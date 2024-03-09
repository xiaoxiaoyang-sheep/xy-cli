import process from 'child_process'
import chalk from "chalk";
import ora from "ora"; // 加载动画

const spinner = ora({
  text: "xiaoyang-cli 正在更新......",
  spinner: {
    interval: 100,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((item) =>
      chalk.blue(item)
    ), 
  },
});

export function update() {
    spinner.start()
    process.exec('npm install xiaoyang-cli@latest -g', (err) => {
        spinner.stop()
        if(!err) {
            console.log(chalk.green('更新成功'));
        } else {
            console.log(chalk.red(err));
        }
        console.log();
        console.log();
    })
}