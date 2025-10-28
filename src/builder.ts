import { ESLintConfigBuilderValidator } from './libs/validation/index.js';
import { ESLintConfigBuilderValidatorError } from './libs/validation/errors.js';

import type {
  LanguageOptions as ILanguageOptions,
  LinterOptions as ILinterOptions,
  Processor as IProcessor,
  Plugin as IPlugin,
  RulesConfig as IRulesConfig,
  ConfigItemBuildResult as IConfigItemBuildResult,
} from './types.js';
import { createLogger } from './libs/logger/index.js';

const log = createLogger('ESLintConfigBuilder');

class Builder<
  Names extends readonly string[] = [],
  HasNames extends boolean = false,
  BasePaths extends readonly string[] = [],
  HasBasePaths extends boolean = false,
  Files extends readonly string[] = [],
  HasFiles extends boolean = false,
  Ignores extends readonly string[] = [],
  HasIgnores extends boolean = false,
  Language extends string | undefined = undefined,
  HasLanguage extends boolean = false,
  LanguageOptions extends ILanguageOptions = {},
  HasLanguageOptions extends boolean = false,
  LinterOptions extends ILinterOptions = {},
  HasLinterOptions extends boolean = false,
  Processor extends IProcessor | undefined = undefined,
  HasProcessor extends boolean = false,
  Plugins extends Record<string, IPlugin> = undefined,
  HasPlugins extends boolean = false,
  Rules extends Partial<IRulesConfig> = undefined,
  HasRules extends boolean = false,
  Settings extends Record<string, unknown> = undefined,
  HasSettings extends boolean = false
