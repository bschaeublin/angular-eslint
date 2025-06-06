import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { chain, schematic } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import type { Schema } from './schema';
import {
  createRootESLintConfig,
  createStringifiedRootESLintConfig,
  getTargetsConfigFromProject,
  readJsonInTree,
  shouldUseFlatConfig,
  sortObjectByKeys,
  updateJsonInTree,
  updateSchematicCollections,
} from '../utils';

export const FIXED_ESLINT_V8_VERSION = '8.57.0';
export const FIXED_TYPESCRIPT_ESLINT_V7_VERSION = '7.11.0';

const packageJSON = require('../../package.json');

function addAngularESLintPackages(
  json: Record<string, any>,
  useFlatConfig: boolean,
  options: Schema,
) {
  return (host: Tree, context: SchematicContext) => {
    if (!host.exists('package.json')) {
      throw new Error(
        'Could not find a `package.json` file at the root of your workspace',
      );
    }

    if (host.exists('tsconfig.base.json')) {
      throw new Error(
        '\nError: Angular CLI v10.1.0 and later (and no `tsconfig.base.json`) is required in order to run this schematic. Please update your workspace and try again.\n',
      );
    }

    json.scripts = json.scripts || {};
    json.scripts['lint'] = json.scripts['lint'] || 'ng lint';

    if (useFlatConfig) {
      applyDevDependenciesForFlatConfig(json);

      // Check if yarn PnP is used https://yarnpkg.com/advanced/pnpapi#processversionspnp and install extra explicit packages to make it happy
      if (process.versions.pnp) {
        // An explicit reference to the builder is needed for running `ng lint` in PnP
        json.devDependencies['@angular-eslint/builder'] = packageJSON.version;
        // The linting cannot complete without these explicitly in the root package.json in PnP
        json.devDependencies['@eslint/js'] =
          `^${packageJSON.devDependencies['eslint']}`;
        const typescriptESLintVersion =
          packageJSON.devDependencies['@typescript-eslint/utils'];
        json.devDependencies['@typescript-eslint/types'] =
          typescriptESLintVersion;
        json.devDependencies['@typescript-eslint/utils'] =
          typescriptESLintVersion;
      }
    } else {
      applyDevDependenciesForESLintRC(json);
    }

    json.devDependencies = sortObjectByKeys(json.devDependencies);
    host.overwrite('package.json', JSON.stringify(json, null, 2));

    if (!options.skipInstall) {
      context.addTask(new NodePackageInstallTask({ allowScripts: false }));

      context.logger.info(`
All angular-eslint dependencies have been successfully installed 🎉

Please see https://github.com/angular-eslint/angular-eslint for how to add ESLint configuration to your project.
`);
    } else {
      context.logger.info(`
All angular-eslint dependencies have been successfully added. Run your package manager install command to complete setup.

Please see https://github.com/angular-eslint/angular-eslint for how to add ESLint configuration to your project.
`);
    }

    return host;
  };
}

function applyDevDependenciesForESLintRC(
  json: Record<'devDependencies', Record<string, string>>,
) {
  json.devDependencies['eslint'] = FIXED_ESLINT_V8_VERSION;

  /**
   * @angular-eslint packages
   */
  json.devDependencies['@angular-eslint/builder'] = packageJSON.version;
  json.devDependencies['@angular-eslint/eslint-plugin'] = packageJSON.version;
  json.devDependencies['@angular-eslint/eslint-plugin-template'] =
    packageJSON.version;
  json.devDependencies['@angular-eslint/schematics'] = packageJSON.version;
  json.devDependencies['@angular-eslint/template-parser'] = packageJSON.version;

  /**
   * @typescript-eslint packages
   */
  json.devDependencies['@typescript-eslint/eslint-plugin'] =
    FIXED_TYPESCRIPT_ESLINT_V7_VERSION;
  json.devDependencies['@typescript-eslint/parser'] =
    FIXED_TYPESCRIPT_ESLINT_V7_VERSION;
}

