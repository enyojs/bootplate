enyo.kind({
	name: "onyx.sample.ButtonGroupSample",
	classes: "onyx onyx-sample",
	components: [
		{classes: "onyx-sample-divider", content: "RadioGroup"},
		{kind: "onyx.RadioGroup", onActivate:"radioActivated", components: [
			{content: "Alpha", active: true},
			{content: "Beta"},
			{content: "Gamma"}
		]},
		{tag: "br"},
		{classes: "onyx-sample-divider", content: "TabGroup"},
		{kind: "onyx.RadioGroup", onActivate:"tabActivated", controlClasses: "onyx-tabbutton", components: [
			{content: "Alpha", active: true},
			{content: "Beta"}
		]},
		{tag: "br"},
		{classes: "onyx-sample-divider", content: "Button Group"},
		{kind: "Group", onActivate:"buttonActivated", classes: "onyx-sample-tools group", defaultKind: "onyx.Button", highlander: true, components: [
			{content: "Button A", active: true, classes: "onyx-affirmative"},
			{content: "Button B", classes: "onyx-negative"},
			{content: "Button C", classes: "onyx-blue"}
		]},
		{tag: "br"},
		{kind: "onyx.Groupbox", classes:"onyx-sample-result-box", components: [
			{kind: "onyx.GroupboxHeader", content: "Result"},
			{name:"result", classes:"onyx-sample-result", content:"No button tapped yet."}
		]}
	],
	radioActivated: function(inSender, inEvent) {
		if (inEvent.originator.getActive()) {
			this.$.result.setContent("The \"" + inEvent.originator.getContent() + "\" radio button is selected.");
		}
	},
	tabActivated: function(inSender, inEvent) {
		if (inEvent.originator.getActive()) {
			this.$.result.setContent("The \"" + inEvent.originator.getContent() + "\" tab button is selected.");
		}
	},
	buttonActivated: function(inSender, inEvent) {
		if (inEvent.originator.getActive()) {
			this.$.result.setContent("The \"" + inEvent.originator.getContent() + "\" button is selected.");
		}
	}
});
