/**
 * The configuration for a set of files.
 */
export interface ConfigObject<Rules extends RulesConfig = RulesConfig> {
  /**
   * A string to identify the configuration object. Used in error messages and
   * inspection tools.
   */
  name?: string;
  /**
   * Path to the directory where the configuration object should apply.
   * `files` and `ignores` patterns in the configuration object are
   * interpreted as relative to this path.
   */
  basePath?: string;
  /**
   * An array of glob patterns indicating the files that the configuration
   * object should apply to. If not specified, the configuration object applies
   * to all files
   */
  files?: (string | string[])[];
  /**
   * An array of glob patterns indicating the files that the configuration
   * object should not apply to. If not specified, the configuration object
   * applies to all files matched by files
   */
  ignores?: string[];
  /**
   * The name of the language used for linting. This is used to determine the
   * parser and other language-specific settings.
   */
  language?: string;
  /**
   * An object containing settings related to how the language is configured for
   * linting.
   */
  languageOptions?: LanguageOptions;
  /**
   * An object containing settings related to the linting process
   */
  linterOptions?: LinterOptions;
  /**
   * Either an object containing preprocess() and postprocess() methods or a
   * string indicating the name of a processor inside of a plugin
   * (i.e., "pluginName/processorName").
   */
  processor?: string | Processor;
  /**
   * An object containing a name-value mapping of plugin names to plugin objects.
   * When files is specified, these plugins are only available to the matching files.
   */
  plugins?: Record<string, Plugin>;
  /**
   * An object containing the configured rules. When files or ignores are specified,
   * these rule configurations are only available to the matching files.
   */
  rules?: Partial<Rules>;
  /**
   * An object containing name-value pairs of information that should be
   * available to all rules.
   */
  settings?: Record<string, unknown>;
}
/**
 * A collection of rules and their configurations.
 */
export interface RulesConfig {
  [key: string]: RuleConfig;
}

export type RuleConfig<RuleOptions extends unknown[] = unknown[]> =
  | Severity
  | [Severity, ...Partial<RuleOptions>];
/**
 * The human readable severity level used in a configuration.
 */
export type SeverityName = 'off' | 'warn' | 'error';
/**
 * The numeric severity level for a rule.
 *
 * - `0` means off.
 * - `1` means warn.
 * - `2` means error.
 */
export type SeverityLevel = 0 | 1 | 2;
/**
 * The severity of a rule in a configuration.
 */
export type Severity = SeverityName | SeverityLevel;
/**
 * Plugin-defined options for the language.
 */
export interface LanguageOptions {
  /**
   * The ECMAScript version of the code being linted.
   * @deprecated Only supported in legacy eslintrc config format.
   */
  ecmaVersion?: EcmaVersion;
  globals?: Record<string, GlobalAccess>;
  sourceType?: SourceType;
  parserOptions?: ParserOptions;
}
export interface ParserOptions {
  /**
   * Allow the use of reserved words as identifiers (if `ecmaVersion` is 3).
   *
   * @default false
   */
  allowReserved?: boolean;
  /**
   * Accepts any valid ECMAScript version number or `'latest'`:
   *
   * - A version: es3, es5, es6, es7, es8, es9, es10, es11, es12, es13, es14, ..., or
   * - A year: es2015, es2016, es2017, es2018, es2019, es2020, es2021, es2022, es2023, ..., or
   * - `'latest'`
   *
   * When it's a version or a year, the value must be a number - so do not include the `es` prefix.
   *
   * Specifies the version of ECMAScript syntax you want to use. This is used by the parser to determine how to perform scope analysis, and it affects the default
   *
   * @default 5
   */
  ecmaFeatures?: EcmaFeatures;
}
/**
 * The ECMAScript version of the code being linted.
 * @deprecated Only supported in legacy eslintrc config format.
 */
export type EcmaVersion =
  | 3
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 2015
  | 2016
  | 2017
  | 2018
  | 2019
  | 2020
  | 2021
  | 2022
  | 2023
  | 2024
  | 2025
  | 2026
  | 'latest';

/**
 * Represents the configuration options for the core linter.
 */
export interface LinterOptions {
  /**
   * Indicates whether or not inline configuration is evaluated.
   */
  noInlineConfig?: boolean;
  /**
   * Indicates what to do when an unused disable directive is found.
   */
  reportUnusedDisableDirectives?: boolean | Severity;
  /**
   * A severity value indicating if and how unused inline configs should be
   * tracked and reported.
   */
  reportUnusedInlineConfigs?: Severity;
}
/**
 * A processor is an object that can preprocess and postprocess files.
 */
export interface Processor<
  T extends string | ProcessorFile = string | ProcessorFile
> extends ObjectMetaProperties {
  supportsAutofix?: boolean | undefined;
  preprocess?(text: string, filename: string): T[];
  postprocess?(messages: LintMessage[][], filename: string): LintMessage[];
}
/**
 * File information passed to a processor.
 */
export interface ProcessorFile {
  text: string;
  filename: string;
}
/**
 * Represents the metadata for an object, such as a plugin or processor.
 */
export interface ObjectMetaProperties {
  /** @deprecated Use `meta.name` instead. */
  name?: string | undefined;
  /** @deprecated Use `meta.version` instead. */
  version?: string | undefined;
  meta?: {
    name?: string | undefined;
    version?: string | undefined;
  };
}
/**
 * The normalized version of a lint violation message.
 */
