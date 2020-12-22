## API Report File for "@vuedx/analyze"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { ArrowFunctionExpression } from '@babel/types';
import { File as File_2 } from '@babel/types';
import { FunctionExpression } from '@babel/types';
import { Node as Node_2 } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { ObjectExpression } from '@babel/types';
import { ObjectMember } from '@babel/types';
import { ObjectMethod } from '@babel/types';
import { ParserOptions } from '@babel/parser';
import { ProjectConfig } from '@vuedx/projectconfig';
import { ProjectConfigNormalized } from '@vuedx/projectconfig';
import { SFCBlock } from '@vuedx/compiler-sfc';
import { SFCDescriptor } from '@vuedx/compiler-sfc';
import { SFCParseOptions } from '@vuedx/compiler-sfc';
import { SFCScriptBlock } from '@vuedx/compiler-sfc';
import { SFCStyleBlock } from '@vuedx/compiler-sfc';
import { SFCTemplateBlock } from '@vuedx/compiler-sfc';
import { SourceFile } from 'typescript';
import { TypeChecker } from 'typescript';

// @public (undocumented)
export interface Analyzer {
    // (undocumented)
    analyze: (content: string, fileName?: string) => ComponentInfo;
    // (undocumented)
    analyzeScript: (content: string, fileName?: string, mode?: 'script' | 'scriptSetup') => ComponentInfo;
    // (undocumented)
    analyzeTemplate: (content: string, fileName?: string) => ComponentInfo;
}

// @public (undocumented)
export interface ComponentInfo {
    // (undocumented)
    components: LocalComponentRegistrationInfo[];
    // (undocumented)
    emits: EmitInfo[];
    // (undocumented)
    errors: SyntaxError_2[];
    // (undocumented)
    fnSetupOption?: SetupInfo;
    // (undocumented)
    identifierSource: Record<string, IdentifierSource>;
    // Warning: (ae-forgotten-export) The symbol "ComponentOptionsInfo" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    options?: ComponentOptionsInfo;
    // (undocumented)
    props: PropInfo[];
    // (undocumented)
    scriptSetup?: ScriptSetupInfo;
}

// @public (undocumented)
export interface ComponentRegistrationInfo {
    // (undocumented)
    aliases: string[];
    // (undocumented)
    name: string;
    // (undocumented)
    source: ImportSource;
}

// @public (undocumented)
export const ComponentsOptionAnalyzer: Plugin_2;

// @public (undocumented)
export class ConfiguredVueProject extends VueProject {
    // Warning: (ae-forgotten-export) The symbol "PackageJSON" needs to be exported by the entry point index.d.ts
    constructor(rootDir: string, packageFile: string | undefined, packageJSON: Partial<PackageJSON>, configFile: string, config: Readonly<ProjectConfig>, requireModule?: NodeJS.Require);
    // (undocumented)
    readonly configFile: string;
    // (undocumented)
    kind: "configured";
    // (undocumented)
    protected refresh(): void;
    // (undocumented)
    setFileNames(fileNames: string[]): void;
}

// Warning: (ae-forgotten-export) The symbol "Context" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export function createAnalyzer(plugins: Plugin_2[], options?: Partial<Context['parsers']>): Analyzer;

// @public (undocumented)
export function createFullAnalyzer(plugins?: Plugin_2[], options?: Partial<Context['parsers']>): ReturnType<typeof createAnalyzer>;

// Warning: (ae-forgotten-export) The symbol "ScriptAnalyzerContext" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export function createSourceRange(context: Context | ScriptAnalyzerContext, node: Node_2): SourceRange;

// Warning: (ae-forgotten-export) The symbol "Taggable" needs to be exported by the entry point index.d.ts
// Warning: (ae-forgotten-export) The symbol "Addressable" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export interface EmitInfo extends Taggable, Addressable {
    // (undocumented)
    description: string;
    // (undocumented)
    isDynamic: boolean;
    // (undocumented)
    isInferred: boolean;
    // (undocumented)
    name: string;
    // (undocumented)
    references: SourceRange[];
    // Warning: (ae-forgotten-export) The symbol "TypeInfo" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    type: TypeInfo[];
}

// @public (undocumented)
export const EmitsOptionsAnalyzer: Plugin_2;

// @public (undocumented)
export interface IdentifierSource extends Addressable {
    // (undocumented)
    name: string;
}

// @public (undocumented)
export const ImplicitEmitsAnalyzer: Plugin_2;

// @public (undocumented)
export interface ImportSource {
    // (undocumented)
    exportName?: string;
    // (undocumented)
    localName: string;
    // (undocumented)
    moduleName: string;
}

// @public (undocumented)
export interface ImportSourceWithLocation extends ImportSource, Addressable {
}

// @public (undocumented)
export class InferredVueProject extends VueProject {
    // (undocumented)
    kind: "inferred";
    // (undocumented)
    protected refresh(): void;
}

// @public (undocumented)
export interface LocalComponentRegistrationInfo extends ComponentRegistrationInfo, Addressable {
    // (undocumented)
    kind: 'script' | 'scriptSetup';
    // (undocumented)
    source: ImportSourceWithLocation;
}

