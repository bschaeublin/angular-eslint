import type { JsonObject } from '@angular-devkit/core';

export interface Schema extends JsonObject {
  format: Formatter;
  lintFilePatterns: string[];
  force: boolean;
  quiet: boolean;
  maxWarnings: number;
  silent: boolean;
  fix: boolean;
  cache: boolean;
  cacheLocation: string | null;
  cacheStrategy: 'content' | 'metadata' | null;
  eslintConfig: string | null;
  ignorePath: string | null;
  outputFile: string | null;
  stats: boolean;
  noEslintrc: boolean;
  rulesdir: string[];
  resolvePluginsRelativeTo: string | null;
  reportUnusedDisableDirectives: Linter.RuleLevel | null;
  useEslintrc: boolean | null;
  noConfigLookup: boolean | null;
}

type Formatter =
  | 'stylish'
  | 'compact'
  | 'codeframe'
  | 'unix'
  | 'visualstudio'
  | 'table'
  | 'checkstyle'
  | 'html'
  | 'jslint-xml'
  | 'json'
  | 'json-with-metadata'
  | 'junit'
  | 'tap';
