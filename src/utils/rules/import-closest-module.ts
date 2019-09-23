import { Tree, Rule } from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";
import {
  findModule,
  buildRelativePath
} from "@schematics/angular/utility/find-module";

import { addImportToModule } from "../vendor/ast-utils";
import { readIntoSourceFile, updateTree } from "../utils";

export function importClosestModule(_path: string, _name: string): Rule {

  return (_tree: Tree) => {
    const path = `${_path}/${strings.dasherize(_name)}`;
    const closestModulePath = findModule(_tree, path);
    const componentPath = `${path}/${strings.dasherize(_name)}.module`;

    const relativePath = buildRelativePath(closestModulePath, componentPath);
    const classifiedName = strings.classify(`${_name}Module`);

    // Reading the module file
    const source = readIntoSourceFile(_tree, closestModulePath);
    const declarationChanges = addImportToModule(
      source,
      closestModulePath,
      classifiedName,
      relativePath
    );

    return updateTree(_tree, closestModulePath, declarationChanges);
  };

}
