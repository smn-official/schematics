import * as ts from "typescript";

import { Tree, SchematicsException } from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";

import { Change, InsertChange } from "./vendor/change";

export function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
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

export function updateTree(_tree: Tree, path: string, declarationChanges: Change[]) {
  const declarationRecorder = _tree.beginUpdate(path);

  declarationChanges.forEach((change: any) => {
    if (change instanceof InsertChange) {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
    }
  });

  _tree.commitUpdate(declarationRecorder);

  return _tree;
}

export function upperWithUderscore(value: string): string {
  if (!value) {
    return '';
  }

  return strings.underscore(value).toUpperCase();
}
