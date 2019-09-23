import * as ts from "typescript";
import { join } from 'path';
import { readdirSync, lstatSync } from 'fs';

import { Tree, SchematicsException, Rule } from "@angular-devkit/schematics";
import { findModule, buildRelativePath, findModuleFromOptions } from "@schematics/angular/utility/find-module";
import { strings } from "@angular-devkit/core";

import { addImportToModule } from "./ast-utils";

class File {
  classified: string;
  file: string;
  dirPath: string;

  // TODO: Buscar o caminho root do projeto 
  constructor(classified: string, file: string, root: string = 'src') {
    this.classified = classified;
    this.file = file;

    if (root) {
      this.dir = getDir(`${file}.ts`, root);
    }
  }

  set dir(value: string) {
    this.dirPath = value;
  }

  get dir() {
    return this.dirPath;
  }

  get path() {
    return `/${this.dirPath}/${this.file}`;
  }

  get pathWithoutExtension() {
    return `/${this.dirPath}/${this.file}`;
  }
}

export function importClosestModule(_tree: Tree, _path: string, _name: string) {
  const path = `${_path}/${strings.dasherize(_name)}`;
  const closestModulePath = findModule(_tree, path);
  const componentPath = `${path}/${strings.dasherize(_name)}.module`;
  
  const relativePath = buildRelativePath(closestModulePath, componentPath);
  const classifiedName = strings.classify(`${_name}Module`);

  // Reading the module file
  const source: any = readIntoSourceFile(_tree, closestModulePath);
  const declarationChanges = addImportToModule(
    source,
    closestModulePath,
    classifiedName,
    relativePath
  );

  const declarationRecorder = _tree.beginUpdate(closestModulePath);
  declarationChanges.forEach((change: any) => {
    declarationRecorder.insertLeft(change.pos, change.toAdd);
  });

  _tree.commitUpdate(declarationRecorder);
}

export function importSharedModule(_path: string, _name: string): Rule {
  return (_tree: Tree) => {
    const shared: File = new File('SharedModule', 'shared.module');

    // Variaveis do caminho que está sendo executado o comando
    const dasherizedName = strings.dasherize(_name);
    const dir = `${_path}/${dasherizedName}`;
    const path = `${dir}/${dasherizedName}.module`;
    const fullPath = `${path}.ts`;
    
    const relativePath = buildRelativePath(path, `/${shared.dirPath}/shared.module`);
    const source = readIntoSourceFile(_tree, fullPath);

    const declarationChanges = addImportToModule(
      source,
      path,
      shared.classified,
      relativePath
    );
  
    const declarationRecorder = _tree.beginUpdate(fullPath);
    declarationChanges.forEach((change: any) => {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
    });
  
    _tree.commitUpdate(declarationRecorder);

    return _tree;
  }
}

function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
  const text = host.read(modulePath);

  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }

  return ts.createSourceFile(
    modulePath,
    text.toString("utf-8"),
    ts.ScriptTarget.Latest,
    true
  );
}

function getDir(fileName: string, path = '/'): string {
  const files = readdirSync(path);

  if (files.includes(fileName)) {
    return path;
  }

  for (let file of files) {
    const filePath = join(path, file);
    const stat = lstatSync(filePath);

    if (stat.isDirectory()) {
      const fileFound = getDir(fileName, filePath);

      if (fileFound) {
        return fileFound;
      }
    }
  }

  return '';
}
