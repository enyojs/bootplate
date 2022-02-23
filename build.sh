#!/bin/bash

mydir=$(cd `dirname $0` && pwd)
rm -rf $mydir/bin/*
mkdir $mydir/bin/ -p

www=0
webOS=0
android=0
for arg in "$@"; do
    if [ "$arg" = 'webos' ]; then
        webOS=1
    fi
    if [ "$arg" = 'luneos' ]; then
        webOS=1
    fi
    if [ "$arg" = 'android' ]; then
        android=1
    fi
    if [ "$arg" = 'www' ]; then
        www=1
    fi
    if [ "$arg" = 'web' ]; then
        www=1
    fi
done

if [[ $www -eq 0 ]] && [[ $webOS -eq 0 ]] && [[ $android -eq 0 ]] ; then
    echo "No build target specified"
    echo "Allowed: webos www android"
    echo "(or any combination)"
    exit
fi

if [ $webOS -eq 1 ]; then
    echo "Building for webOS..."
    $mydir/enyo-app/tools/deploy.sh -w
    mv $mydir/enyo-app/deploy/bin/*.ipk $mydir/bin/
else
    echo "Building for web..."
    $mydir/enyo-app/tools/deploy.sh
fi

if [ $android -eq 1 ]; then
    echo "Building for Android..."
    dirname=$mydir/cordova-app
    cd $mydir/cordova-app
    cordova platform add android
    echo "Copying to Cordova..."
    cp $mydir/enyo-app/deploy/* $mydir/cordova-app/www -R
    cd $mydir/cordova-app
    echo "Building Cordova..."
    cordova build android --buildConfig=build.json
    cp $mydir/cordova-app/platforms/android/app/build/outputs/apk/debug/* $mydir/bin/
fi

echo "Cleaning up..."
if [ $www -eq 1 ]; then
    mkdir $mydir/bin/www -p
    cp $mydir/enyo-app/deploy/* $mydir/bin/www/ -R
fi
rm -rf $mydir/enyo-app/deploy/*
rm -rf $mydir/enyo-app/build/*

echo
echo "Build output at: $mydir/bin/"
ls $mydir/bin/
