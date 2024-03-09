import path from "path";
import fs from "fs-extra"; // 处理文件
import { input, select } from "@inquirer/prompts"; // 用于命令行交互
import { clone } from "src/utils/clone";
import { gt } from "lodash";
import axios, { AxiosResponse } from "axios";
import { name, version } from "../../package.json";
import chalk from "chalk";
import log from "src/utils/log";

export interface TemplateInfo {
  name: string; // 模板名称
  downloadUrl: string; // 模板下载地址
  description: string; // 模板描述
  branch: string; // 模板分支
}

export const templates: Map<string, TemplateInfo> = new Map([
  [
    "Vite-Vue3-Typescript-tempalte",
    {
      name: "Vite-Vue3-Typescript-tempalte",
      downloadUrl: "https://gitee.com/sohucw/admin-pro.git",
      description: "Vue3技术栈开发模板2",
      branch: "dev11",
    },
  ],
  [
    "Vite-Vue3-移动端模板",
    {
      name: "Vite-Vue3-Typescript-tempalte",
      downloadUrl: "git@gitee.com:sohucw/admin-pro.git",
      description: "Vue3技术栈开发模板1",
      branch: "h5",
    },
  ],
]);

export function isOverwrite(fileName: string) {
  log.warn(`${fileName}文件夹存在`);
  return select({
    message: "是否覆盖？",
    choices: [
      { name: "覆盖", value: true },
      { name: "取消", value: false },
    ],
  });
}

export const getNpmInfo = async (name: string) => {
  const npmUrl = `https://registry.npmjs.org//${name}`;
  let res = {};
  try {
    res = await axios.get(npmUrl);
  } catch (error) {
    log.error(error as string);
  }
  return res;
};

export const getNpmLatestVersion = async (name: string) => {
  const { data } = (await getNpmInfo(name)) as AxiosResponse;
  return data["dist-tags"].latest;
};

export const checkVersion = async (name: string, version: string) => {
  const latestVersion = await getNpmLatestVersion(name);
  const need = gt(latestVersion, version);
  if (need) {
    console.log();
    console.log();
    console.log("===========================================");
    console.log(
      `    检测到xiaoyang-cli最新版本：${chalk.blueBright(latestVersion)}`
    );
    console.log(`    当前版本为：${chalk.blueBright(version)}`);
    console.log("===========================================");
    console.log();
    log.info(
      `可使用：${chalk.yellow("npm install xiaoyang-cli@latest -g")}`
    );
    log.info(`或者使用：${chalk.yellow("xy-cli update")} 更新`);
    console.log();
    console.log();
  }
  return need;
};


export async function create(projectName?: string) {
  // 初始化模板列表
  const templateList = Array.from(templates).map(
    (item: [string, TemplateInfo]) => {
      const [name, info] = item;
      return {
        name,
        value: name,
        description: info.description,
      };
    }
  );
  if (!projectName) {
    projectName = await input({ message: "请输入项目名称" });
  }

  // 如果文件存在 则提示是否覆盖
  const filePath = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(filePath)) {
    const run = await isOverwrite(projectName);
    if (run) {
      await fs.remove(filePath);
    } else {
      return; // 不覆盖 直接结束
    }
  }

  // 检测版本更新
  await checkVersion(name, version);

  const tempalteName = await select({
    message: "请选择模版",
    choices: templateList,
  });

  const info = templates.get(tempalteName);

  if (info) {
    // 克隆代码
    clone(info.downloadUrl, projectName, ["-b", info.branch]);
  }
}
