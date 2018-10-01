# Jung von Matt/Neckar - GroundZero Changelog

## What is this script doing?

Updates the release version and writes all commits to changelog.

## How is it doing it?

1) Gets the last release tag and scans all commits from the git HEAD to that point.
2) From the commits determines what type of release it should be and bumps the package.
3) Formats the commits to markdown and writes to changelog.md.

## Release assumptions
- Your working on a git-flow structure
- You make a release from develop branch
- Your release tags are in a clear SemVer format (1.0.0, v1.0.0, =1.0.0)
- A Jira ticket is written inside brackets [] and can be located anywhere in the commit
