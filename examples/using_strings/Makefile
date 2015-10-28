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


.PHONY: clean clean-dist deps dist


# cleans both the build and dist directory 
clean: clean-dist


# internal
clean-dist:
	@echo "cleaning dist..."
	@-rm -Rf $(dist_dir)


# installs local (dev) dependencies
deps:
	@echo "installing local (dev) dependencies..."
	@npm install 


# creates the distribution
dist: clean-dist
	@echo "creating distribution..."
	@BABEL_ENV="DIST" babel -d $(dist_dir) $(src_dir)
	@echo "to run, enter ./bin/simpleapp"
