import {test} from 'node:test';import assert from 'node:assert/strict';import {stations,filterStations,streamURL,streamFormatHint,capabilitySummary,loadFavorites,loadLastStation,chooseStation,toggleFavorite,mediaErrorMessage,stationIndexForKey} from '../src/model.js';
import {attemptLabel} from '../src/model.js';
test('city discovery is case-insensitive',()=>{assert.equal(filterStations(' TOKYO ').length,1);assert.equal(filterStations('unknown').length,0);});
test('only credential-free HTTPS streams accepted',()=>{assert.ok(streamURL('https://example.com/live.mp3'));for(const u of ['http://example.com','javascript:alert(1)','https://user:pass@example.com','broken'])assert.equal(streamURL(u),null);});
test('stream hints describe URL extensions without claiming capability or health',()=>{assert.match(streamFormatHint('https://example.com/live.MP3'),/MP3 filename hint.*not verified/);assert.match(streamFormatHint('https://example.com/live'),/Format unknown.*not verified/);assert.match(streamFormatHint('http://example.com/live.mp3'),/credential-free/);});
test('browser capability summary remains separate from remote health',()=>{assert.match(capabilitySummary(mime=>mime==='audio/mpeg'?'probably':''),/MP3.*Remote stream health is not tested/);assert.match(capabilitySummary(()=>''),/no capability.*not tested/);});
test('last station restores only known fictional station ids',()=>{assert.equal(loadLastStation('lisbon').id,'lisbon');assert.equal(loadLastStation('missing').id,stations[0].id);assert.equal(loadLastStation(null).id,stations[0].id);});
test('station keyboard navigation wraps and supports boundaries',()=>{assert.equal(stationIndexForKey(0,4,'ArrowUp'),3);assert.equal(stationIndexForKey(3,4,'ArrowDown'),0);assert.equal(stationIndexForKey(2,4,'Home'),0);assert.equal(stationIndexForKey(1,4,'End'),3);assert.equal(stationIndexForKey(1,4,'x'),1);});
test('stored favorites are validated and deduplicated',()=>{assert.deepEqual(loadFavorites('["tokyo","tokyo","fake"]'),['tokyo']);assert.deepEqual(loadFavorites('{broken'),[]);assert.deepEqual(loadFavorites('{}'),[]);});


test('filtered city selection follows visible results',()=>{const visible=filterStations('Lisbon');assert.equal(chooseStation(visible,'tokyo').id,'lisbon');assert.equal(chooseStation([], 'tokyo'),null);});
test('favorite toggle preserves valid ids without duplicates',()=>{assert.deepEqual(toggleFavorite(['tokyo','tokyo'],'tokyo'),[]);assert.deepEqual(toggleFavorite([], 'lisbon'),['lisbon']);assert.deepEqual(toggleFavorite(['tokyo'],'unknown'),['tokyo']);});
test('media failures have actionable explanations',()=>{assert.match(mediaErrorMessage(2),/Network/);assert.match(mediaErrorMessage(3),/decoded/);assert.match(mediaErrorMessage(4),/format/);assert.match(mediaErrorMessage(999),/Unable/);});
test('session attempts never imply remote health',()=>{assert.match(attemptLabel(2),/attempt 2.*not a remote health check/);assert.match(attemptLabel(0),/No playback attempt/);});


