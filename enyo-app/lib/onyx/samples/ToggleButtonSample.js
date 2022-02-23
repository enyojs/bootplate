enyo.kind({
	name: "onyx.sample.ToggleButtonSample",
	classes: "onyx onyx-sample",
	components: [
		{classes: "onyx-sample-divider", content: "Toggle Buttons"},
		{classes: "onyx-sample-tools", components: [
			{kind:"onyx.ToggleButton", onChange:"toggleChanged", value: true},
			{kind:"onyx.ToggleButton", onChange:"toggleChanged"},
			{kind:"onyx.ToggleButton", onChange:"toggleChanged"},
			{kind:"onyx.ToggleButton", onChange:"toggleChanged", value: true, disabled: true}
		]},
		{tag: "br"},
		{classes: "onyx-sample-divider", content: "Toggle Buttons Group"},
		{kind: "Group", classes: "onyx-sample-tools group", onActivate:"groupActivated", highlander: true, components: [
			{kind:"onyx.ToggleButton"},
			{kind:"onyx.ToggleButton", value: true},
			{kind:"onyx.ToggleButton"}
		]},
		{tag: "br"},
		{kind: "onyx.Groupbox", classes:"onyx-sample-result-box", components: [
			{kind: "onyx.GroupboxHeader", content: "Result"},
			{name:"result", classes:"onyx-sample-result", content:"No button tapped yet."}
		]}
	],
	toggleChanged: function(inSender, inEvent) {
		this.$.result.setContent(inSender.name + " was " + (inSender.getValue() ? " selected." : "deselected."));
	},
	ordinals: ["1st", "2nd", "3rd"],
	groupActivated: function(inSender, inEvent) {
		if (inEvent.originator.getActive()) {
			var selected = inEvent.originator.indexInContainer();
			this.$.result.setContent("The " + this.ordinals[selected] + " toggle button in the group is selected.");
		}
	}
});
