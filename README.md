# inxs

![logo](https://github.com/coldrye-es/inxs-artwork/blob/master/dist/logo-60x80.png)

Extensible, decorator based dependency injection framework using Babel. Suitable for
both node and the browser.


## Travis-CI

[![Build Status](https://travis-ci.org/coldrye-es/inxs.svg?branch=master)](https://travis-ci.org/coldrye-es/inxs)


## Limitations

See [inxs-common](https://github.com/coldrye-es/inxs-common#limitations).


## Contributing

While I believe that the feature set of the software can be considered final,
you are very welcome to propose changes and report bugs, or even provide pull
requests on [github](https://github.com/coldrye-es/inxs).


### Contributors

 - [Carsten Klein](https://github.com/silkentrance) **Maintainer**


## Runtime Dependencies

 - [babel-runtime](https://github.com/babel/babel)
 - [inxs-common](https://github.com/coldrye-es/inxs-common)
 - [sprintf-js](https://github.com/alexei/sprintf.js)


## Development Dependencies

Development dependencies must be installed globally as we need the cli commands
provided by those packages.

Besides the dependencies listed in package.json#globalDevDependencies, you need
have the following tools installed.

 - GNU Make


## Why GNU Make and not Grunt or Gulp or ...?

The current situation with the available task runners is so that Gulp is not my
cup of tea and that Grunt lacks active development. Other task runners simply
do not do the trick or are way too specialized for my purposes.

Also, see (2) under resources below for my overall motivation. Opposed to the
view expressed by the author, though, I even refrain from using **npm** for
my build process as this also turned out to be an actual pain in the arse.

Besides, have a look at the Makefile and decide for yourself whether using Grunt
or Gulp would have made things easier or even more complex.


## Building

In order to build this from source, you need a working Bash. See the Makefile
for the available targets.


## Installation

Simply run **npm install --save inxs** to install.


## Usage

See the existing [examples](https://github.com/coldrye-es/inxs/tree/master/examples/simpleapp) on how to use this.


## Resources

 - (1) [Github Site](https://github.com/coldrye-es/inxs)
 - (2) [Keith Cirkel on "Why we should stop using Grunt & Gulp"](http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt)
 - (3) [inxs-common](https://github.com/coldrye-es/inxs-common)

