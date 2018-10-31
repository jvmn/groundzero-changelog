# Jung von Matt/Neckar - GroundZero Changelog

## What is this script doing?

Bumps the release version depending on the type of commits found and writes all the commits to a changelog file in Markdown format.

## How is it doing it?

1) Gets the last release tag from the package.json and scans all commits from the git HEAD to that point.
2) From the commits determines what type of release it should be and bumps the package.
3) Formats the commits to markdown and writes to CHANGELOG.md

## Installation
1) npm install: 
    ```
    npm i git://stash.jvm.de/scm/jvmnec/groundzero-changelog.git --save-dev
    ```
    If install is stuck or not working try this alternate URL:

    ```
    npm i git+https://stash.jvm.de/scm/jvmnec/groundzero-changelog.git --save-dev
    ```
2) add a script to the scripts section in your package.json
    ```json
    "postrelease": "groundzero-changelog",
    ``` 
    or any other hook you want to run it from.

3) *optionally overwrite default options in package.json

## Options
In your main project package.json you can overwrite some defaults by adding the jvmChangelog object.
Defaults to:
```json
"jvmChangelog": {
    "pathChangelog": "./docs/CHANGELOG.md",
    "pathRepo": "./.git",
    "gitRepo": "false",
    "ignores": "build,chore,revert,test"
},
```
**The gitRepo url** (not the clone url) would be added from the project/fractal config, if none exist either add the url here or the changelog will not output commit urls or compare urls between releases.

## Script assumptions
- Your commits follow the Angular Commit Message Conventions (https://gist.github.com/stephenparish/9941e89d80e2bc58a153)

- A Jira ticket is written inside brackets [TICKET-123] and can be located anywhere in the commit.
