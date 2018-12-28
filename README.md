# canadian-pub

**Successor to [`irish-pub`](https://github.com/thlorenz/irish-pub). Feel like npm is drunk or maybe you are and want to verify what gets published via `npm publish`? `canadian-pub` has you covered.**

[![npm](https://img.shields.io/npm/v/canadian-pub.svg)](https://www.npmjs.com/package/canadian-pub)
![Node version](https://img.shields.io/node/v/canadian-pub.svg)
[![build status](https://secure.travis-ci.org/vweevers/canadian-pub.svg)](http://travis-ci.org/vweevers/canadian-pub)
[![dependencies](https://david-dm.org/vweevers/canadian-pub.svg)](https://david-dm.org/vweevers/canadian-pub)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Usage

```sh
➝ canadian-pub

npm will publish canadian-pub@1.0.0 as vweevers, including the following files eh:

package.json
index.js
LICENSE.md
README.md
bin/canadian-pub.js
```

Similar to `npm pack --dry-run` but less noisy and printing files to stdout instead of stderr. In addition `canadian-pub` protects you from [common mistakes](blacklist.js), printing errors to stderr and exiting with code `1`:

```
3 blacklisted:

.travis.yml
deps/snappy/snappy.sln
.nyc_output/9daf5b463f958a9071a9efcc7fbac6d9
```

This makes it useful as an npm `prepublish(Only)` script. Add `--silent` or `-s` to skip printing files. E.g.:

```json
"scripts": {
  "prepublishOnly": "canadian-pub -s"
}
```

## Install

With [npm](https://npmjs.org) do:

```
npm install canadian-pub --save-dev
```

Or globally:

```
npm install canadian-pub -g
```

## CLI

```
canadian-pub [root] [--silent/-s] [--verbose]
```

See description of `root` and options below.

## API

### `canadianPub([root][, options])`

Invokes `npm pack --ignore-scripts` to determine what would be included during `npm publish`. The `root` argument should be the path to the package to publish and defaults to the current working directory.

Returns a [readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) that yields file paths relative to `root`.

## Options

- `silent`: boolean. Skip printing files.
- `verbose`: boolean (cli only). Print stack traces.

## License

[MIT](LICENSE.md) © 2018-present Vincent Weevers. Adapted from `irish-pub`, copyright © 2014 Thorsten Lorenz.
