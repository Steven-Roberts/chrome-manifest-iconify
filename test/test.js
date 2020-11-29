/* eslint-env mocha */

const { async } = require('../');
const { join } = require('path');
const { promisify } = require('util');
const readFile = promisify(require('fs').readFile);
const sharp = require('sharp');

// Congifure Chai
const chai = require('chai');

chai.use(require('chai-as-promised'));
chai.should();

const getPath = join.bind(null, __dirname);
const getManifestPath = getPath.bind(null, 'manifests');

describe('chrome-manifest-iconify', () => {
  describe('#async', () => {
    it(
      'should resolve promise for valid resize mode',
      () => async({
        manifest: getManifestPath('minimal.json'),
        masterIcon: getPath('test-icon.png'),
        resizeMode: 'nearest'
      }).should.be.fulfilled
    );

    it(
      'should reject promise when the manifest does not exist',
      () => async({
        manifest: getManifestPath('xxx.json'),
        masterIcon: getPath('test-icon.png')
      }).should.be.rejectedWith(Error,
        /ENOENT: no such file or directory, open '.*xxx.json'/u)
    );

    it(
      'should resolve promise when the master icon is a valid buffer',
      async () => {
        const masterIconBuffer = await readFile(
          getPath('test-icon.png')
        );

        return async({
          manifest: getManifestPath('minimal.json'),
          masterIcon: masterIconBuffer
        }).should.be.fulfilled;
      }
    );

    it(
      'should reject promise when the manifest contains malformed JSON',
      () => async({
        manifest: getManifestPath('malformed.json'),
        masterIcon: getPath('test-icon.png')
      }).should.be.rejectedWith(SyntaxError, 'Unexpected token')
    );

    it(
      'should reject promise when the manifest has two icons with the ' +
                'same path but different sizes',
      () => async({
        manifest: getManifestPath('same-path-different-size.json'),
        masterIcon: getPath('test-icon.png')
      }).should.be.rejectedWith(Error, 'The manifest contains icons ' +
                'with sizes 128 and 16 from the same path icon.png')
    );

    it(
      'should resolve promise with icons for a valid manifest',
      async () => {
        const icons = await async({
          manifest: getManifestPath('manifest.json'),
          masterIcon: getPath('test-icon.png')
        });

        icons.should.be.an('array').with.length(4);

        const buffers =
                    await Promise.all(icons.map((i) => i.contents));
        const metadata =
                    await Promise.all(buffers.map((b) => sharp(b).metadata()));

        metadata[0].width.should.equal(16);
        metadata[0].height.should.equal(16);
        metadata[0].format.should.equal('png');

        metadata[1].width.should.equal(128);
        metadata[1].height.should.equal(128);
        metadata[1].format.should.equal('jpeg');

        metadata[2].width.should.equal(19);
        metadata[2].height.should.equal(19);
        metadata[2].format.should.equal('png');

        metadata[3].width.should.equal(38);
        metadata[3].height.should.equal(38);
        metadata[3].format.should.equal('jpeg');
      }
    );

    it(
      'should resolve promise when manifest has duplicate icon',
      async () => {
        const icons = await async({
          manifest: getManifestPath('duplicate-icon.json'),
          masterIcon: getPath('test-icon.png'),
          resizeMode: 'cubic'
        });

        icons.should.be.an('array').with.length(1);
        const buffer = await icons[0].contents;
        const metadata = await sharp(buffer).metadata();

        metadata.width.should.equal(19);
        metadata.height.should.equal(19);
        metadata.format.should.equal('png');
      }
    );
  });
});
