(function (enyo, scope) {
	/**
	* {@link enyo.ImageCarousel} is an {@link enyo.Panels} that uses {@link enyo.CarouselArranger}
	* as its arrangerKind. An ImageCarousel dynamically creates and loads instances of
	* {@link enyo.ImageView} as needed, creating a gallery of images.
	*
	* ```
	* {kind: 'ImageCarousel', images: [
	* 	'assets/mercury.jpg',
	* 	'assets/venus.jpg',
	* 	'assets/earth.jpg',
	* 	'assets/mars.jpg',
	* 	'assets/jupiter.jpg',
	* 	'assets/saturn.jpg',
	* 	'assets/uranus.jpg',
	* 	'assets/neptune.jpg'
	* ], defaultScale: 'auto'},
	* ```
	*
	* All of the events (`onload`, `onerror`, and `onZoom`) from the contained
	* ImageView objects are bubbled up to the ImageCarousel, which also inherits
	* the [onTransitionStart]{@link enyo.Panels#onTransitionStart} and
	* [onTransitionFinish]{@link enyo.Panels#onTransitionFinish} events from
	* {@link enyo.Panels}.
	*
	* The [images]{@link enyo.ImageCarousel#images} property is an array containing the
	* file paths of the images in the gallery.  The `images` array may be altered and
	* updated at any time, and the current index may be manipulated at runtime via the
	* inherited functions [getIndex()]{@link enyo.Panels#getIndex} and
	* [setIndex()]{@link enyo.Panels#setIndex}.
	*
	* Note that it's best to specify a size for the ImageCarousel in order to
	* avoid complications.
	*
	* @ui
	* @class enyo.ImageCarousel
	* @extends enyo.Panels
	* @public
	*/
	enyo.kind(
		/** @lends enyo.ImageCarousel.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.ImageCarousel',

		/**
		* @private
		*/
		kind: 'enyo.Panels',

		/**
		* @private
		*/
		arrangerKind: 'enyo.CarouselArranger',

		/**
		* The default scaling to be applied to each ImageView. Can be `'auto'`,
		* `'width'`, `'height'`, or any positive numeric value.
		*
		* @type {String|Number}
		* @default 'auto'
		* @public
		*/
		defaultScale: 'auto',

		/**
		* If `true`, ImageView instances are created with zooming disabled.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		disableZoom:  false,

		/**
		* If `true`, any ImageViews that are not in the immediate viewing area
		* (i.e., any images other than the currently active image and the first image
		* on either side of it) will be destroyed to free up memory. This has the
		* benefit of minimizing memory usage (which is good for mobile devices), but
		* also has the downside that, if you want to view the images again, you'll need
		* to recreate the ImageViews refetch the images (thus increasing the number of
		* image-related GET calls). Defaults to `false`.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		lowMemory: false,

		/**
		* @lends enyo.ImageCarousel.prototype
		* @private
		*/
		published: {

			/**
			* Array of paths to image files.
			*
			* @type {String[]}
			* @default `[]`
			* @public
			*/
			images: []
		},

		/**
		* @private
		*/
		handlers: {
			onTransitionStart: 'transitionStart',
			onTransitionFinish: 'transitionFinish'
		},

		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.imageCount = this.images.length;
				if (this.images.length > 0) {
					this.initContainers();
					this.loadNearby();
				}
			};
		}),

		/**
		* Builds a container for each image and destroys any extra containers and images.
		*
		* @private
		*/
		initContainers: function () {
			for (var i=0; i<this.images.length; i++) {
				if (!this.$['container' + i]) {
					this.createComponent({
						name: 'container' + i,
						style: 'height:100%; width:100%;'
					});
					this.$['container' + i].render();
				}
			}
			for (i=this.images.length; i<this.imageCount; i++) {
				if (this.$['image' + i]) {
					this.$['image' + i].destroy();
				}
				this.$['container' + i].destroy();
			}
			this.imageCount = this.images.length;
		},

		/**
		* Loads images that are in view or may come into view soon.
		*
		* @private
		*/
		loadNearby: function () {
			var range = this.getBufferRange();
			for (var i in range) {
				this.loadImageView(range[i]);
			}
		},

		/**
		* Determines which image indices are `'near'` the active image.
		*
		* @private
		*/
		getBufferRange: function () {
			var range = [];
			if (this.layout.containerBounds) {
				var prefetchRange = 1;
				var bounds = this.layout.containerBounds;
				var c, i, x, xEnd;
				// get the lower range
				i=this.index-1;
				x=0;
				xEnd = bounds.width * prefetchRange;
				while (i>=0 && x<=xEnd) {
					c = this.$['container' + i];
					x+= c.width + c.marginWidth;
					range.unshift(i);
					i--;
				}
				// get the upper range
				i=this.index;
				x=0;
				xEnd = bounds.width * (prefetchRange + 1);
				while (i<this.images.length && x<=xEnd) {
					c = this.$['container' + i];
					x+= c.width + c.marginWidth;
					range.push(i);
					i++;
				}
			}
			return range;
		},

		/**
		* @method
		* @private
		*/
		reflow: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.loadNearby();
			};
		}),

		/**
		* Loads the image whose path is found at the specified index in the
		* [images]{@link enyo.ImageCarousel#images} array.
		*
		* @param {Number} index - The index of the image to load.
		* @private
		*/
		loadImageView: function (index) {
			// NOTE: wrap bugged in enyo.CarouselArranger, but once fixed, wrap should work in this
			if (this.wrap) {
				// Used this modulo technique to get around javascript issue with negative values
				// ref: http://javascript.about.com/od/problemsolving/a/modulobug.htm
				index = ((index % this.images.length)+this.images.length)%this.images.length;
			}
			if (index>=0 && index<=this.images.length-1) {
				if (!this.$['image' + index]) {
					this.$['container' + index].createComponent({
						name: 'image' + index,
						kind: 'ImageView',
						scale: this.defaultScale,
						disableZoom: this.disableZoom,
						src: this.images[index],
						verticalDragPropagation: false,
						style: 'height:100%; width:100%;'
					}, {owner: this});
					this.$['image' + index].render();
				} else {
					if (this.$['image' + index].src != this.images[index]) {
						this.$['image' + index].setSrc(this.images[index]);
						this.$['image' + index].setScale(this.defaultScale);
						this.$['image' + index].setDisableZoom(this.disableZoom);
					}
				}
			}
			return this.$['image' + index];
		},

		/**
		* Updates the array of images.
		*
		* @todo Probably a defect here. Simply calling `set()` won't force the observer to fire
		* if `images` is a ref to the same array. Need to add the `force` parameter.
		* @public
		*/
		setImages: function (images) {
			// always invoke imagesChanged because this is an array property
			// which might otherwise seem to be the same object
			this.set('images', images);
		},

		/**
		* @private
		*/
		imagesChanged: function () {
			this.initContainers();
			this.loadNearby();
		},

		/**
		* @method
		* @private
		*/
		indexChanged: enyo.inherit(function (sup) {
			return function () {
				this.loadNearby();
				if (this.lowMemory) {
					this.cleanupMemory();
				}
				sup.apply(this, arguments);
			};
		}),

		/**
		* @private
		*/
		transitionStart: function (sender, event) {
			if (event.fromIndex==event.toIndex) {
				return true; //prevent from bubbling if there's no change
			}
		},

		/**
		* @private
		*/
		transitionFinish: function (sender, event) {
			this.loadNearby();
			if (this.lowMemory) {
				this.cleanupMemory();
			}
		},

		/**
		* Returns the currently displayed ImageView.
		*
		* @return {enyo.Control} - The active image control.
		* @public
		*/
		getActiveImage: function () {
			return this.getImageByIndex(this.index);
		},

		/**
		* Returns the ImageView with the specified index.
		*
		* @param {Number} index  - The index of the image to be retrieved.
		* @return {enyo.Control} - The image control at `index`.
		* @public
		*/
		getImageByIndex: function (index) {
			return this.$['image' + index] || this.loadImageView(index);
		},

		/**
		* Destroys any ImageView objects that are not in the immediate viewing area
		* (i.e., any images other than the currently active image and the first
		* image on either side of it) to free up memory. If you set the ImageCarousel's
		* [lowMemory]{@link enyo.ImageCarousel#lowMemory} property to `true`, this
		* function will be called automatically as needed.
		*
		* @public
		*/
		cleanupMemory: function () {
			var buffer = this.getBufferRange();
			for (var i=0; i<this.images.length; i++) {
				if (enyo.indexOf(i, buffer) ===-1) {
					if (this.$['image' + i]) {
						this.$['image' + i].destroy();
					}
				}
			}
		}
	});

})(enyo, this);