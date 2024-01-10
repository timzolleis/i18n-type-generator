import {readConfig} from "./configuration-loader";
import * as fs from "fs";
import * as path from "node:path";


const config = readConfig()

/**
 * Gets all available locales that are not excluded by configuration
 */
export function getAvailableLocales(){
    const locales = fs.readdirSync(config.localeRoot)
    return locales.filter(locale => !config.excludeLocales.includes(locale))
}

/**
 * Gets all namespaces for all locales that are not excluded by configuration
 */
export function getAvailableNamespaces(){
    const namespaces = new Set<string>()
    const locales = getAvailableLocales()
    locales.forEach(locale => {
        const localePath = path.join(config.localeRoot, locale)
        const files = fs.readdirSync(localePath)
        files.forEach(file => {
            const namespace = file.split(".")[0]
            namespaces.add(namespace)
        })
    })
    return Array.from(namespaces).filter(namespace => !config.excludeNamespaces.includes(namespace))
}

/**
 * Gets all namespaces for the reference locale
 */
export function getReferenceLocaleNamespaces(){
    const namespaces = new Set<string>()
    const localePath = path.join(config.localeRoot, config.referenceLocale)
    const files = fs.readdirSync(localePath)
    files.forEach(file => {
        const namespace = file.split(".")[0]
        namespaces.add(namespace)
    })
    return Array.from(namespaces)
}


/**
 * Gets all namespaces for a given locale
 */
export function getAvailableNamespacesForLocale(locale: string){
    const localePath = path.join(config.localeRoot, locale)
    const files = fs.readdirSync(localePath)
    return files.map(file => file.split(".")[0])
}