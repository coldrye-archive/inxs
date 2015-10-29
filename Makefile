# vim: noexpandtab:ts=4:sw=4

# Copyright 2015 Carsten Klein
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


build_dir       = ./build
build_cover_dir = $(build_dir)/cover
build_doc_dir   = $(build_dir)/doc
build_devdoc_dir= $(build_dir)/devdoc
build_src_dir   = $(build_dir)/src
build_test_dir  = $(build_dir)/test
dist_dir        = ./lib
src_dir         = ./src
test_dir        = ./test
watchdog        = $(build_dir)/watchdog


.PHONY: build build-cover build-doc build-devdoc build-src build-test \
		check-cover clean clean-build clean-cover clean-dist cover \
        deps deps-global deps-global-travis dist doc devdoc lint test \
		test-run watch watch-run publish check-master


# transpiles both src and test
build: build-src build-test


# internal
build-cover:
	@echo "gathering coverage data..."
	@babel-istanbul cover _mocha $(build_dir)/test/*


# internal
build-doc: $(src_dir)/*
	@echo "building docs..."
	@esdoc -c .esdoc.json >/dev/null


# internal
build-devdoc: $(src_dir)/*
	@echo "building dev docs..."
	@esdoc -c .esdoc-dev.json >/dev/null


# internal
build-src: $(build_src_dir)/*


# internal
build-test: $(build_test_dir)/*


# internal
check-cover: $(build_cover_dir)
	@echo "checking coverage..."
	@babel-istanbul check-coverage


# cleans both the build and dist directory 
clean: clean-build clean-dist


# internal
clean-build:
	@echo "cleaning build..."
	@-rm -Rf $(build_dir)


# internal
clean-cover:
	@echo "cleaning coverage data..."
	@-rm -Rf $(build_cover_dir)


# internal
clean-dist:
	@echo "cleaning dist..."
	@-rm -Rf $(dist_dir)


# internal
clean-doc:
	@echo "cleaning docs..."
	@-rm -Rf $(build_doc_dir)


# internal
clean-devdoc:
	@echo "cleaning dev docs..."
	@-rm -Rf $(build_devdoc_dir})


# generates the coverage data
cover: clean build build-cover check-cover


# installs local (dev) dependencies
deps:
	@echo "installing local (dev) dependencies..."
	@npm install 


# installs global dev dependencies
deps-global:
	@echo "installing global dev dependencies (sudo)..."
	@sudo npm -g install $(shell node -e " \
		var pkg = require('./package.json'); \
		var deps = []; \
        for (var key in pkg.globalDevDependencies) { \
			var version = pkg.globalDevDependencies[key]; \
			if (version.indexOf('/') != -1) { \
				deps.push(version); \
			} \
			else { \
				deps.push(key + '@' + version); \
			} \
		} \
		console.log(deps.join(' ')); \
    ")


deps-global-travis:
	@echo "installing global dev dependencies (travis)..."
	@npm -g install $(shell node -e " \
		var pkg = require('./package.json'); \
		var deps = []; \
        for (var key in pkg.globalDevDependencies) { \
			var version = pkg.globalDevDependencies[key]; \
			if (version.indexOf('/') != -1) { \
				deps.push(version); \
			} \
			else { \
				deps.push(key + '@' + version); \
			} \
		} \
		console.log(deps.join(' ')); \
    ")


# creates the distribution
dist: clean-dist test cover
	@echo "creating distribution..."
	@BABEL_ENV="DIST" babel -d $(dist_dir) $(src_dir) >/dev/null


# creates the apidocs
doc: clean-doc build-doc


# creates the dev apidocs
devdoc: clean-devdoc build-devdoc


# runs lint
lint: $(src_dir)/* $(test_dir)/*
	@echo "linting..."
	@eslint $?


publish: check-master clean dist
	@MASTER=1 npm publish


check-master:
	@echo "must be on master branch"
	@git branch | grep "^[*] master"


# tests everything
test: lint test-run 


# internal
test-run: $(test_dir)/*
	@echo "running tests..."
	@BABEL_ENV="TEST" mocha --compilers js:babel/register $?


# runs a perpetual watch on the sources and builds
watch: clean
	@echo "watching... (CTRL-C to abort)"
	@-mkdir $(build_dir)
	@while true; do make --quiet watch-run; sleep 1; done


# internal
watch-run: $(watchdog)
	@touch $?


# internal
$(watchdog): $(src_dir)/* $(test_dir)/* $(build_src_dir)/* $(build_test_dir)/*
	@-make cover
	@echo "watching... (CTRL-C to abort)"


# internal
$(build_src_dir)/*: $(src_dir)/*
	@echo "building sources..."
	@-mkdir -p $(build_src_dir)
	@cp $? $(build_src_dir)


# internal
$(build_test_dir)/*: $(test_dir)/*
	@echo "building tests..."
	@BABEL_ENV="BUILD" babel -d $(build_dir) $? >/dev/null

