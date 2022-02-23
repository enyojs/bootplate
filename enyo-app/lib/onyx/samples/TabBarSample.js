/*global enyo, setTimeout */

enyo.kind({
	name: "SimpleTabBar",
	fit: true,
	components: [
		{name:"bar",kind: "onyx.TabBar"},
		{
			style: "border: 2px solid grey; ",
			components: [
				{
					content: 'Only the content of this kind is changed',
					style: 'padding: 1em'
				},
				{name: 'stuff', content: 'empty', style: 'padding: 1em'}
			]
		}
	],

	handlers: {
		onTabChanged: "switchStuff"
	},

	rendered: function() {
		this.inherited(arguments);
		this.$.bar.addTab(
			{
				'caption': 'English',
				'tooltipMsg': 'English/Anglais',
				'data' : { 'msg': 'Hello World !' } // arbitrary user data
			}
		) ;
		this.$.bar.addTab(
			{
				'caption': 'Français',
				'tooltipMsg': 'French/Français',
				'data' : { 'msg': 'Bonjour tout le monde !' } // arbitrary user data
			}
		) ;
	},

	switchStuff: function(inSender,inEvent) {
		this.log("Tapped tab with caption "+ inEvent.caption
			+ " and message " + inEvent.data.msg );
		this.$.stuff.setContent( inEvent.data.msg);
	}
});

enyo.kind(
	{
		name: "DynamicTabBar",
		fit: true,
		components: [
			{name:"bar",kind: "onyx.TabBar", maxMenuHeight: 200},
			{
				style: "border: 2px solid grey; ",
				components: [
					{
						content: 'create many tabs and reduce the width of the browser'
					},
					{name: 'stuff', content: 'empty', style: 'padding: 1em'},
					{
						kind: 'onyx.Button',
						content: 'create tab',
						ontap: 'addATab',
						style: 'margin: 0.5em'
					},
					{
						kind: 'onyx.Button',
						content: 'kill last tab',
						ontap: 'killTab'
					}
				]
			}
		],

		handlers: {
			onTabChanged: "switchStuff"
		},

		number: 1,
		rendered: function() {
			this.inherited(arguments);
			var date = new Date();
			this.creationTime = date.getTime();
			this.addATab() ;
		},

		addATab: function(inSender,inEvent) {
			this.log("adding a tab");
			var date = new Date();
			var delta = ( date.getTime() - this.creationTime ) / 1000 ;
			this.$.bar.addTab(
				{
					'caption': 'Tab label ' + this.number ,
					data: { msg: "tab " + this.number++ + " created after " + delta + " seconds" }
				}
			) ;
		},

		switchStuff: function(inSender,inEvent) {
			this.log("Tapped tab with caption "+ inEvent.caption
				+ " and message " + inEvent.data.msg );
			this.$.stuff.setContent( inEvent.data.msg);
		},
		killTab: function(inSender,inEvent) {
			this.log("killing tab");
			this.$.bar.removeTab({index: this.number-- - 2});
		}

	}
);

// This class shows how actual switch or actual close can be controlled
// from the application. In the example below, these are controlled by a
// 500ms timer.

enyo.kind({
	name: "DelayedTabBar",
	fit: true,
	components: [
		{
			name:"bar",
			kind: "onyx.TabBar",
			checkBeforeChanging: true,
			checkBeforeClosing: true
		},
		{
			style: "border: 2px solid grey; ",
			components: [
				{
					content: 'Only the content of this kind is changed',
					style: 'padding: 1em'
				},
				{name: 'stuff', content: 'empty', style: 'padding: 1em'}
			]
		},
		{
			name: "delayPopup",
			kind: "onyx.Popup",
			modal: true,
			floating: true,
			centered: true,
			content: "delayed"
		}
	],

	handlers: {
		// for convenienve, the same delay is applied to tabChange and close
		// Of course, different handlers can be used.
		onTabChangeRequested: "delayAction",
		onTabChanged:         "updateContent",
		onTabRemoveRequested: "delayAction"
	},

	rendered: function() {
		this.inherited(arguments);
		// With apologies to Morris and Goscinny
		var names = ['Joe','Jack','William','Averell'];

		var add = function (name) {
			this.$.bar.addTab({
				'caption': name,
				'data' : { 'msg': 'Hello ' + name } // arbitrary user data
			});
		};
		enyo.forEach(names, add, this);
	},

	delayAction: function(inSender, inEvent) {
		this.log("Tapped tab with caption "+ inEvent.caption
			+ " and message " + inEvent.data.msg );
		this.$.delayPopup.show();
		setTimeout(enyo.bind(this, this.resumeAction, inSender,inEvent), 500);
	},
	resumeAction: function(inSender,inEvent) {
		this.$.delayPopup.hide();
		this.$.stuff.setContent( inEvent.data.msg);
		inEvent.next(); // call inEvent.next(error) is abort is needed
	},
	updateContent: function(inSender,inEvent) {
		this.$.stuff.setContent( inEvent.data.msg);
	}
});

enyo.kind({
	name: "onyx.sample.TabBarSample",
	classes: "onyx onyx-sample",
	components: [
		{
			classes: "onyx-sample-divider",
			content: "Simple Tab Bar"
		},
		{
			kind:"SimpleTabBar"
		},
		{
			classes: "onyx-sample-divider",
			content: "Dynamic Tab Bar",
			style: 'padding-top: 4em;'
		},
		{
			kind:"DynamicTabBar"
		},
		{
			classes: "onyx-sample-divider",
			content: "Delayed Tab Bar",
			style: 'padding-top: 4em;'
		},
		{
			kind:"DelayedTabBar"
		}

	]
});
