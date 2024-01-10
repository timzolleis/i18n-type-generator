import {readConfig} from "./configuration-loader";
import {getAvailableNamespaces, getReferenceLocaleNamespaces} from "./translation-file-loader";
import * as path from "node:path";
import {config} from "../index";


/**
 * Generates the import statement for resources file
 */
export function generateImportStatement() {
    //First, load all available namespaces for the reference locale
    const namespaces = getReferenceLocaleNamespaces()
    //Generate the import statement for the reference locale
    return namespaces.map(namespace => {
        const importPath = path.join(config.importAlias, config.referenceLocale, `${namespace}.json`)
        return `import ${namespace} from '${importPath}'`
    }).join("\n")
}

/**
 * Generates the new export statement for the resources file
 */
export function generateNewResourceObject(){
    //Get the filenames for the referenceLocale
    const namespaces = getReferenceLocaleNamespaces()
    return `export const resources = { ${namespaces.join(",\n")} } as const;`
}