# Jung von Matt/Neckar - GroundZero Changelog

## What is this script doing?

Updates the release version and writes all commits to changelog.

## How is it doing it?

1) Gets the last release tag and scans all commits from the git HEAD to that point.
2) From the commits determines what type of release it should be and bumps the package.
3) Formats the commits to markdown and writes to CHANGELOG.md

## Installation
1) run 
    ```
    npm i git://stash.jvm.de/scm/jvmnec/groundzero-changelog.git --save-dev
    ```
2) add script to the scripts section in your package.json
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

## Release assumptions
- Your working on a git-flow structure
- You make a release from develop branch
- A Jira ticket is written inside brackets [] and can be located anywhere in the commit
