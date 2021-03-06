import {
  Rule,
  SchematicContext,
  Tree,
  url,
  apply,
  template,
  mergeWith,
  SchematicsException,
  move,
  chain,
  branchAndMerge
} from "@angular-devkit/schematics";
import { buildDefaultPath } from "@schematics/angular/utility/project";
import { parseName } from "@schematics/angular/utility/parse-name";
import { Schema } from "./schema";
import { strings } from "@angular-devkit/core";

import { importClosestModule, importSharedModule } from "../utils/rules";
import { upperWithUderscore, namedCapitalize } from "../utils/utils";

export function crud(_options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const workspaceConfigBuffer = _tree.read("angular.json");

    if (!workspaceConfigBuffer) {
      throw new SchematicsException(
        "angular.json not found, is it an angular project?"
      );
    }

    const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
    const projectName = _options.project || workspaceConfig.defaultProject;
    const project = workspaceConfig.projects[projectName];

    const defaultProjectPath = buildDefaultPath(project);

    const parsedPath = parseName(defaultProjectPath, _options.name);
    const { name, path } = parsedPath;

    const sourceParametrizedTemplates = renderTemplate(_options, name, path, projectName);

    const rule = chain([
      branchAndMerge(
        chain([
          importClosestModule(path, name),
          mergeWith(sourceParametrizedTemplates),
          importSharedModule(path, name)
        ])
      )
    ]);

    return rule(_tree, _context);
  };
}

function renderTemplate(_options: Schema, name: any, path: any, projectName: any) {
  const sourceTemplates = url("./templates");

  const sourceParametrizedTemplates = apply(sourceTemplates, [
    template({
      ..._options,
      ...strings,
      size: _options.size || 600,
      name,
      projectName,
      path: getPathRootDir(path),
      upperWithUderscore,
      namedCapitalize
    }),
    move(path)
  ]);

  return sourceParametrizedTemplates;
}

function getPathRootDir(path: string) {
  return path.replace("/", "");
}
