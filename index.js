const core = require('@actions/core');
const fs = require('fs');
const github = require('@actions/github');
const path = require('path');

async function calculateProgress() {
  let javaFiles = [];
  let kotlinFiles = [];

  try {
    const searchDirectory = core.getInput('directory');
    const openIssue = core.getInput('open-issue') === 'true';

    kotlinFiles = await getKotlinFiles(searchDirectory);
    javaFiles = await getJavaFiles(searchDirectory);

    const progressRatio = kotlinFiles.length / (kotlinFiles.length + javaFiles.length);

    core.setOutput('java-files', JSON.stringify(javaFiles));

    if (openIssue) {
      await createIssue(progressRatio, javaFiles, kotlinFiles);
    } else {
      console.log(`Total Kotlin Migration is: ${progressRatio * 100}% (${kotlinFiles.length} out of ${javaFiles.length + kotlinFiles.length} files)`);
      console.log("Remaining Java Files:");
      javaFiles.forEach(file => {
        console.log(file);
      })
    }
  } catch (error) {
    console.error(error);
  }
}

async function getKotlinFiles(searchDirectory) {
   return await getFilesWithExtension('kt', searchDirectory, []); 
}

async function getJavaFiles(searchDirectory) { 
  return await getFilesWithExtension('java', searchDirectory, []); 
}

async function getFilesWithExtension(extension, directory, filesList = []) {

  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      getFilesWithExtension(extension, filePath, filesList);
    } else if (filePath.endsWith(`.${extension}`)) {
      filesList.push(filePath);
    }
  });
  return filesList;
}

async function createIssue(progress, javaFiles, kotlinFiles) {
  const token = core.getInput('github-token', { required: true});
  const octokit = github.getOctokit(token);

  const context = github.context;

  let issueBody = `### Total Kotlin Migration is: ${progress * 100}% (${kotlinFiles.length} out of ${javaFiles.length + kotlinFiles.length} files)\n`;

  issueBody += "Remaining Java files:\n";

  javaFiles.forEach(file => {
    issueBody += `* \`${file}\`\n`;
  })

  const currentDate = new Date().toISOString().split('T')[0];
  const issueTitle = `Kotlin Migration Progress: ${currentDate}`;

  await octokit.rest.issues.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title: issueTitle,
    body: issueBody
  }).then(() => {
    core.info("🟢 Issue Created Successfully!");
  });
}

calculateProgress();
