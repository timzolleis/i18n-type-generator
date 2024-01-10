import {
    getAvailableLocales,
    getAvailableNamespacesForLocale,
    getReferenceLocaleNamespaces
} from "./translation-file-loader";
import {readConfig} from "./configuration-loader";

type MissingNamespace = {
    locale: string;
    namespace: string;
}
const config = readConfig()


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
            if(!namespaces.includes(namespace) && !config.excludeNamespaces.includes(namespace)){
                missingNamespaces.push({
                    locale,
                    namespace
                })
            }
        })
    })
    return missingNamespaces
}





