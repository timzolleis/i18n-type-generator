import {Command} from "commander";
import {writeOrUpdateResourceFile} from "../resource-file-generator";
import {generate, generateCommand} from "./generate";
import {validateCommand} from "./validate";
import {cleanupCommand} from "./cleanup";
import {sortCommand} from "./sort";


export const runAll = new Command()
    .name("run")
    .action(() => {
        //Generate types
        generateCommand();
        //Validate namespaces and keys
        validateCommand();
        //Remove unused keys
        cleanupCommand();
        //Sort keys
        sortCommand();
    })