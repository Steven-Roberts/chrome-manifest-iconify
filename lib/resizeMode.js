'use strict';

const jimp = require('jimp');

/**
 * Enum for resize algorithms
 * @readonly
 * @enum
 * @memberof module:chrome-manifest-iconify
 */
const ResizeMode = {
    NEAREST_NEIGHBOR: jimp.RESIZE_NEAREST_NEIGHBOR,
    BILINEAR: jimp.RESIZE_BILINEAR,
    BICUBIC: jimp.RESIZE_BICUBIC,
    HERMITE: jimp.RESIZE_HERMITE,
    BEZIER: jimp.RESIZE_BEZIER
};

module.exports = Object.freeze(ResizeMode);
