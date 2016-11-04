'use strict';

/**
 * Icon module
 * @module lib/icon
 */

const jimp = require('jimp');
const mime = require('mime');
const Vinyl = require('vinyl');
const Promise = require('bluebird');
const _ = require('lodash');
const join = require('path').join;

/**
 * Class representing a Chrome extension icon
 */
module.exports = class Icon {

    /**
     * Create an icon
     * @param {string|number} size - The size of the icon in pixels
     * @param {string} path - The file path to the icon
     * @param {object} data - The JIMP image data
     */
    constructor (size, path, data) {
        this.size = parseInt(size, 10);
        if (isNaN(this.size) || this.size <= 0) {
            throw new Error(`The icon size ${size} is not a positive integer`);
        }


        if (!_.isString(path)) {
            throw new Error(`The path "${path}" is not a string`);
        }
        this.path = path;
        this.data = data;
    }

    /**
     * A static helper function that loads an Icon from a file
     * @param {string} file - The path from which to load the Icon
     * @returns {Promise} A promise that resolves when the Icon loads
     */
    static load (file) {
        let path = '';

        if (_.isString(file)) {
            path = file;
        } else if (!Buffer.isBuffer(file)) {
            throw new TypeError('The icon must be a file path or buffer');
        }

        return jimp.read(file)
            .then((icon) => {
                const width = icon.bitmap.width;
                const height = icon.bitmap.height;

                if (width !== height) {
                    throw new Error(`The icon has size ${width}x${height} \
which is not square`);
                }

                return new Icon(width, path, icon);
            });
    }

    /**
     * Gets the MIME type of the icon
     * @returns {string} The MIME type
     */
    get mimeType () {
        return mime.lookup(this.path);
    }

    /**
     * Resizes the given Icon into this Icon
     * @param {Icon} otherIcon The icon from which to resize
     * @param {?module:lib/icon.resizeMode} resizeMode The resize algorithm
     * @returns {Icon} this for method chaining
     */
    resizeFrom (otherIcon, resizeMode) {
        this.data = otherIcon.data.clone()
            .resize(this.size, this.size, resizeMode);

        return this;
    }

    /**
     * Converts the icon to a buffer
     * @param {string} base The directory in which the file will reside
     * @returns {Promise} A Promise that resolvles then the Icon is converted
     * to a file
     */
    toFile (base) {
        return Promise
            .fromCallback(this.data.getBuffer.bind(this.data, this.mimeType))
            .then((buffer) => new Vinyl({
                base,
                path: join(base, this.path),
                contents: buffer
            }));
    }

};
