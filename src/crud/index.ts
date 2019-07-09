import { Rule, SchematicContext, Tree, url, apply, template, mergeWith, SchematicsException, move } from '@angular-devkit/schematics';
import { buildDefaultPath } from "@schematics/angular/utility/project";
import { parseName } from "@schematics/angular/utility/parse-name";

import * as path from 'path';
// import * as fs from 'fs';

import { Schema } from './schema';
import { strings } from '@angular-devkit/core';

export function crud(_options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {

    // const config = readConfig(_tree);
    // const config = { projectConfig: getProjectConfig() };

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

    return mergeWith(sourceParametrizedTemplates)(_tree, _context);
  };
}

// function readConfig(_tree: Tree) {
//   const buffer = _tree.read('./smn-schematics.json');

//   if (buffer) {
//     // TODO: Validate configs
//     return JSON.parse(buffer.toString('utf8'));
//   } else {
//     throw new SchematicsException('Error to read smn-schematics.json');
//   }
// }

function renderTemplate(_options: Schema, name: any, path: any) {
  const sourceTemplates = url('./templates');

  const sourceParametrizedTemplates = apply(sourceTemplates, [
    template({
      size: 600,
      ..._options,
      ...strings,
      name,
      upperWithUderscore,
      findSharedModule,
      getPathRootDir
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

function getPathRootDir() {
  const relative = path.relative(process.cwd(), __dirname);
  return relative.split(path.sep).join('/');
}
