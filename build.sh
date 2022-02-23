#!/bin/bash

mydir=$(cd `dirname $0` && pwd)
rm -rf $mydir/bin/*
mkdir $mydir/bin/www -p

webOS=0
android=0
luneOS=0
for arg in "$@"; do
    if [ "$arg" = 'webos' ]; then
        webOS=1
    fi
    if [ "$arg" = 'android' ]; then
        android=1
    fi
    if [ "$arg" = 'luneos' ]; then
        webOS=1
    fi
done

if [ $webOS -eq 1 ]; then
    echo "Building for web and webOS..."
    $mydir/enyo-app/tools/deploy.sh -w
    mv $mydir/enyo-app/deploy/bin/*.ipk $mydir/bin/
else
    echo "Building for web..."
    $mydir/enyo-app/tools/deploy.sh
fi
cp $mydir/enyo-app/deploy/* $mydir/bin/www/ -R

if [ $android -eq 1 ]; then
    echo "Building for Android..."
    dirname=$mydir/cordova-app
    cd $mydir/cordova-app
    cordova platform add android
    echo "Copying to Cordova..."
    cp $mydir/build-extras.gradle $mydir/cordova-app/platforms/android
    cp $mydir/enyo-app/deploy/* $mydir/cordova-app/www -R
    cd $mydir/cordova-app
    echo "Building Cordova..."
    cordova build android
    cp $mydir/cordova-app/platforms/android/app/build/outputs/apk/debug/* $mydir/bin/
fi

echo
echo "Build output at: $mydir/bin/"
ls $mydir/bin/
