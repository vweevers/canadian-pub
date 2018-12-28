# canadian-pub

[![build status](https://secure.travis-ci.org/vweevers/canadian-pub.png)](http://travis-ci.org/vweevers/canadian-pub)

Successor to [`irish-pub`](https://github.com/thlorenz/irish-pub). Feel like npm is drunk or maybe you are and want to verify what gets published via `npm publish`? **canadian-pub** has you covered.

```sh
➝ canadian-pub

npm will publish canadian-pub@1.0.0 as vweevers, including the following files eh:

package.json
.npmignore
README.md
LICENSE
index.js
.travis.yml
bin/canadian-pub.js
test/index.js
test/foo/package.json
test/foo/.npmignore
test/foo/index.js
test/foo/example/first.js
test/foo/lib/work.js
```

## Installation

    npm install -g canadian-pub

## API

### `canadianPub([root])`

Invokes `npm pack` to determine what would be included during `npm publish`. The `root` argument should be the path to the package to publish and defaults to the current working directory.

Returns a [readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) that yields file paths relative to `root`.

## License

[MIT](LICENSE.md) © 2018-present Vincent Weevers. Adapted from `irish-pub`, copyright © 2014 Thorsten Lorenz.
