# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [0.2.0](https://github.com/ikatyang/tree-sitter-markdown/compare/v0.1.1...v0.2.0) (2019-10-01)


### Performance Improvements

* reduce the number of lookahead chars for parsing `task_list_item`s ([37e92ff](https://github.com/ikatyang/tree-sitter-markdown/commit/37e92ff))


### BREAKING CHANGES

* `checkbox`s are renamed with `task_list_item_marker`
* `task_list_item_marker`s are now part of the first `paragraph` in `task_list_item`s



## [0.1.1](https://github.com/ikatyang/tree-sitter-markdown/compare/v0.1.0...v0.1.1) (2019-10-01)


### Performance Improvements

* remove unnecessary buffering for block-level scanning ([b92a780](https://github.com/ikatyang/tree-sitter-markdown/commit/b92a780))



## 0.1.0 (2019-09-30)


### Features

* initial implementation ([a794f46](https://github.com/ikatyang/tree-sitter-markdown/commit/a794f46))
