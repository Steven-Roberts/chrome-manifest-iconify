'use strict';

/**
 * The chrome-manifest-iconify module
 * @module chrome-manifest-iconify
 * @example
 * const chromeManifestIconify = require('chrome-manifest-iconify');
 *
 * chromeManifestIconify.async({
 *     manifest: 'src/manifest.json',
 *     masterIcon: 'master.png',
 *     resizeMode: 'hermiteInterpolation'
 * }).then((icons) => {
 *     // Do stuff with icons
 *     icons.forEach(console.log);
 * }).catch((err) => {
 *     // Oh, no! Something bad happened
 *     console.log(err);
 * });
 */

// Local imports
const Manifest = require('./lib/manifest');
const Icon = require('./lib/icon');
const ResizeMode = require('./lib/resizeMode');

// Node imports
const Promise = require('bluebird');
const _ = require('lodash');

exports.Icon = Icon;
exports.ResizeMode = ResizeMode;

/**
 * Generates icon set for a Chrome extension or app by parsing the v2 manifest.
 * Note that this function does not actually write the files.
 * @param {object} options - The options for generating the Icons
 * @param {string} options.manifest - The path to the v2 manifest.json
 * @param {string|Buffer} options.masterIcon - Either a path or Buffer of the
 * master icon from which all the generated icons will be reseized
 * @param {module:chrome-manifest-iconify.ResizeMode}
 * [options.resizeMode=ResizeMode.RESIZE_BILINEAR] - The algorithm for resizing
 * the master Icon
 * @returns {Promise<module:chrome-manifest-iconify.Icon>} A promise that
 * resolves with the generated Icons
 */
exports.async = (options) => {
    // Validate options object
    if (!_.isObject(options)) {
        throw new TypeError('Options must be an object');
    }

    // Return a promise of the Icons
    return Promise.join(
        Manifest.load(options.manifest),
        Icon.load(options.masterIcon),
        (manifest, masterIcon) =>
            manifest.getIcons(masterIcon, options.resizeMode)
    );
};
