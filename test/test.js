'use strict';

const chromeManifestIconify = require('../');
const Promise = require('bluebird');
const readFile = Promise.promisify(require('fs').readFile);
const path = require('path');
const jimp = require('jimp');

// Congifure Chai
const chai = require('chai');

chai.use(require('chai-as-promised'));
chai.use(require('chai-string'));
chai.should();


const getPath = path.join.bind(null, __dirname);
const getIconPath = getPath.bind(null, 'icons');
const getManifestPath = getPath.bind(null, 'manifests');

describe('chrome-manifest-iconify', () => {
    describe('#async', () => {
        const async = chromeManifestIconify.async;

        it('should require an options object', () => {
            async.should.throw(TypeError, 'Options must be an object');
        });

        it('should not fail for valid resize mode', () => {
            const fn = () => async({
                manifest: getManifestPath('minimal.json'),
                masterIcon: getIconPath('test-icon.png'),
                resizeMode: chromeManifestIconify.ResizeMode.HERMITE
            });

            fn.should.not.throw(Error);
        });

        it('should require a manifest path be provided in options', () => {
            const fn = () => async({
                masterIcon: getIconPath('test-icon.png')
            });

            fn.should.throw(Error, 'The manifest path must be a string');
        });

        it('should require a master icon be provided in options', () => {
            const fn = () => async({
                manifest: getManifestPath('minimal.json')
            });

            fn.should.throw(Error, 'The icon must be a file path or Buffer');
        });

        it('should reject promise when the manifest does not exist', () =>
            async({
                manifest: getManifestPath('does-not-exist.json'),
                masterIcon: getIconPath('test-icon.png')
            }).should.eventually.be.rejectedWith(Error,
            /ENOENT: no such file or directory, open '.*does-not-exist.json'/)
        );

        it('should reject promise when the master icon does not exist', () =>
            async({
                manifest: getManifestPath('minimal.json'),
                masterIcon: getIconPath('does-not-exist.jpg')
            }).should.eventually.be.rejectedWith(Error,
            /ENOENT: no such file or directory, open '.*does-not-exist.jpg'/)
        );

        it('should reject promise when the master icon is not square', () =>
            async({
                manifest: getManifestPath('minimal.json'),
                masterIcon: getIconPath('not-square.png')
            }).should.eventually.be.rejectedWith(Error,
                'The icon has size 128x64 which is not square')
        );

        it('should resolve promise when the master icon is a valid buffer',
            () => readFile(getIconPath('test-icon.png'))
                .then((masterIconBuffer) => async({
                    manifest: getManifestPath('minimal.json'),
                    masterIcon: masterIconBuffer
                }))
                .should.eventually.be.fullfilled
        );

        it('should reject promise when the manifest contains malformed JSON',
            () => async({
                manifest: getManifestPath('malformed.json'),
                masterIcon: getIconPath('test-icon.png')
            }).should.eventually.be.rejectedWith(SyntaxError,
                'Unexpected token')
        );

        it('should reject promise when the manifest contains an invalid icon ' +
            'extension',
            () => async({
                manifest: getManifestPath('invalid-extension.json'),
                masterIcon: getIconPath('test-icon.png')
            }).should.eventually.be.rejectedWith(Error,
                'icon-128.invalid has no MIME type')
        );

        it('should reject promise when the manifest has a non-positve icon' +
            'size',
            () => async({
                manifest: getManifestPath('negative-size.json'),
                masterIcon: getIconPath('test-icon.png')
            }).should.eventually.be.rejectedWith(Error,
                'The icon size -42 is not a positive integer')
        );

        it('should reject promise when the manifest has a NaN icon size', () =>
            async({
                manifest: getManifestPath('nan-size.json'),
                masterIcon: getIconPath('test-icon.png')
            }).should.eventually.be.rejectedWith(Error,
                'The icon size abc is not a positive integer')
        );

        it('should reject promise when the manifest has an invalid icon path',
            () => async({
                manifest: getManifestPath('invalid-path.json'),
                masterIcon: getIconPath('test-icon.png')
            }).should.eventually.be.rejectedWith(Error,
                'Path must be a string. Received 3.14')
        );

        it('should reject promise when the manifest has two icons with the ' +
            'same path but different sizes',
            () => async({
                manifest: getManifestPath('same-path-different-size.json'),
                masterIcon: getIconPath('test-icon.png')
            }).should.eventually.be.rejectedWith(Error, 'The manifest ' +
                'contains icons with sizes 128 and 16 from the same path ' +
                'icon.png')
        );

        it('should resolve promise with icons for a valid manifest', () =>
            async({
                manifest: getManifestPath('manifest.json'),
                masterIcon: getIconPath('test-icon.png')
            })
            .then((icons) => {
                icons.should.be.an('array').with.length(4);
                icons.forEach((i) => i.should.have.property('contents')
                    .that.has.length.at.least(0));

                icons[0].toString().should.startWith(`Icon \
${getManifestPath('icon-16.png')} of size 16x16 with data `);
                icons[1].toString().should.startWith(`Icon \
${getManifestPath('icon-128.bmp')} of size 128x128 with data `);
                icons[2].toString().should.startWith(`Icon \
${getManifestPath('a', 'icon-19.png')} of size 19x19 with data `);
                icons[3].toString().should.startWith(`Icon \
${getManifestPath('img.jpg')} of size 38x38 with data `);

                return Promise.map(icons, (i) => jimp.read(i.contents));
            })
            .then((icons) => {
                // TODO: Use Jimp.getMIME() when it becomes available
                /* eslint-disable no-underscore-dangle */
                icons[0].bitmap.width.should.equal(16);
                icons[0].bitmap.height.should.equal(16);
                icons[0]._originalMime.should.equal('image/png');

                icons[1].bitmap.width.should.equal(128);
                icons[1].bitmap.height.should.equal(128);
                icons[1]._originalMime.should.equal('image/bmp');

                icons[2].bitmap.width.should.equal(19);
                icons[2].bitmap.height.should.equal(19);
                icons[2]._originalMime.should.equal('image/png');

                icons[3].bitmap.width.should.equal(38);
                icons[3].bitmap.height.should.equal(38);
                icons[3]._originalMime.should.equal('image/jpeg');

                /* eslint-enable no-underscore-dangle */
            })
        );

        it('should resolve promise when manifest has duplicate icon', () =>
            async({
                manifest: getManifestPath('duplicate-icon.json'),
                masterIcon: getIconPath('test-icon.png'),
                resizeMode: chromeManifestIconify.ResizeMode.NEAREST_NEIGHBOR
            })
            .then((icons) => {
                icons.should.be.an('array').with.length(1);
                icons[0].toString().should.startWith(`Icon \
${getManifestPath('icon.png')} of size 19x19 with data `);

                return jimp.read(icons[0].contents);
            })
            .then((icon) => {
                // TODO: Use Jimp.getMIME() when it becomes available
                /* eslint-disable no-underscore-dangle */
                icon.bitmap.width.should.equal(19);
                icon.bitmap.height.should.equal(19);
                icon._originalMime.should.equal('image/png');

                /* eslint-enable no-underscore-dangle */
            })
        );
    });
});
