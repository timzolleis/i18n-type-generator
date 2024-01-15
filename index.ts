import {writeOrUpdateResourceFile} from "./src/resource-file-generator";
import {read} from "node:fs";
import {readConfig} from "./src/configuration-loader";
import {validateKeys, validateNamespaces} from "./src/file-validator";
import {writeReport} from "./src/reporter";
import {removeUnusedKeys} from "./src/file-cleanup";

export const config = readConfig()

function index(){
    writeOrUpdateResourceFile()
    //Validate that all namespaces are present in all locales
    const missingNamespaces = validateNamespaces()
    if(config.mode === "report"){
        writeReport(missingNamespaces)
    }
    removeUnusedKeys();
}
index()