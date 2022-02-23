enyo.kind({
	name: "onyx.sample.SubmenuSample",
	classes: "onyx onyx-sample",
	components: [
		{classes: "onyx-sample-divider", content: "Submenu"},
		{kind: "onyx.MenuDecorator", onSelect: "itemSelected", components:[
			{content:"Contact actions"},
			{kind:"onyx.Menu", components:[
				{content:"Add contact"},
				{kind:"onyx.Submenu", content:"Sort by...", components:[
					{content:"First Name"},
					{content:"Last Name"},
					{content:"Company"}
				]},
				{content:"Sync"}
			]}
		]},
		{tag: "br"},
		{classes: "onyx-sample-divider", content: "Nested Submenu"},
		{kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
			{content: "Email actions"},
			{kind: "onyx.Menu", components: [
				{content: "Reply"},
				{content: "Forward"},
				{kind:"onyx.Submenu", content:"Move to...", components:[
					{kind:"onyx.Submenu", content:"Personal...", components:[
						{content:"Games"},
						{content:"Recpies"}
					]},
					{kind:"onyx.Submenu", content:"Work...", components:[
						{content:"Primary project"},
						{content:"Super secret project"}
					]}
				]},
				{content: "Delete"}
			]}
		]},
		{tag: "br"},
		{kind: "onyx.Groupbox", classes:"onyx-sample-result-box", components: [
			{kind: "onyx.GroupboxHeader", content: "Result"},
			{name:"menuSelection", classes:"onyx-sample-result", content:"No menu selection yet."}
		]}
	],
	create: function() {
		this.inherited(arguments);
	},
	itemSelected: function(inSender, inEvent) {
		this.$.menuSelection.setContent(inEvent.originator.content + " Selected");
	}
});
