enyo.kind({
	name: 'enyo.sample.ImageCarouselSample',
	kind: 'FittableRows',
	classes: 'enyo-fit',
	components: [
		{kind: 'onyx.Toolbar', style:'text-align:center;', components: [
			{kind: 'onyx.Button', content:'&larr;', allowHtml: true, ontap:'previous'},
			{kind: 'onyx.Button', content:'&rarr;', allowHtml: true, ontap:'next'},
			{kind: 'onyx.InputDecorator', classes: 'imagecarousel-sample-input', components: [
				{name: 'carouselIndexInput', kind: 'onyx.Input', value: '0', onchange: 'updateIndex'}
			]}
		]},
		{name:'carousel', kind:'ImageCarousel', fit:true, onload:'load', onZoom:'zoom', onerror:'error', onTransitionStart: 'transitionStart', onTransitionFinish: 'transitionFinish'}
	],
	create: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this.urls = [
				'assets/mercury.jpg',
				'assets/venus.jpg',
				'assets/earth.jpg',
				'assets/mars.jpg',
				'assets/jupiter.jpg',
				'assets/saturn.jpg',
				'assets/uranus.jpg',
				'assets/neptune.jpg'
			];
			// although we're specifying all the image urls now, the images themselves
			// only get created/loaded as needed
			this.$.carousel.setImages(this.urls);
		};
	}),
	load: function(inSender, inEvent) {
		//enyo.log('image loaded: ' + inEvent.originator.src);
	},
	zoom: function(inSender, inEvent) {
		//enyo.log('image zoomed: ' + inEvent.scale + ' scale on ' + inEvent.originator.src);
	},
	error: function(inSender, inEvent) {
		//enyo.log('image error: ' + inEvent.originator.src);
	},
	transitionStart: function(inSender, inEvent) {
		//enyo.log('image now transitioning from: ' + this.$.carousel.getImageByIndex(inEvent.fromIndex).src
		//		+ ' to ' + this.$.carousel.getImageByIndex(inEvent.toIndex).src);
	},
	transitionFinish: function(inSender, inEvent) {
		//enyo.log('image transitioned to: ' + this.$.carousel.getActiveImage().src);
		if (this.$.carouselIndexInput) {
			this.$.carouselIndexInput.setValue(inEvent.toIndex);
		}
	},
	previous: function(inSender, inEvent) {
		this.$.carousel.previous();
	},
	next: function(inSender, inEvent) {
		this.$.carousel.next();
	},
	getRandomIndex: function() {
		var i = Math.floor(Math.random()*this.$.carousel.images.length);
		while(i==this.$.carousel.index) { //make sure it isn't the active index
			i = Math.floor(Math.random()*this.$.carousel.images.length);
		}
		return i;
	},
	updateIndex: function(inSender, inEvent) {
		var index = this.trimWhitespace(this.$.carouselIndexInput.getValue());
		if (index === '' || isNaN(index)) {
			//enyo.log('Numbers only please.')
			return;
		}
		this.$.carousel.setIndex(parseInt(index, 10));
	},
	trimWhitespace: function(inString) {
		return inString.replace(/^\s+|\s+$/g,'');
	}
});