import * as prettier from "prettier";

export function formatTypescriptFile(content: string) {
  return prettier.format(content, { parser: "typescript" });
}