export interface LintMessage {
  /** The 1-based column number. */
  column: number;
  /** The 1-based line number. */
  line: number;
  /** The 1-based column number of the end location. */
  endColumn?: number | undefined;
  /** The 1-based line number of the end location. */
  endLine?: number | undefined;
  /** The ID of the rule which makes this message. */
  ruleId: string | null;
  /** The reported message. */
  message: string;
  /** The ID of the message in the rule's meta. */
  messageId?: string | undefined;
  /**
   * Type of node.
   * @deprecated `nodeType` is deprecated and will be removed in the next major version.
   */
  nodeType?: string | undefined;
  /** If `true` then this is a fatal error. */
  fatal?: true | undefined;
  /** The severity of this message. */
  severity: Exclude<SeverityLevel, 0>;
  /** Information for autofix. */
  fix?: RuleTextEdit | undefined;
  /** Information for suggestions. */
  suggestions?: LintSuggestion[] | undefined;
}
/**
 * Represents a fix for a rule violation implemented as a text edit.
 */
export interface RuleTextEdit {
  /**
   * The range to replace.
   */
  range: SourceRange;
  /**
   * The text to insert.
   */
  text: string;
}
/**
 * The normalized version of a lint suggestion.
 */
export interface LintSuggestion {
  /** A short description. */
  desc: string;
  /** Fix result info. */
  fix: RuleTextEdit;
  /** Id referencing a message for the description. */
  messageId?: string | undefined;
}
/**
 * Represents a range of characters in the source.
 */
export type SourceRange = [number, number];

export interface Plugin extends ObjectMetaProperties {
  meta?: ObjectMetaProperties['meta'] & {
    namespace?: string | undefined;
  };
  configs?: any;
  environments?: Record<string, EnvironmentConfig> | undefined;
  languages?: Record<string, Language> | undefined;
  processors?: Record<string, Processor> | undefined;
  rules?: Record<string, RuleDefinition> | undefined;
}
/** @deprecated Only supported in legacy eslintrc config format. */
export interface EnvironmentConfig {
  /** The definition of global variables. */
  globals?: GlobalsConfig | undefined;
  /** The parser options that will be enabled under this environment. */
  parserOptions?: ParserOptions | undefined;
}
/** @deprecated Only supported in legacy eslintrc config format. */
export interface GlobalsConfig {
  [name: string]: GlobalAccess;
}
/** @deprecated Only supported in legacy eslintrc config format. */
export type GlobalAccess =
  | boolean
  | 'off'
  | 'readable'
  | 'readonly'
  | 'writable'
  | 'writeable';
/**
 * Represents a plugin language.
 */
export interface Language<
  Options extends LanguageTypeOptions = {
    LangOptions: LanguageOptions;
    Code: SourceCode;
    RootNode: unknown;
    Node: unknown;
  }
> {
  /**
   * Indicates how ESLint should read the file.
   */
  fileType: 'text';
  /**
   * First line number returned from the parser (text mode only).
   */
  lineStart: 0 | 1;
  /**
   * First column number returned from the parser (text mode only).
   */
  columnStart: 0 | 1;
  /**
   * The property to read the node type from. Used in selector querying.
   */
  nodeTypeKey: string;
  /**
   * The traversal path that tools should take when evaluating the AST
   */
  visitorKeys?: Record<string, string[]>;
  /**
   * Default language options. User-defined options are merged with this object.
   */
  defaultLanguageOptions?: LanguageOptions;
  /**
   * Validates languageOptions for this language.
   */
  validateLanguageOptions(languageOptions: Options['LangOptions']): void;
  /**
   * Normalizes languageOptions for this language.
   */
  normalizeLanguageOptions?(
    languageOptions: Options['LangOptions']
  ): Options['LangOptions'];
  /**
   * Helper for esquery that allows languages to match nodes against
   * class. esquery currently has classes like `function` that will
   * match all the various function nodes. This method allows languages
   * to implement similar shorthands.
   */
  matchesSelectorClass?(
    className: string,
    node: Options['Node'],
    ancestry: Options['Node'][]
  ): boolean;
  /**
   * Parses the given file input into its component parts. This file should not
   * throws errors for parsing errors but rather should return any parsing
   * errors as parse of the ParseResult object.
   */
  parse(
    file: File,
    context: LanguageContext<Options['LangOptions']>
  ): ParseResult<Options['RootNode']>;
  /**
   * Creates SourceCode object that ESLint uses to work with a file.
   */
  createSourceCode(
    file: File,
    input: OkParseResult<Options['RootNode']>,
    context: LanguageContext<Options['LangOptions']>
  ): Options['Code'];
}
/**
 * Generic options for the `Language` type.
 */
export interface LanguageTypeOptions {
  LangOptions: LanguageOptions;
  Code: SourceCode;
  RootNode: unknown;
  Node: unknown;
}

export type SourceCode<
  Options extends SourceCodeBaseTypeOptions = {
    LangOptions: LanguageOptions;
    RootNode: unknown;
    SyntaxElementWithLoc: unknown;
    ConfigNode: unknown;
  }
> = TextSourceCode<Options> | BinarySourceCode<Options>;
/**
 * Generic options for the `SourceCodeBase` type.
 */
export interface SourceCodeBaseTypeOptions {
  LangOptions: LanguageOptions;
  RootNode: unknown;
  SyntaxElementWithLoc: unknown;
  ConfigNode: unknown;
}
/**
 * Represents the source of a text file being linted.
 */
export interface TextSourceCode<
  Options extends SourceCodeBaseTypeOptions = {
    LangOptions: LanguageOptions;
    RootNode: unknown;
    SyntaxElementWithLoc: unknown;
    ConfigNode: unknown;
  }
> extends SourceCodeBase<Options> {
  /**
   * The body of the file that you'd like rule developers to access.
   */
  text: string;
}
/**
 * Represents the basic interface for a source code object.
 */
