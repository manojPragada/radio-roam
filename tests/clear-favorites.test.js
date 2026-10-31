import test from 'node:test';import assert from 'node:assert/strict';import {clearFavorites} from '../src/model.js';
test('clearFavorites returns a fresh empty collection',()=>{const first=clearFavorites(),second=clearFavorites();assert.deepEqual(first,[]);assert.notEqual(first,second);});
