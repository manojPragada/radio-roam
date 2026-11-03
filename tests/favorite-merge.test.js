import {test} from 'node:test';import assert from 'node:assert/strict';import {mergeFavorites} from '../src/model.js';
import {favoriteMergeSummary} from '../src/model.js';
test('favorite merge preserves current known stations and deduplicates imports',()=>{assert.deepEqual(mergeFavorites(['tokyo'],['lisbon','tokyo']),['tokyo','lisbon']);assert.deepEqual(mergeFavorites(['unknown'],['toronto']),['toronto']);});
test('favorite merge summary distinguishes additions from existing saves',()=>{assert.deepEqual(favoriteMergeSummary(['tokyo'],['lisbon','tokyo']),{merged:['tokyo','lisbon'],added:1,alreadySaved:1,total:2});});
