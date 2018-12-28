'use strict'

var test = require('tape')
var path = require('path')
var registry = require('./registry')
var canadianPub = require('..')

test('start mock registry server', function (t) {
  t.plan(1)

  registry(function (err) {
    t.ifError(err)
  })
})

test('foo with .gitignore and no .npmignore', function (t) {
  t.plan(4)

  var root = path.join(__dirname, 'foo')
  var entries = []

  canadianPub(root)
    .on('error', t.fail.bind(t))
    .on('metadata', function (meta) {
      t.is(meta.name, 'foo')
      t.is(meta.version, '1.2.3')
      t.is(meta.user, 'test-user')
    })
    .on('data', function (d) {
      entries.push(d.toString())
    })
    .on('end', function () {
      t.deepEqual(entries, [
        'package.json\n',
        'index.js\n',
        'example/first.js\n',
        'lib/work.js\n'
      ], 'emits all files that would be published')
    })
})

test('bar with prepublish script', function (t) {
  t.plan(1)

  var root = path.join(__dirname, 'bar')
  var entries = []

  canadianPub(root)
    .on('error', t.fail.bind(t))
    .on('data', function (d) {
      entries.push(d.toString())
    })
    .on('end', function () {
      t.deepEqual(entries, [
        'package.json\n',
        'index.js\n'
      ], 'emits all files that would be published')
    })
})

test('@scope/bar with prepack script', function (t) {
  t.plan(1)

  var root = path.join(__dirname, 'scoped')
  var entries = []

  canadianPub(root)
    .on('error', t.fail.bind(t))
    .on('data', function (d) {
      entries.push(d.toString())
    })
    .on('end', function () {
      t.deepEqual(entries, [
        'package.json\n',
        'index.js\n',
        'other.js\n'
      ], 'emits all files that would be published')
    })
})
