#!/bin/bash

cd `dirname $0`

# the deploy target folder
FOLDER=deploy

# the deploy target suffix
SUFFIX=`date "+-%Y_%m_%d-%I_%M_%S%p"`

# The grandparent folder for this script
SOURCE=$(cd `dirname $0`/../; pwd)

# extract project folder name
NAME=${SOURCE##*/}

# target names
if [ -z "${DEPLOY}" ]; then
    DEPLOY="$NAME$SUFFIX"
fi

if [ -z "${TARGET}" ]; then
    TARGET="$SOURCE/$FOLDER/$DEPLOY"
fi    

if [ -d $TARGET ]; then
	echo "$TARGET folder already exists, please rename or remove it and try again."
	exit 1
fi

echo "This script can create a deployment in $TARGET"

cat <<EOF
==========
build step
==========
EOF

./minify.sh

cat <<EOF
=========
copy step
=========
EOF

# make deploy folder
mkdir -p "$TARGET/lib"

# copy root folder files
cp "$SOURCE/index.html" "$SOURCE/icon.png" "$TARGET"

# copy assets and build
cp -r "$SOURCE/assets" "$SOURCE/build" "$TARGET"

for i in "$SOURCE/lib/"*; do
	o=${i##*/}
	if [ -x $i/deploy.sh ]; then
		echo "Deploying $o"
		$i/deploy.sh "$TARGET/lib/$o"
	else
		echo "Copying $o"
		cp -r "$i" "$TARGET/lib"
	fi
done
