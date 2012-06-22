#!/bin/bash

cd `dirname $0`

# build enyo
pushd ../enyo/minify > /dev/null
./minify.sh
popd > /dev/null

# build app
../enyo/tools/minify.sh package.js -output ../build/app
