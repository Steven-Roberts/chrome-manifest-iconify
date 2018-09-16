'use strict';

/**
 * The chrome-manifest-iconify module
 * @module chrome-manifest-iconify
 * @example
 * const chromeManifestIconify = require('chrome-manifest-iconify');
 *
 * const printIcons = async () => {
 *     try {
 *         const icons = await chromeManifestIconify.async({
 *             manifest: 'src/manifest.json',
 *             masterIcon: 'img/test-icon.png',
 *             resizeMode: chromeManifestIconify.ResizeMode.HERMITE
 *         });
 *
 *         // Do stuff with icons
 *         const buffers = await Promise.all(icons.map((i) => i.contents));
 *
 *         console.log(buffers);
 *     } catch (err) {
 *         // Oh, no! Something bad happened
 *         console.log(err);
 *     }
 * };
 */

const Manifest = require('./lib/manifest');
const Icon = require('./lib/icon');
const ResizeMode = require('./lib/resizeMode');

exports.Icon = Icon;
exports.ResizeMode = ResizeMode;

/**
 * Generates icon set for a Chrome extension or app by parsing the v2 manifest.
 * Note that this function does not actually write the files.
 * @async
 * @param {object} options - The options for generating the Icons
 * @param {string} options.manifest - The path to the v2 manifest.json
 * @param {string|Buffer} options.masterIcon - Either a path or Buffer of the
 * master icon from which all the generated icons will be reseized
 * @param {module:chrome-manifest-iconify.ResizeMode}
 * [options.resizeMode=ResizeMode.BILINEAR] - The algorithm for resizing the
 * master Icon
 * @returns {Promise<module:chrome-manifest-iconify.Icon[]>} A promise that
 * resolves with the generated Icons
 */
exports.async = async (options) => (await Manifest.load(options.manifest))
    .getIcons(await Icon.load(options.masterIcon), options.resizeMode);
