#!/bin/bash

# The location of this script
SOURCE=$(cd `dirname $0`; pwd)

# extract project folder name
NAME=${SOURCE##*/}

# target names
DEPLOY="$NAME-deploy"
TARGET="$SOURCE/../$DEPLOY"

echo "This script can create a deployment in $TARGET"

if [ -d $TARGET ]; then
	echo "$DEPLOY folder already exists, please rename or remove it and try again."
	exit
fi

cat <<EOF
==========
build step
==========
EOF

# FIXME: we push/pop to satisfy minify.bat requirement that package.js be in CWD

pushd "$SOURCE/minify"
./minify.sh
popd

cat <<EOF
=========
copy step
=========
EOF

# make deploy folder
mkdir $TARGET

# copy root folder files
cp $SOURCE/index.html $SOURCE/icon.png $TARGET

# copy assets and build
cp -r $SOURCE/assets $SOURCE/build $TARGET

# copy library items
mkdir $TARGET/lib

for i in $SOURCE/lib/*; do
	o=${i##*/}
	if [ -x $i/deploy.sh ]; then
		echo "Deploying $o"
		$i/deploy.sh $TARGET/lib/$o
	else
		echo "Copying $o"
		cp -r $i $TARGET/lib
	fi
done
