'use strict';
/*jshint asi: true */

var test = require('tape')
  , canadianPub = require('../')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('foo with .gitignore and no .npmignore', function (t) {
  var root = __dirname + '/foo';
  var entries = []
  t.plan(4);
  canadianPub(root)
    .on('error', t.fail.bind(t))
    .on('metadata', function(meta) {
      t.is(meta.name, 'foo');
      t.is(meta.version, '1.2.3');
      t.is(typeof meta.user, 'string');
    })
    .on('data', function (d) {
      entries.push(d.toString());
    })
    .on('end', function () {
      t.deepEqual(
          entries
        , [ 'package.json\n',
            'index.js\n',
            'example/first.js\n',
            'lib/work.js\n' ]
        , 'emits all files that would be published'
      )
    });
})

test('bar with prepublish script', function (t) {
  var root = __dirname + '/bar';
  var entries = []
  t.plan(1);
  canadianPub(root)
    .on('error', t.fail.bind(t))
    .on('data', function (d) {
      entries.push(d.toString());
    })
    .on('end', function () {
      t.deepEqual(
          entries
        , [ 'package.json\n',
            'index.js\n' ]
        , 'emits all files that would be published'
      )
    });
})
