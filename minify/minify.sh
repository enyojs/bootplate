#!/bin/bash

# build enyo
pushd ../enyo/source/minify > /dev/null
./minify.sh
popd > /dev/null

# build app
../enyo/tools/minify.sh package.js -output ../build/app
