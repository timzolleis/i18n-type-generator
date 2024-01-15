export function safeParse(content: string, filePath: string) {
  try {
    return JSON.parse(content);
  } catch (e) {
    console.log("E");
    const message = e instanceof Error ? e.message : e;
    throw new Error(`Failed to parse JSON file ${filePath}: ${message}`);
  }
}
