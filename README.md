# chrome-manifest-iconify

[![NPM version](https://img.shields.io/npm/v/chrome-manifest-iconify.svg)](https://www.npmjs.com/package/chrome-manifest-iconify)
[![node](https://img.shields.io/node/v/chrome-manifest-iconify.svg)](https://www.npmjs.com/package/chrome-manifest-iconify)
[![Build Status](https://travis-ci.org/Steven-Roberts/chrome-manifest-iconify.svg?branch=master)](https://travis-ci.org/Steven-Roberts/chrome-manifest-iconify)
[![Coverage Status](https://coveralls.io/repos/github/Steven-Roberts/chrome-manifest-iconify/badge.svg)](https://coveralls.io/github/Steven-Roberts/chrome-manifest-iconify)
[![dependencies Status](https://david-dm.org/Steven-Roberts/chrome-manifest-iconify/status.svg)](https://david-dm.org/Steven-Roberts/chrome-manifest-iconify)
[![devDependencies Status](https://david-dm.org/Steven-Roberts/chrome-manifest-iconify/dev-status.svg)](https://david-dm.org/Steven-Roberts/chrome-manifest-iconify?type=dev)

When creating a Chrome extension or app, you need to provide a set of icons for
context menus, browser actions, page actions, and the Chrome Web Store. Usually,
these are just resized versions of the same image. The goal of
chrome-manifest-iconify is to intelligently handle the tedious process of
generated all these resized clones. All you need to do is provide it a master
icon and [v2 manifest](https://developer.chrome.com/extensions/manifest) file.
It will parse the manifest to determine the sizes, names, types, and paths of
the icons it needs to generate. You can choose from several resizing algorithms
as provided by [Sharp](https://sharp.dimens.io/en/stable/) so your entire icon
set looks awesome.

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

* [chrome-manifest-iconify](#module_chrome-manifest-iconify)
    * [.Icon](#module_chrome-manifest-iconify.Icon)
        * [new Icon(path, data)](#new_module_chrome-manifest-iconify.Icon_new)
        * [.path](#module_chrome-manifest-iconify.Icon+path) : <code>string</code>
        * [.contents](#module_chrome-manifest-iconify.Icon+contents) : <code>Promise.&lt;Buffer&gt;</code>
        * [.write()](#module_chrome-manifest-iconify.Icon+write) ⇒ <code>Promise</code>
    * [.async(options)](#module_chrome-manifest-iconify.async) ⇒ <code>Promise.&lt;Array.&lt;module:chrome-manifest-iconify.Icon&gt;&gt;</code>

<a name="module_chrome-manifest-iconify.Icon"></a>

#### chrome-manifest-iconify.Icon
Class representing a Chrome extension icon

**Kind**: static class of [<code>chrome-manifest-iconify</code>](#module_chrome-manifest-iconify)  

* [.Icon](#module_chrome-manifest-iconify.Icon)
    * [new Icon(path, data)](#new_module_chrome-manifest-iconify.Icon_new)
    * [.path](#module_chrome-manifest-iconify.Icon+path) : <code>string</code>
    * [.contents](#module_chrome-manifest-iconify.Icon+contents) : <code>Promise.&lt;Buffer&gt;</code>
    * [.write()](#module_chrome-manifest-iconify.Icon+write) ⇒ <code>Promise</code>

<a name="new_module_chrome-manifest-iconify.Icon_new"></a>

##### new Icon(path, data)
Create an Icon


| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The file path to the Icon |
| data | <code>object</code> | The Sharp image data |

<a name="module_chrome-manifest-iconify.Icon+path"></a>

##### icon.path : <code>string</code>
The file path to the Icon

**Kind**: instance property of [<code>Icon</code>](#module_chrome-manifest-iconify.Icon)  
**Read only**: true  
<a name="module_chrome-manifest-iconify.Icon+contents"></a>

##### icon.contents : <code>Promise.&lt;Buffer&gt;</code>
Asynchronously creates a Buffer for the Icon

**Kind**: instance property of [<code>Icon</code>](#module_chrome-manifest-iconify.Icon)  
<a name="module_chrome-manifest-iconify.Icon+write"></a>

##### icon.write() ⇒ <code>Promise</code>
Writes an Icon to its path

**Kind**: instance method of [<code>Icon</code>](#module_chrome-manifest-iconify.Icon)  
**Returns**: <code>Promise</code> - Promise that resolves when the Icon is written  
<a name="module_chrome-manifest-iconify.async"></a>

#### chrome-manifest-iconify.async(options) ⇒ <code>Promise.&lt;Array.&lt;module:chrome-manifest-iconify.Icon&gt;&gt;</code>
Generates icon set for a Chrome extension or app by parsing the v2 manifest.
Note that this function does not actually write the files.

**Kind**: static method of [<code>chrome-manifest-iconify</code>](#module_chrome-manifest-iconify)  
**Returns**: <code>Promise.&lt;Array.&lt;module:chrome-manifest-iconify.Icon&gt;&gt;</code> - A promise that
resolves with the generated Icons  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | The options for generating the Icons |
| options.manifest | <code>string</code> | The path to the v2 manifest.json |
| options.masterIcon | <code>string</code> \| <code>Buffer</code> | Either a path or Buffer of the master icon from which all the generated icons will be reseized |
| [options.outDir] | <code>string</code> | Base directory of the generated Icons. Defaults to parent directory of manifest |
| [options.resizeMode] | <code>string</code> | The name of a [Sharp kernel](http://sharp.pixelplumbing.com/en/stable/api-resize) |


