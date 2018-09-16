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
as provide by [JIMP](https://github.com/oliver-moran/jimp) so your entire icon
set looks awesome.

## Installation

```shell
npm install --save-dev chrome-manifest-iconify
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

const printIcons = async () => {
    try {
        const icons = await chromeManifestIconify.async({
            manifest: 'src/manifest.json',
            masterIcon: 'img/test-icon.png',
            resizeMode: chromeManifestIconify.ResizeMode.HERMITE
        });

        // Do stuff with icons
        const buffers = await Promise.all(icons.map((i) => i.contents));

        console.log(buffers);
    } catch (err) {
        // Oh, no! Something bad happened
        console.log(err);
    }
};
```

* [chrome-manifest-iconify](#module_chrome-manifest-iconify)
    * [.Icon](#module_chrome-manifest-iconify.Icon)
        * [new Icon(path, jimpData)](#new_module_chrome-manifest-iconify.Icon_new)
        * [.path](#module_chrome-manifest-iconify.Icon+path) : <code>string</code>
        * [.mimeType](#module_chrome-manifest-iconify.Icon+mimeType) : <code>string</code>
        * [.size](#module_chrome-manifest-iconify.Icon+size) : <code>number</code>
        * [.contents](#module_chrome-manifest-iconify.Icon+contents) : <code>Promise.&lt;Buffer&gt;</code>
        * [.toString()](#module_chrome-manifest-iconify.Icon+toString) ⇒ <code>string</code>
    * [.ResizeMode](#module_chrome-manifest-iconify.ResizeMode)
    * [.async(options)](#module_chrome-manifest-iconify.async) ⇒ <code>Promise.&lt;Array.&lt;module:chrome-manifest-iconify.Icon&gt;&gt;</code>

<a name="module_chrome-manifest-iconify.Icon"></a>

#### chrome-manifest-iconify.Icon
Class representing a Chrome extension or app icon

**Kind**: static class of [<code>chrome-manifest-iconify</code>](#module_chrome-manifest-iconify)  

* [.Icon](#module_chrome-manifest-iconify.Icon)
    * [new Icon(path, jimpData)](#new_module_chrome-manifest-iconify.Icon_new)
    * [.path](#module_chrome-manifest-iconify.Icon+path) : <code>string</code>
    * [.mimeType](#module_chrome-manifest-iconify.Icon+mimeType) : <code>string</code>
    * [.size](#module_chrome-manifest-iconify.Icon+size) : <code>number</code>
    * [.contents](#module_chrome-manifest-iconify.Icon+contents) : <code>Promise.&lt;Buffer&gt;</code>
    * [.toString()](#module_chrome-manifest-iconify.Icon+toString) ⇒ <code>string</code>

<a name="new_module_chrome-manifest-iconify.Icon_new"></a>

##### new Icon(path, jimpData)
Create an Icon


| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The file path to the Icon |
| jimpData | <code>object</code> | The JIMP image data |

<a name="module_chrome-manifest-iconify.Icon+path"></a>

##### icon.path : <code>string</code>
The file path to the Icon

**Kind**: instance property of [<code>Icon</code>](#module_chrome-manifest-iconify.Icon)  
**Read only**: true  
<a name="module_chrome-manifest-iconify.Icon+mimeType"></a>

##### icon.mimeType : <code>string</code>
Gets the MIME type of the Icon

**Kind**: instance property of [<code>Icon</code>](#module_chrome-manifest-iconify.Icon)  
<a name="module_chrome-manifest-iconify.Icon+size"></a>

##### icon.size : <code>number</code>
Gets the size in pixels of the Icons

**Kind**: instance property of [<code>Icon</code>](#module_chrome-manifest-iconify.Icon)  
<a name="module_chrome-manifest-iconify.Icon+contents"></a>

##### icon.contents : <code>Promise.&lt;Buffer&gt;</code>
Asynchronously creates a Buffer for the Icon

**Kind**: instance property of [<code>Icon</code>](#module_chrome-manifest-iconify.Icon)  
<a name="module_chrome-manifest-iconify.Icon+toString"></a>

##### icon.toString() ⇒ <code>string</code>
Gets a human-friendly string representation of the Icon

**Kind**: instance method of [<code>Icon</code>](#module_chrome-manifest-iconify.Icon)  
**Returns**: <code>string</code> - A string representation of the Icon  
<a name="module_chrome-manifest-iconify.ResizeMode"></a>

#### chrome-manifest-iconify.ResizeMode
Enum for resize algorithms

**Kind**: static enum of [<code>chrome-manifest-iconify</code>](#module_chrome-manifest-iconify)  
**Read only**: true  
**Properties**

| Name | Default |
| --- | --- |
| NEAREST_NEIGHBOR | <code>jimp.RESIZE_NEAREST_NEIGHBOR</code> | 
| BILINEAR | <code>jimp.RESIZE_BILINEAR</code> | 
| BICUBIC | <code>jimp.RESIZE_BICUBIC</code> | 
| HERMITE | <code>jimp.RESIZE_HERMITE</code> | 
| BEZIER | <code>jimp.RESIZE_BEZIER</code> | 

<a name="module_chrome-manifest-iconify.async"></a>

#### chrome-manifest-iconify.async(options) ⇒ <code>Promise.&lt;Array.&lt;module:chrome-manifest-iconify.Icon&gt;&gt;</code>
Generates icon set for a Chrome extension or app by parsing the v2 manifest.
Note that this function does not actually write the files.

**Kind**: static method of [<code>chrome-manifest-iconify</code>](#module_chrome-manifest-iconify)  
**Returns**: <code>Promise.&lt;Array.&lt;module:chrome-manifest-iconify.Icon&gt;&gt;</code> - A promise that
resolves with the generated Icons  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | The options for generating the Icons |
| options.manifest | <code>string</code> |  | The path to the v2 manifest.json |
| options.masterIcon | <code>string</code> \| <code>Buffer</code> |  | Either a path or Buffer of the master icon from which all the generated icons will be reseized |
| [options.resizeMode] | [<code>ResizeMode</code>](#module_chrome-manifest-iconify.ResizeMode) | <code>ResizeMode.BILINEAR</code> | The algorithm for resizing the master Icon |


