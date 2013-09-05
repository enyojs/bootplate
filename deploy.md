# Minification and Deployment
## Understanding and Using Minification

Enyo comes with a minification tool based on UglifyJS, run by Node.js.

This tool can be used to compress the framework, other libraries, and applications, and will keep load order intact as well as correct url paths in css.

### Why compress?

Compressing enyo apps greatly reduces load times of applications, as well as reducing overall code size.

This way, you can be very verbose in the documentation of your source code, without that impacting the performance of your application in production.

### What is compressed

For enyo, the libraries, and your code: **external assets such as images will not be copied or moved**.

Instead, the CSS url paths are fixed up to reference the new path from the build location.

### How to compress

To compress your application, you must run the script named `deploy.js` that comes with Enyo, as `node enyo/tools/deploy.js`.  Bootplate provides 2 wrappers scripts to shorten the minification learning curve.  You can just run:

    C:\path\to\bootplate\> cd tools
    C:\path\to\bootplate\tools> deploy.bat

or (on Mac & Linux):

    $ cd /path/to/bootplate/tools
    $ bash ./deploy.sh

This script will run the minification tool located in `enyo/tools/minifier/deploy.js`, and make a build of enyo, then a build of your app.

Any libraries referenced in your `package.js` manifest will be built into your app's built code.

**NOTE:** `deploy.js` expects to find a `deploy.json` manifest in the root-folder of your application. This manifest then defines where are (1) the top-level `package.js`, (2) the location of the Enyo framework within the applicatio source & what are the various libraries & assets.  A typical default `package.json` contains:

```json
{
	"enyo": "./enyo",
	"packagejs": "./package.js",
	"assets": ["./icon.png", "./index.html", "./assets"],
	"libs": ["./lib/onyx", "./lib/layout"]
}
```

### What comes out?

After running the `deploy.bat|sh` script, two new folders (`build` and `deploy`) will be located next to your `source` directory.

#### Minification test folder - build

```
build
├── app.css
├── app.js
├── enyo.css
└── enyo.js
```

These generated files will be loaded in the given order by `index.html`.

#### Deployment folder - deploy

The `deploy` folder contains a ready-to-be-shipped minified version of your application, including its declared assets & libraries in addition to the content of the `build folder`.

If the libraries have a compatible `deploy.json` (use to be `deploy.sh` or `deploy.bat` scripts), they will be used, and a minimal copy will be placed in the deployment's `./lib` folder.

If no `deploy.(json|sh|bat)` script is found for the libraries, all of each library is copied into the `deploy/lib` folder to provide maximum safety.

If you are adding a library, please add a `deploy.json` file similar to the ones in `lib/onyx` or `lib/layout`.

If no images or files are needed from the library, just include the following (the same as `lib/layout`):

```json
{
	"packagejs": "./package.js",
	"assets": [],
	"libs": []
}
```

**NOTE:** In case you want full control of the minification process (target folders... etc), get familiar with the underlying Node.js script using:

    $ node enyo/tools/deploy.js -h

**NOTE:** For reference, the minification of an un-modified `bootplate` results in the following `deploy/` tree:

```
deploy
├── assets
│   └── favicon.ico
├── build
│   ├── app.css
│   ├── app.js
│   ├── enyo.css
│   └── enyo.js
├── icon.png
├── index.html
└── lib
    └── onyx
        ├── LICENSE-2.0.txt
        └── images
            ├── checkbox.png
            ├── close-active.png
            ├── close-inactive.png
            ├── grabbutton.png
            ├── gradient-invert.png
            ├── gradient.png
            ├── more.png
            ├── progress-button-cancel.png
            ├── search-input-cancel.png
            ├── search-input-search.png
            ├── slider-handle.png
            ├── spinner-dark.gif
            └── spinner-light.gif
```
