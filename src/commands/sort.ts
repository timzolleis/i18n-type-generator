import {Command} from "commander";
import {config} from "../../index";
import {sortKeys} from "../file-cleanup";
import chalk from "chalk";
import ora from "ora";


export const sort = new Command()
    .name("sort")
    .action(() => {
        sortCommand();
    })


export function sortCommand(){
    if(!config.sortKeys){
        console.log(chalk.yellow("WARN: Key sorting is disabled in your configuration. Skipping."))
        return
    }
    const spinner = ora("Sorting keys...").start()
    sortKeys()
    spinner.stopAndPersist({symbol: "✅ ", text: "Successfully sorted keys."})
}