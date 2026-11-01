import {test} from 'node:test';import assert from 'node:assert/strict';import {mergeFavorites} from '../src/model.js';
test('favorite merge preserves current known stations and deduplicates imports',()=>{assert.deepEqual(mergeFavorites(['tokyo'],['lisbon','tokyo']),['tokyo','lisbon']);assert.deepEqual(mergeFavorites(['unknown'],['toronto']),['toronto']);});
