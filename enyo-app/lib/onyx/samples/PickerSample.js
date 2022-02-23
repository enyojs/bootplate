enyo.kind({
	name: "onyx.sample.PickerSample",
	kind: "FittableRows",
	classes: "onyx onyx-sample",
	handlers: {
		onSelect: "itemSelected"
	},
	components: [
		{content: "Default Picker", classes:"onyx-sample-divider"},
		{kind: "onyx.PickerDecorator", components: [
			{},
			{kind: "onyx.Picker", components: [
				{content: "Gmail", active: true},
				{content: "Yahoo"},
				{content: "Outlook"},
				{content: "Hotmail"}
			]}
		]},
		{tag: "br"},
		{content: "Picker with Static Button", classes:"onyx-sample-divider"},
		{kind: "onyx.PickerDecorator", components: [
			{kind: "onyx.Button", content: "Pick One...", style: "width: 200px"},
			{kind: "onyx.Picker", components: [
				{content: "Hello!"},
				{content: "I am busy."},
				{content: "Good Bye."}
			]}
		]},
		{tag: "br"},
		{content: "Integer Picker", classes:"onyx-sample-divider"},
		{classes: "onyx-toolbar-inline", components: [
			{kind: "onyx.PickerDecorator", components: [
				{style: "min-width: 60px;"},
				{kind: "onyx.IntegerPicker", min: 0, max: 25, value: 5}
			]}
		]},
		{tag: "br"},
		{content: "Other Pickers", classes:"onyx-sample-divider"},
		{classes: "onyx-toolbar-inline", components: [
			{content: "JS Library", classes: "onyx-sample-label"},
			{kind: "onyx.PickerDecorator", components: [
				{name:"libPickerButton", style: "min-width: 160px;"},
				{name: "libPicker", kind: "onyx.FlyweightPicker", count: 200, onSetupItem: "setupLibs", components: [
					{name: "lib"}
				]}
			]}
		]},
		{tag: "br"},
		{classes: "onyx-toolbar-inline", components: [
			{kind: "onyx.PickerDecorator", components: [
				{},
				{kind: "onyx.Picker", components: [
					{content: "Gmail"},
					{content: "Yahoo"},
					{content: "Outlook"},
					{content: "Hotmail", active: true}
				]}
			]}
		]},
		{tag: "br"},
		{kind: "onyx.Groupbox", classes:"onyx-sample-result-box", components: [
			{kind: "onyx.GroupboxHeader", content: "Selection"},
			{name:"pickerSelection", classes:"onyx-sample-result", content: "Nothing picked yet."}
		]}
	],
	libs: ["Enyo", "AngularJS", "Backbone.js", "Dojo", "Ember.js", "Ext JS", "Google Web Toolkit", "Knockout", "SproutCore", "Spine", "Yahoo! Mojito", "AccDC", "Dojo Toolkit", "Glow", "jQuery", "jQuery Mobile", "midori", "MooTools", "Prototype JavaScript Framework", "YUI Library", "Ample SDK", "DHTMLX", "iX Framework", "jQuery UI", "Lively Kernel", "qooxdoo", "Script.aculo.us", "SmartClient", "D3.js", "JavaScript InfoVis Toolkit", "Kinetic.js", "Processing.js", "Raphael", "SWFObject", "Three.js", "EaseIJS", "Chaplin.js", "Echo", "JavaScriptMVC", "Rialto Toolkit", "Web Atoms JS", "FuncJS", "Google Closure Library", "Joose", "jsPHP", "MochiKit", "PDF.js", "Rico", "Socket.IO", "Spry framework", "Underscore.js", "Wakanda Framework", "Cascade Framework", "Handlebars", "Mustache", "Twitter Bootstrap", "ZURB Foundation", "Modernizr"],
	create: function() {
		this.inherited(arguments);
		this.$.libPicker.setSelected(0);
		this.$.libPickerButton.setContent(this.libs[this.$.libPicker.getSelected()]);
	},
	setupLibs: function(inSender, inEvent) {
		this.$.lib.setContent(this.libs.length > inEvent.index ? this.libs[inEvent.index] : "JS Library " + (inEvent.index-this.libs.length));
		return true;
	},
	itemSelected: function(inSender, inEvent) {
		this.$.pickerSelection.setContent(inEvent.selected.content);
	}
});