function applyDevDependenciesForFlatConfig(
  json: Record<'devDependencies', Record<string, string>>,
) {
  json.devDependencies['eslint'] = `^${packageJSON.devDependencies['eslint']}`;

  /**
   * angular-eslint packages
   */
  json.devDependencies['angular-eslint'] = packageJSON.version;

  // Clean up individual packages from devDependencies
  delete json.devDependencies['@angular-eslint/builder'];
  delete json.devDependencies['@angular-eslint/eslint-plugin'];
  delete json.devDependencies['@angular-eslint/eslint-plugin-template'];
  delete json.devDependencies['@angular-eslint/schematics'];
  delete json.devDependencies['@angular-eslint/template-parser'];

  /**
   * typescript-eslint
   */
  const typescriptESLintVersion =
    packageJSON.devDependencies['@typescript-eslint/utils'];
  json.devDependencies['typescript-eslint'] = typescriptESLintVersion;

  // Clean up individual packages from devDependencies
  delete json.devDependencies['@typescript-eslint/parser'];
  delete json.devDependencies['@typescript-eslint/eslint-plugin'];
  delete json.devDependencies['@typescript-eslint/utils'];
}

function applyESLintConfigIfSingleProjectWithNoExistingTSLint(
  useFlatConfig: boolean,
) {
  return (host: Tree, context: SchematicContext) => {
    const angularJson = readJsonInTree(host, 'angular.json');
    if (!angularJson || !angularJson.projects) {
      return;
    }

    /**
     * If the workspace was created by passing `--create-application=false` to `ng new`
     * then there will be an angular.json file with a projects object, but no projects
     * within it.
     *
     * In this case we should still configure the root eslint config and set the
     * schematicCollections to use in angular.json.
     */
    const projectNames = Object.keys(angularJson.projects);
    if (projectNames.length === 0) {
      return chain([
        useFlatConfig
          ? (host) => {
              // If the root package.json uses type: module, generate ESM content
              const packageJson = readJsonInTree(host, 'package.json');
              const isESM = packageJson.type === 'module';
              host.create(
                'eslint.config.js',
                createStringifiedRootESLintConfig(null, isESM),
              );
              return host;
            }
          : updateJsonInTree('.eslintrc.json', () =>
              createRootESLintConfig(null),
            ),
        updateJsonInTree('angular.json', (json) =>
          updateSchematicCollections(
            json,
            useFlatConfig ? 'angular-eslint' : '@angular-eslint/schematics',
          ),
        ),
      ]);
    }

    /**
     * The only other use-case we can reliably support for automatic configuration
     * is the default case of having a single project in the workspace, so for anything
     * else we bail at this point.
     */
    if (projectNames.length !== 1) {
      return;
    }

    const singleProject = angularJson.projects[projectNames[0]];
    const targetsConfig = getTargetsConfigFromProject(singleProject);
    // Only possible if malformed, safer to finish here
    if (!targetsConfig) {
      return;
    }

    // The project already has a lint builder setup, finish here as there is nothing more we can do automatically
    if (targetsConfig.lint) {
      return;
    }

    context.logger.info(
      `
We detected that you have a single project in your workspace and no existing linter wired up, so we are configuring ESLint for you automatically.

Please see https://github.com/angular-eslint/angular-eslint for more information.
`.trimStart(),
    );

    return chain([
      schematic('add-eslint-to-project', {}),
      updateJsonInTree('angular.json', (json) =>
        updateSchematicCollections(
          json,
          useFlatConfig ? 'angular-eslint' : '@angular-eslint/schematics',
        ),
      ),
    ]);
  };
}

/**
 * Entry point for the ng-add schematic.
 *
 * @param options Configuration options passed to the schematic.
 */
export default function (options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspacePackageJSON = (host.read('package.json') as Buffer).toString(
      'utf-8',
    );
    const json = JSON.parse(workspacePackageJSON);
    const useFlatConfig = shouldUseFlatConfig(host, json);

    return chain([
      addAngularESLintPackages(json, useFlatConfig, options),
      applyESLintConfigIfSingleProjectWithNoExistingTSLint(useFlatConfig),
    ])(host, context);
  };
}
