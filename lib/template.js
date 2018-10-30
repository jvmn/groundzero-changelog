const bump = require('./bump');

const options = {
    jiraUrl: 'https://jira.jvm.de/browse/',
    relTypes: {
        feat: 'Features',
        fix: 'Bug Fixes',
        perf: 'Performance Improvements',
        docs: 'Documentation',
        style: 'Styles',
        refactor: 'Code Refactoring',
        chore: 'Chores',
        build: 'Build'
    }
}

function commitUrl(commit, vars) {
    if (vars.gitRepo) {
        return vars.gitRepo + '/commits/' + commit;
    }
}

function compareUrl(oldVer, newVer, vars) {
    return vars.gitRepo ? '(' + vars.gitRepo + '/compare/commits?targetBranch=refs%2Ftags%2F' + oldVer + '&sourceBranch=refs%2Ftags%2F' + newVer + ')' : '';
}

function jiraTicketUrl(id) {
    if (id) {
        return options.jiraUrl + id.substr(1).slice(0, -1);
    }
}

function checkJiraTicket(text, vars) {
    if (!text) return;
    let m = text.match(vars.regex.ticketRegex);

    return m === null ? undefined : { name: m[0], url: jiraTicketUrl(m[0]) };
}

function getReleaseType(commits) {
    const isMinor = commits.filter(commit => commit.convention.type === 'feat').length > 0;
    const isMajor = commits.filter(commit => commit.isMajor === true).length > 0;
    let releaseType;

    if (isMinor) {
        releaseType = 'minor'
    } else if (isMajor) {
        releaseType = 'major'
    } else {
        releaseType = 'patch'
    }

    return releaseType;
}

function renameType(type) {
    let commitType = options.relTypes[type]
    if (!commitType) return type
    return commitType;
}

function prepareConvention(commit, regex) {
    let m;
    let convention;
    while ((m = regex.exec(commit)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // TODO: perhaps some checking for errors should come here just in case we are not linting commits
        convention = {
            type: m[1],
            scope: m[2],
            description: m[3]
        }
    }
    return convention;
}

function formatCommitsToMarkdown(commits) {
    return commits.map(function (commit) {
        // console.log('formatCommitsToMarkdown url', commit)
        let jiraUrl = commit.url && commit.jiraTicket ? '(' + commit.jiraTicket.url + ')' : '';
        let jiraTicket = commit.jiraTicket ? ' ['+ commit.jiraTicket.name + jiraUrl + ']' : '';
        let author = commit.author ? ' _by ['+ commit.author.name() + ']('+ commit.author.email() +')' : '';
        let cScope = '* ';
        let commitUrl = commit.url ? '(' + commit.url + '))' : '';
        let formatDate = new Date(commit.date).toLocaleDateString('en-GB');
        if (commit.convention.scope !== undefined) 
            cScope = '* **' + commit.convention.scope + ':** ';
        return cScope + commit.convention.description + ' ([' + commit.id + ']' + commitUrl + jiraTicket + author + ' @' + formatDate + '_\n';
    });
}

function formattedDate(d = new Date) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${day}.${month}.${year}`;
}

function prepareMarkdownTemplate(groups, vars) {
    let today = formattedDate();
    // here we preper the release header
    const releaseHeader = `\n *** \n\n# [${bump.newVersion()}]${compareUrl(bump.oldVersion(), bump.newVersion(), vars)} (${today})\n`;
    // here we structure the type groups and commits and convert to string
    const commitGroups = groups.map(function (group) {
        return '### ' + group.type + '\n\n' + formatCommitsToMarkdown(group.commits).join('');
    }).join('');
    return releaseHeader + commitGroups;
}

module.exports = {
    commitUrl,
    checkJiraTicket,
    getReleaseType,
    renameType,
    prepareConvention,
    prepareMarkdownTemplate
}