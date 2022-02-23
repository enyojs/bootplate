# Enyo2 on LuneOS with Cordova

- Requires the [webos-ports-sdk for LuneOS](https://github.com/webOS-ports/webos-ports-sdk)

## Simple and Automated

- Create your Enyo app by adding to and modifying the contents of the `enyo-app` folder
- From the parent folder, use the command line to run `./build.sh luneos`
- Install the output apk using `lune-install`

## DIY (Manual)

- Set up your project the same way you would set up any other bootplate project.
- Modify your index.html and JavaScript files as outlined in this blog post: [JavaScript Apps for Open webOS With Enyo and Cordova](OpenWebOSBlog.md)
- Copy `appinfo.json` from the PhoneGap `'lib/webos/framework'` directory and a cordova JavaScript file from the PhoneGap `'lib/webos/lib'` directory
- Modify `appinfo.json` for your project and add an icon
- run `tools\deploy.bat --cordova-webos` or `tools/deploy.sh --cordova-webos` to build your app.
- Use `lune-install` to install to your webOS device