// @public (undocumented)
interface Plugin_2 {
    // Warning: (ae-forgotten-export) The symbol "AbstractScriptAnalyzerFn" needs to be exported by the entry point index.d.ts
    // Warning: (ae-forgotten-export) The symbol "AbstractAnalyzerHandler" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    babel?: AbstractScriptAnalyzerFn | AbstractAnalyzerHandler;
    // Warning: (ae-forgotten-export) The symbol "BlockAnalyzer" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    blocks?: Partial<{
        script: BlockAnalyzer<SFCScriptBlock>;
        template: BlockAnalyzer<SFCTemplateBlock>;
        style: BlockAnalyzer<SFCStyleBlock>;
    }> & Record<string, BlockAnalyzer<any>>;
    // Warning: (ae-forgotten-export) The symbol "ComponentDeclarationAnalyzer" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    declaration?: ComponentDeclarationAnalyzer[];
    // Warning: (ae-forgotten-export) The symbol "ComponentOptionsAnalyzer" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    options?: ComponentOptionsAnalyzer[] | Record<string, AbstractScriptAnalyzerFn<ObjectMember>>;
    // Warning: (ae-forgotten-export) The symbol "ComponentSetupFnAnalyzer" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    setup?: ComponentSetupFnAnalyzer[];
    // (undocumented)
    templateExpression?: (node: File_2, context: Context) => void;
}

export { Plugin_2 as Plugin }

// @public (undocumented)
export interface PropInfo extends Taggable, Addressable {
    // Warning: (ae-forgotten-export) The symbol "ValueInfo" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    defaultValue: ValueInfo | null;
    // (undocumented)
    description: string;
    // (undocumented)
    name: string;
    // (undocumented)
    required: boolean;
    // (undocumented)
    type: TypeInfo[];
}

// @public (undocumented)
export const PropsOptionsAnalyzer: Plugin_2;

// @public (undocumented)
export const ScriptBlockAnalyzer: Plugin_2;

// @public (undocumented)
export const ScriptIdentifierSourceAnalyzer: Plugin_2;

// @public (undocumented)
export interface ScriptSetupInfo {
    // (undocumented)
    defineEmit?: Addressable;
    // (undocumented)
    defineProps?: Addressable;
}

// @public (undocumented)
export interface SetupInfo extends Addressable {
    // (undocumented)
    context?: {
        identifiers: Partial<{
            attrs: string;
            slots: string;
            emit: string;
        }>;
        rest?: string;
    } & Addressable;
    // (undocumented)
    props?: {
        identifiers: string[];
        rest?: string;
    } & Addressable;
    // (undocumented)
    return?: Addressable;
}

// @public (undocumented)
export const SetupOptionsAnalyzer: Plugin_2;

// @public (undocumented)
export interface SourceRange {
    // (undocumented)
    end: SourceLocation;
    // (undocumented)
    source: string;
    // Warning: (ae-forgotten-export) The symbol "SourceLocation" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    start: SourceLocation;
}

// @public (undocumented)
interface SyntaxError_2 {
    // (undocumented)
    loc: SourceLocation;
    // (undocumented)
    message: string;
}

export { SyntaxError_2 as SyntaxError }

// @public (undocumented)
export const TemplateBlockAnalyzer: Plugin_2;

// Warning: (ae-forgotten-export) The symbol "FunctionTransformOptions" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export function transformToFunction(content: string, options?: FunctionTransformOptions): string;

// @public (undocumented)
export abstract class VueProject {
    constructor(rootDir: string, packageFile: string | undefined, packageJSON: Partial<PackageJSON>, requireModule?: NodeJS.Require);
    // (undocumented)
    get components(): ComponentRegistrationInfo[];
    // (undocumented)
    get config(): Readonly<ProjectConfigNormalized>;
    // (undocumented)
    protected _config: Readonly<ProjectConfigNormalized>;
    // (undocumented)
    protected _externalComponents: ComponentRegistrationInfo[];
    // (undocumented)
    get fileNames(): string[];
    // (undocumented)
    protected _fileNames: string[];
    // (undocumented)
    get globalComponents(): ComponentRegistrationInfo[];
    // (undocumented)
    protected _globalComponents: ComponentRegistrationInfo[];
    // (undocumented)
    protected isDirty: boolean;
    // (undocumented)
    abstract kind: 'inferred' | 'configured';
    // (undocumented)
    protected loadGlobalComponents(): void;
    // (undocumented)
    markDirty(): void;
    // (undocumented)
    readonly packageFile: string | undefined;
    // (undocumented)
    packageJSON: PackageJSON;
    // (undocumented)
    protected _projectComponents: Map<string, ComponentRegistrationInfo[]>;
    // (undocumented)
    protected abstract refresh(): void;
    // (undocumented)
    protected reloadIfNeeded(): void;
    // (undocumented)
    protected readonly requireModule: NodeJS.Require;
    // (undocumented)
    readonly rootDir: string;
    // (undocumented)
    setConfig(config: ProjectConfig): void;
    // (undocumented)
    setFileNames(fileNames: string[]): void;
    // (undocumented)
    get version(): string;
    // (undocumented)
    protected _version: string;
    // (undocumented)
    get vueFileNames(): string[];
}


// (No @packageDocumentation comment for this package)

```