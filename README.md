# chrome-manifest-iconify

[![NPM version](https://img.shields.io/npm/v/chrome-manifest-iconify.svg)](https://www.npmjs.com/package/chrome-manifest-iconify)
[![node](https://img.shields.io/node/v/chrome-manifest-iconify.svg)](https://www.npmjs.com/package/chrome-manifest-iconify)
[![Build Status](https://travis-ci.org/Steven-Roberts/chrome-manifest-iconify.svg?branch=master)](https://travis-ci.org/Steven-Roberts/chrome-manifest-iconify)
[![Coverage Status](https://coveralls.io/repos/github/Steven-Roberts/chrome-manifest-iconify/badge.svg)](https://coveralls.io/github/Steven-Roberts/chrome-manifest-iconify)
[![dependencies Status](https://david-dm.org/Steven-Roberts/chrome-manifest-iconify/status.svg)](https://david-dm.org/Steven-Roberts/chrome-manifest-iconify)
[![devDependencies Status](https://david-dm.org/Steven-Roberts/chrome-manifest-iconify/dev-status.svg)](https://david-dm.org/Steven-Roberts/chrome-manifest-iconify?type=dev)

When creating a Chrome extension, you need to provide a set of icons for context menus, browser actions, page actions, and the Chrome Web Store. Usually, these are just resized versions of the same image. The goal of chrome-manifest-iconify is to intelligently handle the tedious process of generated all these resized clones. All you need to do is provide it a master icon and [v2 manifest](https://developer.chrome.com/extensions/manifest) file.  It will parse the manifest to determine the sizes, names, types, and paths of the icons it needs to generate. You can choose from several resizing algorithms as provided by [Sharp](https://sharp.dimens.io/en/stable/) so your entire icon set looks awesome.

## Installation

```shell
npm install --save-dev chrome-manifest-iconify
```

## CLI

```shell
Options:
  --help             Show help                                         [boolean]
  --version          Show version number                               [boolean]
  -i, --master-icon  Path to the master icon                 [string] [required]
  -m, --manifest     Path to the v2 manifest.json
                                             [string] [default: "manifest.json"]
  -r, --resize-mode  Algorithm for resizing the master icon
     [choices: "nearest", "cubic", "mitchell", "lanczos2", "lanczos3"] [default:
                                                                     "lanczos3"]
  -o, --out-dir      Directory to write the icons                       [string]

Examples:
  chrome-manifest-iconify -i master.svg
  chrome-manifest-iconify -i master.jpg -m src/manifest.json -r nearest -o
  build/icons
```

## Gulp

Instead of directly using this API, you might find it easier to use the
[Gulp](https://github.com/gulpjs/gulp) plugin
[gulp-chrome-manifest-iconify](https://github.com/Steven-Roberts/gulp-chrome-manifest-iconify)
for your project.

## API

<a name="module_chrome-manifest-iconify"></a>

### chrome-manifest-iconify
The chrome-manifest-iconify module

**Example**  
```js
const chromeManifestIconify = require('chrome-manifest-iconify');

const loadIcons = async () => {
  try {
    const icons = await chromeManifestIconify.async({
      manifest: 'src/manifest.json',
      masterIcon: 'img/test-icon.png'
    });

    // Do stuff with icons
    const buffers = await Promise.all(icons.map((i) => i.contents));

    console.log(buffers);
  } catch (err) {
    // Oh, no! Something bad happened
    console.error(err);
  }
};
```
<a name="module_chrome-manifest-iconify.async"></a>

#### chrome-manifest-iconify.async(options) ⇒ <code>Promise.&lt;Array.&lt;module:chrome-manifest-iconify.Icon&gt;&gt;</code>
Generates icon set for a Chrome extension by parsing the v2 manifest.  Note
that this function does not actually write the files.

**Kind**: static method of [<code>chrome-manifest-iconify</code>](#module_chrome-manifest-iconify)  
**Returns**: <code>Promise.&lt;Array.&lt;module:chrome-manifest-iconify.Icon&gt;&gt;</code> - A promise that
resolves with the generated Icons  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | The options for generating the Icons |
| options.manifest | <code>string</code> | The path to the v2 manifest.json |
| options.masterIcon | <code>string</code> \| <code>Buffer</code> | Either a path or Buffer of the master icon from which all the generated icons will be reseized |
| [options.outDir] | <code>string</code> | Base directory of the generated Icons. Defaults to parent directory of manifest |
| [options.resizeMode] | <code>string</code> | The name of a [https://sharp.pixelplumbing.com/api-resize#resize](https://sharp.pixelplumbing.com/api-resize#resize) |


