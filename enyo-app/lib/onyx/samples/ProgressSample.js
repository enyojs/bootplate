enyo.kind({
	name: "onyx.sample.ProgressSample",
	classes: "onyx onyx-sample",
	components: [
		{classes: "onyx-sample-divider", content: "Progress Bars"},
		{kind: "onyx.ProgressBar", progress: 25},
		{kind: "onyx.ProgressBar", animateStripes: false, progress: 25},
		{kind: "onyx.ProgressBar", progress: 25, barClasses: "onyx-green"},
		{kind: "onyx.ProgressBar", progress: 25, barClasses: "onyx-red"},
		{kind: "onyx.ProgressBar", progress: 25, barClasses: "onyx-dark"},
		{kind: "onyx.ProgressBar", animateStripes: false, barClasses: "onyx-light", progress: 50},
		{kind: "onyx.ProgressBar", showStripes: false, progress: 75},
		{tag: "br"},
		{classes: "onyx-sample-divider", content: "Progress Buttons"},
		{kind: "onyx.ProgressButton", progress: 25, onCancel:"clearValue", components: [
			{content: "0"},
			{content: "100", style: "float: right;"}
		]},
		{kind: "onyx.ProgressButton", animateStripes: false, barClasses: "onyx-dark", progress: 50, onCancel:"clearValue"},
		{kind: "onyx.ProgressButton", showStripes: false, progress: 75, onCancel:"clearValue"},
		{tag: "br"},
		{kind: "onyx.InputDecorator", style:"margin-right:10px;", components: [
			{kind: "onyx.Input", placeholder: "Value", style:"width:50px;"}
		]},
		{kind: "onyx.Button", content:"Set", classes:"onyx-sample-spaced-button", ontap:"changeValue"},
		{kind: "onyx.Button", content:"-", classes:"onyx-sample-spaced-button", ontap:"decValue"},
		{kind: "onyx.Button", content:"+", classes:"onyx-sample-spaced-button", ontap:"incValue"},
		{tag: "br"},
		{tag: "br"},
		{kind: "onyx.Checkbox", name:"animateSetting", checked:true},
		{content:"Animated", classes:"enyo-inline onyx-sample-animate-label"},
		{tag: "br"},
		{tag: "br"},
		{classes: "onyx-sample-divider", content: "Sliders"},
		{kind: "onyx.Slider", min: 10, max: 50, value: 30},
		{tag: "br"},
		{kind: "onyx.Slider", lockBar: false, progress: 20, value: 75},
		{tag: "br"},
		{name: "progressSlider", kind: "onyx.Slider", lockBar: false, value: 75},
		{kind: "onyx.Button", content: "Toggle Progress", ontap: "toggleProgress"}
	],
	changeValue: function(inSender, inEvent) {
		for (var i in this.$) {
			if (this.$[i].kind == "onyx.ProgressBar" || this.$[i].kind == "onyx.ProgressButton") {
				if (this.$.animateSetting.getValue()) {
					this.$[i].animateProgressTo(this.$.input.getValue());
				} else {
					this.$[i].setProgress(this.$.input.getValue());
				}
			}
		}
	},
	incValue: function() {
		this.$.input.setValue(Math.min(parseInt(this.$.input.getValue() || 0, 10) + 10, 100));
		this.changeValue();
	},
	decValue: function() {
		this.$.input.setValue(Math.max(parseInt(this.$.input.getValue() || 0, 10) - 10, 0));
		this.changeValue();
	},
	clearValue: function(inSender, inEvent) {
		inSender.setProgress(0);
	},
	toggleProgress: function() {
		this._progressing = !this._progressing;
		this.nextProgress();
	},
	nextProgress: function() {
		if (this._progressing) {
			enyo.requestAnimationFrame(this.bindSafely(function() {
				this.incrementProgress();
				setTimeout(this.bindSafely("nextProgress"), 500);
			}), this.hasNode());
		}
	},
	incrementProgress: function() {
		var p = this.$.progressSlider;
		var i = p.min + ((p.progress - p.min + 5) % (p.max - p.min + 1));
		p.animateProgressTo(i);
	}
});