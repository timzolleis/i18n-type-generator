import * as fs from "fs";
import * as path from "node:path";
import {config} from "../index";

/**
 * Gets all available locales that are not excluded by configuration
 */
export function getAvailableLocales() {
  const locales = fs.readdirSync(config.localeRoot);
  return locales.filter((locale) => !config.excludeLocales.includes(locale));
}

/**
 * Gets all namespaces for the reference locale
 */
export function getReferenceLocaleNamespaces() {
  const namespaces = new Set<string>();
  const localePath = path.join(config.localeRoot, config.referenceLocale);
  const files = fs.readdirSync(localePath);
  files.forEach((file) => {
    const namespace = file.split(".")[0];
    namespaces.add(namespace);
  });
  return Array.from(namespaces);
}

/**
 * Gets all namespaces for a given locale
 */
export function getAvailableNamespacesForLocale(locale: string) {
  const localePath = path.join(config.localeRoot, locale);
  const files = fs.readdirSync(localePath);
  return files.map((file) => file.split(".")[0]);
}

/**
 * Gets the content of a translation file for a given namespace and locale
 */
export function getTranslationFileContent({
  namespace,
  locale,
}: {
  namespace: string;
  locale: string;
}) {
  const filePath = path.join(config.localeRoot, locale, `${namespace}.json`);
  return fs.readFileSync(filePath, "utf-8");
}
