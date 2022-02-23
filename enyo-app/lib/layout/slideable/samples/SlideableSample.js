enyo.kind({
	name: 'enyo.sample.SlideableSample',
	classes: 'enyo-unselectable enyo-fit',
	style: 'overflow: hidden; background-color: #000;',
	components: [
		{name: 'top', kind: 'Slideable', axis: 'v', unit: '%', min: -90, max: 0, classes: 'enyo-fit slideable-sample top', onChange: 'updateInfo'},
		{name: 'right', kind: 'Slideable', axis: 'h', unit: '%', min: 0, max: 90, classes: 'enyo-fit slideable-sample right', onChange: 'updateInfo'},
		{name: 'bottom', kind: 'Slideable', axis: 'v', unit: '%', min: 0, max: 90, classes: 'enyo-fit slideable-sample bottom', onChange: 'updateInfo'},
		{name: 'left', kind: 'Slideable', axis: 'h', unit: '%', min: -90, max: 0, classes: 'enyo-fit slideable-sample left', onChange: 'updateInfo'}
	],
	handlers: {
		ondragstart: 'suppressPanelDrag'
	},
	create: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			var slideables = [];

			for (var c in this.$) {
				if (this.$[c].kind === 'Slideable') {
					slideables.push(this.$[c]);
				}
			}
			this.populate(slideables);
		};
	}),
	populate: function(inSlideables) {
		var slideable;
		for (var i = 0; i < inSlideables.length; i++) {
			slideable = inSlideables[i];
			slideable.createComponents([
				{style: slideable.axis === 'h' ? 'height: 38%;' : ''}, // cheating here for the horizontal Slideables to make everything nice and (almost) centered vertically
				{
					kind: 'enyo.sample.SlideableInfo',
					layoutKind: (slideable.axis === 'v') ? enyo.FittableColumnsLayout : enyo.FittableRowsLayout,
					classes: 'enyo-center', // cheating here for the vertical Slideables to make everything nice and centered horizontally (no effect on horizontal Slideables)
					info: {
						name: slideable.name,
						axis: slideable.axis,
						unit: slideable.unit,
						min: slideable.min,
						max: slideable.max,
						value: slideable.value
					}
				}
			]);
		}
	},
	updateInfo: function(inSender) {
		inSender.waterfallDown('onUpdateInfo', {
			name: inSender.name,
			axis: inSender.axis,
			unit: inSender.unit,
			min: inSender.min,
			max: inSender.max,
			value: Math.round(inSender.value)
		});
		return true;
	},
	// keeps the view panel from moving in Sampler app while dragging the Slideable
	suppressPanelDrag: function() {
		return true;
	}
});

enyo.kind({
	name: 'enyo.sample.SlideableInfo',
	kind: enyo.Control,
	published: {
		info: null
	},
	components: [
		{kind: enyo.FittableRows, classes: 'slideableinfo-sample', components: [
			{name: 'name'},
			{name: 'axis'},
			{name: 'unit'},
			{name: 'min'},
			{name: 'max'},
			{name: 'value'}
		]}
	],
	handlers: {
		onUpdateInfo: 'updateInfo'
	},
	create: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this.infoChanged();
		};
	}),
	infoChanged: function() {
		for (var p in this.info) {
			if (this.$[p]) {
				this.$[p].setContent(enyo.cap(p) + ': ' + this.info[p]);
			}
		}
	},
	updateInfo: function(inSender, inEvent) {
		this.setInfo(inEvent);
		return true;
	}
});