import test from 'node:test';
import assert from 'node:assert/strict';
import { change, display } from '../web/model.mjs';
test('unavailable attendance and numeric zero are distinct', () => {
  assert.equal(change(0,12),12);
  assert.equal(change('UR',12),null);
  assert.equal(display(0),'0');
  assert.equal(display('TC'),'Temporarily closed');
});
