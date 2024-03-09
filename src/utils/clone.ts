import simpleGit, { SimpleGitOptions } from "simple-git"; // 用于git
import createLogger from "progress-estimator"; // 用于clone 进度
import chalk from "chalk";

// 初始化进度条
const logger = createLogger({
  spinner: {
    interval: 100,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((item) =>
      chalk.green(item)
    ),
  },
});

const gitOptions: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(), // 根目录
  binary: "git", // 指定 git 二进制文件路径
  maxConcurrentProcesses: 6, // 最大并发进程数
};

export const clone = async (url: string, projectName: string, options: string[]) => {
  const git = simpleGit(gitOptions);

  try {
    await logger(git.clone(url, projectName, options), '代码下载中...', {
        estimate: 7000, //预计下载时间
    })

    console.log();
    console.log(chalk.blueBright(`==================================================`));
    console.log(chalk.blueBright(`==================================================`));
    console.log(chalk.blueBright(`============= 欢迎使用 xy-cli 脚手架 =============`));
    console.log(chalk.blueBright(`==================================================`));
    console.log(chalk.blueBright(`==================================================`));
    console.log();

    console.log('项目下载成功');
    

   
  } catch (error) {
    console.log(chalk.red('代码下载失败'));
    // console.log(error);
  }
};
