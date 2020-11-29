import chalk from 'chalk';

export const success = (msg: string) => {
  console.log(chalk.green(msg));
};

export const fail = (msg: string) => {
  console.log(chalk.red(msg));
};
