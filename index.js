'use strict';

var exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , PassThrough = require('readable-stream').PassThrough
  , zlib = require('zlib')
  , tar = require('tar-stream')

module.exports = function canadianPub(root) {
  root = root || process.cwd();

  var out = new PassThrough();

  getMetadata(root, function(err, meta) {
    if (err) return out.emit('error', err);
    out.emit('metadata', meta);
    listFiles(root, out);
  });
  return out;
}

function getMetadata(root, callback) {
  exec('npm whoami', function (err, stdout, stderr) {
    if (err) return callback('Cannot get current npm user');
    var npmUser = stdout.trim();
    var packagePath = path.join(root, 'package.json');
    try {
      var pkg = require(packagePath);
    } catch (ex) {
      return callback('error', 'Invalid package: ' + packagePath);
    }
    callback(null, {
      name: pkg.name,
      version: pkg.version,
      user: npmUser
    });
  });
}

function listFiles(root, out) {
  exec('npm pack --ignore-scripts ' + root, function (err, stdout, stderr) {
    if (err) return out.emit('error', 'Failed to pack archive: ' + err);

    // npm logs created filename on stdout
    var tarFile = path.join(process.cwd(), stdout.trim().split(/\n+/).pop());

    fs.createReadStream(tarFile)
      .on('error', out.emit.bind(out, 'error'))
      .pipe(zlib.createGunzip())
      .on('error', out.emit.bind(out, 'error'))
      .pipe(tar.extract())
      .on('error', out.emit.bind(out, 'error'))
      .on('entry', function (header, stream, next) {
        out.write(header.name.replace(/^package\//, '') + '\n');
        stream.resume()
        next()
      })
      .on('finish', function () {
        fs.unlink(tarFile, function (err) {
          if (err) return out.emit(err);
          out.emit('end')
        })
      })
  })
}
