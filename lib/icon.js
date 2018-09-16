'use strict';

const mime = require('mime');
const jimp = require('jimp');

/**
 * Class representing a Chrome extension or app icon
 * @memberof module:chrome-manifest-iconify
 */
class Icon {

    /**
     * Create an Icon
     * @private
     * @param {string} path - The file path to the Icon
     * @param {object} jimpData - The JIMP image data
     */
    constructor (path, jimpData) {
        /**
         * The file path to the Icon
         * @readonly
         * @type {string}
         */
        this.path = path;

        const {width, height} = jimpData.bitmap;

        if (width !== height) {
            throw new Error(`The icon has size ${width}x${height}, which is \
not square`);
        }

        /**
         * @private
         * The JIMP image data
         * @readonly
         * @type {object}
         */
        this.jimpData = jimpData;
    }

    /**
     * A static helper function that loads an Icon from a file
     * @private
     * @async
     * @param {string|Buffer} file - Either a path or Buffer of the Icon
     * @returns {Promise<Icon>} A promise that resolves when the Icon loads
     */
    static async load (file) {
        const jimpData = await jimp.read(file);
        const path = typeof file === 'string' || file instanceof String
            ? file
            : null;

        return new Icon(path, jimpData);
    }

    /**
     * Gets the MIME type of the Icon
     * @type {string}
     */
    get mimeType () {
        return mime.getType(this.path);
    }

    /**
     * Gets the size in pixels of the Icons
     * @type {number}
     */
    get size () {
        return this.jimpData.bitmap.height;
    }

    /**
     * Asynchronously creates a Buffer for the Icon
     * @type {Promise<Buffer>}
     */
    get contents () {
        return this.jimpData.getBufferAsync(this.mimeType);
    }

    /**
     * Create a new Icon that is a resized version of this Icon
     * @private
     * @param {string|number} size - The size of the new Icon in pixels
     * @param {string} path - The file path to the new Icon
     * @param {module:chrome-manifest-iconify.ResizeMode}
     * [resizeMode=ResizeMode.BILINEAR] - The algorithm for resizing the master
     * Icon
     * @returns {Icon} The resized Icon
     */
    resize (size, path, resizeMode) {
        const resizedJimpData = this.jimpData.clone()
            .resize(size, size, resizeMode);

        return new Icon(path, resizedJimpData);
    }

    /**
     * Gets a human-friendly string representation of the Icon
     * @returns {string} A string representation of the Icon
     */
    toString () {
        return `Icon ${this.path} of size ${this.size}x${this.size}`;
    }

}

module.exports = Icon;
