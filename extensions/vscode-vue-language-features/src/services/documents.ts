import {
  transformers,
  VueBlockDocument,
  VueSFCDocument,
} from '@vuedx/vue-virtual-textdocument'
import * as FS from 'fs'
import { injectable } from 'inversify'
import vscode from 'vscode'
import { Installable } from '../utils/installable'

@injectable()
export class DocumentService extends Installable {
  private readonly emitter = new vscode.EventEmitter<{ uri: vscode.Uri }>()
  private readonly documents = new Map<string, VueSFCDocument>()
  private readonly openVirtualDocuments = new Set<string>()

  public install(): vscode.Disposable {
    super.install()

    return vscode.Disposable.from(
      this.emitter,
      vscode.workspace.onDidChangeTextDocument(async ({ document }) => {
        if (document.languageId === 'vue') {
          const fileName = this.createVueDocument(document).fileName
          this.openVirtualDocuments.forEach((virtual) => {
            if (this.removeVirtualFileQuery(virtual) === fileName) {
              this.emitter.fire({ uri: this.getVirtualFileUri(virtual) })
            }
          })
        }
      }),
      vscode.workspace.onDidOpenTextDocument(async (document) => {
        if (document.languageId === 'vue') {
          this.createVueDocument(document)
        } else if (document.uri.scheme === 'vue') {
          this.openVirtualDocuments.add(
            document.uri.with({ scheme: 'file' }).fsPath,
          )
        }
      }),
      vscode.workspace.onDidCloseTextDocument(async (document) => {
        if (document.uri.scheme === 'vue') {
          this.openVirtualDocuments.delete(
            document.uri.with({ scheme: 'file' }).fsPath,
          )
        }
      }),
    )
  }

  private createVueDocument(document: vscode.TextDocument): VueSFCDocument {
    const fileName = document.uri.fsPath
    const file = this.documents.get(fileName)
    if (file != null) {
      file.update([{ text: document.getText() }], document.version)
      console.log('Update: ' + fileName, document.version)
      return file
    } else {
      const file = VueSFCDocument.create(
        fileName,
        document.getText(),
        {},
        document.version,
      )
      this.documents.set(fileName, file)
      return file
    }
  }

  private getVirtualFileUri(fileName: string): vscode.Uri {
    return vscode.Uri.file(fileName).with({ scheme: 'vue' })
  }

  public getVueDocument(fileName: string): VueSFCDocument | null {
    return this.documents.get(fileName) ?? null
  }

  public async ensureDocument(fileName: string): Promise<void> {
    if (this.documents.has(fileName)) return

    try {
      const text = await FS.promises.readFile(fileName, 'utf-8')
      const document = VueSFCDocument.create(fileName, text, {
        transformers,
      })

      this.documents.set(fileName, document)
    } catch {}
  }

  private removeVirtualFileQuery(fileName: string): string {
    const index = fileName.indexOf('?vue')
    if (index < 0) return fileName
    return fileName.substr(0, index)
  }

  public async getVirtualDocument(
    fileName: string,
  ): Promise<VueBlockDocument | null> {
    return (
      this.getVueDocument(this.removeVirtualFileQuery(fileName))?.getDocById(
        fileName,
      ) ?? null
    )
  }

  public onDidChangeTextDocument(
    fn: (e: { uri: vscode.Uri }) => any,
  ): vscode.Disposable {
    return this.emitter.event(fn)
  }
}
