# Enyo2 on the Web

Enyo2 apps natively run in modern web browsers, with the only caveat being CORS restrictions.
If you want to cross-target other platforms, particularly webOS, ensure you don't do use
modern web features that won't render on older browsers.

## Simple and Automated

- Create your Enyo app by adding to and modifying the contents of the `enyo-app` folder
- From the parent folder, use the command line to run `./build.sh www`
- Copy (or symlink) the output `bin/www` folder to your web server

## DIY (Manual)

- Create your Cordova project the standard way:
    - eg: `cordova create hello com.example.hello HelloWorld`
- Add the android platform
    - `cd <folder>` (eg: `hello`)
    - `cordova platform add android`
- Build your project the Enyo2 way:
    - `tools/deploy.sh` for *nix or `tools/deploy.bat` for Windows
- Copy the resulting build output from the Enyo `deploy` folder to the Cordova `www` folder (eg: `hello\www`)
- Use the `config.xml` included in this project to add the Android namespace and security exeptions
- Add the security exemption meta tag to your .html files in `www`:
    - `<meta http-equiv="Content-Security-Policy" content="default-src *; style-src * 'unsafe-inline'; script-src * 'unsafe-inline' 'unsafe-eval'">`
- Build your combined webOS + Cordova app for Android:
    - `cordova build android`

## Debugging

- Use `adb` to install the resulting apk to your Android device.
- You can use Chrome on your PC to debug Enyo apps:
    - With the Android device connected over USB (and USB debugging enabled)
    - Go to `chrome://inspect/#devices` in your Chrome-based browser
    - Launch your app from your Android device
    - Click "inspect" in the Chrome page where your app shows up