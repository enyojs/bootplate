EnyoJS Api Tool
===============

This [Bootplate](http://github.com/enyojs/bootplate) based application scans EnyoJS source code on the fly and produces navigable documentation.

The _manifest.json_ file identifies the code packages to be scanned for documentation.

**IMPORTANT**: in the context of the Api Tool application the `$enyo` and `$lib` macros refer to internal folders. You should not use those macros in _manifest.json_ in a deployed Api Tool application. Instead, use complete paths (relative to the Api Tool folder, or absolute).

For example, given:

	enyo/
	lib/
	  layout/
	api-tool/
	  

_manifest.json_ should look like this:

	[
		{"name": "enyo", "path": "../enyo/source"}
		{"name": "layout", "path": "../lib/layout"}
	]