/**
 * TODO:
 * - Check if last commit has already been released and abort
 * - Check if we have a changelog.md file in the docs folder otherwise write one
 * - add more dynamic vars to options object
 */

const fs = require('fs');
const Git = require('nodegit');
const path = require('path');
const bump = require('./bump');
const template = require('./template');
const getPackageJsonPath = () => `${ process.cwd() }/package.json`;
const projectPackageJson = require(getPackageJsonPath());
// lets check for default gitRepo if we find a fractal config 
let fractal;
try {
    fractal = require(path.resolve('./fractal-config.js'));
}
catch (e) {
    console.log("Did not find a fractal config file. Setting gitRepo to none (Overwrite in jvmChangelog)");
    fractal = false;
}

let releaseVars = {
    pathToChangelog: undefined,
    gitRepo: undefined,
    pathToRepo: undefined,
    currentRepo: undefined,
    startCommit: undefined,
    finishCommit: undefined,
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

let setOptionsFromProject = () => {
    // here we are looking at the projects package.json for the vars
    // they should be set under jvmChangelog {}, vars: pathChangelog, pathRepo, gitRepo
    const jvmChangelog = projectPackageJson && projectPackageJson.jvmChangelog ? projectPackageJson.jvmChangelog : null;
    const fractalRepo = fractal ? fractal.get('project.gitrepo') : false;
    // console.log('setOptionsFromProject:', fractalRepo, jvmChangelog);
    if (jvmChangelog) {
        releaseVars.pathToChangelog = jvmChangelog.pathChangelog || path.resolve('./docs/CHANGELOG.md');
        releaseVars.pathToRepo = jvmChangelog.pathRepo || path.resolve('./.git');
        releaseVars.gitRepo = jvmChangelog.gitRepo || fractalRepo;

        if (jvmChangelog.ignores) {
            // lets convert the option to array and overwrite the defaults
            const stringToArray = jvmChangelog.ignores.split(",");
            // console.log('stringToArray', stringToArray);
            releaseVars.ignores = stringToArray;
        }
    } else {
        releaseVars.pathToChangelog = path.resolve('./docs/CHANGELOG.md');
        releaseVars.pathToRepo = path.resolve('./.git');
        releaseVars.gitRepo = fractalRepo;
    }
}

let getStartCommit = function (repo) {
    releaseVars.currentRepo = repo;
    return repo.getHeadCommit()
        .then(function (commit) {
            // get the HEAD commit of the current branch and save it as the starting commit
            releaseVars.startCommit = commit;
            // console.log('headCommit.startCommit', releaseVars.startCommit.sha());
            // Promise.resolve(releaseVars.startCommit);
            return repo;
        });
}

let searchLatestTag = function(repo) {
    // get latest tag name Oid
    var lastTag = releaseVars.oldVersion;
    // console.log('searchLatestTag:lastTag', lastTag);
    return Git.Reference.lookup(releaseVars.currentRepo, 'refs/tags/' + lastTag)
        .then(function (tagRef) {
            // console.log('tagRef', tagRef);
            return tagRef.peel(Git.Object.TYPE.COMMIT)
                .then(function (commitRef) {
                    return getLatestTagHash(repo, commitRef);
                })
        }, function () {
            console.log('No Tag Found ! Starting from first commit');
            releaseVars.finishCommit = null;
            return repo;
        })
}

let getLatestTagHash = function(repo, tagRef) {
    // console.log('getLatestTagHash', repo);
    return Git.Commit.lookup(releaseVars.currentRepo, tagRef)
        .then(function (commit) {
            // save last release commit Oid as finishCommit
            releaseVars.finishCommit = commit;
            // console.log('finishCommit', releaseVars.finishCommit, repo);
            return repo;
        });
}

let doScanCommits = function() {
    // return console.log({ startCommit: releaseVars.startCommit, finishCommit: releaseVars.finishCommit });
    return scanCommits({ startCommit: releaseVars.startCommit, finishCommit: releaseVars.finishCommit });
}

/**
 * Init nodegit to kickoff everything
 * First getStartCommit (latest commit) and save it to releaseVars.startCommit
 * Second getFinishCommit (commit from latest tag) and if exists, save it to releaseVars.finishCommit
 * Last scanCommits -> processCommits
 */
setOptionsFromProject();
Git.Repository.open(releaseVars.pathToRepo)
    .then(getStartCommit)
    .then(searchLatestTag)
    .done(doScanCommits);

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
    var buffer = new Buffer(commits);

    fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
    fs.writeSync(fd, data, 0, data.length, buffer.length); //append old data

    fs.close(fd);

    console.log(`
----------- ${releaseVars.releaseCommits.length} commits added to CHANGELOG -------------

Next steps:
***********

1) Overview/Add custom documentation to the CHANGELOG.md
2) Commit files with message:
   chore(release): prepare release ${bump.newVersion()}
3) Do git-flow release start, git-flow release finish
4) Tag new version: "${bump.newVersion()}" and publish to origin
5) Push everything
6) Run Deploy script for both dev and stage
7) Take 5 minutes break ;-)

------------------------------------------------------`);
}