export interface SourceCodeBase<
  Options extends SourceCodeBaseTypeOptions = {
    LangOptions: LanguageOptions;
    RootNode: unknown;
    SyntaxElementWithLoc: unknown;
    ConfigNode: unknown;
  }
> {
  /**
   * Root of the AST.
   */
  ast: Options['RootNode'];
  /**
   * The traversal path that tools should take when evaluating the AST.
   * When present, this overrides the `visitorKeys` on the language for
   * just this source code object.
   */
  visitorKeys?: Record<string, string[]>;
  /**
   * Retrieves the equivalent of `loc` for a given node or token.
   * @param syntaxElement The node or token to get the location for.
   * @returns The location of the node or token.
   */
  getLoc(syntaxElement: Options['SyntaxElementWithLoc']): SourceLocation;
  /**
   * Retrieves the equivalent of `range` for a given node or token.
   * @param syntaxElement The node or token to get the range for.
   * @returns The range of the node or token.
   */
  getRange(syntaxElement: Options['SyntaxElementWithLoc']): SourceRange;
  /**
   * Traversal of AST.
   */
  traverse(): Iterable<TraversalStep>;
  /**
   * Applies language options passed in from the ESLint core.
   */
  applyLanguageOptions?(languageOptions: Options['LangOptions']): void;
  /**
   * Return all of the inline areas where ESLint should be disabled/enabled
   * along with any problems found in evaluating the directives.
   */
  getDisableDirectives?(): {
    directives: Directive[];
    problems: FileProblem[];
  };
  /**
   * Returns an array of all inline configuration nodes found in the
   * source code.
   */
  getInlineConfigNodes?(): Options['ConfigNode'][];
  /**
   * Applies configuration found inside of the source code. This method is only
   * called when ESLint is running with inline configuration allowed.
   */
  applyInlineConfig?(): {
    configs: InlineConfigElement[];
    problems: FileProblem[];
  };
  /**
   * Called by ESLint core to indicate that it has finished providing
   * information. We now add in all the missing variables and ensure that
   * state-changing methods cannot be called by rules.
   * @returns {void}
   */
  finalize?(): void;
}
/**
 * Represents a file read by ESLint.
 */
export interface File {
  /**
   * The path that ESLint uses for this file. May be a virtual path
   * if it was returned by a processor.
   */
  path: string;
  /**
   * The path to the file on disk. This always maps directly to a file
   * regardless of whether it was returned from a processor.
   */
  physicalPath: string;
  /**
   * Indicates if the original source contained a byte-order marker.
   * ESLint strips the BOM from the `body`, but this info is needed
   * to correctly apply autofixing.
   */
  bom: boolean;
  /**
   * The body of the file to parse.
   */
  body: string | Uint8Array;
}
/**
 * Represents the start and end coordinates of a node inside the source.
 */
export interface SourceLocation {
  start: Position;
  end: Position;
}
/**
 * Represents a location coordinate inside the source. ESLint-style formats
 * have just `line` and `column` while others may have `offset` as well.
 */
export interface Position {
  line: number;
  column: number;
}
/**
 * Represents a disable directive.
 */
export interface Directive {
  /**
   * The type of directive.
   */
  type: DirectiveType;
  /**
   * The node of the directive. May be in the AST or a comment/token.
   */
  node: unknown;
  /**
   * The value of the directive.
   */
  value: string;
  /**
   * The justification for the directive.
   */
  justification?: string;
}
/**
 * The type of disable directive. This determines how ESLint will disable rules.
 */
export type DirectiveType =
  | 'disable'
  | 'enable'
  | 'disable-line'
  | 'disable-next-line';
/**
 * Represents a problem found in a file.
 */
export interface FileProblem {
  ruleId: string | null;
  message: string;
  loc: SourceLocation;
}
/**
 * Represents inline configuration found in the source code.
 */
export interface InlineConfigElement {
  /**
   * The location of the inline config element.
   */
  loc: SourceLocation;
  /**
   * The interpreted configuration from the inline config element.
   */
  config: {
    rules: RulesConfig;
  };
}
export interface BinarySourceCode<
  Options extends SourceCodeBaseTypeOptions = {
    LangOptions: LanguageOptions;
    RootNode: unknown;
    SyntaxElementWithLoc: unknown;
    ConfigNode: unknown;
  }
> extends SourceCodeBase<Options> {
  /**
   * The body of the file that you'd like rule developers to access.
   */
  body: Uint8Array;
}
/**
 * The context object that is passed to the language plugin methods.
 */
export interface LanguageContext<LangOptions = LanguageOptions> {
  languageOptions: LangOptions;
}
/**
 * Represents the successful result of parsing a file.
 */
export interface OkParseResult<RootNode = unknown> {
  /**
   * Indicates if the parse was successful. If true, the parse was successful
   * and ESLint should continue on to create a SourceCode object and run rules;
   * if false, ESLint should just report the error(s) without doing anything
   * else.
   */
  ok: true;
  /**
   * The abstract syntax tree created by the parser. (only when ok: true)
   */
  ast: RootNode;
  /**
   * Any additional data that the parser wants to provide.
   */
  [key: string]: any;
}
/**
 * The definition of an ESLint rule.
 */
export interface RuleDefinition<
  Options extends RuleDefinitionTypeOptions = RuleDefinitionTypeOptions
> {
  /**
   * The meta information for the rule.
   */
  meta?: RulesMeta<
    Options['MessageIds'],
    Options['RuleOptions'],
    Options['ExtRuleDocs']
  >;
  /**
   * Creates the visitor that ESLint uses to apply the rule during traversal.
   * @param context The rule context.
   * @returns The rule visitor.
   */
  create(
    context: RuleContext<{
      LangOptions: Options['LangOptions'];
      Code: Options['Code'];
      RuleOptions: Options['RuleOptions'];
      Node: Options['Node'];
      MessageIds: Options['MessageIds'];
    }>
  ): Options['Visitor'];
}
/**
 * Generic options for the `RuleDefinition` type.
 */
