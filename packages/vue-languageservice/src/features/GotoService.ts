import type {
  VueBlockDocument,
  VueSFCDocument,
} from '@vuedx/vue-virtual-textdocument'
import { inject, injectable } from 'inversify'
import type Typescript from 'typescript/lib/tsserverlibrary'
import { INJECTABLE_TS_SERVICE } from '../constants'
import type { TSLanguageService } from '../contracts/Typescript'
import { FilesystemService } from '../services/FilesystemService'
import { LoggerService } from '../services/LoggerService'
import { TemplateGlobals } from './helpers'

@injectable()
export class GotoService {
  private readonly logger = LoggerService.getLogger(`Goto`)

  constructor(
    @inject(FilesystemService)
    private readonly fs: FilesystemService,
    @inject(INJECTABLE_TS_SERVICE)
    private readonly service: TSLanguageService,
  ) {}

  private readonly depth: Array<[string, number]> = []

  public getDefinitionAtPosition(
    fileName: string,
    position: number,
  ): readonly Typescript.DefinitionInfo[] | undefined {
    if (
      this.depth.some((args) => fileName === args[0] && position === args[1])
    ) {
      return undefined
    }

    this.logger.debug(
      `getDefinitionAtPostion(${this.depth.length}) ${fileName} ${position}`,
    )
    this.depth.push([fileName, position])
    try {
      if (this.fs.isVueFile(fileName)) {
        return this.doActionAtPosition(
          fileName,
          position,
          ({ tsFileName, offset, vueFile, blockFile }) => {
            const result = this.service.getDefinitionAtPosition(
              tsFileName,
              offset,
            )

            if (result == null) {
              this.logger.debug(
                `NoDefintion(${
                  this.depth.length
                }) ${fileName} ${position}:${JSON.stringify(
                  vueFile.getText().substr(position, 15),
                )} -> ${offset}:${JSON.stringify(
                  blockFile.generated?.getText().substr(offset, 15),
                )}`,
              )

              return
            }
            this.logger.debug(
              `DefinitionAtPostion(${this.depth.length}) ${fileName} ${position} (Found ${result.length} definitions)`,
            )

            return this.dedupeDefinitionInfos(
              result.map((info) => this.normalizeTSDefinitionInfo(info)).flat(),
            )
          },
        )
      } else {
        const result = this.service.getDefinitionAtPosition(fileName, position)

        if (result == null) return

        return this.dedupeDefinitionInfos(
          result.map((info) => this.normalizeTSDefinitionInfo(info)).flat(),
        )
      }
    } finally {
      this.depth.pop()
    }
  }

  public getDefinitionAndBoundSpan(
    fileName: string,
    position: number,
  ): Typescript.DefinitionInfoAndBoundSpan | undefined {
    this.logger.debug(
      `getDefinitionAndBoundSpan(${this.depth.length}) ${fileName} ${position}`,
    )
    if (this.fs.isVueFile(fileName)) {
      return this.doActionAtPosition(
        fileName,
        position,
        ({ tsFileName, blockFile, offset, vueFile }) => {
          const result = this.service.getDefinitionAndBoundSpan(
            tsFileName,
            offset,
          )
          if (result == null) {
            this.logger.debug(
              `NoDefinition(${
                this.depth.length
              }) at ${position}:${JSON.stringify(
                vueFile.getText().substr(position, 10),
              )} -> ${offset}:${JSON.stringify(
                blockFile.generated?.getText().substr(offset, 10),
              )}`,
            )
            return undefined
          }
          result.textSpan = this.getTextSpan(blockFile, result.textSpan)
          return this.normalizeTSDefinitionInfoAndBoundSpan(result)
        },
      )
    } else {
      const result = this.service.getDefinitionAndBoundSpan(fileName, position)
      if (result == null) return undefined
      return this.normalizeTSDefinitionInfoAndBoundSpan(result)
    }
  }

  private dedupeDefinitionInfos(
    definitions: readonly Typescript.DefinitionInfo[],
  ): Typescript.DefinitionInfo[] {
    const output: Typescript.DefinitionInfo[] = []
    const ids = new Set<string>()

    definitions.forEach((definition) => {
      const id = `${definition.fileName}:${definition.textSpan.start}:${definition.textSpan.length}`

      if (!ids.has(id)) {
        ids.add(id)
        output.push(definition)
      }
    })

    return output
  }

