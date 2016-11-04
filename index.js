'use strict';

/**
 * The chrome-manifest-iconify module
 * @module chrome-manifest-iconify
 */

// Local imports
const Manifest = require('./lib/manifest');
const Icon = require('./lib/icon');

// Node imports
const Promise = require('bluebird');
const _ = require('lodash');
const path = require('path');

/**
 * Generates icon set for a Chrome extension or app by parsing the v2 manifest
 * @param {object} options - The options for generating the icons
 * @param {string} options.manifest - The path to the v2 manifest.json
 * @param {string|Buffer} options.masterIcon - Either a path or buffer of the
 * master icon from which all the generated icons will be reseized
 * @param {('nearestNeighbor'|'bilinearInterpolation'|'bicubicInterpolation'|
 * 'hermiteInterpolation'|'bezierInterpolation')} [options.resizeMode] - The
 * algorithm for
 * resizing the master icon
 * @returns {Promise<Vinyl[]>} A promise that resolves with the generated icons
 * as an array of [Vinyl]{@link https://github.com/gulpjs/vinyl} files
 */
module.exports = (options) => {
    // Validate options object
    if (!_.isObject(options)) {
        throw new TypeError('Options must be an object');
    }

    // Return a promise of the icons
    return Promise.join(Manifest.load(options.manifest),
        Icon.load(options.masterIcon),
        (manifest, masterIcon) => Promise.map(manifest.icons,
            (manifestIcon) => manifestIcon
                .resizeFrom(masterIcon, options.resizeMode)
                .toFile(path.dirname(options.manifest)))
    );
};
