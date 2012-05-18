# Minification and Deployment
## Understanding and Using Minification

Enyo comes with a minification tool based on NodeJS and UglifyJS.

This tool can be used to compress the framework, other libraries, and applications, and will keep load order intact as well as correct url paths in css.

### Why compress?

Compressing enyo apps greatly reduces load times of appliactions, as well as reducing overall code size.

This way, you can be very verbose in the documentation of your source code, without that impacting the performance of your application in production.

### What is compressed

For enyo, the libraries, and your code: **external assets such as images will not be copied or moved**.

Instead, the CSS url paths are fixed up to reference the new path from the build location.

### How to compress

To compress your application, you must enter the `minify` folder and run one of the scripts.
- On Windows, just double click on `minify.bat`
- On Mac and Linux, run `minify.sh`

Both scripts will run the minification tool located in `enyo/tools/minify`, and make a build of enyo, then a build of your app.

Any libraries referenced in your `package.js` manifest will be built into your app's built code.

**NOTE:** The `package.js` file inside the `minify` folder is mandatory, and only references your app's `package.js` to keep paths correct. Do not modify this.

### What comes out?

After running the minify script, a new folder `build` will be located next to your `source` directory.

In it will be 4 files:
- enyo.css
- enyo.js
- app.css
- app.js

These files will be loaded in the given order by `index.html`.

## Deployment

The deploy scripts included here will make a production ready copy of your application, and copy it into a packeagable folder.

### How to run

Just execute the platform specific `deploy` script.

### What comes out?

The output of the `deploy` scripts will minify your appliaction, and copy the necessary files into `deploy/<appname>-<date>-<time>/`.

If the libraries have a compatible `deploy` script, they will be executed, and a minimal copy will be placed in the deployment's lib folder.

If no `deploy` script is found for the library, all of the library is copied into the lib folder to provide maximum safety.

If you are adding a library, please add a `deploy.sh` file and `deploy.bat` file similar to the ones in `lib/onyx`.

If no images or files are needed from the library, just include blank (and executable) copies of the deploy scripts.
