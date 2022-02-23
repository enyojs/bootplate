#!/bin/bash

mydir=$(cd `dirname $0` && pwd)
echo "Building for Web..."
$mydir/enyo-app/tools/deploy.sh

if [ "$1" = "android" ]; then
    echo "Building for Android..."
    cd $mydir/cordova-app
    `cordova platform add android`
    echo "Copying to Cordova..."
    cp $mydir/enyo-app/deploy/* $mydir/cordova-app/www -R

fi