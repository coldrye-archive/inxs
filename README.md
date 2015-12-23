# inxs

![logo](https://raw.githubusercontent.com/coldrye-es/inxs-artwork/master/dist/logo.png)

Extensible, decorator based dependency injection framework using Babel. Suitable for
both node and the browser.


## Limitations

See [inxs-common](https://github.com/coldrye-es/inxs-common#limitations).


## Breaking Changes

Since version v0.1.0 this is no longer compatible with Babel 5.x. 

ES decorators are about to change. Currently, we must use the legacy ES2015 decorators.
Support for these decorators is provided by the interim package published by
[loganfsmyth](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy).

Please note that during build we have to make sure that **babel-traverse** is up to date, too.
See https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy/issues/8 for more information.

Another important change is that the distribution layout was changed since v0.1.0.
Clients of this will now be able to simply import from **<package>** rather than 
from **<package>/lib**.


## Travis-CI
See [inxs-common](https://github.com/coldrye-es/inxs-common#breaking-changes) for more information.


## Travis-CI

[![Build Status](https://travis-ci.org/coldrye-es/inxs.svg?branch=master)](https://travis-ci.org/coldrye-es/inxs)


## Project Site

The project site, see (2) under resources below, provides more insight into the project,
including test coverage reports and API documentation.


## Contributing

While I believe that the feature set of the software can be considered final,
you are very welcome to propose changes and report bugs, or even provide pull
requests on [github](https://github.com/coldrye-es/inxs).

See the [contributing guidelines](https://github.com/coldrye-es/inxs/blob/master/CONTRIBUTING.md) for more information.


### Contributors

 - [Carsten Klein](https://github.com/silkentrance) **Maintainer**


## Runtime Dependencies

 - [babel-runtime](https://github.com/babel/babel)
 - [inxs-common](https://github.com/coldrye-es/inxs-common)
 - [sprintf-js](https://github.com/alexei/sprintf.js)


## Development Dependencies

See [esmake](https://github.com/coldrye-es/esmake#development-dependencies) for more information on development dependencies.


## Building

See [esmake](https://github.com/coldrye-es/esmake#build-process) and the targets listed under
[esmake](https://github.com/coldrye-es/esmake#makefilesoftwarein) for more information on how to build this.


## Installation

Simply run **npm install --save inxs** to install.


## Usage

See the existing [examples](https://github.com/coldrye-es/inxs/tree/master/examples/) on how to use this.


## Resources

 - (1) [Github Site](https://github.com/coldrye-es/inxs)
 - (2) [Project Site](http://inxs.es.coldrye.eu)