export interface RuleDefinitionTypeOptions {
  LangOptions: LanguageOptions;
  Code: SourceCode;
  RuleOptions: unknown[];
  Visitor: RuleVisitor;
  Node: unknown;
  MessageIds: string;
  ExtRuleDocs: unknown;
}
/**
 * An object containing visitor information for a rule. Each method is either the
 * name of a node type or a selector, or is a method that will be called at specific
 * times during the traversal.
 */
export type RuleVisitor = Record<
  string,
  ((...args: any[]) => void) | undefined
>;
export interface RulesMeta<
  MessageIds extends string = string,
  RuleOptions = unknown[],
  ExtRuleDocs = unknown
> {
  /**
   * Properties that are used when documenting the rule.
   */
  docs?: (RulesMetaDocs & ExtRuleDocs) | undefined;
  /**
   * The type of rule.
   */
  type?: RuleType | undefined;
  /**
   * The schema for the rule options. Required if the rule has options.
   */
  schema?: JSONSchema4 | JSONSchema4[] | false | undefined;
  /**
   * Any default options to be recursively merged on top of any user-provided options.
   **/
  defaultOptions?: RuleOptions;
  /**
   * The messages that the rule can report.
   */
  messages?: Record<MessageIds, string>;
  /**
   * Indicates whether the rule has been deprecated or provides additional metadata about the deprecation. Omit if not deprecated.
   */
  deprecated?: boolean | DeprecatedInfo | undefined;
  /**
   * @deprecated Use deprecated.replacedBy instead.
   * The name of the rule(s) this rule was replaced by, if it was deprecated.
   */
  replacedBy?: readonly string[] | undefined;
  /**
   * Indicates if the rule is fixable, and if so, what type of fix it provides.
   */
  fixable?: RuleFixType | undefined;
  /**
   * Indicates if the rule may provide suggestions.
   */
  hasSuggestions?: boolean | undefined;
  /**
   * The language the rule is intended to lint.
   */
  language?: string;
  /**
   * The dialects of `language` that the rule is intended to lint.
   */
  dialects?: string[];
}
/**
 * Rule meta information used for documentation.
 */
export interface RulesMetaDocs {
  /**
   * A short description of the rule.
   */
  description?: string | undefined;
  /**
   * The URL to the documentation for the rule.
   */
  url?: string | undefined;
  /**
   * The category the rule falls under.
   * @deprecated No longer used.
   */
  category?: string | undefined;
  /**
   * Indicates if the rule is generally recommended for all users.
   *
   * Note - this will always be a boolean for core rules, but may be used in any way by plugins.
   */
  recommended?: unknown;
  /**
   * Indicates if the rule is frozen (no longer accepting feature requests).
   */
  frozen?: boolean | undefined;
}
/**
 * JSON Schema V4
 * @see https://tools.ietf.org/html/draft-zyp-json-schema-04
 */
export interface JSONSchema4 {
  id?: string | undefined;
  $ref?: string | undefined;
  $schema?: JSONSchema4Version | undefined;
  /**
   * This attribute is a string that provides a short description of the
   * instance property.
   *
   * @see https://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.21
   */
  title?: string | undefined;

