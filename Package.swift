// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterMarkdown",
    platforms: [.macOS(.v10_13), .iOS(.v11)],
    products: [
        .library(name: "TreeSitterMarkdown", targets: ["TreeSitterMarkdown"]),
    ],
    dependencies: [],
    targets: [
        .target(name: "TreeSitterMarkdown",
                path: ".",
                exclude: [
                    "binding.gyp",
                    "bindings",
                    "Cargo.toml",
                    "corpus",
                    "examples",
                    "grammar.js",
                    "LICENSE",
                    "Makefile",
                    "package.json",
                    "README.md",
                    "src/grammar.json",
                    "src/node-types.json",
                ],
                sources: [
                    "src/parser.c",
                    "src/scanner.cc",
                ],
                resources: [],
                publicHeadersPath: "bindings/swift",
                cSettings: [.headerSearchPath("src")])
    ]
)
