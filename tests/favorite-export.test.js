import test from 'node:test';import assert from 'node:assert/strict';import {favoriteExport} from '../src/model.js';
test('favorite export validates ids and contains no stream fields',()=>{const value=favoriteExport(['toronto','bad','toronto']);assert.equal(value.stations.length,1);assert.equal(value.stations[0].city,'Toronto');assert.equal(JSON.stringify(value).includes('url'),false);});
