import {test} from 'node:test';import assert from 'node:assert/strict';import {stations,filterStations,streamURL,loadFavorites,loadLastStation,chooseStation,toggleFavorite,mediaErrorMessage} from '../src/model.js';
test('city discovery is case-insensitive',()=>{assert.equal(filterStations(' TOKYO ').length,1);assert.equal(filterStations('unknown').length,0);});
test('only credential-free HTTPS streams accepted',()=>{assert.ok(streamURL('https://example.com/live.mp3'));for(const u of ['http://example.com','javascript:alert(1)','https://user:pass@example.com','broken'])assert.equal(streamURL(u),null);});
test('last station restores only known fictional station ids',()=>{assert.equal(loadLastStation('lisbon').id,'lisbon');assert.equal(loadLastStation('missing').id,stations[0].id);assert.equal(loadLastStation(null).id,stations[0].id);});
test('stored favorites are validated and deduplicated',()=>{assert.deepEqual(loadFavorites('["tokyo","tokyo","fake"]'),['tokyo']);assert.deepEqual(loadFavorites('{broken'),[]);assert.deepEqual(loadFavorites('{}'),[]);});


test('filtered city selection follows visible results',()=>{const visible=filterStations('Lisbon');assert.equal(chooseStation(visible,'tokyo').id,'lisbon');assert.equal(chooseStation([], 'tokyo'),null);});
test('favorite toggle preserves valid ids without duplicates',()=>{assert.deepEqual(toggleFavorite(['tokyo','tokyo'],'tokyo'),[]);assert.deepEqual(toggleFavorite([], 'lisbon'),['lisbon']);assert.deepEqual(toggleFavorite(['tokyo'],'unknown'),['tokyo']);});
test('media failures have actionable explanations',()=>{assert.match(mediaErrorMessage(2),/Network/);assert.match(mediaErrorMessage(3),/decoded/);assert.match(mediaErrorMessage(4),/format/);assert.match(mediaErrorMessage(999),/Unable/);});


