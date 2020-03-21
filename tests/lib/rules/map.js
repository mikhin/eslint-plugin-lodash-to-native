/**
 * @fileoverview Transform lodash map to native JS map function.
 * @author Yuri Mikhin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/map');


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run('map', rule, {

  valid: [
    'var x = Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn);',
    'var x = collection instanceof Array ? collection.map(fn) : _.map(collection, fn);',
    `if (Array.isArray(collection)) {
          collection.map(fn);
        } else {
          _.map(collection, fn);
        }
`,
    'var x = true ? collection.map(fn) : _.map();',
    'var x = true ? collection.map(fn) : __.map(collection, fn);',
    'var x = true ? collection.map(fn) : _.mapp(collection, fn);',
    'var toggleHeal = function (item) {\n'
    + '  if (typeof item != \'object\') {\n'
    + '    return item;\n'
    + '  } else {\n'
    + '    if (_.isArray(item)) {\n'
    + '      return _.map(item, toggleHeal);\n'
    + '    }\n'
    + '    item.heal = !item.heal;\n'
    + '  }\n'
    + '  return item\n'
    + '};',
    'var new_array = arr.map(function callback(currentValue, index, array) { \n'
    + '    // Возвращает элемент для new_array \n'
    + '}[thisArg])',
    'var roots = numbers.map(Math.sqrt);',
    'var doubles = numbers.map(function(num) {\n'
    + '  return num * 2;\n'
    + '});',
    '_.map({a: 1, b: 2}, fn)',
  ],

  invalid: [
    {
      code: 'var a = _.map(arr, function(x) {return x + 1});',
      errors: [
        'Need to add checking is argument Array or Object.',
      ],
    },
    {
      code: 'var a = _.map(arr);',
      errors: [
        'Need to add checking is argument Array or Object.',
      ],
    },
    {
      code: 'var x = _.map(a, "prop");',
      errors: [
        'Need to add checking is argument Array or Object.',
      ],
    },
    {
      code: '_.map([{id: 1}, {id: 2}, {id: 3}], function (item) {\n'
        + '  return item.id;\n'
        + '});',
      errors: [
        'Need to be transformed into native JS Array.map function.',
      ],
    },
    {
      code: 'var x = _.map(a, () => {});',
      errors: [
        'Need to add checking is argument Array or Object.',
      ],
    },
    {
      code: 'var x = _.map(collection, callback);',
      output: 'var x = Array.isArray(collection) ? collection.map(callback) : _.map(collection, callback);',
      errors: [
        'Need to add checking is argument Array or Object.',
      ],
    },
    {
      code: 'var x = _.map(a, () => {});',
      output: 'var x = Array.isArray(a) ? a.map(() => {}) : _.map(a, () => {});',
      errors: [
        'Need to add checking is argument Array or Object.',
      ],
    },
    {
      code: 'var x = _.map(a, (b) => {return b + a});',
      output: 'var x = Array.isArray(a) ? a.map((b) => {return b + a}) : _.map(a, (b) => {return b + a});',
      errors: [
        'Need to add checking is argument Array or Object.',
      ],
    },
    {
      code: '_.map([1, 2, 3], fn)',
      output: '[1, 2, 3].map(fn)',
      errors: [
        'Need to be transformed into native JS Array.map function.',
      ],
    },
  ],
});
