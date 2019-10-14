# tree-sitter-markdown

[![npm](https://img.shields.io/npm/v/tree-sitter-markdown.svg)](https://www.npmjs.com/package/tree-sitter-markdown)
[![build](https://img.shields.io/travis/com/ikatyang/tree-sitter-markdown/master.svg)](https://travis-ci.com/ikatyang/tree-sitter-markdown/builds)

Markdown ([CommonMark Spec v0.29-gfm](https://github.github.com/gfm/)) grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter)

_Note: This grammar is based on the assumption that **[link label matchings](https://github.github.com/gfm/#matches) will never fail** since reference links can come before their reference definitions, which causes it hard to do incremental parsing without this assumption._

[Changelog](https://github.com/ikatyang/tree-sitter-markdown/blob/master/CHANGELOG.md)

## Install

```sh
npm install tree-sitter-markdown tree-sitter
```

## Usage

```js
const Parser = require("tree-sitter");
const Markdown = require("tree-sitter-markdown");

const parser = new Parser();
parser.setLanguage(Markdown);

const sourceCode = `
# foo
-     bar
  baz
`;

const tree = parser.parse(sourceCode);
console.log(tree.rootNode.toString());
// (document
//   (atx_heading
//     (atx_heading_marker)
//     (heading_content
//       (text)))
//   (tight_list
//     (list_item
//       (list_marker)
//       (indented_code_block
//         (text))
//       (paragraph
//         (text)))))
```

## License

MIT © [Ika](https://github.com/ikatyang)
