import { Rule, SchematicContext, Tree, url, apply, template, mergeWith, SchematicsException, move } from '@angular-devkit/schematics';
import { buildDefaultPath } from "@schematics/angular/utility/project";
import { parseName } from "@schematics/angular/utility/parse-name";
import { Schema } from './schema';
import { strings } from '@angular-devkit/core';
import { importModule } from '../utils/import-utils';

export function crud(_options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const workspaceConfigBuffer = _tree.read('angular.json');

    if (!workspaceConfigBuffer) {
      throw new SchematicsException('angular.json not found, is it an angular project?');
    }

    const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
    const projectName  = _options.project || workspaceConfig.defaultProject;
    const project = workspaceConfig.projects[projectName];

    const defaultProjectPath = buildDefaultPath(project);

    const parsedPath = parseName(defaultProjectPath, _options.name);
    const { name, path } = parsedPath;

    const sourceParametrizedTemplates = renderTemplate(_options, name, path);

    importModule(_tree, path, name);

    return mergeWith(sourceParametrizedTemplates)(_tree, _context);
  };
}

function renderTemplate(_options: Schema, name: any, path: any) {
  const sourceTemplates = url('./templates');
  
  const sourceParametrizedTemplates = apply(sourceTemplates, [
    template({
      ..._options,
      ...strings,
      size: _options.size || 600,
      name,
      path: getPathRootDir(path),
      upperWithUderscore,
      findSharedModule,
    }),
    move(path)
  ]);

  return sourceParametrizedTemplates;
}

function upperWithUderscore(value: string): string {
  if (!value) {
    return '';
  }

  return strings.underscore(value).toUpperCase();
}

function findSharedModule(): string {
  return '';
}

function getPathRootDir(path: string) {
  return path.replace('/', '');
}
