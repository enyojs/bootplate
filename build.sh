#!/bin/bash

mydir=$(cd `dirname $0` && pwd)
echo "Building for Web..."
$mydir/enyo-app/tools/deploy.sh

if [ "$1" = "android" ]; then
    cp $mydir/enyo-app/sampler $mydir/cordova-app/www -R
fi