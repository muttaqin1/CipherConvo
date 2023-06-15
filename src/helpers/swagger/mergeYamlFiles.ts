import path from 'path';
import fs from 'fs';
import yaml from 'yamljs';
import Logger from '@helpers/Logger';

/**
 * This function merges all the YAML files in a directory
 */
export const mergeYamlFiles = (directoryPath: string) => {
  const mergedYamlObject = {};
  const files = fs.readdirSync(directoryPath);
  files.forEach((file: string) => {
    if (path.extname(file) !== '.yaml')
      Logger.error(`File ${file} is not a YAML file`);
    const yamlFilePath = path.join(directoryPath, file);
    const fileContents = fs.readFileSync(yamlFilePath, 'utf8');
    const yamlData = yaml.parse(fileContents);
    Object.assign(mergedYamlObject, yamlData);
  });
  return mergedYamlObject;
};
