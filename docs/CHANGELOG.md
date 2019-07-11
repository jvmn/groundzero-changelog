
 *** 

# [1.7.0](https://github.com/jvmn/groundzero-changelog/compare/1.6.1...1.7.0) (11.07.2019)

 ### Chores

* **log:**  npm link ([9ab21b2](https://github.com/jvmn/groundzero-changelog/commit/9ab21b2)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @11.07.2019_
 ### Documentation

* **readme:**  update with new features ([1d8ffcf](https://github.com/jvmn/groundzero-changelog/commit/1d8ffcf)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @11.07.2019_
 ### Features

* **nextsteps:**  standalone log function ([45dc15b](https://github.com/jvmn/groundzero-changelog/commit/45dc15b)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @11.07.2019_
* **index:**  logNextSteps option ([38091d4](https://github.com/jvmn/groundzero-changelog/commit/38091d4)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @11.07.2019_
* **log:**  print log commend ([565afbb](https://github.com/jvmn/groundzero-changelog/commit/565afbb)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @11.07.2019_
* **package:**  next bin function, update dep ([1556790](https://github.com/jvmn/groundzero-changelog/commit/1556790)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @11.07.2019_
 ### Bug Fixes

* **index:**  deprecationWarning: Buffer() ([1cf70fe](https://github.com/jvmn/groundzero-changelog/commit/1cf70fe)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @11.07.2019_
 ### Code Refactoring

* **bump:**  return pkg version if undefined ([5ef53b6](https://github.com/jvmn/groundzero-changelog/commit/5ef53b6)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @11.07.2019_

 *** 

# [1.6.1](https://github.com/jvmn/groundzero-changelog/compare/1.6.0...1.6.1) (17.01.2019)

### Chores

* **package:**  update dependencies ([044fab4](https://github.com/jvmn/groundzero-changelog/commit/044fab4)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @17.01.2019_
* **package:**  Increased node semver range ([20f4fad](https://github.com/jvmn/groundzero-changelog/commit/20f4fad)) _by [Holger Prys](holger.prys@jvm.de) @05.12.2018_

 *** 

# [1.6.0](https://github.com/jvmn/groundzero-changelog/compare/1.5.1...1.6.0) (07.11.2018)

 ### Breaking changes 
 * **ignore-list** if you have defined custom ignore items in your **package.json** config you would need to convert the list from a string to a string array !
 ```json
 refactor: "chore,build,test" 
 to: ["chore","build","test"]
 ```

 ### Chores

* **package:**  remove npm publish script ([ab12c73](https://github.com/jvmn/groundzero-changelog/commit/ab12c73)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @07.11.2018_
 ### Documentation

* **readme:**  update new options ([b75ca25](https://github.com/jvmn/groundzero-changelog/commit/b75ca25)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @07.11.2018_
 ### Features

* **extra-comments:**  expose extra comments as options ([fafb1f3](https://github.com/jvmn/groundzero-changelog/commit/fafb1f3)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @07.11.2018_
 ### Code Refactoring

* **ignores:**  switch from string to array ([be671dc](https://github.com/jvmn/groundzero-changelog/commit/be671dc)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @07.11.2018_

 *** 

# [1.5.1](https://github.com/jvmn/groundzero-changelog/compare/1.5.0...1.5.1) (06.11.2018)

 ### Breaking changes
 * Now published on npm. For old projects please uninstall the old package and install the new one. See README for more information.

 ### Documentation

* **readme:**  update package url to npm ([2613cb4](https://github.com/jvmn/groundzero-changelog/commit/2613cb4)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @06.11.2018_
 ### Code Refactoring

* **package:**  add publish script ([c3f1de3](https://github.com/jvmn/groundzero-changelog/commit/c3f1de3)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @06.11.2018_
 ### Styles

* **cli:**  remove test logs ([c100934](https://github.com/jvmn/groundzero-changelog/commit/c100934)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @06.11.2018_

 *** 

# [1.5.0](https://github.com/jvmn/groundzero-changelog/compare/1.4.0...1.5.0) (31.10.2018)

 ### Breaking changes
 * Repository moved to github: https://github.com/jvmn/groundzero-changelog. For old projects please uninstall the old package and install the new one.

 ### Chores

* **package:**  update depndencies ([91a0f1e](https://github.com/jvmn/groundzero-changelog/commit/91a0f1e)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @31.10.2018_
 ### Documentation

* **readme:**  update gitPlatform and npm i url ([f91504f](https://github.com/jvmn/groundzero-changelog/commit/f91504f)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @31.10.2018_
* **license:**  add license to package ([610fb54](https://github.com/jvmn/groundzero-changelog/commit/610fb54)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @31.10.2018_
* **changelog:**  replace bitbucket with github urls ([c83bc50](https://github.com/jvmn/groundzero-changelog/commit/c83bc50)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @31.10.2018_
 ### Features

* **options:**  add gitPlatform support for url formats now supports bitbucket as default and github as option ([a6da655](https://github.com/jvmn/groundzero-changelog/commit/a6da655)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @31.10.2018_
 ### Code Refactoring

* **package:**  change repo url to github ([13fbfe9](https://github.com/jvmn/groundzero-changelog/commit/13fbfe9)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @31.10.2018_

 *** 

# [1.4.0](https://github.com/jvmn/groundzero-changelog/compare/1.3.0...1.4.0) (31.10.2018)

 ### Documentation

* **readme:**  update info ([21c2d4c](https://github.com/jvmn/groundzero-changelog/commit/21c2d4c)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @31.10.2018_
 ### Features

* **template:**  add release comments to template ([c32184b](https://github.com/jvmn/groundzero-changelog/commit/c32184b)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @31.10.2018_
 ### Code Refactoring

* **template:**  use formattedDate method on commit date ([fcffb3b](https://github.com/jvmn/groundzero-changelog/commit/fcffb3b)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @31.10.2018_

 *** 

# [1.3.0](https://github.com/jvmn/groundzero-changelog/compare/1.2.0...1.3.0) (30.10.2018)
### Documentation

* **readme:**  add alternate url ([4c7bd33](https://github.com/jvmn/groundzero-changelog/commit/4c7bd33)) _by [Oliver Müller](oliver.mueller@jvm.de) @09.10.2018_
### Features

* **template:**  add formated commit date ([fdcd463](https://github.com/jvmn/groundzero-changelog/commit/fdcd463)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @30.10.2018_

 *** 

# [1.2.0](https://github.com/jvmn/groundzero-changelog/compare/1.1.1...1.2.0) (09.10.2018)
### Chores

* **cli:**  remove console log ([eb01388](https://github.com/jvmn/groundzero-changelog/commit/eb01388)) _by [Shachar Leuchter](shachar.leuchter@jvm.de)_
### Features

* **module:**  change module name ([c2de055](https://github.com/jvmn/groundzero-changelog/commit/c2de055)) _by [Oliver Müller](oliver.mueller@jvm.de)_

 *** 

# [1.1.1](https://github.com/jvmn/groundzero-changelog/compare/1.1.0...1.1.1) (01.10.2018)
### Documentation

* **readme:**  update install and options ([6b3a660](https://github.com/jvmn/groundzero-changelog/commit/6b3a660)) _by [Shachar Leuchter](shachar.leuchter@jvm.de)_
### Bug Fixes

* **package:**  add correct project gitRepo ([d93c4b5](https://github.com/jvmn/groundzero-changelog/commit/d93c4b5)) _by [Shachar Leuchter](shachar.leuchter@jvm.de)_
* **template:**  jiraUrl with jiraTicket check ([9e9b0f3](https://github.com/jvmn/groundzero-changelog/commit/9e9b0f3)) _by [Shachar Leuchter](shachar.leuchter@jvm.de)_
### Code Refactoring

* **package:**  clean unused tasks, add release task ([5772831](https://github.com/jvmn/groundzero-changelog/commit/5772831)) _by [Shachar Leuchter](shachar.leuchter@jvm.de)_
* **index:**  check for fractal config to fill gitRepo defaults ([bbc4f73](https://github.com/jvmn/groundzero-changelog/commit/bbc4f73)) _by [Shachar Leuchter](shachar.leuchter@jvm.de)_
* **template:**  url checks if no gitRepo, commit header styling ([228f743](https://github.com/jvmn/groundzero-changelog/commit/228f743)) _by [Shachar Leuchter](shachar.leuchter@jvm.de)_
* **index:**  better defaults, url checks if no gitRepo ([e918371](https://github.com/jvmn/groundzero-changelog/commit/e918371)) _by [Shachar Leuchter](shachar.leuchter@jvm.de)_
* **package:**  remove default configs options ([051b2f3](https://github.com/jvmn/groundzero-changelog/commit/051b2f3)) _by [Shachar Leuchter](shachar.leuchter@jvm.de)_
### Styles

* **template:**  releaseHeader line breaks ([92354e3](https://github.com/jvmn/groundzero-changelog/commit/92354e3)) _by [Shachar Leuchter](shachar.leuchter@jvm.de)_

 *** 

# [1.1.0](https://github.com/jvmn/groundzero-changelog/compare/1.0.0...1.1.0) (01.10.2018)
### Chores

* **pkg:**  add cli ([c52196f](https://github.com/jvmn/groundzero-changelog/commit/c52196f)) _by [Shachar Leuchter](shachar.leuchter@jvm.de)_

### Features

* **index:**  add ignores list for commit types ([3146980](https://github.com/jvmn/groundzero-changelog/commit/3146980)) _by [Shachar Leuchter](shachar.leuchter@jvm.de)_
### Bug Fixes

* **index:**  conditional projectConfig import ([83c1e20](https://github.com/jvmn/groundzero-changelog/commit/83c1e20)) _by [Shachar Leuchter](shachar.leuchter@jvm.de)_
### Code Refactoring

* **package:**  remove chore ignore from commit types ([291d419](https://github.com/jvmn/groundzero-changelog/commit/291d419)) _by [Shachar Leuchter](shachar.leuchter@jvm.de)_
* **package:**  add jvmChangelog params ([c119e6a](https://github.com/jvmn/groundzero-changelog/commit/c119e6a)) _by [Shachar Leuchter](shachar.leuchter@jvm.de)_

***

# [1.0.0](https://github.com/jvmn/groundzero-changelog/commits/1.0.0) (01.10.2018)

### Chores

* **pkg:**  Initial Commit ([6ecfd8e](https://github.com/jvmn/groundzero-changelog/commit/6ecfd8e)) _by [Shachar Leuchter](shachar.leuchter@jvm.de)_
