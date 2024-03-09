import { Command } from "commander";
import { version } from "../package.json";
import { create } from "./command/create";
import { update } from "./command/update";

const program = new Command("xy-cli");
// 查看版本
program.version(version, "-v --version");

program
  .command("update")
  .description("更新脚手架")
  .action(async () => {
    await update();
  });

program
  .command("create")
  .description("创建一个项目")
  .argument("[name]", "项目名称")
  .action(async (dirName) => {
    await create(dirName);
  });

program.parse();
