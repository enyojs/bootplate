## About

bootplate is a template for a minimal Enyo2 and Onyx web application.
You would normally use this to setup your local environment then go and modify the
files to build your own application.

## Use

The bootplate provides a folder structure and app template to allow you to develop
Enyo2 apps for a variety of platforms including legacy webOS, LuneOS, Android and the web.

You create your app by modifying and updating the contents of the `enyo-app` folder.

The build script will help you build the app for different platforms. You specify
which platforms to build for with command line arguments to the build script.

Ensure the script is executable: `chmod +x build.sh`

Call the script, passing a list of the platforms you want to build, with a space between each one:

`.\build.sh webos www android`

If you prefer to be in control, check out the other docs in this folder for platform-specific details.

## Downloading

You can use a Git client to clone this repo and then initialize
submodules. Be aware that you'll need to clone recursively `--recurse-submodules`
to ensure that all the subfolders are downloaded.

Remove the `.git` folder to detach your local folder from the bootplate git repo
so that you can customize the contents for your own app (and add to your own repo)