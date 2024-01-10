import {z} from "zod";
import * as fs from "fs";


const configSchema = z.object({
        localeRoot: z.string().default("public/locales"),
        mode: z.enum(["report", "write", "print"]).default("report"),
        importAlias: z.string().default("@/locales"),
        outputFile: z.string().default("resources.ts"),
        runFormat: z.boolean().default(true),
        reportFileName: z.string().default("i18n-type-report.json"),
        referenceLocale: z.string().default("en"),
        excludeLocales: z.array(z.string()).default([]),
        excludeNamespaces: z.array(z.string()).default([]),
    }
)

export function readConfig() {
    const configFile = fs.readFileSync(".i18n-generator.json", "utf-8")
   try {
        const parsedJson = JSON.parse(configFile)
        return configSchema.parse(parsedJson)
   } catch (e) {
       console.log("Unable to parse config file. Using defaults.")
       return configSchema.parse({})
    }

}