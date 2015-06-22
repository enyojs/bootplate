/**
	Instantiate your enyo.Application kind in this file.  Note,
	application rendering should be deferred until DOM is ready by wrapping
	it in a call to ready().
*/

var
	ready = require('enyo/ready'),
	App = require('./src/App');

ready(function () {
	new App();
});
