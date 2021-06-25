declare module '@parcel/types' {
  import { Diagnostic } from '@parcel/diagnostic';
  type AST = any;
  type ConfigResult = any;
  type FilePath = string;
  type Glob = string;
  type ModuleSpecifier = string;
  type PackageName = string;
  type Semver = string;
  type SemverRange = string;

  type EnvironmentContext =
    | 'browser'
    | 'web-worker'
    | 'service-worker'
    | 'node'
    | 'electron-main'
    | 'electron-renderer';

  type Async<T> = T | Promise<T>;
  type BuildMode = 'development' | 'production' | string;
  type EnvMap = typeof process.env;
  type FileSystem = any;
  type LogLevel = 'none' | 'error' | 'warn' | 'info' | 'verbose';
  type OutputFormat = 'esmodule' | 'commonjs' | 'global';
  type ResolveFn = (from: FilePath, to: string) => Promise<FilePath>;

  type Engines = {
    readonly browsers?: string | string[];
    readonly electron?: SemverRange;
    readonly node?: SemverRange;
    readonly parcel?: SemverRange;
  };

  type TargetSourceMapOptions = {
    readonly sourceRoot?: string;
    readonly inline?: boolean;
    readonly inlineSources?: boolean;
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  type VersionMap = {};

  interface Environment {
    readonly context: EnvironmentContext;
    readonly engines: Engines;
    readonly includeNodeModules:
      | boolean
      | PackageName[]
      | {
          [packageName: string]: boolean;
        };
    readonly outputFormat: OutputFormat;
    readonly isLibrary: boolean;
    readonly shouldOptimize: boolean;
    readonly shouldScopeHoist: boolean;
    readonly sourceMap: TargetSourceMapOptions | undefined;
    isBrowser(): boolean;
    isNode(): boolean;
    isElectron(): boolean;
    isWorker(): boolean;
    isIsolated(): boolean;
    matchesEngines(minVersions: VersionMap): boolean;
  }

  type EnvironmentOptions = {
    readonly context?: EnvironmentContext;
    readonly engines?: Engines;
    readonly includeNodeModules?:
      | boolean
      | PackageName[]
      | {
          [packageName: string]: boolean;
        };
    readonly outputFormat?: OutputFormat;
    readonly isLibrary?: boolean;
    readonly shouldOptimize?: boolean;
    readonly shouldScopeHoist?: boolean;
    readonly sourceMap?: TargetSourceMapOptions | undefined;
  };

  type ConfigResultWithFilePath = {
    contents: ConfigResult;
    filePath: FilePath;
  };

  type PackageTargetDescriptor = {
    readonly context?: EnvironmentContext;
    readonly engines?: Engines;
    readonly includeNodeModules?:
      | boolean
      | PackageName[]
      | {
          [key: string]: boolean;
        };
    readonly outputFormat?: OutputFormat;
    readonly publicUrl?: string;
    readonly distDir?: FilePath;
    readonly sourceMap?: boolean | TargetSourceMapOptions;
    readonly isLibrary?: boolean;
    readonly optimize?: boolean;
    readonly scopeHoist?: boolean;
    readonly source?: FilePath | FilePath[];
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  type PackageDependencies = {};

  type PackageJSON = {
    name: PackageName;
    version: Semver;
    main?: FilePath;
    module?: FilePath;
    types?: FilePath;
    browser?:
      | FilePath
      | {
          [key: string]: FilePath | boolean;
        };
    source?: FilePath | FilePath[];
    alias?: {
      [key: string]: PackageName | FilePath;
    };
    browserslist?:
      | string[]
      | {
          [key: string]: string[];
        };
    engines?: Engines;
    targets?: {
      [key: string]: PackageTargetDescriptor;
    };
    dependencies?: PackageDependencies;
    devDependencies?: PackageDependencies;
    peerDependencies?: PackageDependencies;
    sideEffects?: boolean | FilePath | FilePath[];
    bin?:
      | string
      | {
          [key: string]: FilePath;
        };
  };

  type DevDepOptions = {
    moduleSpecifier: ModuleSpecifier;
    resolveFrom: FilePath;
    invalidateParcelPlugin?: boolean;
  };

  type FileInvalidation = {
    filePath: FilePath;
  };

  type GlobInvalidation = {
    glob: Glob;
  };

  type FileAboveInvalidation = {
    fileName: string;
    aboveFilePath: FilePath;
  };

  type FileCreateInvalidation =
    | FileInvalidation
    | GlobInvalidation
    | FileAboveInvalidation;

  interface Config {
    readonly isSource: boolean;
    readonly searchPath: FilePath;
    readonly result: ConfigResult;
    readonly env: Environment;
    readonly includedFiles: Set<FilePath>;
    setResult(result: ConfigResult): void;
    setResultHash(resultHash: string): void;
    addIncludedFile(filePath: FilePath): void;
    addDevDependency(devDep: DevDepOptions): void;
    invalidateOnFileCreate(invalidation: FileCreateInvalidation): void;
    getConfigFrom(
      searchPath: FilePath,
      filePaths: FilePath[],
      options:
        | {
            packageKey?: string;
            parse?: boolean;
            exclude?: boolean;
          }
        | undefined
    ): Promise<ConfigResultWithFilePath | null>;
    getConfig(
      filePaths: FilePath[],
      options:
        | {
            packageKey?: string;
            parse?: boolean;
            exclude?: boolean;
          }
        | undefined
    ): Promise<ConfigResultWithFilePath | null>;
    getPackage(): Promise<PackageJSON | null>;
    shouldInvalidateOnStartup(): void;
  }

  type HMROptions = {
    port?: number;
    host?: string;
  };

  type HTTPSOptions = Readonly<{
    cert: FilePath;
    key: FilePath;
  }>;

  type ServerOptions = Readonly<{
    distDir: FilePath;
    host?: string;
    port: number;
    https?: HTTPSOptions | boolean;
    publicUrl?: string;
  }>;

  type DetailedReportOptions = {
    assetsPerBundle?: number;
  };

  interface PluginOptions {
    readonly mode: BuildMode;
    readonly env: EnvMap;
    readonly hmrOptions: HMROptions | undefined;
    readonly serveOptions: ServerOptions | false;
    readonly shouldBuildLazily: boolean;
    readonly shouldAutoInstall: boolean;
    readonly logLevel: LogLevel;
    readonly entryRoot: FilePath;
    readonly projectRoot: FilePath;
    readonly cacheDir: FilePath;
    readonly inputFS: any;
    readonly outputFS: any;
    readonly packageManager: any;
    readonly instanceId: string;
    readonly detailedReport: DetailedReportOptions | undefined;
  }

  type JSONObject = {
    [key: string]: any;
  };
  type Meta = JSONObject;
  // eslint-disable-next-line @typescript-eslint/ban-types
  type QueryParameters = {};

  type ASTGenerator = {
    type: string;
    version: string;
  };

  type SourceLocation = Readonly<{
    filePath: string;
    start: {
      line: number;
      column: number;
    };
    end: {
      line: number;
      column: number;
    };
  }>;

  type AssetSymbols = any;
  type MutableAssetSymbols = any;
  type MutableDependencySymbols = any;
  type SourceMap = any;

  interface Target {
    readonly distEntry: FilePath | undefined;
    readonly distDir: FilePath;
    readonly env: Environment;
    readonly name: string;
    readonly publicUrl: string;
    readonly loc: SourceLocation | undefined;
  }

  interface Dependency {
    readonly id: string;
    readonly moduleSpecifier: ModuleSpecifier;
    readonly isAsync: boolean;
    readonly isEntry: boolean | undefined;
    readonly isOptional: boolean;
    readonly isURL: boolean;
    readonly isIsolated: boolean;
    readonly loc: SourceLocation | undefined;
    readonly env: Environment;
    readonly meta: Meta;
    readonly target: Target | undefined;
    readonly sourceAssetId: string | undefined;
    readonly sourcePath: string | undefined;
    readonly resolveFrom: string | undefined;
    readonly pipeline: string | undefined;
    readonly symbols: MutableDependencySymbols;
  }

  type DependencyOptions = {
    readonly moduleSpecifier: ModuleSpecifier;
    readonly isAsync?: boolean;
    readonly isEntry?: boolean;
    readonly isOptional?: boolean;
    readonly isURL?: boolean;
    readonly isIsolated?: boolean;
    readonly loc?: SourceLocation;
    readonly env?: EnvironmentOptions;
    readonly meta?: Meta;
    readonly pipeline?: string;
    readonly resolveFrom?: FilePath;
    readonly target?: Target;
    readonly symbols?: ReadonlyMap<
      symbol,
      {
        local: symbol;
        loc: SourceLocation | undefined;
        isWeak: boolean;
      }
    >;
  };

  interface BaseAsset {
    readonly env: Environment;
    readonly fs: FileSystem;
    readonly filePath: FilePath;
    readonly query: QueryParameters;
    readonly id: string;
    readonly meta: Meta;
    readonly isIsolated: boolean;
    readonly isInline: boolean;
    readonly isSplittable: boolean | undefined;
    readonly isSource: boolean;
    readonly type: string;
    readonly sideEffects: boolean;
    readonly uniqueKey: string | undefined;
    readonly astGenerator: ASTGenerator | undefined;
    readonly pipeline: string | undefined;
    readonly symbols: AssetSymbols;
    getAST(): Promise<AST | undefined>;
    getCode(): Promise<string>;
    getBuffer(): Promise<Buffer>;
    getStream(): any;
    getMap(): Promise<SourceMap | undefined>;
    getMapBuffer(): Promise<Buffer | undefined>;
    getDependencies(): ReadonlyArray<Dependency>;
    getConfig(
      filePaths: FilePath[],
      options:
        | {
            packageKey?: string;
            parse?: boolean;
          }
        | undefined
    ): Promise<ConfigResult | null>;
    getPackage(): Promise<PackageJSON | null>;
  }

  interface MutableAsset extends BaseAsset {
    isIsolated: boolean;
    isInline: boolean;
    isSplittable: boolean | undefined;
    type: string;
    addDependency(dep: DependencyOptions): string;
    addIncludedFile(filePath: FilePath): void;
    invalidateOnFileCreate(invalidation: FileCreateInvalidation): void;
    addURLDependency(url: string, opts: Partial<DependencyOptions>): string;
    invalidateOnEnvChange(env: string): void;
    readonly symbols: MutableAssetSymbols;
    isASTDirty(): boolean;
    getAST(): Promise<AST | undefined>;
    setAST(ast: AST): void;
    setBuffer(buffer: Buffer): void;
    setCode(code: string): void;
    getCode(): Promise<string>;
    setEnvironment(opts: EnvironmentOptions): void;
    setMap(map: SourceMap): void;
    setStream(readable: any): void;
  }

  type Stats = {
    time: number;
    size: number;
  };

  interface Asset extends BaseAsset {
    readonly stats: Stats;
  }

  type TransformerResult = {
    readonly ast?: AST | undefined;
    readonly content?: Blob | undefined;
    readonly dependencies?: ReadonlyArray<DependencyOptions>;
    readonly env?: EnvironmentOptions;
    readonly filePath?: FilePath;
    readonly query?: QueryParameters | undefined;
    readonly includedFiles?: ReadonlyArray<File>;
    readonly isInline?: boolean;
    readonly isIsolated?: boolean;
    readonly isSource?: boolean;
    readonly isSplittable?: boolean;
    readonly map?: SourceMap | undefined;
    readonly meta?: Meta;
    readonly pipeline?: string | undefined;
    readonly sideEffects?: boolean;
    readonly symbols?: ReadonlyMap<
      symbol,
      {
        local: symbol;
        loc: SourceLocation | undefined;
      }
    >;
    readonly type: string;
    readonly uniqueKey?: string | undefined;
  };

  type SymbolResolution = Readonly<{
    asset: Asset;
    exportSymbol: symbol | string;
    symbol: void | null | false | symbol;
    loc: SourceLocation | undefined;
  }>;

  type ExportSymbolResolution = SymbolResolution &
    Readonly<{
      exportAs: symbol | string;
    }>;

  type BundleTraversable = Readonly<
    | {
        type: 'asset';
        value: Asset;
      }
    | {
        type: 'dependency';
        value: Dependency;
      }
  >;

  interface TraversalActions {
    skipChildren(): void;
    stop(): void;
  }

  type GraphTraversalCallback<TNode, TContext> = (
    node: TNode,
    context: TContext | undefined,
    actions: TraversalActions
  ) => TContext | undefined;

  type GraphVisitor<TNode, TContext> =
    | GraphTraversalCallback<TNode, TContext>
    | {
        enter?: GraphTraversalCallback<TNode, TContext>;
        exit?: GraphTraversalCallback<TNode, TContext>;
      };

  interface Bundle {
    readonly id: string;
    readonly hashReference: string;
    readonly type: string;
    readonly env: Environment;
    readonly isEntry: boolean | undefined;
    readonly isInline: boolean | undefined;
    readonly isSplittable: boolean | undefined;
    readonly target: Target;
    readonly stats: Stats;
    getEntryAssets(): Asset[];
    getMainEntry(): Asset | undefined;
    hasAsset(asset: Asset): boolean;
    hasDependency(dependency: Dependency): boolean;
    traverseAssets<TContext>(
      visit: GraphVisitor<Asset, TContext>
    ): TContext | undefined;
    traverse<TContext>(
      visit: GraphVisitor<BundleTraversable, TContext>
    ): TContext | undefined;
  }

  interface NamedBundle extends Bundle {
    readonly publicId: string;
    readonly name: string;
    readonly displayName: string;
  }

  interface PackagedBundle extends NamedBundle {
    readonly filePath: FilePath;
  }

  type BundleGroup = Readonly<{
    target: Target;
    entryAssetId: string;
  }>;

  interface BundleGraph<TBundle extends Bundle> {
    getAssetById(id: string): Asset;
    getAssetPublicId(asset: Asset): string;
    getBundles(): TBundle[];
    getBundleGroupsContainingBundle(bundle: Bundle): BundleGroup[];
    getBundlesInBundleGroup(bundleGroup: BundleGroup): TBundle[];
    getChildBundles(bundle: Bundle): TBundle[];
    getParentBundles(bundle: Bundle): TBundle[];
    getReferencedBundles(
      bundle: Bundle,
      opts?: {
        recursive: boolean;
      }
    ): TBundle[];
    getDependencies(asset: Asset): Dependency[];
    getIncomingDependencies(asset: Asset): Dependency[];
    getAssetWithDependency(dep: Dependency): Asset | undefined;
    isEntryBundleGroup(bundleGroup: BundleGroup): boolean;
    resolveAsyncDependency(
      dependency: Dependency,
      bundle?: Bundle | undefined
    ):
      | {
          type: 'bundle_group';
          value: BundleGroup;
        }
      | {
          type: 'asset';
          value: Asset;
        }
      | undefined;
    isDependencySkipped(dependency: Dependency): boolean;
    getDependencyResolution(
      dependency: Dependency,
      bundle?: Bundle
    ): Asset | undefined;
    getReferencedBundle(
      dependency: Dependency,
      bundle: Bundle
    ): TBundle | undefined;
    findBundlesWithAsset(asset: Asset): TBundle[];
    findBundlesWithDependency(dependency: Dependency): TBundle[];
    isAssetReachableFromBundle(asset: Asset, bundle: Bundle): boolean;
    findReachableBundleWithAsset(
      bundle: Bundle,
      asset: Asset
    ): TBundle | undefined;
    isAssetReferencedByDependant(bundle: Bundle, asset: Asset): boolean;
    hasParentBundleOfType(bundle: Bundle, type: string): boolean;
    resolveSymbol(
      asset: Asset,
      symbol: symbol,
      boundary: Bundle | undefined
    ): SymbolResolution;
    getExportedSymbols(
      asset: Asset,
      boundary: Bundle | undefined
    ): ExportSymbolResolution[];
    traverseBundles<TContext>(
      visit: GraphVisitor<TBundle, TContext>,
      startBundle: Bundle | undefined
    ): TContext | undefined;
    getUsedSymbols(assetOrDependency: Asset | Dependency): ReadonlySet<symbol>;
  }

  type BuildSuccessEvent = Readonly<{
    type: 'buildSuccess';
    bundleGraph: BundleGraph<PackagedBundle>;
    buildTime: number;
    changedAssets: Map<string, Asset>;
    requestBundle: (bundle: NamedBundle) => Promise<BuildSuccessEvent>;
  }>;

  type ProgressLogEvent = Readonly<{
    type: 'log';
    level: 'progress';
    phase?: string;
    message: string;
  }>;

  type DiagnosticLogEvent = Readonly<{
    type: 'log';
    level: 'error' | 'warn' | 'info' | 'verbose';
    diagnostics: Diagnostic[];
  }>;

  type TextLogEvent = Readonly<{
    type: 'log';
    level: 'success';
    message: string;
  }>;

  type LogEvent = ProgressLogEvent | DiagnosticLogEvent | TextLogEvent;

  type BuildStartEvent = Readonly<{
    type: 'buildStart';
  }>;

  type ResolvingProgressEvent = Readonly<{
    type: 'buildProgress';
    phase: 'resolving';
    dependency: Dependency;
  }>;

  type TransformingProgressEvent = Readonly<{
    type: 'buildProgress';
    phase: 'transforming';
    filePath: FilePath;
  }>;

  type BundlingProgressEvent = Readonly<{
    type: 'buildProgress';
    phase: 'bundling';
  }>;

  type PackagingProgressEvent = Readonly<{
    type: 'buildProgress';
    phase: 'packaging';
    bundle: NamedBundle;
  }>;

  type OptimizingProgressEvent = Readonly<{
    type: 'buildProgress';
    phase: 'optimizing';
    bundle: NamedBundle;
  }>;

  type BuildProgressEvent =
    | ResolvingProgressEvent
    | TransformingProgressEvent
    | BundlingProgressEvent
    | PackagingProgressEvent
    | OptimizingProgressEvent;

  type BuildFailureEvent = Readonly<{
    type: 'buildFailure';
    diagnostics: Diagnostic[];
  }>;

  type WatchStartEvent = Readonly<{
    type: 'watchStart';
  }>;

  type WatchEndEvent = Readonly<{
    type: 'watchEnd';
  }>;

  type ValidationEvent = Readonly<{
    type: 'validation';
    filePath: FilePath;
  }>;

  type ReporterEvent =
    | LogEvent
    | BuildStartEvent
    | BuildProgressEvent
    | BuildSuccessEvent
    | BuildFailureEvent
    | WatchStartEvent
    | WatchEndEvent
    | ValidationEvent;
}

declare module '@parcel/core' {
  import { BuildSuccessEvent } from '@parcel/types';

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ParcelOptions {}

  export class Parcel {
    constructor(options: ParcelOptions);

    run(): Promise<BuildSuccessEvent>;
  }

  export default Parcel;

  export type WorkerFarm = {
    end(): Promise<void>;
  };

  export function createWorkerFarm(): WorkerFarm;
}

declare module '@parcel/diagnostic' {
  import type { FilePath } from '@parcel/types';

  type DiagnosticHighlightLocation = {
    readonly line: number;
    readonly column: number;
  };

  type DiagnosticCodeHighlight = {
    start: DiagnosticHighlightLocation;
    end: DiagnosticHighlightLocation;
    message?: string;
  };

  type DiagnosticCodeFrame = {
    code?: string;
    codeHighlights: DiagnosticCodeHighlight[];
  };

  type Diagnostic = {
    message: string;
    origin?: string;
    stack?: string;
    name?: string;
    filePath?: FilePath;
    language?: string;
    codeFrame?: DiagnosticCodeFrame;
    hints?: string[];
  };

  type ThrowableDiagnosticOpts = {
    diagnostic: Diagnostic | Diagnostic[];
  };

  class ThrowableDiagnostic extends Error {
    diagnostics: Diagnostic[];
    constructor(opts: ThrowableDiagnosticOpts);
  }

  type PrintableError = Error & {
    fileName?: string;
    filePath?: string;
    codeFrame?: string;
    highlightedCodeFrame?: string;
    loc?:
      | {
          column: number;
          line: number;
        }
      | undefined;
    source?: string;
  };

  type Diagnostifiable =
    | Diagnostic
    | Diagnostic[]
    | ThrowableDiagnostic
    | PrintableError
    | string;

  type DiagnosticWithoutOrigin = Diagnostic & {
    origin?: string;
  };
}

declare module '@parcel/logger' {
  import { DiagnosticWithoutOrigin, Diagnostifiable } from '@parcel/diagnostic';

  interface PluginLogger {
    verbose(
      diagnostic: DiagnosticWithoutOrigin | DiagnosticWithoutOrigin[]
    ): void;
    info(diagnostic: DiagnosticWithoutOrigin | DiagnosticWithoutOrigin[]): void;
    log(diagnostic: DiagnosticWithoutOrigin | DiagnosticWithoutOrigin[]): void;
    warn(diagnostic: DiagnosticWithoutOrigin | DiagnosticWithoutOrigin[]): void;
    error(
      input:
        | Diagnostifiable
        | DiagnosticWithoutOrigin
        | DiagnosticWithoutOrigin[]
    ): void;
  }
}

declare module '@parcel/fs' {
  import type { Dirent, ReadStream, Stats, WriteStream } from 'fs';
  import type { FilePath } from '@parcel/types';
  import type {
    AsyncSubscription,
    Options as WatcherOptions,
  } from '@parcel/watcher';

  export type FileOptions = {
    mode?: number;
  };

  export interface FileSystem {
    readFile(filePath: FilePath): Promise<Buffer>;
    readFile(filePath: FilePath, encoding: string): Promise<string>;
    readFileSync(filePath: FilePath): Buffer;
    readFileSync(filePath: FilePath, encoding: string): string;
    writeFile(
      filePath: FilePath,
      contents: Buffer | string,
      options?: FileOptions
    ): Promise<void>;
    copyFile(
      source: FilePath,
      destination: FilePath,
      flags?: number
    ): Promise<void>;
    stat(filePath: FilePath): Promise<Partial<Stats>>;
    statSync(filePath: FilePath): Partial<Stats>;
    readdir(
      path: FilePath,
      opts?: { withFileTypes?: false }
    ): Promise<FilePath[]>;
    readdir(path: FilePath, opts: { withFileTypes: true }): Promise<Dirent[]>;
    readdirSync(path: FilePath, opts?: { withFileTypes?: false }): FilePath[];
    readdirSync(path: FilePath, opts: { withFileTypes: true }): Dirent[];
    unlink(path: FilePath): Promise<void>;
    realpath(path: FilePath): Promise<FilePath>;
    realpathSync(path: FilePath): FilePath;
    exists(path: FilePath): Promise<boolean>;
    existsSync(path: FilePath): boolean;
    mkdirp(path: FilePath): Promise<void>;
    rimraf(path: FilePath): Promise<void>;
    ncp(source: FilePath, destination: FilePath): Promise<void>;
    createReadStream(path: FilePath, options?: FileOptions): ReadStream;
    createWriteStream(path: FilePath, options?: FileOptions): WriteStream;
    cwd(): FilePath;
    chdir(dir: FilePath): void;
    watch(
      dir: FilePath,
      fn: (err: Error | undefined, events: Event[]) => unknown,
      opts: WatcherOptions
    ): Promise<AsyncSubscription>;
    getEventsSince(
      dir: FilePath,
      snapshot: FilePath,
      opts: WatcherOptions
    ): Promise<Event[]>;
    writeSnapshot(
      dir: FilePath,
      snapshot: FilePath,
      opts: WatcherOptions
    ): Promise<void>;
    findAncestorFile(
      fileNames: string[],
      fromDir: FilePath,
      root: FilePath
    ): FilePath | undefined;
    findNodeModule(moduleName: string, fromDir: FilePath): FilePath | undefined;
    findFirstFile(filePaths: FilePath[]): FilePath | undefined;
  }

  export interface NodeFSStatic {
    new (): FileSystem;
  }

  export const MemoryFS: NodeFSStatic;
  export const NodeFS: NodeFSStatic;
}

declare module '@parcel/plugin' {
  import { PluginLogger } from '@parcel/logger';
  import type {
    Asset,
    AST,
    Async,
    Bundle,
    BundleGraph,
    Config,
    ConfigResult,
    Dependency,
    MutableAsset,
    PackagedBundle,
    PluginOptions,
    ReporterEvent,
    ResolveFn,
    SourceMap,
    TransformerResult,
  } from '@parcel/types';

  export type {
    Asset,
    Bundle,
    BundleGraph,
    Dependency,
    MutableAsset,
    PackagedBundle,
    PluginOptions,
  };

  export type GenerateOutput = Readonly<{
    content: Blob;
    map?: SourceMap | undefined;
  }>;

  export class Transformer {
    constructor(transformer: {
      loadConfig?: (opts: {
        config: Config;
        options: PluginOptions;
        logger: PluginLogger;
      }) => Async<void>;
      canReuseAST?: (opts: {
        ast: AST;
        options: PluginOptions;
        logger: PluginLogger;
      }) => boolean;
      parse?: (opts: {
        asset: MutableAsset;
        config: ConfigResult | undefined;
        resolve: ResolveFn;
        options: PluginOptions;
        logger: PluginLogger;
      }) => Async<AST | undefined>;
      transform(opts: {
        asset: MutableAsset;
        config: ConfigResult | undefined;
        resolve: ResolveFn;
        options: PluginOptions;
        logger: PluginLogger;
      }): Async<Array<TransformerResult | MutableAsset>>;
      generate?: (opts: {
        asset: Asset;
        ast: AST;
        options: PluginOptions;
        logger: PluginLogger;
      }) => Async<GenerateOutput>;
    });
  }

  export class Reporter {
    constructor(reporter: {
      report(opts: {
        event: ReporterEvent;
        options: PluginOptions;
        logger: PluginLogger;
      }): Async<void>;
    });
  }
}

declare module '@parcel/watcher' {
  import { FilePath } from '@parcel/types';

  export interface AsyncSubscription {
    unsubscribe(): Promise<unknown>;
  }

  export type Options = {
    ignore?: FilePath[];
    backend?: 'fs-events' | 'watchman' | 'inotify' | 'windows' | 'brute-force';
  };
}