> {
  constructor(
    private readonly names: Readonly<Names>,
    private readonly basePaths: Readonly<BasePaths>,
    private readonly files: Readonly<Files>,
    private readonly ignores: Readonly<Ignores>,
    private readonly language: Readonly<Language>,
    private readonly languageOptions: Readonly<LanguageOptions>,
    private readonly linterOptions: Readonly<LinterOptions>,
    private readonly processor: Readonly<Processor>,
    private readonly plugins: Readonly<Plugins>,
    private readonly rules: Readonly<Rules>,
    private readonly settings: Readonly<Settings>
  ) {}

  setName<const T extends readonly string[]>(...name: T) {
    const names = [...this.names, ...name] as const;
    return new Builder<
      [...Names, ...T],
      true,
      BasePaths,
      HasBasePaths,
      Files,
      HasFiles,
      Ignores,
      HasIgnores,
      Language,
      HasLanguage,
      LanguageOptions,
      HasLanguageOptions,
      LinterOptions,
      HasLinterOptions,
      Processor,
      HasProcessor,
      Plugins,
      HasPlugins,
      Rules,
      HasRules,
      Settings,
      HasSettings
    >(
      names,
      this.basePaths,
      this.files,
      this.ignores,
      this.language,
      this.languageOptions,
      this.linterOptions,
      this.processor,
      this.plugins,
      this.rules,
      this.settings
    );
  }

  setBasePath<const T extends readonly string[]>(...basePath: T) {
    const basePaths = [...this.basePaths, ...basePath] as const;
    return new Builder<
      Names,
      HasNames,
      [...BasePaths, ...T],
      true,
      Files,
      HasFiles,
      Ignores,
      HasIgnores,
      Language,
      HasLanguage,
      LanguageOptions,
      HasLanguageOptions,
      LinterOptions,
      HasLinterOptions,
      Processor,
      HasProcessor,
      Plugins,
      HasPlugins,
      Rules,
      HasRules,
      Settings,
      HasSettings
    >(
      this.names,
      basePaths,
      this.files,
      this.ignores,
      this.language,
      this.languageOptions,
      this.linterOptions,
      this.processor,
      this.plugins,
      this.rules,
      this.settings
    );
  }

  setFiles<const T extends readonly string[]>(...file: T) {
    const files = [...this.files, ...file] as const;
    return new Builder<
      Names,
      HasNames,
      BasePaths,
      HasBasePaths,
      [...Files, ...T],
      true,
      Ignores,
      HasIgnores,
      Language,
      HasLanguage,
      LanguageOptions,
      HasLanguageOptions,
      LinterOptions,
      HasLinterOptions,
      Processor,
      HasProcessor,
      Plugins,
      HasPlugins,
      Rules,
      HasRules,
      Settings,
      HasSettings
    >(
      this.names,
      this.basePaths,
      files,
      this.ignores,
      this.language,
      this.languageOptions,
      this.linterOptions,
      this.processor,
      this.plugins,
      this.rules,
      this.settings
    );
  }

  setIgnores<const T extends readonly string[]>(...ignore: T) {
    const ignores = [...this.ignores, ...ignore] as const;
    return new Builder<
      Names,
      HasNames,
      BasePaths,
      HasBasePaths,
      Files,
      HasFiles,
      [...Ignores, ...T],
      true,
      Language,
      HasLanguage,
      LanguageOptions,
      HasLanguageOptions,
      LinterOptions,
      HasLinterOptions,
      Processor,
      HasProcessor,
      Plugins,
      HasPlugins,
      Rules,
      HasRules,
      Settings,
      HasSettings
    >(
      this.names,
      this.basePaths,
      this.files,
      ignores,
      this.language,
      this.languageOptions,
      this.linterOptions,
      this.processor,
      this.plugins,
      this.rules,
      this.settings
    );
  }

  setLanguage<const T extends string>(language: T) {
    return new Builder<
      Names,
      HasNames,
      BasePaths,
      HasBasePaths,
      Files,
      HasFiles,
      Ignores,
      HasIgnores,
      T,
      true,
      LanguageOptions,
      HasLanguageOptions,
      LinterOptions,
      HasLinterOptions,
      Processor,
      HasProcessor,
      Plugins,
      HasPlugins,
      Rules,
      HasRules,
      Settings,
      HasSettings
    >(
      this.names,
      this.basePaths,
      this.files,
      this.ignores,
      language,
      this.languageOptions,
      this.linterOptions,
      this.processor,
      this.plugins,
      this.rules,
      this.settings
    );
  }

  setLanguageOptions<const T extends ILanguageOptions>(languageOptions: T) {
    return new Builder<
      Names,
      HasNames,
      BasePaths,
      HasBasePaths,
      Files,
      HasFiles,
      Ignores,
      HasIgnores,
      Language,
      HasLanguage,
      T,
      true,
      LinterOptions,
      HasLinterOptions,
      Processor,
      HasProcessor,
      Plugins,
      HasPlugins,
      Rules,
      HasRules,
      Settings,
      HasSettings
    >(
      this.names,
      this.basePaths,
      this.files,
      this.ignores,
      this.language,
      languageOptions,
      this.linterOptions,
      this.processor,
      this.plugins,
      this.rules,
      this.settings
    );
  }

  setLinterOptions<const T extends ILinterOptions>(linterOptions: T) {
    return new Builder<
      Names,
      HasNames,
      BasePaths,
      HasBasePaths,
      Files,
      HasFiles,
      Ignores,
      HasIgnores,
      Language,
      HasLanguage,
      LanguageOptions,
      HasLanguageOptions,
      T,
      true,
      Processor,
      HasProcessor,
      Plugins,
      HasPlugins,
      Rules,
      HasRules,
      Settings,
      HasSettings
    >(
      this.names,
      this.basePaths,
      this.files,
      this.ignores,
      this.language,
      this.languageOptions,
      linterOptions,
      this.processor,
      this.plugins,
      this.rules,
      this.settings
    );
  }

  setProcessor<const T extends IProcessor>(processor: T) {
    return new Builder<
      Names,
      HasNames,
      BasePaths,
      HasBasePaths,
      Files,
      HasFiles,
      Ignores,
      HasIgnores,
      Language,
      HasLanguage,
      LanguageOptions,
      HasLanguageOptions,
      LinterOptions,
      HasLinterOptions,
      T,
      true,
      Plugins,
      HasPlugins,
      Rules,
      HasRules,
      Settings,
      HasSettings
    >(
      this.names,
      this.basePaths,
      this.files,
      this.ignores,
      this.language,
      this.languageOptions,
      this.linterOptions,
      processor,
      this.plugins,
      this.rules,
      this.settings
    );
  }

  setPlugins<const T extends Record<string, IPlugin>>(plugins: T) {
    return new Builder<
      Names,
      HasNames,
      BasePaths,
      HasBasePaths,
      Files,
      HasFiles,
      Ignores,
      HasIgnores,
      Language,
      HasLanguage,
      LanguageOptions,
      HasLanguageOptions,
      LinterOptions,
      HasLinterOptions,
      Processor,
      HasProcessor,
      T,
      true,
      Rules,
      HasRules,
      Settings,
      HasSettings
    >(
      this.names,
      this.basePaths,
      this.files,
      this.ignores,
      this.language,
      this.languageOptions,
      this.linterOptions,
      this.processor,
      plugins,
      this.rules,
      this.settings
    );
  }

  setRules<const T extends Partial<IRulesConfig>>(rules: T) {
    return new Builder<
      Names,
      HasNames,
      BasePaths,
      HasBasePaths,
      Files,
      HasFiles,
      Ignores,
      HasIgnores,
      Language,
      HasLanguage,
      LanguageOptions,
      HasLanguageOptions,
      LinterOptions,
      HasLinterOptions,
      Processor,
      HasProcessor,
      Plugins,
      HasPlugins,
      T,
      true,
      Settings,
      HasSettings
    >(
      this.names,
      this.basePaths,
      this.files,
      this.ignores,
      this.language,
      this.languageOptions,
      this.linterOptions,
      this.processor,
      this.plugins,
      rules,
      this.settings
    );
  }

  setSettings<const T extends Record<string, unknown>>(settings: T) {
    return new Builder<
      Names,
      HasNames,
      BasePaths,
      HasBasePaths,
      Files,
      HasFiles,
      Ignores,
      HasIgnores,
      Language,
      HasLanguage,
      LanguageOptions,
      HasLanguageOptions,
      LinterOptions,
      HasLinterOptions,
      Processor,
      HasProcessor,
      Plugins,
      HasPlugins,
      Rules,
      HasRules,
      T,
      true
    >(
      this.names,
      this.basePaths,
      this.files,
      this.ignores,
      this.language,
      this.languageOptions,
      this.linterOptions,
      this.processor,
      this.plugins,
      this.rules,
      settings
    );
  }

  build(): IConfigItemBuildResult<
    Names,
    HasNames,
    BasePaths,
    HasBasePaths,
    Files,
    HasFiles,
    Ignores,
    HasIgnores,
    Language,
    HasLanguage,
    LanguageOptions,
    HasLanguageOptions,
    LinterOptions,
    HasLinterOptions,
    Processor,
    HasProcessor,
    Plugins,
    HasPlugins,
    Rules,
    HasRules,
    Settings,
    HasSettings
  > {
    const out: any = {};
    this.validateName(out);
    this.validateBasePaths(out);
    this.validateFiles(out);
    this.validateLanguage(out);
    this.validateLanguageOptions(out);
    this.validateLinterOptions(out);
    this.validateProcessor(out);
    this.validatePlugins(out);
    this.validateRules(out);
    this.validateSettings(out);
    return out;
  }

  private validateName(out: any) {
    const arr = ESLintConfigBuilderValidator.validateArray(this.names, {
      allowEmpty: false,
      allowSparse: false,
      minLength: 2,
      maxLength: 3,
      elementGuard: (val): val is string =>
        ESLintConfigBuilderValidator.validateString(val, {
          allowEmpty: false,
          allowWhitespaceOnly: false,
          trim: true,
        }).ok,
    });

    if (ESLintConfigBuilderValidator.isError(arr))
      return new ESLintConfigBuilderValidatorError(arr);

    const name: string = this.names.join('/').toLowerCase();
    const pattern =
      /^@?[a-z0-9]+(?:[-_][a-z0-9]+)*(?:\/[a-z0-9]+(?:[-_][a-z0-9]+)*){1,2}$/;
    const str = ESLintConfigBuilderValidator.validateString(name, { pattern });
    if (ESLintConfigBuilderValidator.isError(str))
      return new ESLintConfigBuilderValidatorError(str);

    log.info(`${name} was validated succefully.`);

    out.name = name;
  }

  private validateBasePaths(out: any) {
    out.basePath = this.basePaths.join('/');
  }

  private validateFiles(out: any) {
    out.files = this.files;
  }

  private validateLanguage(out: any) {
    out.language = this.language;
  }

  private validateLanguageOptions(out: any) {
    out.languageOptions = this.languageOptions;
  }

  private validateLinterOptions(out: any) {
    out.linterOptions = this.linterOptions;
  }

  private validateProcessor(out: any) {
    out.processor = this.processor;
  }

  private validatePlugins(out: any) {
    out.plugins = this.plugins;
  }

  private validateRules(out: any) {
    out.rules = this.rules;
  }

  private validateSettings(out: any) {
    out.settings = this.settings;
  }
}

export const ESLintConfigBuilder = {
  create: () =>
    new Builder(
      [] as const,
      [] as const,
      [] as const,
      [] as const,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ),
};

export default ESLintConfigBuilder;
