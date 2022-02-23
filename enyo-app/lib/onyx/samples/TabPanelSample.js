enyo.kind({
	name: "SimpleTabPanel",
	kind: "onyx.TabPanels",
	style: "height: 150px;",
	fit: true,
	components: [
		{	
			name: 'Blue welcome',
			'caption': 'Blue',
			style: "height: 100px; border: 2px solid grey; padding: 20px; color: blue",
			content: 'The whole kind is changed: Blue Hello World !'
		},
		{
			name: 'Red welcome',
			'caption': 'Red',
			style: "height: 100px; border: 2px solid grey; padding: 20px; color: red",
			content: 'The whole kind is changed: Red Hello World !'
		}
	]

});

enyo.kind({
	name: "DynamicTabPanel",
	kind: "onyx.TabPanels",
	style: "height: 150px;",
	components: [{
		'caption': 'Tab label 1' ,
		style: "border: 2px solid grey; padding: 20px;",
		content: "tab created at startup"
	}]
});

enyo.kind({
	name: "onyx.sample.TabPanelSample",
	classes: "onyx onyx-sample",
	components: [
		{
			classes: "onyx-sample-divider",
			content: "Simple Tab Panel"
		},
		{
			kind:"SimpleTabPanel"
		},
		{
			classes: "onyx-sample-divider",
			content: "Dynamic Tab Panel",
			style: 'padding-top: 4em;'
		},
		{
			kind:"DynamicTabPanel",
			name: 'dynamicTP',
			maxMenuHeight: 200
		},
		{
			kind: 'onyx.Button',
			content: 'create tab',
			style: 'margin-top: 2em;',
			ontap: 'addATab'
		},
		{
			kind: 'onyx.Button',
			content: 'kill last tab',
			ontap: 'killTab',
			style: 'margin-left: 10px'
		}
	],

	number: 2, // because 1 tab is create at startup
	create: function() {
		this.inherited(arguments);
		var date = new Date();
		this.creationTime = date.getTime();
	},

	addATab: function(inSender,inEvent) {
		this.log("adding a tab");
		var date = new Date();
		var delta = ( date.getTime() - this.creationTime ) / 1000 ;
		var tooltipMessage = "";
		var contentForTooltip = " and doesn't have a tooltip";
		if(this.number % 2){
			tooltipMessage = "I'm a odd tab => " + this.number;
			contentForTooltip = " and has a tooltip";
		}
		var added = this.$.dynamicTP.createComponent(
			{
				'caption': 'Tab label ' + this.number++ ,
				'tooltipMsg': tooltipMessage,
				style: "border: 2px solid grey; padding: 20px;",
				content: "tab created after " + delta + " seconds" + contentForTooltip
			}
		) ;
		this.render() ;
		this.$.dynamicTP.addTab(added);
	},
	killTab: function(inSender,inEvent) {
		this.log("killing tab");
		this.$.dynamicTP.removeTab({index: this.number-- - 2});
	}
});
