import {test} from 'node:test';import assert from 'node:assert/strict';import {favoritesLabel} from '../src/model.js';
test('favorite summary validates ids and pluralizes',()=>{assert.equal(favoritesLabel(['tokyo','bogus']),'1 fictional station saved locally');assert.equal(favoritesLabel([]),'0 fictional stations saved locally');});
