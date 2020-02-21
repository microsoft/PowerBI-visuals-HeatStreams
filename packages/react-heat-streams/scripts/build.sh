#!/bin/sh
set -e

# Build the react heat streams package
tsc
babel --config-file ../../babelrc.esm.js -d dist/esm lib
babel --config-file ../../babelrc.cjs.js -d dist/cjs lib

# Copy over library to PowerBI build area
mkdir -p ../../pbi-heat-streams/ext/react-heat-streams
cp -r lib ../../pbi-heat-streams/ext/react-heat-streams/
cp -r dist ../../pbi-heat-streams/ext/react-heat-streams/
cp ./package.json ../../pbi-heat-streams/ext/react-heat-streams