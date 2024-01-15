import chalk from "chalk";

export function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : error;
  console.error(chalk.red("ERROR: ", message));
}
