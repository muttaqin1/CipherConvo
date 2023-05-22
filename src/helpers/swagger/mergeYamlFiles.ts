import path from 'path';
import fs from 'fs';
import yaml from 'yamljs';
import Logger from '@helpers/Logger';

/**
 * This function merges all the YAML files in a directory
 */
export const mergeYamlFiles = (directoryPath: string) => {
  const mergedYamlObject = {};
  // I have to extract all the files from the directory
  const files = fs.readdirSync(directoryPath);
  // Loop through each of the files
  files.forEach((file: string) => {
    // Check if the file is a YAML file
    if (path.extname(file) !== '.yaml')
      Logger.error(`File ${file} is not a YAML file`);
    // Construct the path to the file
    const yamlFilePath = path.join(directoryPath, file);
    // Read the file contents
    const fileContents = fs.readFileSync(yamlFilePath, 'utf8');
    // Parse the YAML content and merge it into the main object
    const yamlData = yaml.parse(fileContents);
    // Merge the data into the main object
    Object.assign(mergedYamlObject, yamlData);
  });
  return mergedYamlObject;
};
