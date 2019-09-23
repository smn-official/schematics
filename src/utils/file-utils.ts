import { join } from 'path';
import { readdirSync, lstatSync } from 'fs';

export class FileUtil {
  classified: string;
  file: string;
  dirPath: string;

  // TODO: Buscar o caminho root do projeto
  constructor(classified: string, file: string, root: string = "src") {
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
}

export function getDir(fileName: string, path = "/"): string {
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

  return "";
}
