## API Report File for "@vuedx/vue-virtual-textdocument"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { CodegenResult } from '@vuedx/compiler-tsx';
import { ComponentImport } from '@vuedx/compiler-tsx';
import { ComponentRegistrationInfo } from '@vuedx/analyze';
import { Position as Position_2 } from 'vscode-languageserver-textdocument';
import { Range as Range_2 } from 'vscode-languageserver-textdocument';
import { RawSourceMap } from 'source-map';
import { SFCBlock } from '@vuedx/compiler-sfc';
import { SFCDescriptor } from '@vuedx/compiler-sfc';
import { SFCParseOptions } from '@vuedx/compiler-sfc';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { TextDocumentContentChangeEvent } from 'vscode-languageserver-textdocument';

// @public (undocumented)
export function asFsPath(uri: string): string;

// @public (undocumented)
export function asFsUri(fileName: string): string;

// @public (undocumented)
export function asUri(fileNameOrUri: string): string;

// @public (undocumented)
export class AsyncDocumentStore<T> extends DocumentStore<T> {
    constructor(resolve: (uri: string) => T | Promise<T | null> | null, normalize?: (uri: string) => string);
    // (undocumented)
    get(uri: string): T | null;
    // (undocumented)
    get(uri: string): Promise<T | null>;
    }

// @public (undocumented)
export function basename(fileName: string): string;

// @public (undocumented)
export function binarySearch<T>(array: T[], isMatch: (a: T) => number, returnMin?: boolean): T | undefined;

// @public (undocumented)
export type BlockSelector = {
    type: typeof SCRIPT_BLOCK_SELECTOR;
} | {
    type: typeof SCRIPT_SETUP_BLOCK_SELECTOR;
} | {
    type: typeof TEMPLATE_BLOCK_SELECTOR;
} | {
    type: 'style';
    index: number;
} | {
    type: 'customBlocks';
    index: number;
};

// @public (undocumented)
export class DocumentStore<T> {
    constructor(resolve: (uri: string) => T | null, normalize?: (uri: string) => string);
    // (undocumented)
    all(): string[];
    // (undocumented)
    delete(uri: string): boolean;
    // (undocumented)
    dispose(): void;
    // (undocumented)
    get(uri: string): T | null;
    // (undocumented)
    protected getNormalizedUri(uri: string): string;
    // (undocumented)
    has(uri: string): boolean;
    // (undocumented)
    protected map: Map<string, T>;
    // (undocumented)
    normalize: (uri: string) => string;
    // (undocumented)
    protected resolve: (uri: string) => T | null;
    // (undocumented)
    protected reverseUriMap: Map<string, string>;
    // (undocumented)
    set(uri: string, document: T): void;
}

// @public (undocumented)
export function getBlockLanguage(block?: SFCBlock | null): string;

// @public (undocumented)
export function getContainingFile(fileName: string): string;

// @public (undocumented)
export function getLanguageExtension(lang: string): string;

// @public (undocumented)
export function getLanguageIdFromExtension(ext: string): string;

// @public (undocumented)
export const INTERNAL_MODULE_SELECTOR = "_internal";

// @public (undocumented)
export function isOffsetInBlock(offset: number, block?: SFCBlock | null): boolean;

// @public (undocumented)
export function isVirtualFile(fileName: string): boolean;

// @public (undocumented)
export function isVirtualFileOfType(fileName: string, type: '_render' | '_module' | '_internal' | 'script' | 'scriptSetup'): boolean;

// @public (undocumented)
export function isVueFile(fileName: string): boolean;

// @public (undocumented)
export const MODULE_SELECTOR = "_module";

// @public (undocumented)
export function parseVirtualFileName(fileName: string): {
    uri: string;
    selector: Selector;
} | null;

// @public (undocumented)
export function relativeVirtualImportPath(fileName: string): string;

// @public (undocumented)
export const RENDER_SELECTOR = "_render";

// @public (undocumented)
export class RenderFunctionTextDocument extends TransformedBlockTextDocument {
    constructor(container: VueTextDocument, selector: Selector, transformed: TextDocument, source: TextDocument);
    // (undocumented)
    get ast(): CodegenResult['ast'] | undefined;
    // (undocumented)
    get contextCompletionsTriggerOffset(): number;
    // Warning: (ae-forgotten-export) The symbol "CreateVirtualTextDocumentOptions" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    static create(options: CreateVirtualTextDocumentOptions): RenderFunctionTextDocument;
    // (undocumented)
    findExpression(offset: number, length: number): undefined | {
        offset: number;
        length: number;
    };
    // (undocumented)
    protected generate(): string;
    // (undocumented)
    getAllGeneratedOffsetsAt(offset: number): undefined | Array<{
        length: number;
        offset: number;
    }>;
    // (undocumented)
    getGeneratedOffsetAt(offset: number): undefined | {
        length: number;
        offset: number;
    };
    // (undocumented)
    protected getKnownComponents(): Record<string, ComponentImport>;
    // (undocumented)
    getOriginalOffsetAt(offset: number): undefined | {
        offset: number;
        length: number;
    };
    // (undocumented)
    isInGeneratedRange(offset: number): boolean;
    // (undocumented)
    get parserErrors(): CodegenResult['errors'];
    // (undocumented)
    get tagCompletionsTriggerOffset(): number;
    // (undocumented)
    toDisplayMappings(): string;
    // (undocumented)
    protected tryGenerate(): string;
}

