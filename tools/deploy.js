#!/usr/bin/env node

/**
# Deployment script
 */

// Load dependencies

var optimist = require('optimist'),
    path = require('path'),
    strftime = require('strftime'),
    fs = require('fs'),
    util = require('util'),
    shell = require('shelljs');

var stat, ppwd, lib, script, scripts = {};

// Parse arguments

//var suffix = strftime("-%Y_%m_%d-%I_%M_%S%p");	// non-monotonic, but same as before
var suffix = strftime("-%Y-%m-%d_%H-%M-%S");		// monotonic & ISO-compliant

var node = process.argv[0],
    source = path.resolve(__dirname, '..'),
    enyoDir = path.resolve(source, "enyo"),
    buildDir = path.resolve(source, "build"),
    name = path.basename(source),
    outdir = path.resolve(source, 'deploy', name + suffix);

var argv = optimist.usage("Usage: $0 [-e <enyo_dir>] [-o <out_dir>]", {
	'o': {
		description: "alternate output directory",
		required: false,
		default: outdir
	},
	'e': {
		description: "location of the enyo framework",
		required: false,
		default: enyoDir
	},
	'b': {
		description: "alternate build directory (to not clobber the source code)",
		required: false,
		default: buildDir
	},
	'c': {
		description: "do not run the LESS compiler",
		boolean: true,
		required: false,
		default: false
	}
}).argv;

if (argv.h) {
	debugger;
	optimist.showHelp();
	process.exit(1);
}

var minifier = path.resolve(argv.e, 'tools', 'minifier', 'minify.js');
console.log("Using: enyo_dir=" + argv.e);
console.log("Using: build_dir=" + argv.b);
console.log("Using: out_dir=" + argv.o);

// utils

function run(args) {
	var command = args.join(' ');
	console.log("Running: '"+ command + "'");
	if (shell.exec(command).code !== 0) {
		throw new Error("*** Fail: '" + command + "'");
	}
}

// Prepare target directory

shell.rm('-rf', path.resolve(argv.o));
shell.rm('-rf', path.resolve(argv.o));
shell.mkdir('-p', path.join(argv.o));

// Build / Minify

process.chdir(path.resolve(argv.e, 'minify'));
run([node, minifier,
     '-no-alias',
     '-enyo', argv.e,
     // XXX generates $buildDir/enyo.(js|css)' so this is
     // XXX rather a 'prefix' than an 'output'...
     '-output', path.join(argv.b, 'enyo'),
     'package.js']);

process.chdir(__dirname);
run([node, minifier,
     '-enyo', argv.e,
     '-output', path.join(argv.b, 'app'),
     (argv.c ? '-no-less' : ''),
     'package.js']);

// Deploy / Copy

shell.mkdir('-p', path.join(argv.o, 'lib'));
shell.cp(path.join(source, 'index.html'), path.join(source, 'icon.png'), argv.o);
shell.cp('-r', path.join(source, 'assets'), argv.b, argv.o);

shell.ls(path.join(source, 'lib')).forEach(function(lib) {
	var libOutdir = path.join(argv.o, 'lib', lib);
	// load & execute sub-'deploy.js'
	try {
		script = path.join(source, 'lib', lib, 'deploy.js');
		stat = fs.statSync(script);
		if (!stat.isFile())
			throw new Error("*** Not a file: '" + script + "'");
		scripts[lib] = require(script);
		scripts[lib].deploy(libOutdir);
	} catch(e) {
		// backward compatibility: run deploy.sh or deploy.bat
		try {
			script = path.join(source, 'lib', lib, 'deploy.' + (process.platform === 'win32' ? 'bat' : 'sh'));
			stat = fs.statSync(script);
			if (!stat.isFile())
				throw new Error("*** Not a file: '" + script + "'");
			run([script, libOutdir]);
		} catch(e) {
			// no deploy.(js|bat|js): copy everything
			shell.cp('-r', path.join(source, 'lib', lib), path.join(argv.o, 'lib'));
		}
	}
});
