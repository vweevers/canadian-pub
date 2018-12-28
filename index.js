'use strict'

var exec = require('child_process').exec
var path = require('path')
var fs = require('fs')
var PassThrough = require('readable-stream').PassThrough
var pipeline = require('readable-stream').pipeline
var zlib = require('zlib')
var tar = require('tar-stream')

module.exports = function canadianPub (root) {
  root = root || process.cwd()

  var out = new PassThrough()

  getMetadata(root, function (err, meta) {
    if (err) return out.destroy(err)
    out.emit('metadata', meta)
    listFiles(root, out)
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

function listFiles (root, out) {
  exec('npm pack --ignore-scripts ' + root, function (err, stdout, stderr) {
    if (err) return out.destroy(err)

    // npm logs created filename on stdout
    var tarFile = path.join(process.cwd(), stdout.trim().split(/\n+/).pop())

    pipeline(
      fs.createReadStream(tarFile),
      zlib.createGunzip(),
      tar.extract().on('entry', function (header, stream, next) {
        out.write(header.name.replace(/^package\//, '') + '\n')
        stream.resume()
        next()
      }),
      function (err) {
        if (err) return out.destroy(err)

        fs.unlink(tarFile, function (err) {
          if (err) return out.destroy(err)
          out.end()
        })
      }
    )
  })
}
