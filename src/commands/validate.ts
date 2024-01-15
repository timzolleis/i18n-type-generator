import {Command} from "commander";
import {validateKeys, validateNamespaces} from "../file-validator";
import ora from "ora";
import {handleError} from "../command-utils/error";

export const validate = new Command().name("validate").action(() => {});

export function validateCommand() {
  const spinner = ora("Validating...").start();
  try {
    //First, validate namespaces
    validateNamespaces();
    //Then, validate keys
    validateKeys();
    spinner.stopAndPersist({ symbol: "✅ ", text: "Validation complete." });
  } catch (e) {
    spinner.stop();
    handleError(e);
  }
}
