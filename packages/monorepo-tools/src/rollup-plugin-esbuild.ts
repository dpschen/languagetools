// @ts-expect-error
import builtins from 'builtins'
import {
  build,
  BuildOptions,
  BuildResult,
  OutputFile,
  PartialMessage,
  version,
} from 'esbuild'
import * as FS from 'fs'
import * as Path from 'path'
import resolveModule from 'resolve'
import type {
  ExternalOption,
  ModuleFormat,
  OutputChunk,
  OutputOptions,
  Plugin,
} from 'rollup'

type ESBuildResult = BuildResult & {
  outputFiles: OutputFile[]
}

export function esbuild(
  invalidationFile: string,
  config: boolean | BuildOptions,
  getExternal: () => ExternalOption | undefined,
): Plugin {
  let format: 'iife' | 'cjs' | 'esm' = 'esm'
  let outputOptions!: OutputOptions
  const watchers: Record<string, ESBuildResult> = {}

  return {
    name: 'esbuild',
    outputOptions(options) {
      outputOptions = options

      if (options.format != null) {
        if (
          new Set<ModuleFormat>([
            'amd',
            'iife',
            'system',
            'systemjs',
            'umd',
          ]).has(options.format)
        ) {
          throw new Error(`Rollup output format: ${options.format}`)
        } else if (
          new Set<ModuleFormat>(['commonjs', 'cjs']).has(options.format)
        ) {
          format = 'cjs'
        } else if (options.format === 'iife') {
          format = 'iife'
        }
      }

      return {
        ...options,
        format: 'esm',
      }
    },

    async generateBundle(options, bundle) {
      const defaults: BuildOptions = typeof config === 'boolean' ? {} : config

      options.sourcemap = outputOptions.sourcemap ?? false

      if (options.file == null) {
        throw new Error(`'bundle' is supported only for 'file' output`)
      }

      const outputFileName = options.file
      const key = Path.basename(options.file)
      const file = bundle[key]
      const isWatching = this.meta.watchMode
      if (outputFileName == null || file == null || file.type === 'asset') {
        throw new Error(`'${key}' is not found in bundle`)
      }
      const entryFileName = Path.resolve(Path.dirname(options.file), '.' + key)

      const externals = new Set(defaults.external)

      if (defaults.platform == null || defaults.platform === 'node') {
        builtins().forEach((value: string) => externals.add(value))
      }

      const isFirstBuild = watchers[options.file] == null
      let isBuilding = true
      let result =
        watchers[options.file] ??
        (await build({
          bundle: true,
          splitting: false,
          preserveSymlinks: true,
          format: format,
          platform: 'node',
          external: [],
          mainFields: ['module', 'main'],
          allowOverwrite: true,
          banner: { js: `/* Bundled with ESBuild v${version} */` },
          outfile: outputFileName,
          treeShaking: true,
          resolveExtensions: ['.mjs', '.js', '.cjs'],
          ...defaults,
          sourcemap: 'external',
          entryPoints: [entryFileName],
          plugins: [
            {
              name: 'rollup',
              setup: (build) => {
                build.onResolve(
                  { filter: /.+/ },
                  async ({ path, importer }) => {
                    if (path === entryFileName) {
                      return { path: entryFileName }
                    }

                    if (path === `${entryFileName}.map`) {
                      return { path: `${entryFileName}.map` }
                    }

                    if (externals.has(path)) {
                      return { path, external: true }
                    }

                    let external = isExternal(getExternal(), path, importer)
                    let resolved: string | undefined
                    const warnings: PartialMessage[] = []
                    let id = path
                    const fromRollup = await this.resolve(id, importer)

                    if (fromRollup != null) {
                      resolved = fromRollup.id
                      external =
                        fromRollup.external === 'absolute'
                          ? false
                          : fromRollup.external

                      if (!Path.isAbsolute(resolved)) {
                        id = resolved
                        external = true
                      }
                    }

                    if (fromRollup == null || external) {
                      resolved = await resolveExternalPackage(id, importer)
                      if (resolved == null) {
                        external = true
                        resolved = id
                      } else {
                        external = false
                      }
                    }

                    if (resolved != null && Path.isAbsolute(resolved)) {
                      resolved = FS.realpathSync(resolved)
                    }

                    if (external) {
                      warnings.push({
                        text: `Module "${path}" is treated as external dependency`,
                      })
                    }

                    return {
                      external,
                      path: resolved,
                      warnings,
                    }
                  },
                )
                build.onLoad({ filter: /.+/ }, async ({ path }) => {
                  if (path === entryFileName) {
                    return {
                      contents: file.code + getSourceMapString(file),
                      resolveDir: Path.basename(path),
                      loader: 'js',
                    }
                  }

                  if (path === `${entryFileName}.map` && file.map != null) {
                    return {
                      contents: file.map.toString(),
                      resolveDir: Path.basename(path),
                      loader: 'js',
                    }
                  }

                  return undefined
                })
              },
            },
          ],
          write: false,
          incremental: isWatching,
          watch: isWatching
            ? {
                onRebuild: (_error, _result) => {
                  if (!isBuilding) {
                    FS.writeFileSync(invalidationFile, `// ${Date.now()} \n`)
                  }
                },
              }
            : false,
        }))

      if (!isFirstBuild && result.rebuild != null) {
        result = (await result.rebuild()) as ESBuildResult
      }

      if (isWatching) {
        watchers[options.file] = result
      }

      isBuilding = false
      result.errors.forEach((error) => {
        this.error({
          message: error.text,
          loc:
            error.location != null
              ? {
                  file: error.location.file,
                  column: error.location.column,
                  line: error.location.line,
                }
              : undefined,
        })
      })

      result.warnings.forEach((warning) => {
        this.warn({
          message: warning.text,
          loc:
            warning.location != null
              ? {
                  file: warning.location.file,
                  column: warning.location.column,
                  line: warning.location.line,
                }
              : undefined,
        })
      })

      result.outputFiles.forEach((outFile) => {
        if (outFile.path === outputFileName) {
          file.code = outFile.text
        } else if (outFile.path === `${outputFileName}.map`) {
          file.map = {
            ...JSON.parse(outFile.text),
            toString() {
              return outFile.text
            },
            toUrl() {
              throw new Error(`Internal source map not supported`)
            },
          }
        } else {
          throw new Error(`Code splitting is not supported in bundle mode.`)
        }
      })
    },
  }
}
function isExternal(
  external: ExternalOption | undefined,
  id: string,
  importer: string,
): boolean {
  if (typeof external === 'function') {
    return external(id, importer, false) === true
  } else if (Array.isArray(external)) {
    return external.some((external) => isExternal(external, id, importer))
  } else if (typeof external === 'string') {
    return external === id
  } else if (external instanceof RegExp) {
    return external.test(id)
  } else {
    return false
  }
}

function resolveExternalPackage(
  path: string,
  importer: string,
): string | PromiseLike<string | undefined> | undefined {
  return new Promise<string | undefined>((resolve) => {
    resolveModule(
      path,
      {
        extensions: ['.mjs', '.js', '.cjs'],
        packageFilter: (pkg) => ({
          ...pkg,
          main: pkg.module ?? pkg.main,
        }),
        basedir: Path.dirname(importer),
      },
      (_, resolved?: string) => {
        resolve(resolved)
      },
    )
  })
}

function getSourceMapString(file: OutputChunk): string {
  if (file.map == null) return ''

  return `\n//# sourceMappingURL=${file.fileName}.map`
}
