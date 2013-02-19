#!/bin/bash

# the folder this script is in (*/bootplate/tools)
TOOLS=$(cd `dirname $0` && pwd)

# enyo location
ENYO="$TOOLS/../enyo"

# deploy script location
DEPLOY="$ENYO/tools/deploy.js"

# check for node, but quietly
if command -v node >/dev/null 2>&1; then
	# use node to invoke deploy with imported parameters
	echo "enyo/tools/minify.sh args: " $@
	node "$DEPLOY" $@
else
	echo "No node found in path"
	exit 1
fi

# copy files and package if deploying to cordova webos
while [ "$1" != "" ]; do
	case $1 in
		-w | --cordova-webos )
														# copy appinfo.json and cordova*.js files
														SRC="$TOOLS/../"
														DEST="$TOOLS/../deploy/"${PWD##*/}

														cp "$SRC"appinfo.json $DEST -v
														cp "$SRC"cordova*.js $DEST -v

														# package it up
														mkdir -p "$DEST/bin"
														palm-package "$DEST/bin"
														;;
	esac
	shift
done
