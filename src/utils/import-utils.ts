import * as ts from "typescript";

import { Tree, SchematicsException } from "@angular-devkit/schematics";
import { findModule, buildRelativePath } from "@schematics/angular/utility/find-module";
import { strings } from "@angular-devkit/core";

import { addImportToModule } from "./ast-utils";

export function importModule(_tree: Tree, _path: string, _name: string) {
  const path = `${_path}/${strings.dasherize(_name)}`;
  const closestModulePath = findModule(_tree, path);
  const componentPath = `${path}/${strings.dasherize(_name)}.module`;

  const relativePath = buildRelativePath(closestModulePath, componentPath);
  const classifiedName = strings.classify(`${_name}Module`);

  // Reading the module file
  const source: any = readIntoSourceFile(_tree, `${closestModulePath}`);
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
