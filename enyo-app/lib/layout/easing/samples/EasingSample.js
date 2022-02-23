enyo.kind({
	name: 'moon.sample.EasingSample',
	classes: 'onyx enyo-unselectable easing-sample',
	components: [
		{kind: 'enyo.Animator', name: 'animator', onStep: 'animatorStep', onEnd: 'animatorComplete', easingFunction: enyo.easing.linear},
		{name: 'container', classes: 'easing-sample-ball-container', components: [
			{name: 'box', classes: 'easing-sample-ball'}
		]},
		{classes: 'easing-sample-control-container', style: 'display:inline-block;', components: [
			{content: 'Easing Type', classes:'easing-sample-divider'},
			{kind: 'onyx.MenuDecorator', onSelect: 'itemSelected', components: [
				{name: 'menuButton', content: 'Scrolling Popup menu'},
				{kind: 'onyx.Menu', components: [
					{name: 'menuScroller', kind: 'enyo.Scroller', defaultKind: 'onyx.MenuItem', vertical: 'auto', classes: 'enyo-unselectable', maxHeight: '200px', strategyKind: 'TouchScrollStrategy'}
				]}
			]}
		]}
	],
	duration: 1000,
	itemSelected: function(inSender, inEvent) {
		var item = inEvent.selected.content;
		this.$.menuButton.setContent(item);
		this.$.animator.setEasingFunction(enyo.easing[item]);
		this.play();
	},
	play: function() {
		this.$.animator.play({
			startValue: 0,
			endValue: 150,
			node: this.$.box.hasNode(),
			duration: this.duration
		});
	},
	animatorStep: function(inSender) {
		this.$.box.applyStyle('top', inSender.value + 'px');
		return true;
	},
	animatorComplete: function(inSender) {
		this.$.btnAnimate.setDisabled(false);
		this.$.menuButton.setDisabled(false);
		return true;
	},
	create: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.buildMenu();
		};
	}),
	buildMenu: function() {
		var i = 0;
		for (var k in enyo.easing){
			this.$.menuScroller.createComponent({content: k});
			if (i === 0) {
				this.$.menuButton.setContent(k);
			}
			i++;
		}
	}
});
