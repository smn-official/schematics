import { Rule, Tree } from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";

import { buildRelativePath } from "@schematics/angular/utility/find-module";

import { addImportToModule } from "../vendor/ast-utils";
import { readIntoSourceFile, updateTree } from "../utils";
import { FileUtil } from "../file-utils";

export function importSharedModule(_path: string, _name: string): Rule {

  return (_tree: Tree) => {
    const shared: FileUtil = new FileUtil("SharedModule", "shared.module");

    // Variaveis do caminho que está sendo executado o comando
    const dasherizedName = strings.dasherize(_name);
    const dir = `${_path}/${dasherizedName}`;
    const path = `${dir}/${dasherizedName}.module`;
    const fullPath = `${path}.ts`;

    const relativePath = buildRelativePath(
      path,
      `/${shared.dirPath}/shared.module`
    );
    const source = readIntoSourceFile(_tree, fullPath);

    const declarationChanges = addImportToModule(
      source,
      path,
      shared.classified,
      relativePath
    );

    return updateTree(_tree, fullPath, declarationChanges);
  };
  
}