  /**
   * This attribute is a string that provides a full description of the of
   * purpose the instance property.
   *
   * @see https://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.22
   */
  description?: string | undefined;
  default?: JSONSchema4Type | undefined;
  multipleOf?: number | undefined;
  maximum?: number | undefined;
  exclusiveMaximum?: boolean | undefined;
  minimum?: number | undefined;
  exclusiveMinimum?: boolean | undefined;
  maxLength?: number | undefined;
  minLength?: number | undefined;
  pattern?: string | undefined;
  /**
   * May only be defined when "items" is defined, and is a tuple of JSONSchemas.
   *
   * This provides a definition for additional items in an array instance
   * when tuple definitions of the items is provided.  This can be false
   * to indicate additional items in the array are not allowed, or it can
   * be a schema that defines the schema of the additional items.
   *
   * @see https://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.6
   */
  additionalItems?: boolean | JSONSchema4 | undefined;
  /**
   * This attribute defines the allowed items in an instance array, and
   * MUST be a schema or an array of schemas.  The default value is an
   * empty schema which allows any value for items in the instance array.
   *
   * When this attribute value is a schema and the instance value is an
   * array, then all the items in the array MUST be valid according to the
   * schema.
   *
   * When this attribute value is an array of schemas and the instance
   * value is an array, each position in the instance array MUST conform
   * to the schema in the corresponding position for this array.  This
   * called tuple typing.  When tuple typing is used, additional items are
   * allowed, disallowed, or constrained by the "additionalItems"
   * (Section 5.6) attribute using the same rules as
   * "additionalProperties" (Section 5.4) for objects.
   *
   * @see https://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.5
   */
  items?: JSONSchema4 | JSONSchema4[] | undefined;
  maxItems?: number | undefined;
  minItems?: number | undefined;
  uniqueItems?: boolean | undefined;
  maxProperties?: number | undefined;
  minProperties?: number | undefined;
  /**
   * This attribute indicates if the instance must have a value, and not
   * be undefined. This is false by default, making the instance
   * optional.
   *
   * @see https://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.7
   */
  required?: boolean | string[] | undefined;
  /**
   * This attribute defines a schema for all properties that are not
   * explicitly defined in an object type definition. If specified, the
   * value MUST be a schema or a boolean. If false is provided, no
   * additional properties are allowed beyond the properties defined in
   * the schema. The default value is an empty schema which allows any
   * value for additional properties.
   *
   * @see https://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.4
   */
  additionalProperties?: boolean | JSONSchema4 | undefined;
  definitions?:
    | {
        [k: string]: JSONSchema4;
      }
    | undefined;
  /**
   * This attribute is an object with property definitions that define the
   * valid values of instance object property values. When the instance
   * value is an object, the property values of the instance object MUST
   * conform to the property definitions in this object. In this object,
   * each property definition's value MUST be a schema, and the property's
   * name MUST be the name of the instance property that it defines.  The
   * instance property value MUST be valid according to the schema from
   * the property definition. Properties are considered unordered, the
   * order of the instance properties MAY be in any order.
   *
   * @see https://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.2
   */
  properties?:
    | {
        [k: string]: JSONSchema4;
      }
    | undefined;
  /**
   * This attribute is an object that defines the schema for a set of
   * property names of an object instance. The name of each property of
   * this attribute's object is a regular expression pattern in the ECMA
   * 262/Perl 5 format, while the value is a schema. If the pattern
   * matches the name of a property on the instance object, the value of
   * the instance's property MUST be valid against the pattern name's
   * schema value.
   *
   * @see https://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.3
   */
  patternProperties?:
    | {
        [k: string]: JSONSchema4;
      }
    | undefined;
  dependencies?:
    | {
        [k: string]: JSONSchema4 | string[];
      }
    | undefined;
  /**
   * This provides an enumeration of all possible values that are valid
   * for the instance property. This MUST be an array, and each item in
   * the array represents a possible value for the instance value. If
   * this attribute is defined, the instance value MUST be one of the
   * values in the array in order for the schema to be valid.
   *
   * @see https://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.19
   */
  enum?: JSONSchema4Type[] | undefined;
  /**
   * A single type, or a union of simple types
   */
  type?: JSONSchema4TypeName | JSONSchema4TypeName[] | undefined;
  allOf?: JSONSchema4[] | undefined;
  anyOf?: JSONSchema4[] | undefined;
  oneOf?: JSONSchema4[] | undefined;
  not?: JSONSchema4 | undefined;
  /**
   * The value of this property MUST be another schema which will provide
   * a base schema which the current schema will inherit from.  The
   * inheritance rules are such that any instance that is valid according
   * to the current schema MUST be valid according to the referenced
   * schema.  This MAY also be an array, in which case, the instance MUST
   * be valid for all the schemas in the array.  A schema that extends
   * another schema MAY define additional attributes, constrain existing
   * attributes, or add other constraints.
   *
   * Conceptually, the behavior of extends can be seen as validating an
   * instance against all constraints in the extending schema as well as
   * the extended schema(s).
   *
   * @see https://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.26
   */
  extends?: string | string[] | undefined;
  /**
   * @see https://tools.ietf.org/html/draft-zyp-json-schema-04#section-5.6
   */
  [k: string]: any;
  format?: string | undefined;
}
/**
 * @see https://tools.ietf.org/html/draft-zyp-json-schema-04#section-3.5
 */
export type JSONSchema4Type =
  | string //
  | number
  | boolean
  | JSONSchema4Object
  | JSONSchema4Array
  | null;
// Workaround for infinite type recursion
// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
export type JSONSchema4Array = Array<JSONSchema4Type>;
// Workaround for infinite type recursion
export type JSONSchema4Object = {
  [key: string]: JSONSchema4Type;
};
/**
 * @see https://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.1
 */
export type JSONSchema4TypeName =
  | 'string' //
  | 'number'
  | 'integer'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null'
  | 'any';
/**
 * Meta schema
 *
 * Recommended values:
 * - 'http://json-schema.org/schema#'
 * - 'http://json-schema.org/hyper-schema#'
 * - 'http://json-schema.org/draft-04/schema#'
 * - 'http://json-schema.org/draft-04/hyper-schema#'
 * - 'http://json-schema.org/draft-03/schema#'
 * - 'http://json-schema.org/draft-03/hyper-schema#'
 *
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-5
 */
export type JSONSchema4Version = string;
/**
 * What the rule is responsible for finding:
 * - `problem` means the rule has noticed a potential error.
 * - `suggestion` means the rule suggests an alternate or better approach.
 * - `layout` means the rule is looking at spacing, indentation, etc.
 */
export type RuleType = 'problem' | 'suggestion' | 'layout';
/**
 * Provides additional metadata about a deprecation.
 */
export interface DeprecatedInfo {
  /**
   * General message presented to the user, e.g. for the key rule why the rule
   * is deprecated or for info how to replace the rule.
   */
  message?: string;
  /**
   * URL to more information about this deprecation in general.
   */
  url?: string;
  /**
   * An empty array explicitly states that there is no replacement.
   */
  replacedBy?: ReplacedByInfo[];
  /**
   * The package version since when the rule is deprecated (should use full
   * semver without a leading "v").
   */
  deprecatedSince?: string;
  /**
   * The estimated version when the rule is removed (probably the next major
   * version). null means the rule is "frozen" (will be available but will not
   * be changed).
   */
  availableUntil?: string | null;
}
/**
 * Provides metadata about a replacement
 */
export interface ReplacedByInfo {
  /**
   * General message presented to the user, e.g. how to replace the rule
   */
  message?: string;
  /**
   * URL to more information about this replacement in general
   */
  url?: string;
  /**
   * Name should be "eslint" if the replacement is an ESLint core rule. Omit
   * the property if the replacement is in the same plugin.
   */
  plugin?: ExternalSpecifier;
  /**
   * Name and documentation of the replacement rule
   */
  rule?: ExternalSpecifier;
}
/**
 * Specifies the name and url of an external resource. At least one property
 * should be set.
 */
