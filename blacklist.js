'use strict'

const mm = require('micromatch')

const patterns = [
  // CI config
  '**/.travis.yml',
  '**/appveyor.yml',
  '**/.circleci/**',
  '**/circle.yml',

  // MSVC artifacts
  '**/*.sln',
  '**/*.vcxproj',
  '**/*.vcxproj.filters',
  '**/*.tlog',
  '**/*.obj',
  '**/*.pdb',
  '**/*.lastbuildstate',

  // Builds
  '**/build/**',
  '**/Release/**',
  '**/Debug/**',

  // Coverage
  '**/coverage/**',
  '**/.nyc_output/**',

  // Lock files (are for apps, not modules)
  '**/yarn.lock',
  '**/package-lock.json',

  // Misc
  '**/.git',
  '**/.gitmodules',
  '**/.dntrc',
  '**/.airtap.yml',
  '**/.airtaprc',
  '**/.zuul.yml',
  '**/.babelrc',
  '**/*.log'
]

module.exports = function (name) {
  return mm.any(name, patterns)
}
