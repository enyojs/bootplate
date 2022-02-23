# Enyo2 on webOS with Cordova

## Simple and Automated

- Create your Enyo app by adding to and modifying the contents of the `enyo-app` folder
- From the parent folder, use the command line to run `./build.sh webos`
- Install the resulting ipk from `bin/` using `palm-install`

## DIY (Manual)

- Set up your project the same way you would set up any other bootplate project.
- Modify your index.html and JavaScript files as outlined in this blog post: [JavaScript Apps for Open webOS With Enyo and Cordova](OpenWebOSBlog.md)
- Copy `appinfo.json` from the PhoneGap `'lib/webos/framework'` directory and a cordova JavaScript file from the PhoneGap `'lib/webos/lib'` directory
- Modify `appinfo.json` for your project and add an icon
- Run `tools\deploy.bat --cordova-webos` or `tools/deploy.sh --cordova-webos` to build your app.
- Use `palm-install` to install the resulting ipk on your webOS device
