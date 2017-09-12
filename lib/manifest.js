'use strict';

const Promise = require('bluebird');
const readFile = Promise.promisify(require('fs').readFile);
const _ = require('lodash');
const pathUtil = require('path');

const iconManifestPaths = [
    'icons',
    'browser_action.default_icon',
    'page_action.default_icon'
];

/**
 * Class representing a Chrome extension manifest file
 */
class Manifest {

    /**
     * A static helper function that loads a Manifest from a file
     * @param {string} path The path from which to load the Manifest
     * @returns {Promise} A Promise that resolves when the Manifest loads
     */
    static load (path) {
        if (!_.isString(path)) {
            throw new TypeError('The manifest path must be a string');
        }

        return readFile(path)
            .then((data) => new Manifest(path, JSON.parse(data)));
    }

    /**
     * Create a Manifest
     * @param {string} path The path at which the Manifest is located
     * @param {object} content - The Manifest data
     */
    constructor (path, content) {
        this.path = path;
        this.content = content;
    }

    /**
     * Generated properly resized icons by parsing the Manifest contents
     * @param {module:chrome-manifest-iconify.Icon} masterIcon The Icon from
     * which the others will be generated
     * @param {module:chrome-manifest-iconify.ResizeMode}
     * [resizeMode=ResizeMode.BILINEAR] - The algorithm for resizing the master
     * Icon
     * @returns {Promise<Icon>} A promise that resolves when the Icons are
     * created
     */
    getIcons (masterIcon, resizeMode) {
        const icons = _(iconManifestPaths)
            .flatMap((manifestPath) => _.map(_.get(this.content, manifestPath),
                (path, size) => ({
                    path,
                    size
                })))
            .uniqWith((i1, i2) => {
                const samePath = i1.path === i2.path;
                const sameSize = i1.size === i2.size;

                if (samePath && !sameSize) {
                    throw Error(`The manifest contains icons with sizes \
${i1.size} and ${i2.size} from the same path ${i1.path}`);
                }

                return samePath && sameSize;
            })
            .map((i) => masterIcon.resize(
                i.size,
                pathUtil.join(pathUtil.dirname(this.path), i.path),
                resizeMode
            ))
            .value();

        return Promise.all(icons);
    }

}

module.exports = Manifest;
