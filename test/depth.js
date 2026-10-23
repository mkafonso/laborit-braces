'use strict';

const assert = require('assert');
const braces = require('..');

const ordinary = {
  list: ['(a|b|c)'],
  path: ['a/(b|c)/d'],
  expand: [
    'user-1/file-a',
    'user-1/file-b',
    'user-2/file-a',
    'user-2/file-b',
    'user-3/file-a',
    'user-3/file-b'
  ],
  nested: ['a', 'b', 'c', 'd']
};

assert.deepStrictEqual(braces('{a,b,c}'), ordinary.list);
assert.deepStrictEqual(braces('a/{b,c}/d'), ordinary.path);
assert.deepStrictEqual(braces.expand('user-{1..3}/file-{a,b}'), ordinary.expand);
assert.deepStrictEqual(braces.expand('{a,{b,c},d}'), ordinary.nested);
assert.strictEqual(braces.compile('src/{components,hooks}/**/*.{ts,tsx}'), 'src/(components|hooks)/**/*.(ts|tsx)');
assert.deepStrictEqual(braces.expand('a/{1..3}/{x,y}'), ['a/1/x', 'a/1/y', 'a/2/x', 'a/2/y', 'a/3/x', 'a/3/y']);
assert.doesNotThrow(() => braces.compile('{'.repeat(64) + 'x,y' + '}'.repeat(64)));

for (const pair of [['{', '}'], ['(', ')']]) {
  assert.throws(
    () => braces.parse(pair[0].repeat(4000) + 'x' + pair[1].repeat(4000)),
    SyntaxError
  );
}

assert.throws(() => braces.expand('{'.repeat(4500) + 'a' + '}'.repeat(4500)), SyntaxError);

for (const operation of ['compile', 'expand', 'stringify']) {
  let ast = { type: 'text', value: 'x' };
  for (let i = 0; i < 12000; i++) ast = { type: 'root', nodes: [ast] };
  assert.throws(() => braces[operation](ast), SyntaxError);

  const cycle = { type: 'root', nodes: [] };
  cycle.nodes.push(cycle);
  assert.throws(() => braces[operation](cycle), SyntaxError);
}

const leaf = { type: 'text', value: 'a' };
assert.strictEqual(braces.stringify({ type: 'root', nodes: [leaf, leaf] }), 'aa');

const parentCycle = { type: 'root', nodes: [] };
const paren = { type: 'paren', nodes: [{ type: 'text', value: 'x' }] };
parentCycle.nodes.push(paren);
paren.parent = paren;
assert.throws(() => braces.expand(parentCycle), RangeError);

console.log('braces depth guard: ok');