export interface ExternalSpecifier {
  /**
   * Name of the referenced plugin / rule.
   */
  name?: string;
  /**
   * URL pointing to documentation for the plugin / rule.
   */
  url?: string;
}
/**
 * The type of fix the rule can provide:
 * - `code` means the rule can fix syntax.
 * - `whitespace` means the rule can fix spacing and indentation.
 */
export type RuleFixType = 'code' | 'whitespace';
/**
 * Represents the context object that is passed to a rule. This object contains
 * information about the current state of the linting process and is the rule's
 * view into the outside world.
 */
export interface RuleContext<
  Options extends RuleContextTypeOptions = RuleContextTypeOptions
> {
  /**
   * The current working directory for the session.
   */
  cwd: string;
  /**
   * Returns the current working directory for the session.
   * @deprecated Use `cwd` instead.
   */
  getCwd(): string;
  /**
   * The filename of the file being linted.
   */
  filename: string;
  /**
   * Returns the filename of the file being linted.
   * @deprecated Use `filename` instead.
   */
  getFilename(): string;
  /**
   * The physical filename of the file being linted.
   */
  physicalFilename: string;
  /**
   * Returns the physical filename of the file being linted.
   * @deprecated Use `physicalFilename` instead.
   */
  getPhysicalFilename(): string;
  /**
   * The source code object that the rule is running on.
   */
  sourceCode: Options['Code'];
  /**
   * Returns the source code object that the rule is running on.
   * @deprecated Use `sourceCode` instead.
   */
  getSourceCode(): Options['Code'];
  /**
   * Shared settings for the configuration.
   */
  settings: SettingsConfig;
  /**
   * Parser-specific options for the configuration.
   * @deprecated Use `languageOptions.parserOptions` instead.
   */
  parserOptions: Record<string, unknown>;
  /**
   * The language options for the configuration.
   */
  languageOptions: Options['LangOptions'];
  /**
   * The CommonJS path to the parser used while parsing this file.
   * @deprecated No longer used.
   */
  parserPath: string | undefined;
  /**
   * The rule ID.
   */
  id: string;
  /**
   * The rule's configured options.
   */
  options: Options['RuleOptions'];
  /**
   * The report function that the rule should use to report problems.
   * @param violation The violation to report.
   */
  report(
    violation: ViolationReport<Options['Node'], Options['MessageIds']>
  ): void;
}
/**
 * Generic type for `RuleContext`.
 */
export interface RuleContextTypeOptions {
  LangOptions: LanguageOptions;
  Code: SourceCode;
  RuleOptions: unknown[];
  Node: unknown;
  MessageIds: string;
}
/**
 * A collection of settings.
 */
export interface SettingsConfig {
  [key: string]: unknown;
}

export type TraversalStep = VisitTraversalStep | CallTraversalStep;
/**
 * Represents a traversal step visiting the AST.
 */
export interface VisitTraversalStep {
  kind: 1;
  target: unknown;
  phase: 1 | 2;
  args: unknown[];
}
/**
 * Represents a traversal step calling a function.
 */
export interface CallTraversalStep {
  kind: 2;
  target: string;
  phase?: string;
  args: unknown[];
}

export type ParseResult<RootNode = unknown> =
  | OkParseResult<RootNode>
  | NotOkParseResult;
/**
 * Represents the unsuccessful result of parsing a file.
 */
export interface NotOkParseResult {
  /**
   * Indicates if the parse was successful. If true, the parse was successful
   * and ESLint should continue on to create a SourceCode object and run rules;
   * if false, ESLint should just report the error(s) without doing anything
   * else.
   */
  ok: false;
  /**
   * Any parsing errors, whether fatal or not. (only when ok: false)
   */
  errors: FileError[];
  /**
   * Any additional data that the parser wants to provide.
   */
  [key: string]: any;
}
/**
 * Represents an error inside of a file.
 */
export interface FileError {
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
}
/**
 * The type of JavaScript source code.
 * @deprecated Only supported in legacy eslintrc config format.
 */
export type SourceType = 'module' | 'commonjs' | 'script';

export interface EcmaFeatures {
  /**
   * @default false
   */
  globalReturn?: boolean;
  /**
   * @default false
   */
  impliedStrict?: boolean;
  /**
   * @default false
   */
  jsx?: boolean;
  /**
   * @default false
   */
  experimentalObjectRestSpread?: boolean | undefined;
  [key: string]: any;
}

export type ViolationReport<
  Node = unknown,
  MessageIds = string
> = ViolationReportBase &
  ViolationMessage<MessageIds> &
  ViolationLocation<Node>;

export interface ViolationReportBase {
  /**
   * The data to insert into the message.
   */
  data?: Record<string, string> | undefined;
  /**
   * The fix to be applied for the violation.
   */
  fix?: RuleFixer | null | undefined;
  /**
   * An array of suggested fixes for the problem. These fixes may change the
   * behavior of the code, so they are not applied automatically.
   */
  suggest?: SuggestedEdit[] | null | undefined;
}

export type ViolationMessage<MessageIds = string> =
  | {
      message: string;
    }
  | {
      messageId: MessageIds;
    };

export type ViolationLocation<Node> =
  | {
      loc: SourceLocation | Position;
    }
  | {
      node: Node;
    };

/**
 * Fixes a violation.
 * @param fixer The text editor to apply the fix.
 * @returns The fix(es) for the violation.
 */
