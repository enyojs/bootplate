enyo.kind({
	name: "onyx.sample.ToolbarSample",
	classes: "onyx onyx-sample",
	components: [
		{classes: "onyx-sample-divider", content: "ToolBar"},
		{kind: "onyx.Toolbar", components: [
			{kind: "onyx.Grabber"},
			{content: "Header"},
			{kind: "onyx.Button", content: "Button"},
			{kind: "onyx.Button", content: "Down", classes: "active"},
			{kind: "onyx.Button", content: "Button"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", placeholder: "Input"}
			]},
			{kind: "onyx.Button", content: "Right"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", placeholder: "Right Input"}
			]},
			{kind: "onyx.Button", content: "More Right"},
			{content: "There's more"},
			{kind: "onyx.Button", content: "Far Right"}
		]},
		{tag: "br"},

		{classes: "onyx-sample-divider", content: "Scrolling ToolBar"},
		{kind: "Scroller", classes:"onyx-toolbar", touchOverscroll:false, touch:true, vertical:"hidden", style:"margin:0px;", thumb:false, components: [
			{classes: "onyx-toolbar-inline", style: "white-space: nowrap;", components: [
				{kind: "onyx.Grabber"},
				{content: "Header"},
				{kind: "onyx.Button", content: "Button"},
				{kind: "onyx.Button", content: "Down", classes: "active"},
				{kind: "onyx.Button", content: "Button"},
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", placeholder: "Input"}
				]},
				{kind: "onyx.Button", content: "Right"},
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", placeholder: "Right Input"}
				]},
				{kind: "onyx.Button", content: "More Right"},
				{content: "There's more"},
				{kind: "onyx.Button", content: "Far Right"}
			]}
		]},
		{tag: "br"},

		{classes: "onyx-sample-divider", content: "More ToolBar"},
		{kind: "onyx.MoreToolbar", components: [
			{kind: "onyx.Grabber"},
			{content: "Header"},
			{kind: "onyx.Button", content: "Button"},
			{kind: "onyx.Button", content: "Down", classes: "active"},
			{kind: "onyx.Button", content: "Button"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", placeholder: "Input"}
			]},
			{kind: "onyx.Button", content: "Right"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", placeholder: "Right Input"}
			]},
			{kind: "onyx.Button", content: "More Right"},
			{content: "There's more"},
			{kind: "onyx.Button", content: "Far Right"}
		]}
	]
});
