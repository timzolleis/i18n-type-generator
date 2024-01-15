import * as fs from "fs";
import {generateImportStatement, generateNewResourceObject,} from "./import-generator";
import {formatTypescriptFile} from "./formatter";
import {config} from "../index";
import * as crypto from "crypto";
import {BinaryToTextEncoding} from "node:crypto";

const defaultResourceFileContent = `export const resources = {} as const`;

/**
 * Writes the resource file that exports available translation files or updates it if it already exists
 */
export async function writeOrUpdateResourceFile() {
  const resourceFilePath = config.outputFile;
  const resourceFileExists = fs.existsSync(resourceFilePath);
  let lines: string[]
  const oldFileContent = fs.readFileSync(resourceFilePath, "utf8");
  if (resourceFileExists) {
    lines = removeOldImports(oldFileContent);
  } else {
    lines = [defaultResourceFileContent];
  }
  //Generate the new import statement
  const importStatement = generateImportStatement();
  //Add the new import statement to the top of the file
  lines.unshift(importStatement);
  let contentToWrite = replaceResourceExport(lines.join("\n"));
  //Format the file if the config says so
  if (config.runFormat) {
    contentToWrite = await formatTypescriptFile(contentToWrite);
  }
  //We do not need to  write the file if the checksums are equal
  const oldChecksum = generateChecksum(oldFileContent);
  const newChecksum = generateChecksum(contentToWrite);
  if (oldChecksum === newChecksum) {
    return;
  }
  fs.writeFileSync(resourceFilePath, contentToWrite);
}

/**
 * Removes old imports from the resource file
 */
function removeOldImports(fileContent: string) {
  const regexPattern = /import .+ from ['"].+\.json['"]/;
  const lines = fileContent.split("\n");
  return lines.filter((line) => !regexPattern.test(line));
}

/**
 * Replaces the old resources export with the new one
 */
function replaceResourceExport(fileContent: string) {
  const regexPattern = /export const resources = \{[^}]*} as const/;
  const newContent = generateNewResourceObject();
  return fileContent.replace(regexPattern, newContent);
}

//Generates a checksum of a file
function generateChecksum(
  data: string,
  algorithm = "md5",
  encoding: BinaryToTextEncoding = "hex",
) {
  return crypto.createHash(algorithm).update(data, "utf8").digest(encoding);
}
