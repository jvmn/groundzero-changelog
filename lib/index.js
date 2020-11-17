/**
 * TODO:
 * - Check if last commit has already been released and abort
 * - Check if we have a changelog.md file in the docs folder otherwise write one
 * - add more dynamic vars to options object
 */

const fs = require('fs');
const Nodegit = require('nodegit');
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

const getStartCommit = function (repo) {
    releaseVars.currentRepo = repo;
    return repo.getHeadCommit()
        .then(function (commit) {
            // get the HEAD commit of the current branch and save it as the starting commit
            releaseVars.startCommit = commit;
            // console.log('headCommit.startCommit', releaseVars.startCommit.sha());
            return repo;
        });
}

const searchLatestTag = function(repo) {
    // get latest tag name Oid
    var lastTag = releaseVars.oldVersion;
    // console.log('searchLatestTag:lastTag', lastTag);
    return Nodegit.Reference.lookup(releaseVars.currentRepo, 'refs/tags/' + lastTag)
        .then(function (tagRef) {
            // console.log('tagRef', tagRef);
            return tagRef.peel(Nodegit.Object.TYPE.COMMIT)
                .then(function (commitRef) {
                    return getLatestTagHash(repo, commitRef);
                })
        }, function () {
            console.log('No Tag Found ! Starting from first commit');
            releaseVars.finishCommit = null;
            return repo;
        })
}

const getLatestTagHash = function(repo, tagRef) {
    // console.log('getLatestTagHash', repo);
    return Nodegit.Commit.lookup(releaseVars.currentRepo, tagRef)
        .then(function (commit) {
            // save last release commit Oid as finishCommit
            releaseVars.finishCommit = commit;
            // console.log('finishCommit', releaseVars.finishCommit, repo);
            return repo;
        });
}

function scanCommits(args) {
    // now lets run history from startCommit
    let history = args.startCommit.history();

    // initial settings
    let finishCommentTimestamp = 0;
    let stopCount = false;

    // check if we have a tag
    if(args.finishCommit){
        finishCommentTimestamp = args.finishCommit.timeMs();
    }

    // console.log("scanCommits", args.startCommit.sha(), args.finishCommit.sha());
    // console.log("scanCommits", args.startCommit.timeMs(), finishCommentTimestamp);

    // check timestamps
    // if commit timestamp is smaller/older then tag timestamp stop there
    if (args.startCommit.timeMs() <= finishCommentTimestamp) {
        stopCount = true;
    }

    // Create a counter to only show up to the last found commit.

    history.on('commit', function (commit) {

        // console.log("history.oncommit", commit.sha(), args.finishCommit.sha());

        // check timestamps
        // if commit timestamp is smaller/older then tag timestamp stop there
        if (commit.timeMs() <= finishCommentTimestamp) {
            stopCount = true;
        }

        if (stopCount) {
            // ignore commits older then finishCommit
            return;
        } else {
            let commitObj = {
                id: commit.toString().substring(0, 7),
                sha: commit.sha(),
                message: commit.message(),
                body: commit.body(),
                header: commit.summary(),
                date: commit.date(),
                author: commit.author(),
                convention: template.prepareConvention(commit.summary(), releaseVars.regex.commitRegex),
                isMajor: commit.body() ? commit.body().match(releaseVars.regex.majorRegex) !== null : false,
                jiraTicket: template.checkJiraTicket(commit.message(), releaseVars),
                url: releaseVars.gitRepo ? template.commitUrl(commit.toString().substring(0, 7), releaseVars) : false
            }
            // here we include only commits that follow convention
            if (commitObj.convention) {
                releaseVars.releaseCommits.push(commitObj);
            }
        }
    });

    history.on('end', function () {
        // finished reading the commits. time to make it rain
        // return console.log("history.on",releaseVars);

        processCommits(releaseVars.releaseCommits);
    });

    history.start();
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

/**
 * Init nodegit to kickoff everything
 * First getStartCommit (latest commit) and save it to releaseVars.startCommit
 * Second getFinishCommit (commit from latest tag) and if exists, save it to releaseVars.finishCommit
 * Last scanCommits -> processCommits
 */
Nodegit.Repository.open(releaseVars.pathToRepo)
    .then(getStartCommit)
    .then(searchLatestTag)
    .then(() => {
        scanCommits({ startCommit: releaseVars.startCommit, finishCommit: releaseVars.finishCommit })
    })