# dreamwiki-syntax README

Visual studio code plugin for basic syntax highlighting of  [`dreamwiki`.](https://github.com/free-ghz/dreamwiki).

Will autocomplete ^ and highlights a couple of the different parts of the markup, but ultimately it's very simple as dreamwiki itself is quite simple.

## Todo (maybe)
- Maybe add autocomplete for the different options for tags
- Add hover text for various things

## Build
Compile extension:
```bash
npm install -g vsce
git clone https://github.com/brod8362/dreamwiki-syntax
cd dreamwiki-syntax
vsce package
code --install-extension dreamwiki-syntax-VERSION.vsix
```
(or just find it in the releases and install in Visual Studio Code via `File > Preferences > Extensions > ... > Install from VSIX...`)