import type { TextDocumentContentChangeEvent } from '@vuedx/vue-virtual-textdocument'
import type { FilesystemProvider } from './contracts/FilesystemProvider'
import type { Typescript } from './contracts/Typescript'
import { overrideMethod } from './overrideMethod'

const watchers = new Map<
  string,
  Set<(changes: TextDocumentContentChangeEvent[], version: number) => void>
>()

export function createFilesystemProvider(
  projectService: Typescript.server.ProjectService,
  serverHost: Typescript.server.ServerHost,
): FilesystemProvider {
  const fix = (fileName: string): void => {
    const scriptInfo = projectService.getScriptInfo(fileName)
    if (scriptInfo == null) return
    overrideMethod(
      scriptInfo,
      'editContent',
      (editContent) => (start, end, newText) => {
        editContent.call(scriptInfo, start, end, newText)
        const current = watchers.get(fileName)
        if (current != null && current.size > 0) {
          const latestVersion = scriptInfo.getLatestVersion()
          const version = parseFloat(
            latestVersion.startsWith('Text-')
              ? latestVersion.substr(5)
              : latestVersion.substr(4).replace('-', '.'),
          )
          const changes = [{ text: fs.read(fileName) }]
          current.forEach((fn) => fn(changes, version))
        }
      },
    )
  }

  const fs: FilesystemProvider = {
    exists(fileName) {
      return (
        projectService.getScriptInfo(fileName) != null ||
        serverHost.fileExists(fileName)
      )
    },
    read(fileName) {
      const snapshot = projectService.getScriptInfo(fileName)?.getSnapshot()
      if (snapshot == null) return serverHost.readFile(fileName) ?? ''
      return snapshot.getText(0, snapshot.getLength())
    },
    watch(fileName, onChange) {
      fix(fileName)
      if (!watchers.has(fileName)) watchers.set(fileName, new Set([onChange]))
      else watchers.get(fileName)?.add(onChange)

      return () => {
        watchers.get(fileName)?.delete(onChange)
      }
    },
  }

  return fs
}
