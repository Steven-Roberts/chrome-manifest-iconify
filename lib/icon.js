'use strict';

const mime = require('mime');
const Promise = require('bluebird');
const jimp = require('jimp');
const _ = require('lodash');

/**
 * Class representing a Chrome extension or app icon
 * @memberof module:chrome-manifest-iconify
 */
class Icon {

    /**
     * Create an Icon
     * @ignore
     * @private
     * @param {string|number} size - The size of the Icon in pixels
     * @param {string} path - The file path to the Icon
     * @param {object} jimpData - The JIMP image data
     * @param {Buffer} contents - A Buffer of the Icon data
     */
    constructor (size, path, jimpData, contents) {
        // Assign the params as class properties
        /**
         * The size of the Icon in pixels
         * @readonly
         * @type {number}
         */
        this.size = parseInt(size, 10);
        if (isNaN(this.size) || this.size <= 0) {
            throw new Error(`The icon size ${size} is not a positive integer`);
        }

        /**
         * The file path to the Icon
         * @readonly
         * @type {string}
         */
        this.path = path;

        /**
         * @private
         * The JIMP image data
         * @readonly
         * @type {object}
         */
        this.jimpData = jimpData;

        /**
         * A Buffer of the Icon data
         * @readonly
         * @type {Buffer}
         */
        this.contents = contents;
    }

    /**
     * A static helper function that loads an Icon from a file
     * @private
     * @param {string|Buffer} file - Either a path or Buffer of the Icon
     * @returns {Promise<Icon>} A promise that resolves when the Icon loads
     */
    static load (file) {
        let path = '';
        let contents = null;

        if (_.isString(file)) {
            path = file;
        } else if (Buffer.isBuffer(file)) {
            contents = file;
        } else {
            throw new TypeError('The icon must be a file path or Buffer');
        }

        return jimp.read(file)
            .then((jimpData) => {
                const width = jimpData.bitmap.width;
                const height = jimpData.bitmap.height;

                if (width !== height) {
                    throw new Error(`The icon has size ${width}x${height} \
which is not square`);
                }

                return new Icon(width, path, jimpData, contents);
            });
    }

    /**
     * Gets the MIME type of the Icon
     * @type {string}
     */
    get mimeType () {
        return mime.lookup(this.path);
    }

    /**
     * Create a new Icon that is a resized version of this Icon
     * @private
     * @param {string|number} size - The size of the new Icon in pixels
     * @param {string} path - The file path to the new Icon
     * @param {module:chrome-manifest-iconify.ResizeMode}
     * [resizeMode=ResizeMode.RESIZE_BILINEAR] - The algorithm for resizing the
     * master Icon
     * @returns {Promise<Icon>} A promise that resolves when the Icon is resized
     */
    resize (size, path, resizeMode) {
        const resizedIcon = new Icon(size, path);

        const resizedJimpData = this.jimpData.clone()
            .resize(resizedIcon.size, resizedIcon.size, resizeMode);

        resizedIcon.jimpData = resizedJimpData;

        return Promise.fromCallback(
            (cb) => resizedJimpData.getBuffer(resizedIcon.mimeType, cb))
            .then((resizedContents) => {
                resizedIcon.contents = resizedContents;

                return resizedIcon;
            });
    }

    /**
     * Gets a human-friendly string representation of the Icon
     * @returns {string} A string representation of the Icon
     */
    toString () {
        return `Icon ${this.path} of size ${this.size}x${this.size} with data \
${this.contents}`;
    }

}

module.exports = Icon;
