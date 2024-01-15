import { readConfig } from "./src/configuration-loader";
import { Command } from "commander";
import { sort } from "./src/commands/sort";
import { cleanup } from "./src/commands/cleanup";
import { generate } from "./src/commands/generate";
import { validate } from "./src/commands/validate";
import { runAll } from "./src/commands/run-all";

export const config = readConfig();
const program = new Command()
  .name("i18n-type-generator")
  .description("Validate your locales quickly and easily")
  .addCommand(runAll)
  .addCommand(sort)
  .addCommand(cleanup)
  .addCommand(generate)
  .addCommand(validate);

program.parse();
