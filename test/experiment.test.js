
/* eslint-disable no-undef */
const sum = require('./experiment');

// test('adds 1 + 2 to equal 3', () => {
//    expect(sum(1, 2)).toBe(3);
// });

function sumTest() {
  expect(sum(1, 2)).toBe(3);
}

test('adds 1 + 2 to equal 3', sumTest);


