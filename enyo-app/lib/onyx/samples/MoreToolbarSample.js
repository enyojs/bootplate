enyo.kind({
	name: "onyx.sample.MoreToolbarSample",
	classes: "onyx onyx-sample",
	kind: "FittableRows",
	fit: true,
	components: [
		{kind: "onyx.MoreToolbar", components: [
			{content: "More Toolbar", unmoveable: true},
			{kind: "onyx.Button", content: "Alpha"},
			{kind: "onyx.Button", content: "Beta"},
			{kind: "onyx.Button", content: "Gamma", unmoveable: true},
			{kind: "onyx.Button", content: "Epsilon"},
			{kind: "onyx.Button", content: "Othercon"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", placeholder: "pulez"}
			]},
			{kind: "onyx.Button", content: "Maxizon"}
		]},
		{fit: true, style: "background: lightpurple;padding:25px;", components: [
			{content: "The \"More Toolbar\" label and the Gamma button have the unmoveable property set to true."}
		]},
		{kind: "onyx.MoreToolbar", components: [
			{content: "More Toolbar", unmoveable: true},
			{kind: "onyx.Button", content: "Alpha"},
			{kind: "onyx.Button", content: "Beta"},
			{kind: "onyx.Button", content: "Gamma", unmoveable: true},
			{kind: "onyx.Button", content: "Epsilon"},
			{kind: "onyx.Button", content: "Othercon"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", placeholder: "pulez"}
			]},
			{kind: "onyx.Button", content: "Maxizon"}
		]}
	]
});