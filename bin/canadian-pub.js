#!/usr/bin/env node
'use strict'

var path = require('path')
var canadianPub = require('..')
var root = path.resolve('.', process.argv[2] || '')

canadianPub(root)
  .on('metadata', function (meta) {
    var details = meta.name + '@' + meta.version + ' as ' + meta.user
    console.log('npm will publish ' + details + ', including the following files eh:\n')
  })
  .on('error', function (err) {
    console.error(err)
  })
  .pipe(process.stdout)
