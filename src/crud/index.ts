import { Rule, SchematicContext, Tree, url, apply, template, mergeWith } from '@angular-devkit/schematics';

import * as path from 'path';
import * as fs from 'fs';

import { Schema } from './schema';
import { strings } from '@angular-devkit/core';

export function crud(_options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {

    // const config = readConfig(_tree);
    const config = { projectConfig: getProjectConfig() };

    console.log(config);
    const sourceParametrizedTemplates = renderTemplate(_options, config);

    return mergeWith(sourceParametrizedTemplates);
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

function getProjectConfig(currentPath = __dirname): any {
  try {
    const angularJson = fs.existsSync(`${currentPath}/angular.json`);

    if (angularJson) {
      // TODO: Read and return a json
      return angularJson;
    }

    const newPath = path.resolve(currentPath, '..');

    if (process.cwd() === newPath) {
      throw 'angular.json not found, is it an angular project?';
    }
    
    return getProjectConfig(newPath);

  } catch(error) {
    console.error(error);
    return false;
  }
}

function renderTemplate(_options: Schema, _config: any) {
  const sourceTemplates = url('./templates');

  const sourceParametrizedTemplates = apply(sourceTemplates, [
    template({
      rootDir: 'src',
      size: 600,
      _config,
      ..._options,
      ...strings,
      upperWithUderscore,
      findSharedModule,
      getPathRootDir
    })
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