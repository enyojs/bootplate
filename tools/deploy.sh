#!/bin/bash

# Alert the user of a failed build
errored () {
	errcode=$?
	echo "Deploy encountered errors."
	exit $errcode
}

trap errored ERR

# the folder this script is in (*/bootplate/tools)
TOOLS=$(cd `dirname $0` && pwd)

# application root
SRC="$TOOLS/.."

# enyo location
ENYO="$SRC/enyo"

# deploy script location
DEPLOY="$ENYO/tools/deploy.js"

# check for node, but quietly
if command -v node >/dev/null 2>&1; then
	# use node to invoke deploy with imported parameters
	echo "node $DEPLOY -T -s $SRC -o $SRC/deploy $@"
	node "$DEPLOY" -T -s "$SRC" -o "$SRC/deploy" $@
else
	echo "No node found in path"
	exit 1
fi

# copy files and package if deploying to cordova webos
while [ "$1" != "" ]; do
	case $1 in
		-w | --cordova-webos )
			# copy appinfo.json and cordova*.js files
			DEST="$TOOLS/../deploy/"${PWD##*/}

			cp -v "$SRC"/appinfo.json "$DEST"
			cp -v "$SRC"/cordova*.js "$DEST"

			# package it up
			mkdir -p "$DEST/bin"
			palm-package "$DEST/bin"
			;;
	esac
	case $1 in
		-fxos | --firefoxos )
			# copy manifest.webapp files
			DEST="$TOOLS/../deploy/"${PWD##*/}

			cp -v "$SRC"/manifest.webapp "$DEST"
			;;
	esac
	shift
done
