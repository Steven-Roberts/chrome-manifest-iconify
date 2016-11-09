# chrome-manifest-iconify

[![NPM version](https://img.shields.io/npm/v/chrome-manifest-iconify.svg?style=flat)](https://www.npmjs.com/package/chrome-manifest-iconify)
[![Build Status](https://travis-ci.org/Steven-Roberts/chrome-manifest-iconify.svg?branch=master)](https://travis-ci.org/Steven-Roberts/chrome-manifest-iconify)
[![dependencies Status](https://david-dm.org/Steven-Roberts/chrome-manifest-iconify/status.svg)](https://david-dm.org/Steven-Roberts/chrome-manifest-iconify)
[![devDependencies Status](https://david-dm.org/Steven-Roberts/chrome-manifest-iconify/dev-status.svg)](https://david-dm.org/Steven-Roberts/chrome-manifest-iconify?type=dev)
[![Test Coverage](https://codeclimate.com/github/Steven-Roberts/chrome-manifest-iconify/badges/coverage.svg)](https://codeclimate.com/github/Steven-Roberts/chrome-manifest-iconify/coverage)
[![Code Climate](https://codeclimate.com/github/Steven-Roberts/chrome-manifest-iconify/badges/gpa.svg)](https://codeclimate.com/github/Steven-Roberts/chrome-manifest-iconify)

When creating a Chrome extension or app, you need to provide a set of icons for
browser actions, page actions, context menus, and other places. Usually,
these are just the same image resized. chrome-manifest-iconify is designed to
simplify the process of creating all these icons by properly resizing them for
you. Just provide it a master icon and the v2 manifest file. It will parse
the manifest to determine all the icon sizes, names, and paths. You can choose
from several resizing algorithms as provide by
[JIMP](https://github.com/oliver-moran/jimp).

## Installation
```shell
$ npm install --save-dev chrome-manifest-iconify
```

## API
<a name="exp_module_chrome-manifest-iconify--module.exports"></a>

### module.exports(options) ⇒ <code>Promise.&lt;Array.&lt;Vinyl&gt;&gt;</code> ⏏
Generates icon set for a Chrome extension or app by parsing the v2 manifest

**Kind**: Exported function  
**Returns**: <code>Promise.&lt;Array.&lt;Vinyl&gt;&gt;</code> - A promise that resolves with the generated iconsas an array of [Vinyl](https://github.com/gulpjs/vinyl) files  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | The options for generating the icons |
| options.manifest | <code>string</code> | The path to the v2 manifest.json |
| options.masterIcon | <code>string</code> &#124; <code>Buffer</code> | Either a path or buffer of the master icon from which all the generated icons will be reseized |
| [options.resizeMode] | <code>&#x27;nearestNeighbor&#x27;</code> &#124; <code>&#x27;bilinearInterpolation&#x27;</code> &#124; <code>&#x27;bicubicInterpolation&#x27;</code> &#124; <code>&#x27;hermiteInterpolation&#x27;</code> &#124; <code>&#x27;bezierInterpolation&#x27;</code> | The algorithm for resizing the master icon |

