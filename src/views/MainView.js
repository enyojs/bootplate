/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
*/

var
	kind = require('enyo/kind'),
	FittableRows = require('layout/FittableRows'),
	Toolbar = require('onyx/Toolbar'),
	Scroller = require('enyo/Scroller'),
	Button = require('onyx/Button');


module.exports = kind({
	kind: FittableRows,
	fit: true,
	components:[
		{kind: Toolbar, content: "Hello World"},
		{kind: Scroller, fit: true, components: [
			{name: "main", classes: "nice-padding", allowHtml: true}
		]},
		{kind: Toolbar, components: [
			{kind: Button, content: "Tap me", ontap: "helloWorldTap"}
		]}
	],
	helloWorldTap: function(inSender, inEvent) {
		this.$.main.addContent("The button was tapped.<br/>");
	}
});
