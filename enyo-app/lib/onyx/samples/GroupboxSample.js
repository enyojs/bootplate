enyo.kind({
	name: "onyx.sample.GroupboxSample",
	classes: "onyx onyx-sample",
	components: [
		{classes: "onyx-sample-divider", content: "Groupboxes"},
		{kind: "onyx.Groupbox", components: [
			{kind: "onyx.GroupboxHeader", content: "Header"},
			{content: "I'm a group item!", style: "padding: 8px;"},
			{content: "I'm a group item!", style: "padding: 8px;"}
		]},
		{tag: "br"},
		{kind: "onyx.Groupbox", components: [
			{content: "I'm a group item!", style: "padding: 8px;"}
		]},
		{tag: "br"},
		{kind: "onyx.Groupbox", components: [
			{kind: "onyx.GroupboxHeader", content: "Header"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", style: "width: 100%", placeholder: "Enter text here"}
			]},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", style: "width: 100%", value: "Middle"}
			]},
			{kind: "onyx.InputDecorator", style: "background: lightblue;", components: [
				{kind: "onyx.Input", style: "width: 100%;", value: "Last"}
			]}
		]},
		{tag: "br"},
		{kind: "onyx.Groupbox", components: [
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", style: "width: 100%", placeholder: "Enter text here"}
			]}
		]},
		{kind: "onyx.Groupbox", components: [
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", type: "password", style: "width: 100%", placeholder: "Enter Password"}
			]}
		]}
	]
});
