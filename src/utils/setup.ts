import fs from 'fs';
import { fail, success } from './logging';
import path from 'path';
import { render } from './template';
import shell from 'shelljs';
import { prompt } from 'inquirer';

const currDir = process.cwd();

const skipFiles = ['node_modules'];
// export const CHOICES = fs.readdirSync(path.join(__dirname, '..', 'templates'));
const questions = [
  {
    name: 'projectName',
    type: 'input',
    message: 'Project name:',
  },
  {
    name: 'entityName',
    type: 'input',
    message: 'Entity name:',
  },
];

export const createProject = async () => {
  const answers = await prompt(questions);
  const { projectName, entityName } = answers;
  const templatePath = path.join(__dirname, '..', 'templates', 'node-service');
  const targetPath = path.join(currDir, projectName);

  const isCreated = createProjectDir(targetPath);
  if (!isCreated) return;
  copyTemplateContents(templatePath, projectName, entityName);
  installDependencies(targetPath);
};

const createProjectDir = (projectPath: string) => {
  try {
    fs.mkdirSync(projectPath);
    success(`successfully created ${projectPath}`);
    return true;
  } catch {
    fail(`Folder ${projectPath} exists. Delete or use another name.`);
    return false;
  }
};

const copyTemplateContents = (
  templatePath: string,
  dirName: string,
  entityName: string
) => {
  const filesToCreate = fs.readdirSync(templatePath);
  filesToCreate.forEach((file) => {
    const origFilePath = path.join(templatePath, file);
    const stats = fs.statSync(origFilePath);
    if (skipFiles.indexOf(file) > -1) return;
    if (stats.isFile()) {
      let contents = fs.readFileSync(origFilePath, 'utf8');
      contents = render(contents, { projectName: dirName, entityName });
      const writePath = path.join(
        currDir,
        dirName,
        renderFileName(file, entityName)
      );
      fs.writeFileSync(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      fs.mkdirSync(path.join(currDir, dirName, file));
      copyTemplateContents(
        path.join(templatePath, file),
        path.join(dirName, file),
        entityName
      );
    }
  });
};

const renderFileName = (file: string, entity: string) =>
  file.replace('template', entity);

const installDependencies = (targetPath: string) => {
  shell.cd(targetPath);
  const result = shell.exec('npm install');
  if (result.code !== 0) {
    fail('Could not install dependencies');
    return false;
  }
  success('successfully installed dependencies');
  return true;
};
