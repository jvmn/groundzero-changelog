/**
 * TODO:
 * - Check if last commit has already been released and abort
 * - Check if we have a changelog.md file in the docs folder otherwise write one
 * - add more dynamic vars to options object
 */

const fs = require('fs');
const { spawn } = require('child_process');
const split2 = require('split2');
const commitStream = require('./commitStream');
const listStream = require('./listStream');
const path = require('path');
const bump = require('./bump');
const template = require('./template');
const printNextSteps = require('./nextsteps');
const getPackageJsonPath = () => `${ process.cwd() }/package.json`;
const projectPackageJson = require(getPackageJsonPath());

const releaseVars = {
    logNextSteps: true,
    pathToChangelog: undefined,
    gitRepo: undefined,
    pathToRepo: undefined,
    currentRepo: undefined,
    startCommit: undefined,
    finishCommit: undefined,
    extraComments: null,
    oldVersion: bump.oldVersion(),
    newVersion: undefined,
    releaseCommits: [],
    ignores: ['build','chore','revert','test'],
    regex: {
        commitRegex: /^(\w*)(?:\((.*)\))?:(.*)$/gm,
        ticketRegex: /\[(.*?)\]/gmi,
        majorRegex: /\b(BREAKING CHANGE|BREAKING CHANGES|MAJOR RELEASE)\b/
    }
}

function parseCommits(list) {
    list.forEach((commit) => {
        let commitObj = {
            id: commit.sha.substring(0, 7),
            sha: commit.sha,
            message: commit.message,
            body: commit.body,
            header: commit.summary,
            date: commit.date,
            author: commit.author,
            convention: template.prepareConvention(commit.summary, releaseVars.regex.commitRegex),
            isMajor: commit.body ? commit.body.match(releaseVars.regex.majorRegex) !== null : false,
            jiraTicket: template.checkJiraTicket(commit.message, releaseVars),
            url: releaseVars.gitRepo ? template.commitUrl(commit.sha.substring(0, 7), releaseVars) : false
        }
        // here we include only commits that follow convention
        if (commitObj.convention) {
            releaseVars.releaseCommits.push(commitObj);
        }
    })
    processCommits(releaseVars.releaseCommits);
}

function processCommits(commits) {
    let groups = [];
    // get commit types
    let types = commits
        // ignore these commit types
        .filter(commit => !releaseVars.ignores.includes(commit.convention.type))
        // extract commit types for grouping
        .map(commit => commit.convention.type);
    // extract unique and sort the types
    let uniqueAndSorted = [...new Set(types)].sort();

    uniqueAndSorted.forEach(function (type) {
        groups.push({
            type: template.renameType(type),
            commits: commits.filter(commit => commit.convention.type === type)
        })
    })

    // check for release type
    const releaseType = template.getReleaseType(commits);

    // bump version in package
    bump.bumpVersion(releaseType);

    // now convert commits to markdown format and save to disk
    writeChangelog(template.prepareMarkdownTemplate(groups, releaseVars));
}

function writeChangelog(commits) {
    // Write changelog to file
    var data = fs.readFileSync(releaseVars.pathToChangelog); //read existing contents into data
    var fd = fs.openSync(releaseVars.pathToChangelog, 'w+');
    var buffer = Buffer.from(commits);
    

    fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
    fs.writeSync(fd, data, 0, data.length, buffer.length); //append old data

    fs.close(fd);

    if (releaseVars.logNextSteps) printNextSteps(releaseVars.releaseCommits.length);
}

function onCommitList (err, list) {
    // list is an array of objects
    // console.log('onCommitList', list);
    parseCommits(list);
}

const jvmChangelog = projectPackageJson && projectPackageJson.jvmChangelog ? projectPackageJson.jvmChangelog : null;

if (!('gitRepo' in jvmChangelog)) {
    throw new Error('missing "gitRepo" in changelog config')
}

if (jvmChangelog) {
    releaseVars.pathToChangelog = jvmChangelog.pathChangelog ? jvmChangelog.pathChangelog : path.resolve('./docs/CHANGELOG.md');
    releaseVars.pathToRepo = jvmChangelog.pathRepo ? jvmChangelog.pathRepo : path.resolve('./.git');
    releaseVars.gitRepo = jvmChangelog.gitRepo ? jvmChangelog.gitRepo : '';
    releaseVars.gitPlatform = jvmChangelog.gitPlatform ? jvmChangelog.gitPlatform : 'bitbucket';
    releaseVars.extraComments = jvmChangelog.extraComments ? jvmChangelog.extraComments : null;
    releaseVars.ignores = jvmChangelog.ignores ? jvmChangelog.ignores : releaseVars.ignores;
    releaseVars.logNextSteps = jvmChangelog.logNextSteps ? jvmChangelog.logNextSteps : releaseVars.logNextSteps;
} else {
    throw new Error('missing "jvmChangelog" in package.json')
}

spawn('bash', [ '-c', `git log $(git describe --tags --abbrev=0)...@` ])
    .stdout.pipe(split2()) // break up by newline characters
    .pipe(commitStream())
    .pipe(listStream.obj(onCommitList))
