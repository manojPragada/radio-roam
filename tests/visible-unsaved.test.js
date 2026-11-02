import {test} from 'node:test';import assert from 'node:assert/strict';import {stations,visibleUnsavedLabel} from '../src/model.js';
test('visible unsaved summary validates known favorites',()=>{assert.equal(visibleUnsavedLabel(stations.slice(0,2),['tokyo','unknown']),'1 unsaved station in current view');assert.equal(visibleUnsavedLabel([],[]),'0 unsaved stations in current view');});
