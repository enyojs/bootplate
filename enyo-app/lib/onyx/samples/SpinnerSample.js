enyo.kind({
	name: "onyx.sample.SpinnerSample",
	classes: "onyx onyx-sample",
	handlers: {
		onSelect: "itemSelected"
	},
	components: [
		{classes: "onyx-sample-divider", content: "Light Spinner"},
		{style:"background:black; border-radius:5px; padding:15px", components: [
			{kind: "onyx.Spinner"}
		]},
		{tag: "br"},
		{classes: "onyx-sample-divider", content: "Dark Spinner"},
		{style:"background:white; border-radius:5px; padding:15px", components: [
			{kind: "onyx.Spinner", classes: "onyx-light"}
		]}
	]
});
