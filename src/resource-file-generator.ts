import {readConfig} from "./configuration-loader";
import * as fs from "fs";
import {generateImportStatement, generateNewResourceObject} from "./import-generator";
import {formatTypescriptFile} from "./formatter";


const config = readConfig()
const defaultResourceFileContent = `export const resources = {} as const`


/**
 * Writes the resource file that exports available translation files or updates it if it already exists
 */
export async function writeOrUpdateResourceFile(){
    const resourceFilePath = config.outputFile
    const resourceFileExists = fs.existsSync(resourceFilePath)
    let lines: string[] = []
    if (resourceFileExists) {
        lines = removeOldImports(fs.readFileSync(resourceFilePath, 'utf8'))
    } else {
        lines = [defaultResourceFileContent]
    }
    //Generate the new import statement
    const importStatement = generateImportStatement()
    //Add the new import statement to the top of the file
    lines.unshift(importStatement)
    let contentToWrite = replaceResourceExport(lines.join('\n'))
    if(config.runFormat){
        contentToWrite = await formatTypescriptFile(contentToWrite)
    }
    //Write the updated file
    fs.writeFileSync(resourceFilePath, contentToWrite)
}

/**
 * Removes old imports from the resource file
 */
function removeOldImports(fileContent: string){
    const regexPattern = /import .+ from ['"].+\.json['"]/;
    const lines = fileContent.split('\n');
    return lines.filter((line) => !regexPattern.test(line))
}

/**
 * Replaces the old resources export with the new one
 */
function replaceResourceExport(fileContent: string){
    const regexPattern = /export const resources = \{[^}]*} as const/;
    const newContent = generateNewResourceObject()
    return fileContent.replace(regexPattern, newContent);
}