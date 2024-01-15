import {Command} from "commander";
import {config} from "../../index";
import {removeUnusedKeys} from "../file-cleanup";
import chalk from "chalk";
import ora from "ora";
import {handleError} from "../command-utils/error";

export const cleanup = new Command().name("cleanup").action(() => {
  cleanupCommand();
});

export function cleanupCommand() {
  if (!config.removeUnusedKeys) {
    console.log(
      chalk.yellow(
        "WARN: Key removal is disabled in your configuration. Skipping.",
      ),
    );
    return;
  }
  const spinner = ora("Removing unused keys...").start();
  try {
    removeUnusedKeys();
    spinner.stopAndPersist({
      symbol: "✅ ",
      text: "Successfully removed unused keys.",
    });
  } catch (e) {
    spinner.stop();
    handleError(e);
  }
}
