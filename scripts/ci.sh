#!/bin/sh
set -e

npm install
npm run audit

NODE_ENV=production yarn npm-run-all clean -p lint check_formatting
yarn lerna run build --stream

pushd pbi-heat-streams
npm run lint 
npm run package

