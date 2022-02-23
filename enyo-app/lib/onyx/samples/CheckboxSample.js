enyo.kind({
	name: "onyx.sample.CheckboxSample",
	classes: "onyx onyx-sample",
	components: [
		{classes: "onyx-sample-divider", content: "Checkboxes"},
		{classes: "onyx-sample-tools", components: [
			{kind:"onyx.Checkbox", onchange:"checkboxChanged"},
			{kind:"onyx.Checkbox", onchange:"checkboxChanged"},
			{kind:"onyx.Checkbox", onchange:"checkboxChanged", checked: true}
		]},
		{tag: "br"},
		{classes: "onyx-sample-divider", content: "Checkboxes Group"},
		{kind: "Group", classes: "onyx-sample-tools group", onActivate:"groupActivated", highlander: true, components: [
			{kind:"onyx.Checkbox", checked: true},
			{kind:"onyx.Checkbox"},
			{kind:"onyx.Checkbox"}
		]},
		{tag: "br"},
		{kind: "onyx.Groupbox", classes:"onyx-sample-result-box", components: [
			{kind: "onyx.GroupboxHeader", content: "Result"},
			{name:"result", classes:"onyx-sample-result", content:"No button tapped yet."}
		]}
	],
	checkboxChanged: function(inSender, inEvent) {
		this.$.result.setContent(inSender.name + " was " + (inSender.getValue() ? " selected." : "deselected."));
	},
	ordinals: ["1st", "2nd", "3rd"],
	groupActivated: function(inSender, inEvent) {
		if (inEvent.originator.getActive()) {
			var selected = inEvent.originator.indexInContainer();
			this.$.result.setContent("The " + this.ordinals[selected] + " checkbox in the group is selected.");
		}
	}
});
