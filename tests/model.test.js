import {test} from 'node:test';import assert from 'node:assert/strict';import {filterStations,streamURL,loadFavorites} from '../src/model.js';
test('city discovery is case-insensitive',()=>{assert.equal(filterStations(' TOKYO ').length,1);assert.equal(filterStations('unknown').length,0);});
test('only credential-free HTTPS streams accepted',()=>{assert.ok(streamURL('https://example.com/live.mp3'));for(const u of ['http://example.com','javascript:alert(1)','https://user:pass@example.com','broken'])assert.equal(streamURL(u),null);});
test('stored favorites are validated and deduplicated',()=>{assert.deepEqual(loadFavorites('["tokyo","tokyo","fake"]'),['tokyo']);assert.deepEqual(loadFavorites('{broken'),[]);assert.deepEqual(loadFavorites('{}'),[]);});
