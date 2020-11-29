const { promisify } = require('util');
const readFile = promisify(require('fs').readFile);
const { join, dirname } = require('path');

const getProps = (obj, ...p) => Object.entries(
  p.reduce((o, v) => o[v] || {}, obj)
);

/**
 * Class representing a Chrome extension manifest file
 */
class Manifest {
  /**
   * A static helper function that loads a Manifest from a file
   * @param {string} path The path from which to load the Manifest
   * @returns {Promise} A Promise that resolves when the Manifest loads
   */
  static async load (path) {
    const data = await readFile(path);

    return new Manifest(path, JSON.parse(data));
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
   * @param {module:chrome-manifest-iconify.Icon} masterIcon The Icon from which
   * the others will be generated
   * @param {string} [resizeMode] The algorithm for resizing the master Icon
   * @param {string} [outDir] Base directory of the generated Icons. Defaults to
   * parent directory of manifest
   * @returns {Promise<module:chrome-manifest-iconify.Icon[]>} A promise that
   * resolves when the Icons are generated
   */
  getIcons (masterIcon, resizeMode, outDir = dirname(this.path)) {
    return [
      ...getProps(this.content, 'icons'),
      ...getProps(this.content, 'browser_action', 'default_icon'),
      ...getProps(this.content, 'page_action', 'default_icon')
    ].filter(([size1, path1], index, arr) => index === arr.findIndex(
      ([size2, path2]) => {
        const sameSize = size1 === size2;
        const samePath = path1 === path2;

        if (samePath && !sameSize) {
          throw Error(`The manifest contains icons with sizes ${size1} and \
${size2} from the same path ${path1}`);
        }

        return sameSize && samePath;
      }
    )).map(([size, path]) => masterIcon.resize(
      parseInt(size, 10),
      join(outDir, path),
      resizeMode
    ));
  }
}

module.exports = Manifest;