  private normalizeTSDefinitionInfo(
    info: Typescript.DefinitionInfo,
  ): Typescript.DefinitionInfo[] {
    const fileName = info.fileName
    this.logger.debug(
      `Normalize: ${info.textSpan.start}:${info.name} in ${info.fileName}`,
    )

    info.fileName = this.fs.getRealFileName(fileName)
    if (this.fs.isVueVirtualFile(fileName)) {
      const vueFile = this.fs.getVueFile(fileName)
      const blockFile = vueFile?.getDocById(fileName)

      if (blockFile != null) {
        if (blockFile.isOffsetInTemplateGlobals(info.textSpan.start)) {
          const range = TemplateGlobals.findRHS(blockFile, info.textSpan.start)
          if (range == null) return []
          this.logger.debug(
            `TemplateGlobal(${this.depth.length}): ${
              info.textSpan.start
            }:${JSON.stringify(
              blockFile.generated?.getText().substr(info.textSpan.start, 10),
            )} -> ${range.start}:${JSON.stringify(
              blockFile.generated?.getText().substr(range.start, 10),
            )}`,
          )

          return (
            this.getDefinitionAtPosition(fileName, range.start)?.slice() ?? []
          )
        } else if (blockFile.isOffsetInIgonredZone(info.textSpan.start)) {
          this.logger.debug(
            `IgnoredZone(${this.depth.length}): ${
              info.textSpan.start
            }:${JSON.stringify(
              blockFile.generated?.getText().substr(info.textSpan.start, 10),
            )}`,
          )

          return (
            this.getDefinitionAtPosition(
              fileName,
              info.textSpan.start,
            )?.slice() ?? []
          )
        }

        info.textSpan = this.getTextSpan(blockFile, info.textSpan)
        info.contextSpan = this.getTextSpan(blockFile, info.contextSpan)

        return [info]
      }

      info.textSpan = { start: 0, length: 1 }
      if (info.contextSpan != null) {
        info.contextSpan = { start: 0, length: 1 }
      }
    } else if (this.fs.isVueTsFile(fileName)) {
      const result = this.service.getDefinitionAtPosition(
        fileName,
        info.textSpan.start,
      )

      if (result != null && result.length > 0) return Array.from(result)
      info.textSpan = { start: 0, length: 1 }
    }

    return [info]
  }

  private normalizeTSDefinitionInfoAndBoundSpan(
    info: Typescript.DefinitionInfoAndBoundSpan,
  ): Typescript.DefinitionInfoAndBoundSpan {
    info.definitions = info.definitions
      ?.map((info) => {
        return this.normalizeTSDefinitionInfo(info)
      })
      .flat()

    if (info.definitions != null) {
      info.definitions = this.dedupeDefinitionInfos(info.definitions)
    }

    return info
  }

  private doActionAtPosition<T>(
    fileName: string,
    position: number,
    fn: (options: {
      tsFileName: string
      blockFile: VueBlockDocument
      vueFile: VueSFCDocument
      offset: number
    }) => T,
  ): T | undefined {
    const vueFile = this.fs.getVueFile(fileName)
    if (vueFile == null) return undefined
    const blockFile = vueFile.getDocAt(position)
    if (blockFile?.tsFileName == null) return undefined // TODO: Support non-ts-blocks?
    const offset = blockFile.generatedOffetAt(position)

    return fn({ tsFileName: blockFile.tsFileName, vueFile, blockFile, offset })
  }

  private getTextSpan(
    blockFile: VueBlockDocument,
    textSpan: Typescript.TextSpan,
  ): Typescript.TextSpan

  private getTextSpan(
    blockFile: VueBlockDocument,
    textSpan: Typescript.TextSpan | undefined,
  ): Typescript.TextSpan | undefined

  private getTextSpan(
    blockFile: VueBlockDocument,
    textSpan: Typescript.TextSpan | undefined,
  ): Typescript.TextSpan | undefined {
    if (textSpan == null) return undefined

    const range = this.fs.getAbsoluteOffsets(blockFile, textSpan)

    return {
      start: range.start ?? 0,
      length: Math.max(range.length ?? 1, textSpan.length),
    }
  }
}
