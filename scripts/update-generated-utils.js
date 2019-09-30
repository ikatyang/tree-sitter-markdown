const fs = require("fs");
const unicodeRegex = require("unicode-regex");
const blockData = require("./update-generated-utils.block-data.json");
const inlineData = require("./update-generated-utils.inline-data.json");

//==============================================================================

fs.writeFileSync(
  "./src/tree_sitter_markdown/block_scan_util.generated.h",
  [
    "#ifndef TREE_SITTER_MARKDOWN_BLOCK_SCAN_UTIL_GENERATED_H_",
    "#define TREE_SITTER_MARKDOWN_BLOCK_SCAN_UTIL_GENERATED_H_",
    "",
    '#include "./lexer.h"',
    "",
    "namespace tree_sitter_markdown {",
    "",
    "void adv_blk_htm_tag_nam(Lexer &lexer, LexedLength &script_length, LexedLength &div_length);",
    "",
    "}",
    "",
    "#endif // TREE_SITTER_MARKDOWN_BLOCK_SCAN_UTIL_GENERATED_H_",
    "",
  ].join("\n"),
);

fs.writeFileSync(
  "./src/tree_sitter_markdown/block_scan_util.generated.cc",
  [
    '#include "./block_scan_util.generated.h"',
    "",
    "namespace tree_sitter_markdown {",
    "",
    generateScanUtil(
      "void adv_blk_htm_tag_nam(Lexer &lxr, LexedLength &scr_len, LexedLength &div_len)",
      [[blockData.scr, "scr_len"], [blockData.div, "div_len"]],
      false,
    ),
    "}",
    "",
  ].join("\n"),
);

//==============================================================================

fs.writeFileSync(
  "./src/tree_sitter_markdown/inline_scan_util.generated.h",
  [
    "#ifndef TREE_SITTER_MARKDOWN_INLINE_SCAN_UTIL_GENERATED_H_",
    "#define TREE_SITTER_MARKDOWN_INLINE_SCAN_UTIL_GENERATED_H_",
    "",
    '#include "./lexer.h"',
    "",
    "namespace tree_sitter_markdown {",
    "",
    "void adv_inl_ent_ref_nam(Lexer &lexer, LexedLength &entity_reference_length);",
    "",
    "}",
    "",
    "#endif // TREE_SITTER_MARKDOWN_INLINE_SCAN_UTIL_GENERATED_H_",
    "",
  ].join("\n"),
);

fs.writeFileSync(
  "./src/tree_sitter_markdown/inline_scan_util.generated.cc",
  [
    '#include "./inline_scan_util.generated.h"',
    "",
    "namespace tree_sitter_markdown {",
    "",
    generateScanUtil(
      "void adv_inl_ent_ref_nam(Lexer &lxr, LexedLength &ent_ref_len)",
      [[inlineData, "ent_ref_len"]],
      true,
    ),
    "}",
    "",
  ].join("\n"),
);

//==============================================================================

const predicateFunctionNameToCategoriesMap = {
  // http://unicode.org/Public/5.1.0/ucd/UCD.html#General_Category_Values
  is_unicode_Zs: ["Space_Separator"],
  is_unicode_Pc_Pd_Pe_Pf_Pi_Po_Ps: [
    /* Pc */ "Connector_Punctuation",
    /* Pd */ "Dash_Punctuation",
    /* Pe */ "Close_Punctuation",
    /* Pf */ "Final_Punctuation",
    /* Pi */ "Initial_Punctuation",
    /* Po */ "Other_Punctuation",
    /* Ps */ "Open_Punctuation",
  ],
};

fs.writeFileSync(
  "./src/tree_sitter_markdown/predicate_util.generated.h",
  [
    "#ifndef TREE_SITTER_MARKDOWN_PREDICATE_UTIL_GENERATED_H_",
    "#define TREE_SITTER_MARKDOWN_PREDICATE_UTIL_GENERATED_H_",
    "",
    '#include "./shared_type.h"',
    "",
    "namespace tree_sitter_markdown {",
    "",
    ...Object.keys(predicateFunctionNameToCategoriesMap).map(
      fnName => `bool ${fnName}(LexedCharacter character);`,
    ),
    "",
    "}",
    "",
    "#endif // TREE_SITTER_MARKDOWN_PREDICATE_UTIL_GENERATED_H_",
    "",
  ].join("\n"),
);

fs.writeFileSync(
  "./src/tree_sitter_markdown/predicate_util.generated.cc",
  [
    '#include "./predicate_util.generated.h"',
    "",
    "namespace tree_sitter_markdown {",
    "",
    generatePredicateUtil(predicateFunctionNameToCategoriesMap),
    "",
    "}",
    "",
  ].join("\n"),
);

//==============================================================================

function generateScanUtil(functionSignature, pathData, isCaseSensitive) {
  let output = "";

  const namePath = [[], {}];

  for (const [names, lengthId] of pathData) {
    for (const name of names) {
      let currentPath = namePath;
      for (let i = 0; i < name.length; i++) {
        const char = name[i];
        const subPath = currentPath[1];
        if (!(char in subPath)) {
          subPath[char] = [[], {}];
        }
        currentPath = subPath[char];
      }
      currentPath[0] = [`${lengthId} = ${name.length}; /*${name}*/`];
    }
  }

  function append(text) {
    output += text + "\n";
  }

  function appendNamePath([actions, namePath], indent = "") {
    let isFirst = true;
    for (const action of actions) {
      append(indent + action);
    }
    for (const char of Object.keys(namePath)) {
      if (isCaseSensitive || (char >= "0" && char <= "9")) {
        append(
          `${indent}${isFirst ? "" : "else "}if (lxr.adv_if('${char}')) {`,
        );
      } else {
        append(
          `${indent}${
            isFirst ? "" : "else "
          }if (lxr.adv_if('${char.toLowerCase()}') || lxr.adv_if('${char.toUpperCase()}')) {`,
        );
      }
      appendNamePath(namePath[char], indent + "  ");
      append(`${indent}}`);
      isFirst = false;
    }
  }

  append(`${functionSignature} {`);
  appendNamePath(namePath, "  ");
  append("}");

  return output;
}

function generatePredicateUtil(functionNameToCategoriesMap) {
  return Object.entries(functionNameToCategoriesMap)
    .map(([functionName, categories]) => generate(functionName, categories))
    .join("\n");
  function generate(functionName, categories) {
    const { data } = unicodeRegex({ General_Category: categories });
    return `bool ${functionName}(LexedCharacter c) { return ${data
      .map(([start, end]) =>
        start === end
          ? `c == 0x${start.toString(16)}`
          : `(c >= 0x${start.toString(16)} && c <= 0x${end.toString(16)})`,
      )
      .join(" || ")}; }`;
  }
}
