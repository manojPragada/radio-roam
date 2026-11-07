import {test} from 'node:test';import assert from 'node:assert/strict';import {favoriteActionsEnabled} from '../src/model.js';
test('favorite file actions require at least one validated fictional station',()=>{assert.equal(favoriteActionsEnabled([]),false);assert.equal(favoriteActionsEnabled(['unknown']),false);assert.equal(favoriteActionsEnabled(['tokyo','unknown']),true);});
