enyo.kind({
	name: 'enyo.sample.PersistentSwipeableItemSample',
	kind: 'FittableRows',
	classes: 'list-sample-persistent-swipeable-item enyo-fit',
	data: ['Cat','Dog','Hippopotamus'],
	components: [
		{
			kind: 'List',
			classes: 'list-sample-persistent-swipeable-item-list enyo-unselectable',
			fit: true,
			multiSelect: true,
			reorderable: false,
			enableSwipe: true,
			centerReorderContainer: false,
			onSetupItem: 'setupItem',
			onSetupSwipeItem: 'setupSwipeItem',
			onSwipeComplete: 'swipeComplete',
			components: [
				{name: 'item', classes: 'list-sample-persistent-swipeable-item-item', components: [
					{name: 'text', classes: 'itemLabel', allowHtml: true}
				]}
			],
			swipeableComponents: [
				{name: 'swipeItem', classes: 'enyo-fit swipeGreen', components: [
					{name: 'swipeTitle', classes: 'swipeTitle', content: 'This is a test'}
				]}
			]
		}
	],
	rendered: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this.populateList();
		};
	}),
	populateList: function() {
		this.$.list.setCount(this.data.length);
		this.$.list.reset();
	},
	setupItem: function(inSender, inEvent) {
		if(!this.data[inEvent.index]) {
			return;
		}

		this.$.text.setContent(this.data[inEvent.index]);
		return true;
	},
	setupSwipeItem: function(inSender, inEvent) {
		if(!this.data[inEvent.index]) {
			return true;
		}

		if(inEvent.xDirection === -1) {
			// Persist swipeable item if swiped from right to left
			this.$.list.setPersistSwipeableItem(true);
			this.$.swipeTitle.setContent('This is a persistent item');
			this.$.swipeItem.removeClass('swipeGreen');
			this.$.swipeItem.addClass('swipeRed');
		} else {
			// Don't persist swipeable item if swiped from left to right
			this.$.list.setPersistSwipeableItem(false);
			this.$.swipeTitle.setContent('This is not a persistent item');
			this.$.swipeItem.removeClass('swipeRed');
			this.$.swipeItem.addClass('swipeGreen');
		}
		return true;
	},
	swipeComplete: function(inSender, inEvent) {
	}
});