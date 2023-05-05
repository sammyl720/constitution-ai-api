import fs from 'fs';
import path from 'path';

export function findRootDirectory(currentDir: string): string {
  const packageJsonPath = path.join(currentDir, 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    // package.json found, currentDir is the root directory
    return currentDir;
  }

  const parentDir = path.dirname(currentDir);

  // Reached the filesystem root without finding package.json
  if (currentDir === parentDir) {
    throw new Error('Unable to find root directory');
  }

  // Continue searching in the parent directory
  return findRootDirectory(parentDir);
}

export function getAssetsDirectory(currentDirectory: string) {
  return path.resolve(findRootDirectory(currentDirectory), 'assets');
}

export function writeToTextFile(fileName: string, textContent: string) {
  fileName = fileName.replace(/\..*$/, '') + '.txt';
  const filePath = path.resolve(getAssetsDirectory(__dirname), fileName)
  fs.writeFile(filePath, textContent, (err) => {
    if (err) {
      console.error('Error creating file', err);
      return;
    }

    console.log('file created');
  })
}

export function writeToJsonFile(fileName: string, textContent: string) {
  fileName = fileName.replace(/\..*$/, '') + '.json';
  const filePath = path.resolve(getAssetsDirectory(__dirname), fileName)
  fs.writeFile(filePath, textContent, (err) => {
    if (err) {
      console.error('Error creating file', err);
      return;
    }

    console.log('file created');
  })
}

export function getTextFileContent(fileName: string) {
  fileName = fileName.replace(/\..*$/, '') + '.txt';
  const filePath = path.resolve(getAssetsDirectory(__dirname), fileName)
  const dataBuffer = fs.readFileSync(filePath);
  return dataBuffer.toString();
}

export function getJsonFileContent<T>(fileName: string) {
  fileName = fileName.replace(/\..*$/, '') + '.json';
  const filePath = path.resolve(getAssetsDirectory(__dirname), fileName)
  const dataBuffer = fs.readFileSync(filePath);

  return JSON.parse(dataBuffer.toString()) as T;
}


export function rollingWindow(lines: string[], windowHeight: number, cb: (window: string[], startingLine: number, endingLine: number) => void, skip = 0) {
  let currentIndex = 0;
  while ((currentIndex + windowHeight) < lines.length) {
    const endingIndex = currentIndex + windowHeight;
    const windowLines = lines.slice(currentIndex, endingIndex);
    const startingLine = currentIndex + 1;
    const endingLine = currentIndex + windowLines.length;
    cb(windowLines, startingLine, endingLine);
    currentIndex += 1 + skip;
  }
}
export function cosineSimilarity(vector1: number[], vector2: number[]) {
  const dotProduct = vector1.reduce((acc, val, i) => acc + val * vector2[i], 0);
  const magnitude1 = Math.sqrt(vector1.reduce((acc, val) => acc + val ** 2, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((acc, val) => acc + val ** 2, 0));
  return dotProduct / (magnitude1 * magnitude2);
}