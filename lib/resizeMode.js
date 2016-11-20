'use strict';

const jimp = require('jimp');

/**
 * Enum for resize algorithms
 * @readonly
 * @enum
 * @memberof module:chrome-manifest-iconify
 */
const ResizeMode = {
    RESIZE_NEAREST_NEIGHBOR: jimp.RESIZE_NEAREST_NEIGHBOR,
    RESIZE_BILINEAR: jimp.RESIZE_BILINEAR,
    RESIZE_BICUBIC: jimp.RESIZE_BICUBIC,
    RESIZE_HERMITE: jimp.RESIZE_HERMITE,
    RESIZE_BEZIER: jimp.RESIZE_BEZIER
};

module.exports = Object.freeze(ResizeMode);
