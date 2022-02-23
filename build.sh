#!/bin/bash

mydir=$(cd `dirname $0` && pwd)
echo "Building for Web..."
$mydir/enyo-app/tools/deploy.sh

if [ "$1" = "android" ]; then
    echo "Building for Android..."
    dirname=$mydir/cordova-app
    #cd "$(dirname "${BASH_SOURCE[0]}")"
    cd $mydir/cordova-app
    pwd
    cordova platform add android
    echo "Copying to Cordova..."
    cp $mydir/enyo-app/deploy/* $mydir/cordova-app/www -R

fi