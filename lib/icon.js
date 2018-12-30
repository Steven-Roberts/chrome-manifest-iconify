'use strict';

const {extname} = require('path');
const sharp = require('sharp');

/**
 * Class representing a Chrome extension icon
 * @memberof module:chrome-manifest-iconify
 */
class Icon {

    /**
     * Create an Icon
     * @private
     * @param {string} path - The file path to the Icon
     * @param {object} data - The Sharp image data
     */
    constructor (path, data) {
        /**
         * The file path to the Icon
         * @readonly
         * @type {string}
         */
        this.path = path;

        /**
         * The Sharp image data
         * @private
         * @readonly
         * @type {object}
         */
        this.data = data;
    }

    /**
     * A static helper function that loads an Icon from a file
     * @private
     * @async
     * @param {string|Buffer} path - Either a path or Buffer of the Icon
     * @returns {Icon} The loaded Icon
     */
    static load (path) {
        return new Icon(Buffer.isBuffer(path) ? null : path, sharp(path));
    }

    /**
     * Asynchronously creates a Buffer for the Icon
     * @type {Promise<Buffer>}
     */
    get contents () {
        return this.data.toFormat(extname(this.path).substring(1)).toBuffer();
    }

    /**
     * Writes an Icon to its path
     * @async
     * @returns {Promise} Promise that resolves when the Icon is written
     */
    write () {
        return this.data.toFile(this.path);
    }

    /**
     * Create a new Icon that is a resized version of this Icon
     * @private
     * @param {string|number} size - The size of the new Icon in pixels
     * @param {string} path - The file path to the new Icon
     * @param {string} [resizeMode] The algorithm for resizing the master Icon
     * @returns {Icon} The resized Icon
     */
    resize (size, path, resizeMode) {
        return new Icon(path, this.data.clone().resize({
            width: size,
            height: size,
            kernel: sharp.kernel[resizeMode]
        }));
    }

}

module.exports = Icon;
