import {Command} from "commander";
import ora from "ora";
import {writeOrUpdateResourceFile} from "../resource-file-generator";

export const generate = new Command().name("generate").action(() => {
  generateCommand();
});

export function generateCommand() {
  const spinner = ora("Generating resources...").start();
  writeOrUpdateResourceFile()
    .then(() =>
      spinner.stopAndPersist({
        symbol: "✅ ",
        text: "Successfully generated resources",
      }),
    )
    .catch(() =>
      spinner.stopAndPersist({
        symbol: "❌",
        text: "Failed to generate resources",
      }),
    );
}
