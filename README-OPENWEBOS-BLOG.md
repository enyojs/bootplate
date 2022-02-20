# JavaScript Apps for Open webOS With Enyo and Cordova

In the past, we encouraged developers to use Enyo to develop apps for webOS. We still love Enyo and encourage developers to use it. However, as we moved to Open webOS we decided to embrace all the JavaScript frameworks developers use. Enyo, a truly cross-platform app development tool, is no longer bundled with Open webOS. Enyo 1.0 provided a number of webOS-specific functions. Enyo 2.0 doesn’t have that so we needed a way to provide access to device features. The solution we decided upon was to use Apache Cordova for deploying apps on Open webOS.

This will make it easier for developers to not only deploy apps for Open webOS but will also help developers port apps developed for Open webOS to other platforms. With a single code base you can deploy native-quality apps across many mobile devices. We still, of course, love Enyo so we’ll demonstrate how to use it to create an app with Cordova.

In this article we’ll discuss some of the important considerations when building Open webOS (and regular webOS) apps with Enyo 2.0. webOS specific functions that were present in Enyo 1.0 aren’t available. This is where Cordova comes in. It was designed to provide a consistent interface regardless of the device an app is deployed on.

We’re going to build upon the Bootplate project, a starter app that is a part of Enyo 2.0. Bootplate provides tools for debugging apps in a desktop browser and tools for preparing apps for deployment. Bootplate is available from the Enyo GitHub repo or for download from the Enyo Web site. For more information, visit the Bootplate wiki page.

Once Bootplate is downloaded you’ll need to modify the project a bit to be ready for Cordova. To make debugging easy we’re going to leave debug.html alone so that we can test in desktop browsers. We’ll modify index.html to load the Cordova JavaScript library. Modify the head section to add the following before the script to include Enyo:
```
<script src="cordova.js"></script>
```
With other frameworks you might need to tap in to the onDeviceReady() event. Enyo supports PhoneGap events out of the box and you can subscribe to them using Signals. To listen for the Cordova startup event add the following to your main app kind’s components block:
```
{kind: "Signals", ondeviceready: "deviceready"}
```
This signal will be sent as soon as Cordova detects the device is ready. If you need to call any Cordova functions on initialization simply place them in the deviceready() function.

Once done with that step, we can prepare the project for deployment by running the deploy script. For Windows users, `deploy\deploy.bat` and for everyone else `deploy/deploy.sh`.

The next step is setting up the Cordova environment. For this, we’ll use the PhoneGap build of Cordova, available here. At the time of this post, the latest version is 2.2.0. The PhoneGap environment will exist side-by-side with Bootplate and should not be installed in the same directory. Each supported platform in PhoneGap has a directory under lib. For webOS deployments we’ll be placing our app’s files into lib/webos/framework. To prepare, delete all files in this directory except for appinfo.json, which you can edit to your liking.

Copy the of the bootplate deploy directory to `lib/webos/framework` inside your phonegap directory. Now you can package the app for deployment. You can use PhoneGap’s `make` command or use `palm-package` to pack up the contents of the `lib/webos` directory.

Some of the functionality in PhoneGap for webOS is also webOS specific, for example you can call webOS services from your app. Here’s an example using the connectionmanager service:
```
create: function() {
    	this.inherited(arguments);
        var request = navigator.service.Request("palm://com.palm.connectionmanager",
        {
        method: 'getstatus',
        parameters: {},
        onSuccess: enyo.bind(this, "showVersion"),
        });
},
showVersion: function(inResult) {
    	enyo.log("result="+JSON.stringify(inResult));
}
```