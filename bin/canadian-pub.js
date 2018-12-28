#!/usr/bin/env node
'use strict'

var path = require('path')
var canadianPub = require('..')
var argv = require('minimist')(process.argv.slice(2), {
  boolean: ['silent', 'verbose'],
  alias: {
    s: 'silent'
  }
})

canadianPub(path.resolve('.', argv._[0] || ''), argv)
  .on('metadata', function (meta) {
    if (!argv.silent) {
      var details = meta.name + '@' + meta.version + ' as ' + meta.user
      console.log('npm will publish ' + details + ', including the following files eh:\n')
    }
  })
  .on('error', function (err) {
    console.error()
    console.error(argv.verbose ? err : err.message)
    process.exit(1)
  })
  .pipe(process.stdout)
