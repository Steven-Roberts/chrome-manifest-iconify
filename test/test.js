'use strict';

const {async, ResizeMode} = require('../');
const {join} = require('path');
const {promisify} = require('util');
const readFile = promisify(require('fs').readFile);
const jimp = require('jimp');

// Congifure Chai
const chai = require('chai');

chai.use(require('chai-as-promised'));
chai.should();

const getPath = join.bind(null, __dirname);
const getIconPath = getPath.bind(null, 'icons');
const getManifestPath = getPath.bind(null, 'manifests');

describe('chrome-manifest-iconify', () => {
    describe('#async', () => {
        it(
            'should resolve promise for valid resize mode',
            () => async({
                manifest: getManifestPath('minimal.json'),
                masterIcon: getIconPath('test-icon.png'),
                resizeMode: ResizeMode.HERMITE
            }).should.be.fulfilled
        );

        it(
            'should reject promise when the manifest does not exist',
            () => async({
                manifest: getManifestPath('xxx.json'),
                masterIcon: getIconPath('test-icon.png')
            }).should.be.rejectedWith(Error,
                /ENOENT: no such file or directory, open '.*xxx.json'/u)
        );

        it(
            'should reject promise when the master icon does not exist',
            () => async({
                manifest: getManifestPath('minimal.json'),
                masterIcon: getIconPath('xxx.jpg')
            }).should.be.rejectedWith(Error,
                /ENOENT: no such file or directory, open '.*xxx.jpg'/u)
        );

        it(
            'should reject promise when the master icon is not square',
            () => async({
                manifest: getManifestPath('minimal.json'),
                masterIcon: getIconPath('not-square.png')
            }).should.be.rejectedWith(Error,
                'The icon has size 128x64, which is not square')
        );

        it(
            'should resolve promise when the master icon is a valid buffer',
            async () => {
                const masterIconBuffer = await readFile(
                    getIconPath('test-icon.png')
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
                masterIcon: getIconPath('test-icon.png')
            }).should.be.rejectedWith(SyntaxError, 'Unexpected token')
        );

        it(
            'should reject promise when the manifest has two icons with the ' +
                'same path but different sizes',
            () => async({
                manifest: getManifestPath('same-path-different-size.json'),
                masterIcon: getIconPath('test-icon.png')
            }).should.be.rejectedWith(Error, 'The manifest contains icons ' +
                'with sizes 128 and 16 from the same path icon.png')
        );

        it(
            'should resolve promise with icons for a valid manifest',
            async () => {
                const icons = await async({
                    manifest: getManifestPath('manifest.json'),
                    masterIcon: getIconPath('test-icon.png')
                });

                icons.should.be.an('array').with.length(4);

                icons[0].toString().should.equal(`Icon \
${getManifestPath('icon-16.png')} of size 16x16`);
                icons[1].toString().should.equal(`Icon \
${getManifestPath('icon-128.bmp')} of size 128x128`);
                icons[2].toString().should.equal(`Icon \
${getManifestPath('a', 'icon-19.png')} of size 19x19`);
                icons[3].toString().should.equal(`Icon \
${getManifestPath('img.jpg')} of size 38x38`);

                const jimpData = await Promise
                    .all(icons.map((i) => i.contents.then(jimp.read)));

                jimpData[0].bitmap.width.should.equal(16);
                jimpData[0].bitmap.height.should.equal(16);
                jimpData[0].getMIME().should.equal('image/png');

                jimpData[1].bitmap.width.should.equal(128);
                jimpData[1].bitmap.height.should.equal(128);
                jimpData[1].getMIME().should.equal('image/bmp');

                jimpData[2].bitmap.width.should.equal(19);
                jimpData[2].bitmap.height.should.equal(19);
                jimpData[2].getMIME().should.equal('image/png');

                jimpData[3].bitmap.width.should.equal(38);
                jimpData[3].bitmap.height.should.equal(38);
                jimpData[3].getMIME().should.equal('image/jpeg');
            }
        );

        it(
            'should resolve promise when manifest has duplicate icon',
            async () => {
                const icons = await async({
                    manifest: getManifestPath('duplicate-icon.json'),
                    masterIcon: getIconPath('test-icon.png'),
                    resizeMode: ResizeMode.NEAREST_NEIGHBOR
                });

                icons.should.be.an('array').with.length(1);
                icons[0].toString().should.equal(`Icon \
${getManifestPath('icon.png')} of size 19x19`);

                const jimpData = await jimp.read(await icons[0].contents);
                jimpData.bitmap.width.should.equal(19);
                jimpData.bitmap.height.should.equal(19);
                jimpData.getMIME().should.equal('image/png');
            }
        );
    });
});
