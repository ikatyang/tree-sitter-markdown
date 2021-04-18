{
  "targets": [
    {
      "target_name": "tree_sitter_markdown_binding",
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "src"
      ],
      "sources": [
        "src/parser.c",
        "bindings/node/binding.cc",
        "src/scanner.cc"
      ],
      "cflags_c": [
        "-std=c99",
        "-fexceptions"
      ],
      "defines": [
        "TREE_SITTER_MARKDOWN_AVOID_CRASH"
      ],
      "conditions": [
        ["OS=='mac'", { "xcode_settings": { "GCC_ENABLE_CPP_EXCEPTIONS": "YES" } }]
      ]
    }
  ]
}
