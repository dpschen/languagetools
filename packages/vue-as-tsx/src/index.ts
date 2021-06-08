import { parse, SFCDescriptor } from '@vuedx/compiler-sfc'
import type {
  TextDocument,
  TextDocumentContentChangeEvent,
} from 'vscode-languageserver-textdocument'

export interface IncrementalParseOptions {
  document: TextDocument
  descriptor?: SFCDescriptor
}

export interface SFCParseResult {
  descriptor: SFCDescriptor
  errors: Error[]
}

export interface ChangeEvent {
  document: TextDocument
  changes: TextDocumentContentChangeEvent[]
}

export interface Incremental<T> {
  latest(): T
  update(event: ChangeEvent): T
}

// FIXME: Implement incremental SFC parser
export function createIncrementalSFCParser(
  document: TextDocument,
): Incremental<SFCParseResult> {
  let previous: SFCParseResult
  const update = ({ document }: ChangeEvent): SFCParseResult => {
    const result = parse(document.getText(), {
      filename: document.uri,
      pad: false,
      sourceMap: false,
    })
    previous = result
    return result
  }

  const latest = (): SFCParseResult => {
    if (previous == null) {
      return update({ document, changes: [] })
    } else {
      return previous
    }
  }

  return {
    latest,
    update,
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface VueTextDocument {
  // Accept tranformers as plugins
  // Generate a versioned TypeScript document
  // Implement SourceMapped Methods
  // - getOriginalPositionAt()
  // - getGeneratedPositionAt()
}

export function createIncrementalSFCTransformer(
  document: TextDocument,
): Incremental<VueTextDocument> {
  const sfc = createIncrementalSFCParser(document)
  const latest = (): VueTextDocument => {
    return {}
  }
  const update = (event: ChangeEvent): VueTextDocument => {
    const { descriptor } = sfc.update(event)

    console.log(descriptor)
    return {}
  }

  return { latest, update }
}
