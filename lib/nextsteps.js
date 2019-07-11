const bump = require('./bump');

module.exports = function (commitsNum = '') {
    // Tag a new release
    console.log(`
----------- ${commitsNum} commits added to CHANGELOG -------------

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
