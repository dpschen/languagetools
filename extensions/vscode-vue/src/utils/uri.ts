import type vscode from 'vscode'

export function stringifyUri(uri: vscode.Uri): string {
  const str = uri.toString()
  if (str.includes('vue:/')) {
    return str.replace(/^vue:/, 'vue://')
  }
  return str
}
