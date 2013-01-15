Cordova webOS Instructions:
---------------------------

- Set up your project the same way you would set up any other bootplate project.
- Modify your index.html and JavaScript files as outlined in this blog post: [JavaScript Apps for Open webOS With Enyo and Cordova](http://blog.openwebosproject.org/post/39278618299/javascript-apps-for-open-webos-with-enyo-and-cordova)
- Copy appinfo.json from the PhoneGap 'lib/webos/framework' directory and a cordova JavaScript file from the PhoneGap 'lib/webos/lib' directory
- Modify appinfo.json for your project and add an icon
- run tools\deploy.bat --cordova-webos or tools/deploy.sh --cordova-webos to deploy your app.
