import {
    getAvailableLocales,
    getAvailableNamespacesForLocale,
    getReferenceLocaleNamespaces,
    getTranslationFileContent
} from "./translation-file-loader";
import * as path from "node:path";
import * as fs from "fs";
import {config} from "../index";

export type MissingNamespace = {
    locale: string;
    namespace: string;
    filePath: string;
}

/**
 * Validates the presence of all translation files in all locales
 */
export function validateNamespaces() {
    const mode = config.mode
    const missingNamespaces = getMissingNamespaces()
    if (missingNamespaces.length === 0) {
        return {missingNamespaces}
    }
    //Depending on the mode, we want to create the missing namespaces or just return a report
    switch (mode) {
        case "write": {
            //Generate the file for each missing namespace
            missingNamespaces.forEach(missingNamespace => {
                const filePath = path.join(config.localeRoot, missingNamespace.locale, `${missingNamespace.namespace}.json`)
                //Write the file
                fs.writeFileSync(filePath, JSON.stringify({}))
            })
            return {missingNamespaces}
        }
        case "print": {
            //Print the missing namespaces
            console.log("Missing namespaces:")
            missingNamespaces.forEach(missingNamespace => {
                console.log(`  - ${missingNamespace.namespace} in ${missingNamespace.locale}`)
            })
            return {missingNamespaces}
        }
        default: {
            return {missingNamespaces}
        }
    }
}


type MissingKeys = {
    files: {
        path: string;
        locale: string;
        missingKeys: string[];
    }[];
}

/**
 * Validates the presence of all keys in all namespaces of all locales
 */
export function validateKeys() {
    //Get all namespaces of the reference locale
    const referenceLocaleNamespaces = getReferenceLocaleNamespaces();
    //Loop through each namespace and find the missing keys for each locale
    const locales = getAvailableLocales();
    const result = locales.map(locale => {
        const fileReports = referenceLocaleNamespaces.map(referenceNamespace => {
            const referenceNamespaceContent = JSON.parse(getTranslationFileContent({
                namespace: referenceNamespace,
                locale: config.referenceLocale
            }))
            const localeNamespacePath = path.join(config.localeRoot, locale, `${referenceNamespace}.json`)
            let localeNamespace = {}
            try {
                localeNamespace = JSON.parse(getTranslationFileContent({namespace: referenceNamespace, locale}))
            } catch (e){
                //Ignore error
            }
            //Compare the reference locale with the current locale
            const missingKeys = getMissingKeys(localeNamespace, referenceNamespaceContent)
            return {
                namespace: referenceNamespace,
                filePath: localeNamespacePath,
                locale,
                missingKeys
            }
        })
        return {locale, files: fileReports}
    })
    switch (config.mode) {
        //If we are in write mode, we want to write the missing keys to the respective files
        case "write": {
            result.forEach(localeResult => {
                //We only want to write the files that have missing keys
                const files = localeResult.files.filter(file => file.missingKeys.length > 0)
                files.forEach(file => {
                    const filePath = file.filePath
                    let fileContent = {}
                    try {
                        fileContent = JSON.parse(getTranslationFileContent({namespace: file.namespace, locale: file.locale}))
                    } catch (e){
                        //Ignore error
                    }
                    //For each missing key, we want to add it to the file
                    const sorted = sortDotNotatedKeys(file.missingKeys)
                    sorted.forEach(missingKey => {
                      setDeep(fileContent, missingKey, config.replaceMissingWithValue)
                    })
                    //Write the file
                    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2))
                })
            })
            return result
        }
        default: {
            return result
        }
    }
}

/**
 * Validates the presence of all namespaces in all locales
 */
export function getMissingNamespaces() {
    const missingNamespaces: MissingNamespace[] = []
    //Get all namespaces of the reference locale
    const referenceLocaleNamespaces = getReferenceLocaleNamespaces();
    //Validate that the namespaces is present in all locales
    const locales = getAvailableLocales();
    locales.forEach(locale => {
        const namespaces = getAvailableNamespacesForLocale(locale)
        referenceLocaleNamespaces.forEach(namespace => {
            if (!namespaces.includes(namespace) && !config.excludeNamespaces.includes(namespace)) {
                missingNamespaces.push({
                    locale,
                    namespace,
                    filePath: path.join(config.localeRoot, locale, `${namespace}.json`)
                })
            }
        })
    })
    return missingNamespaces
}


type JSONObject = { [key: string]: JSONObject }

/**
 * Deeply compare two JSON objects and return an array of missing keys
 */

//TODO: Fix not accepting : in keys
function getMissingKeys(target: JSONObject, reference: JSONObject, path = "") {
    const missingKeys: string[] = [];
    for (const key in reference) {
        const callback = () => getMissingKeys(target?.[key],reference[key], `${path}${key}.`).map(value => value.replace(":.", "."))
        if (target?.[key] === undefined) {
            missingKeys.push(`${path}${key}`.replace(":.", ".").replace(":", ""));
            if (typeof reference[key] === 'object') {
                missingKeys.push(...callback());
            }
        } else if (typeof target[key] === 'object') {
            missingKeys.push(...callback());
        }
    }
    return missingKeys;
}



function getDeep(key: string){
    const parts = key.split(".")
    return parts.reduce((acc, part) => {
        return {[part]: acc}
    }, {})
}

function setDeep(obj: JSONObject, key: string, value: any) {
    const parts = key.split(".");
    let currentPart = obj;

    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];

        // If the part doesn't exist, or it's not an object, create/initiate it
        if (!currentPart[part] || typeof currentPart[part] !== 'object') {
            currentPart[part] = {};
        }
        // Move our reference down the object hierarchy
        currentPart = currentPart[part];
    }

    // Set the value at the final part
    currentPart[parts[parts.length - 1]] = value;
}


/**
 * Sorts dot notated keys hierarchically
 */
function sortDotNotatedKeys(keys: string[]) {
    return keys.sort((a, b) => {
        const aParts = a.split('.');
        const bParts = b.split('.');

        for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
            if (aParts[i] !== bParts[i]) {
                return aParts[i].localeCompare(bParts[i]);
            }
        }

        return aParts.length - bParts.length;
    });
}