// @public (undocumented)
export function replaceSlashes(fileName: string): string;

// @public (undocumented)
export const SCRIPT_BLOCK_SELECTOR = "script";

// @public (undocumented)
export const SCRIPT_SETUP_BLOCK_SELECTOR = "scriptSetup";

// @public (undocumented)
export type Selector = BlockSelector | {
    type: typeof RENDER_SELECTOR;
} | {
    type: typeof MODULE_SELECTOR;
} | {
    type: typeof INTERNAL_MODULE_SELECTOR;
};

// @public (undocumented)
export type SelectorLike = Selector | typeof TEMPLATE_BLOCK_SELECTOR | typeof SCRIPT_BLOCK_SELECTOR | typeof SCRIPT_SETUP_BLOCK_SELECTOR | typeof RENDER_SELECTOR | typeof MODULE_SELECTOR | typeof INTERNAL_MODULE_SELECTOR;

// @public (undocumented)
export const TEMPLATE_BLOCK_SELECTOR = "template";

// @public (undocumented)
export class TransformedBlockTextDocument extends VirtualTextDocument {
    // Warning: (ae-forgotten-export) The symbol "BlockTransformResult" needs to be exported by the entry point index.d.ts
    protected constructor(container: VueTextDocument, selector: Selector, transformed: TextDocument, source: TextDocument | VirtualTextDocument, _transform: (document: TransformedBlockTextDocument) => BlockTransformResult);
    // Warning: (ae-forgotten-export) The symbol "CreateTransformedBlockTextDocumentOptions" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    static create(options: CreateTransformedBlockTextDocumentOptions): TransformedBlockTextDocument;
    // (undocumented)
    protected refresh(): void;
    // (undocumented)
    transform(): BlockTransformResult;
    // (undocumented)
    tryGetGeneratedOffset(offset: number): number | undefined;
    // (undocumented)
    tryGetSourceOffset(offset: number): number | undefined;
}

// @public (undocumented)
export const VIRTUAL_FILENAME_SEPARATOR = "________";

// Warning: (ae-forgotten-export) The symbol "ProxyTextDocument" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export class VirtualTextDocument extends ProxyTextDocument {
    protected constructor(container: VueTextDocument, selector: Selector, doc: TextDocument);
    // (undocumented)
    readonly container: VueTextDocument;
    // (undocumented)
    static create(options: CreateVirtualTextDocumentOptions): VirtualTextDocument;
    // (undocumented)
    protected isDirty: boolean;
    // (undocumented)
    markDirty(): void;
    // (undocumented)
    protected refresh(): void;
    // (undocumented)
    readonly selector: Selector;
}

// @public (undocumented)
export class VueTextDocument extends ProxyTextDocument {
    constructor(doc: TextDocument, options?: VueTextDocumentOptions, parseOptions?: SFCParseOptions);
    // (undocumented)
    all(): VirtualTextDocument[];
    // (undocumented)
    blockAt(position: Position_2 | number): SFCBlock | null | undefined;
    // (undocumented)
    static create(uri: string, languageId: string, version: number, content: string, options?: VueTextDocumentOptions, parseOptions?: SFCParseOptions): VueTextDocument;
    // (undocumented)
    protected createBlockDocument(selector: BlockSelector): VirtualTextDocument | undefined;
    // (undocumented)
    protected createInternalModuleDocument(): TransformedBlockTextDocument;
    // (undocumented)
    protected createModuleDocument(): TransformedBlockTextDocument;
    // (undocumented)
    protected createRenderDocument(): RenderFunctionTextDocument;
    // (undocumented)
    get descriptor(): SFCDescriptor;
    // (undocumented)
    documentAt(position: Position_2 | number): VirtualTextDocument | undefined;
    // (undocumented)
    getBlock(selector: BlockSelector): SFCBlock | null | undefined;
    // (undocumented)
    getBlockSelector(block: SFCBlock): BlockSelector | undefined;
    // (undocumented)
    getDocument(selector: typeof RENDER_SELECTOR): RenderFunctionTextDocument;
    // (undocumented)
    getDocument(selector: SelectorLike): VirtualTextDocument;
    // (undocumented)
    getDocument(selector: string): VirtualTextDocument | undefined;
    // (undocumented)
    getDocumentFileName(selectorLike: SelectorLike): string;
    // (undocumented)
    protected getDocumentId(selector: Selector): string;
    // (undocumented)
    protected getDocumentLanguage(selector: Selector): string;
    // (undocumented)
    markDirty(): void;
    // Warning: (ae-forgotten-export) The symbol "VueTextDocumentOptions" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    readonly options: VueTextDocumentOptions;
    // (undocumented)
    protected parse(): void;
    // (undocumented)
    static update(document: VueTextDocument, changes: TextDocumentContentChangeEvent[], version: number): VueTextDocument;
}


// (No @packageDocumentation comment for this package)

```