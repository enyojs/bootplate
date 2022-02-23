enyo.kind({
	name: "onyx.sample.ButtonSample",
	classes: "onyx onyx-sample",
	components: [
		{classes: "onyx-sample-divider", content: "Buttons"},
		{classes: "onyx-sample-tools", components: [
			{kind:"onyx.Button", content: "Button", ontap:"buttonTapped"}
		]},
		{classes: "onyx-sample-tools", components: [
			{kind:"onyx.Button", content: "Affirmative", classes: "onyx-affirmative", ontap:"buttonTapped"},
			{kind:"onyx.Button", content: "Negative", classes: "onyx-negative", ontap:"buttonTapped"},
			{kind:"onyx.Button", content: "Blue", classes: "onyx-blue", ontap:"buttonTapped"},
			{kind:"onyx.Button", content: "Dark", classes: "onyx-dark", ontap:"buttonTapped"},
			{kind:"onyx.Button", content: "Custom", style: "background-color: purple; color: #F1F1F1;", ontap:"buttonTapped"}
		]},
		{classes: "onyx-sample-tools", components: [
			{kind:"onyx.Button", content: "Active", classes: "active", ontap:"buttonTapped"},
			{kind:"onyx.Button", content: "Disabled", disabled: true, ontap:"buttonTapped"},
			{kind:"onyx.Button", content: "Active Disabled", classes: "active", disabled: true, ontap:"buttonTapped"}
		]},
		{classes: "onyx-sample-tools", components: [
			{kind:"onyx.Button", content: "Tall Button", style: "height: 70px;", ontap:"buttonTapped"}
		]},
		{classes: "onyx-sample-divider", content: "Buttons with images"},
		{classes: "onyx-sample-tools", components: [
			{kind: "onyx.Button", name:"Image Button", ontap:"buttonTapped", components: [
				{tag: "img", attributes: {src: "assets/enyo-logo-small.png"}},
				{content: "There is an image here"}
			]},
			{kind: "onyx.Button", name:"Fishbowl Button", ontap:"buttonTapped", components: [
				{kind: "onyx.Icon", src: "assets/fish_bowl.png"}
			]}
		]},
		{kind: "onyx.Groupbox", classes:"onyx-sample-result-box", components: [
			{kind: "onyx.GroupboxHeader", content: "Result"},
			{name:"result", classes:"onyx-sample-result", content:"No button tapped yet."}
		]}
	],
	buttonTapped: function(inSender, inEvent) {
		if (inSender.content){
			this.$.result.setContent("The \"" + inSender.getContent() + "\" button was tapped");
		} else {
			this.$.result.setContent("The \"" + inSender.getName() + "\" button was tapped");
		}
	}
});