export type RuleFixer = (
  fixer: RuleTextEditor
) => RuleTextEdit | Iterable<RuleTextEdit> | null;

/**
 * Manager of text edits for a rule fix.
 */
export interface RuleTextEditor<EditableSyntaxElement = unknown> {
  /**
   * Inserts text after the specified node or token.
   * @param syntaxElement The node or token to insert after.
   * @param text The edit to insert after the node or token.
   */
  insertTextAfter(
    syntaxElement: EditableSyntaxElement,
    text: string
  ): RuleTextEdit;
  /**
   * Inserts text after the specified range.
   * @param range The range to insert after.
   * @param text The edit to insert after the range.
   */
  insertTextAfterRange(range: SourceRange, text: string): RuleTextEdit;
  /**
   * Inserts text before the specified node or token.
   * @param syntaxElement A syntax element with location information to insert before.
   * @param text The edit to insert before the node or token.
   */
  insertTextBefore(
    syntaxElement: EditableSyntaxElement,
    text: string
  ): RuleTextEdit;
  /**
   * Inserts text before the specified range.
   * @param range The range to insert before.
   * @param text The edit to insert before the range.
   */
  insertTextBeforeRange(range: SourceRange, text: string): RuleTextEdit;
  /**
   * Removes the specified node or token.
   * @param syntaxElement A syntax element with location information to remove.
   * @returns The edit to remove the node or token.
   */
  remove(syntaxElement: EditableSyntaxElement): RuleTextEdit;
  /**
   * Removes the specified range.
   * @param range The range to remove.
   * @returns The edit to remove the range.
   */
  removeRange(range: SourceRange): RuleTextEdit;
  /**
   * Replaces the specified node or token with the given text.
   * @param syntaxElement A syntax element with location information to replace.
   * @param text The text to replace the node or token with.
   * @returns The edit to replace the node or token.
   */
  replaceText(syntaxElement: EditableSyntaxElement, text: string): RuleTextEdit;
  /**
   * Replaces the specified range with the given text.
   * @param range The range to replace.
   * @param text The text to replace the range with.
   * @returns The edit to replace the range.
   */
  replaceTextRange(range: SourceRange, text: string): RuleTextEdit;
}

export type SuggestedEdit = SuggestedEditBase & SuggestionMessage;

export interface SuggestedEditBase {
  /**
   * The data to insert into the message.
   */
  data?: Record<string, string> | undefined;
  /**
   * The fix to be applied for the suggestion.
   */
  fix?: RuleFixer | null | undefined;
}

export type SuggestionMessage =
  | {
      desc: string;
    }
  | {
      messageId: string;
    };
/**
 * ESLint legacy configuration.
 *
 * @see [ESLint Legacy Configuration](https://eslint.org/docs/latest/use/configure/)
 */
export interface LegacyConfigObject<
  Rules extends RulesConfig = RulesConfig,
  OverrideRules extends RulesConfig = Rules
> extends BaseConfig<Rules, OverrideRules> {
  /**
   * Tell ESLint to ignore specific files and directories.
   *
   * @see [Ignore Patterns](https://eslint.org/docs/latest/use/configure/ignore-deprecated#ignorepatterns-in-config-files)
   */
  ignorePatterns?: string | string[] | undefined;
  /**
   * @see [Using Configuration Files](https://eslint.org/docs/latest/use/configure/configuration-files-deprecated#using-configuration-files)
   */
  root?: boolean | undefined;
}
export /**
 * ESLint legacy configuration.
 *
 * @see [ESLint Legacy Configuration](https://eslint.org/docs/latest/use/configure/)
 */
interface BaseConfig<
  Rules extends RulesConfig = RulesConfig,
  OverrideRules extends RulesConfig = Rules
> extends HasRules<Rules> {
  $schema?: string | undefined;
  /**
   * An environment provides predefined global variables.
   *
   * @see [Environments](https://eslint.org/docs/latest/use/configure/language-options-deprecated#specifying-environments)
   */
  env?:
    | {
        [name: string]: boolean;
      }
    | undefined;
  /**
   * Extending configuration files.
   *
   * @see [Extends](https://eslint.org/docs/latest/use/configure/configuration-files-deprecated#extending-configuration-files)
   */
  extends?: string | string[] | undefined;
  /**
   * Specifying globals.
   *
   * @see [Globals](https://eslint.org/docs/latest/use/configure/language-options-deprecated#specifying-globals)
   */
  globals?: GlobalsConfig | undefined;
  /**
   * Disable processing of inline comments.
   *
   * @see [Disabling Inline Comments](https://eslint.org/docs/latest/use/configure/rules-deprecated#disabling-inline-comments)
   */
  noInlineConfig?: boolean | undefined;
  /**
   * Overrides can be used to use a differing configuration for matching sub-directories and files.
   *
   * @see [How do overrides work](https://eslint.org/docs/latest/use/configure/configuration-files-deprecated#how-do-overrides-work)
   */
  overrides?: ConfigOverride<OverrideRules>[] | undefined;
  /**
   * Parser.
   *
   * @see [Working with Custom Parsers](https://eslint.org/docs/latest/extend/custom-parsers)
   * @see [Specifying Parser](https://eslint.org/docs/latest/use/configure/parser-deprecated)
   */
  parser?: string | undefined;
  /**
   * Parser options.
   *
   * @see [Working with Custom Parsers](https://eslint.org/docs/latest/extend/custom-parsers)
   * @see [Specifying Parser Options](https://eslint.org/docs/latest/use/configure/language-options-deprecated#specifying-parser-options)
   */
  parserOptions?: JavaScriptParserOptionsConfig | undefined;
  /**
   * Which third-party plugins define additional rules, environments, configs, etc. for ESLint to use.
   *
   * @see [Configuring Plugins](https://eslint.org/docs/latest/use/configure/plugins-deprecated#configure-plugins)
   */
  plugins?: string[] | undefined;
  /**
   * Specifying processor.
   *
   * @see [processor](https://eslint.org/docs/latest/use/configure/plugins-deprecated#specify-a-processor)
   */
  processor?: string | undefined;
  /**
   * Report unused eslint-disable comments as warning.
   *
   * @see [Report unused eslint-disable comments](https://eslint.org/docs/latest/use/configure/rules-deprecated#report-unused-eslint-disable-comments)
   */
  reportUnusedDisableDirectives?: boolean | undefined;
  /**
   * Settings.
   *
   * @see [Settings](https://eslint.org/docs/latest/use/configure/configuration-files-deprecated#adding-shared-settings)
   */
  settings?: SettingsConfig | undefined;
}
/**
 * The overwrites that apply more differing configuration to specific files or directories.
 */
