#!/usr/bin/env node
'use strict';
var canadianPub = require('../')

canadianPub(process.cwd())
.on('metadata', function(meta) {
  var details = meta.name + '@' + meta.version + ' as ' + meta.user;
  console.log('npm will publish ' + details + ', including the following files eh:\n');
})
.on('error', function (err) {
  console.error(err);
})
.pipe(process.stdout)
