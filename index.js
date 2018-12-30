'use strict';

/**
 * The chrome-manifest-iconify module
 * @module chrome-manifest-iconify
 * @example
 * const chromeManifestIconify = require('chrome-manifest-iconify');
 *
 * const loadIcons = async () => {
 *     try {
 *         const icons = await chromeManifestIconify.async({
 *             manifest: 'src/manifest.json',
 *             masterIcon: 'img/test-icon.png'
 *         });
 *
 *         // Do stuff with icons
 *         const buffers = await Promise.all(icons.map((i) => i.contents));
 *
 *         console.log(buffers);
 *     } catch (err) {
 *         // Oh, no! Something bad happened
 *         console.error(err);
 *     }
 * };
 */

const Manifest = require('./lib/manifest');
const Icon = require('./lib/icon');

exports.Icon = Icon;

/**
 * Generates icon set for a Chrome extension or app by parsing the v2 manifest.
 * Note that this function does not actually write the files.
 * @async
 * @param {object} options - The options for generating the Icons
 * @param {string} options.manifest - The path to the v2 manifest.json
 * @param {string|Buffer} options.masterIcon - Either a path or Buffer of the
 * master icon from which all the generated icons will be reseized
 * @param {string} [options.outDir] - Base directory of the generated Icons.
 * Defaults to parent directory of manifest
 * @param {string} [options.resizeMode] - The name of a
 * {@link http://sharp.pixelplumbing.com/en/stable/api-resize Sharp kernel}
 * @returns {Promise<module:chrome-manifest-iconify.Icon[]>} A promise that
 * resolves with the generated Icons
 */
exports.async = async (options) => {
    const manifest = await Manifest.load(options.manifest);
    const masterIcon = Icon.load(options.masterIcon);

    return manifest.getIcons(masterIcon, options.resizeMode, options.outDir);
};