export interface ConfigOverride<Rules extends RulesConfig = RulesConfig>
  extends BaseConfig<Rules> {
  /**
   * The glob patterns for excluded files.
   */
  excludedFiles?: string | string[] | undefined;
  /**
   * The glob patterns for target files.
   */
  files: string | string[];
}
/**
 * A configuration object that may have a `rules` block.
 */
export interface HasRules<Rules extends RulesConfig = RulesConfig> {
  rules?: Partial<Rules> | undefined;
}
/**
 * Parser options.
 * @deprecated Only supported in legacy eslintrc config format.
 * @see [Specifying Parser Options](https://eslint.org/docs/latest/use/configure/language-options#specifying-parser-options)
 */
export interface JavaScriptParserOptionsConfig {
  /**
   * Allow the use of reserved words as identifiers (if `ecmaVersion` is 3).
   *
   * @default false
   */
  allowReserved?: boolean | undefined;
  /**
   * Accepts any valid ECMAScript version number or `'latest'`:
   *
   * - A version: es3, es5, es6, es7, es8, es9, es10, es11, es12, es13, es14, ..., or
   * - A year: es2015, es2016, es2017, es2018, es2019, es2020, es2021, es2022, es2023, ..., or
   * - `'latest'`
   *
   * When it's a version or a year, the value must be a number - so do not include the `es` prefix.
   *
   * Specifies the version of ECMAScript syntax you want to use. This is used by the parser to determine how to perform scope analysis, and it affects the default
   *
   * @default 5
   */
  ecmaVersion?: EcmaVersion | undefined;
  /**
   * The type of JavaScript source code. Possible values are "script" for
   * traditional script files, "module" for ECMAScript modules (ESM), and
   * "commonjs" for CommonJS files.
   *
   * @default 'script'
   *
   * @see https://eslint.org/docs/latest/use/configure/language-options-deprecated#specifying-parser-options
   */
  sourceType?: JavaScriptSourceType | undefined;
  /**
   * An object indicating which additional language features you'd like to use.
   *
   * @see https://eslint.org/docs/latest/use/configure/language-options-deprecated#specifying-parser-options
   */
  ecmaFeatures?:
    | {
        globalReturn?: boolean | undefined;
        impliedStrict?: boolean | undefined;
        jsx?: boolean | undefined;
        experimentalObjectRestSpread?: boolean | undefined;
        [key: string]: any;
      }
    | undefined;
  [key: string]: any;
}
/**
 * The type of JavaScript source code.
 * @deprecated Only supported in legacy eslintrc config format.
 */
type JavaScriptSourceType = 'script' | 'module' | 'commonjs';
export type ConfigItemBuildResult<
  Name extends readonly string[],
  HasName extends boolean,
  BasePath extends readonly string[],
  HasBasePath extends boolean,
  Files extends readonly string[],
  HasFiles extends boolean,
  Ignores extends readonly string[],
  HasIgnores extends boolean,
  Language extends string,
  HasLanguage extends boolean,
  LanguageOpts extends LanguageOptions,
  HasLanguageOpts extends boolean,
  LinterOpts extends LinterOptions,
  HasLinterOpts extends boolean,
  ProcessorOpts extends Processor,
  HasProcessorOpts extends boolean,
  PluginsOpts extends Record<string, Plugin>,
  HasPluginsOpts extends boolean,
  RulesOpts extends Partial<RulesConfig>,
  HasRulesOpts extends boolean,
  SettingsOpts extends Record<string, unknown>,
  HasSettingsOpts
> = (HasName extends true ? { name: Join<Name, '/'> } : {}) &
  (HasBasePath extends true ? { basePath: Join<BasePath, '/'> } : {}) &
  (HasFiles extends true ? { files: Files } : {}) &
  (HasIgnores extends true ? { ignores: Ignores } : {}) &
  (HasLanguage extends true ? { language: Language } : {}) &
  (HasLanguageOpts extends true ? { languageOptions: LanguageOpts } : {}) &
  (HasLinterOpts extends true ? { linterOptions: LinterOpts } : {}) &
  (HasProcessorOpts extends true ? { processor: ProcessorOpts } : {}) &
  (HasPluginsOpts extends true ? { plugins: PluginsOpts } : {}) &
  (HasRulesOpts extends true ? { rules: RulesOpts } : {}) &
  (HasSettingsOpts extends true ? { settings: SettingsOpts } : {});

export type Join<T extends readonly string[], Sep extends string> = T extends []
  ? ''
  : T extends [infer F extends string, ...infer R extends readonly string[]]
  ? R['length'] extends 0
    ? F
    : `${F}${Sep}${Join<R, Sep>}`
  : string;
