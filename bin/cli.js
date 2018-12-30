#!/usr/bin/env node

'use strict';

const {async} = require('../');
const yargs = require('yargs');
const {kernel} = require('sharp');

const {argv} = yargs.scriptName('chrome-manifest-iconify')
    .usage('$0 - Generates icon set for a Chrome extension or app by parsing' +
        'the v2 manifest')
    .example('$0 -i master.svg')
    .example('$0 -i master.jpg -m src/manifest.json -r nearest -o build/icons')
    .option('i', {
        alias: 'master-icon',
        demandOption: true,
        description: 'Path to the master icon',
        requiresArg: true,
        type: 'string'
    })
    .option('m', {
        alias: 'manifest',
        default: 'manifest.json',
        describe: 'Path to the v2 manifest.json',
        requiresArg: true,
        type: 'string'
    })
    .option('r', {
        alias: 'resize-mode',
        choices: Object.keys(kernel),
        default: 'lanczos3',
        describe: 'Algorithm for resizing the master icon',
        requiresArg: true
    })
    .option('o', {
        alias: 'out-dir',
        describe: 'Directory to write the icons',
        requiresArg: true,
        type: 'string'
    });

async(argv)
    .then((icons) => Promise.all(icons.map((i) => i.write())))
    .catch((e) => console.error(e.message)); // eslint-disable-line no-console
