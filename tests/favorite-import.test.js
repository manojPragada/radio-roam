import test from 'node:test';import assert from 'node:assert/strict';import {favoriteExport,favoriteImport} from '../src/model.js';
test('exported fictional favorites round-trip by known id',()=>{assert.deepEqual(favoriteImport(favoriteExport(['toronto','lisbon','toronto'])),['lisbon','toronto']);});
test('favorites import rejects unknown stations and unrelated files',()=>{assert.throws(()=>favoriteImport({version:1,kind:'radio-roam-fictional-favorites',stations:[{id:'unknown'}]}),/unknown station/);assert.throws(()=>favoriteImport({stations:[]}),/Invalid/);});
