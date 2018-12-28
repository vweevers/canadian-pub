'use strict'

var exec = require('child_process').exec
var path = require('path')
var fs = require('fs')
var PassThrough = require('readable-stream').PassThrough
var pipeline = require('readable-stream').pipeline
var zlib = require('zlib')
var tar = require('tar-stream')
var blacklist = require('./blacklist')

module.exports = function canadianPub (root, options) {
  root = root || process.cwd()
  options = options || {}

  var out = new PassThrough()

  getMetadata(root, function (err, meta) {
    if (err) return out.destroy(err)

    out.emit('metadata', meta)
    listFiles(root, out, options, function (err, blacklisted) {
      if (err) return out.destroy(err)

      if (blacklisted.length > 0) {
        return out.destroy(new Error(
          blacklisted.length + ' blacklisted: \n\n' +
          blacklisted.join('\n')
        ))
      }

      out.end()
    })
  })

  return out
}

function getMetadata (root, callback) {
  exec('npm whoami', function (err, stdout, stderr) {
    if (err) return callback(err)

    var npmUser = stdout.trim()
    var packagePath = path.join(root, 'package.json')

    try {
      var pkg = require(packagePath)
    } catch (ex) {
      return callback(ex)
    }

    callback(null, {
      name: pkg.name,
      version: pkg.version,
      user: npmUser
    })
  })
}

function listFiles (root, out, options, cb) {
  exec('npm pack --ignore-scripts ' + root, function (err, stdout, stderr) {
    if (err) return cb(err)

    // npm logs created filename on stdout
    var tarFile = path.join(process.cwd(), stdout.trim().split(/\n+/).pop())
    var blacklisted = []

    pipeline(
      fs.createReadStream(tarFile),
      zlib.createGunzip(),
      tar.extract().on('entry', function (header, stream, next) {
        var name = header.name.replace(/^package\//, '')

        if (blacklist(name)) blacklisted.push(name)
        if (!options.silent) out.write(name + '\n')

        stream.resume()
        next()
      }),
      function (err) {
        if (err) return cb(err)

        fs.unlink(tarFile, function (err) {
          cb(err, blacklisted)
        })
      }
    )
  })
}
