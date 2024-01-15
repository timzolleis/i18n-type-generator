import {
    getAvailableLocales,
    getAvailableNamespacesForLocale,
    getReferenceLocaleNamespaces, getTranslationFileContent
} from "./translation-file-loader";
import {config} from "../index";
import {JSONObject} from "./file-validator";
import * as path from "node:path";
import * as fs from "fs";


export function removeUnusedKeys() {
    //Here we need to walk each locale and remove the keys that are not used
    const locales = getAvailableLocales()
    for (const locale of locales) {
        const namespaces = getAvailableNamespacesForLocale(locale)
        for (const namespace of namespaces) {
            const filePath = path.join(config.localeRoot, locale, `${namespace}.json`)
            const referencePath = path.join(config.localeRoot, config.referenceLocale, `${namespace}.json`)
            let fileContent = JSON.parse(getTranslationFileContent({namespace, locale}))
            let referenceContent = JSON.parse(getTranslationFileContent({namespace, locale: config.referenceLocale}))
            removeUnusedKeysFromObject(fileContent, referenceContent)
            //Sort both reference and file content
            if(config.sortKeys){
                fileContent = sortObject(fileContent)
                referenceContent = sortObject(referenceContent)
                fs.writeFileSync(referencePath, JSON.stringify(referenceContent, null, 2))
            }
            fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2))
        }
    }
}

export function sortKeys(){
    const locales = getAvailableLocales()
    for (const locale of locales) {
        const namespaces = getAvailableNamespacesForLocale(locale)
        for (const namespace of namespaces) {
            const referencePath = path.join(config.localeRoot, config.referenceLocale, `${namespace}.json`)
            const filePath = path.join(config.localeRoot, locale, `${namespace}.json`)
            sortFile(referencePath)
            sortFile(filePath)
        }
    }
}


function removeUnusedKeysFromObject(target: JSONObject, reference: JSONObject) {
    for (const key in target) {
        //Check if the key is present in the reference
        if (!reference.hasOwnProperty(key)) {
            //Remove the key
            delete target[key]
        }
        //If the key is an object, we need to go deeper
        if (typeof target[key] === "object") {
            removeUnusedKeysFromObject(target[key], reference[key])
        }
    }
}

export function sortFile(path: string) {
    const content = JSON.parse(fs.readFileSync(path, "utf-8"))
    const sorted = sortObject(content)
    fs.writeFileSync(path, JSON.stringify(sorted, null, 2));
}

function sortObject(obj: object) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
        // Not an object or is an array, return as is
        return obj;
    }
    // Create a new sorted object
    const sortedObj = {};
    Object.keys(obj).sort().forEach(key => {
        // Recursively sort each property if it's an object
        sortedObj[key] = sortObject(obj[key]);
    });
    return sortedObj;
}