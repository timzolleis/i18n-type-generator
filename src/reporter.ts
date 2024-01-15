import {MissingNamespace} from "./file-validator";
import * as fs from "fs";
import {config} from "../index";

type GenerateReportInput = {
  missingNamespaces: MissingNamespace[];
};

export function writeReport(data: GenerateReportInput) {
  const generatedAt = new Date().toISOString();
  const report = {
    generatedAt,
    missingNamespaces: data.missingNamespaces,
  };
  fs.writeFileSync(config.reportFileName, JSON.stringify(report, null, 2));
}
