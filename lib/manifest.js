'use strict';

/**
 * Manifest module
 * @module lib/manifest
 */

const Icon = require('./icon');
const Promise = require('bluebird');
const readFile = Promise.promisify(require('fs').readFile);
const _ = require('lodash');

const iconManifestPaths = [
    'icons',
    'browser_action.default_icon',
    'page_action.default_icon'
];

/**
 * Class representing a Chrome extension manifest file
 */
module.exports = class Manifest {

    /**
     * A static helper function that loads a Manifest from a file
     * @param {string} manifestPath The path from which
     * to load the Manifest
     * @returns {Promise} A Promise that resolves when the Manifest loads
     */
    static load (manifestPath) {
        if (!_.isString(manifestPath)) {
            throw new TypeError('The manifest path must be a string');
        }

        return readFile(manifestPath)
            .then((data) => new Manifest(JSON.parse(data)));
    }

    /**
     * Create a manifest
     * @param {object} content - The manifest data
     */
    constructor (content) {
        this.content = content;

        this.icons = _(iconManifestPaths)
            .flatMap((manifestPath) => {
                const manifestIconData = _.get(this.content, manifestPath);

                return _.toPairs(manifestIconData)
                    .map(([size, path]) => new Icon(size, path));
            })
            .uniqWith((i1, i2) => {
                const samePath = i1.path === i2.path;
                const sameSize = i1.size === i2.size;

                if (samePath && !sameSize) {
                    throw Error(`The manifest contains icons with sizes \
${i1.size} and ${i2.size} from the same path ${i1.path}`);
                }

                return samePath && sameSize;
            })
            .value();
    }

};
