# chrome-manifest-iconify

[![Build Status](https://travis-ci.org/Steven-Roberts/chrome-manifest-iconify.svg?branch=master)](https://travis-ci.org/Steven-Roberts/chrome-manifest-iconify)
[![dependencies Status](https://david-dm.org/Steven-Roberts/chrome-manifest-iconify/status.svg)](https://david-dm.org/Steven-Roberts/chrome-manifest-iconify)
[![devDependencies Status](https://david-dm.org/Steven-Roberts/chrome-manifest-iconify/dev-status.svg)](https://david-dm.org/Steven-Roberts/chrome-manifest-iconify?type=dev)

Takes a master icon and automatically generates icon set for your Chrome
extension or app by parsing the v2 manifest

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

