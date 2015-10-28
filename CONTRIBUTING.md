
# How to contribute



## Getting Started


### Reporting Bugs, Feature Requests

* Get an account on github
* Submit a ticket for your issue or contribute to an existing, similar issue
    * Clearly describe the issue
    * In your description, include the steps to reproduce the issue and also the platform (OS, ...) on which the issue occurs
    * Include any exception stack traces or other relevant log messages you have but keep it crisp
    * State the version of the software that exhibits the issue


### Contributing Changes

* Use a linux machine or OSX or CygWin on Windows
* Install GNU Make
    * On Debian, make it `apt-get install build-essential`
* Install node, npm and the likes, preferrably version 4.x.x of node
* Fork the repository


## Making Changes

* Clone your fork and add a second remote pointing to the original repository, e.g. `git remote add base https://github.com/...`
* Fetch existing branches and tags from the `base`
* Keep your fork up to date by constantly fetching/pulling from `base`, rebasing and pushing to your repository
* Checkout the development branch on which you will base your changes on, e.g. `git checkout dev-next`
* Create a different branch for each of your pull requests, never make changes to master or the development branch directly
* Name the branch so that you can determine easily what it stands for, e.g. `git checkout -b gh-1234` for the issue that you are about to fix
* Keep your changes and commits atomic
    * Too many unrelated changes in a single commit distributed across the whole code base make it difficult to understand your intentions
* Use short yet expressive commit messages
* Always address the issue being fixed in your commit messages, e.g. `fixes #1234`
* Always keep your branch up to date by rebasing it, e.g. `git rebase base dev-next`
    * Resolve all conflicts that you get but make sure that all tests still work
* Think twice before adding additional global, dev or runtime dependencies, perhaps ask first?


### Submitting Pull Requests

* Push the branch to your repository 
* On github, submit a pull request (PR) with your proposed fixes or new features
* In your pull request, refer to the issue that the PR addresses, e.g. `proposed patch for #1234` or `fixes #1234`


### Making Additional Changes

* Rebase first
* Use e.g. `git push -f origin gh-1234` to force push your branch to your repository, and your existing pull request will be updated accordingly


### Needless To Say

* Install dependencies
    * Use `make deps-global` to install global dependencies (requires sudo)
    * Use `make deps` to install both runtime and development dependencies
* Add new or update existing doc comments where appropriate
    * Use `make doc` or `make devdoc` to generate the documentation
    * Check the generated documentation under `build/doc/dev` or `build/doc/public`
* Add required new or update existing tests
    * Use `make test` to run available tests
* Adhere to the overall coding style
    * Use `make lint` to check
* Have a look at Travis CI
    * Whenever you push your changes, Travis CI will run the existing tests and lint your code

