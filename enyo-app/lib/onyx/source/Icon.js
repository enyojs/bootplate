(function (enyo, scope) {

	/**
	* {@link onyx.Icon} is a control that displays an icon. To set the icon image,
	* specify a URL for the image's location in the Icon's [src]{@link onyx.Icon#src}
	* property.
	*
	* In Onyx, icons have a size of 32x32 pixels. Since the icon image is applied
	* as a CSS background, the height and width of the icon must be set if an image
	* of a different size is used.
	*
	* ```
	* {kind: 'onyx.Icon', src: 'images/search.png'}
	* ```
	*
	* When an icon should act like a button, use an {@link onyx.IconButton}.
	*
	* @class  onyx.Icon
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends onyx.Icon.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.Icon',

		/**
		* @private
		*/
		classes: 'onyx-icon',

		/**
		* @lends  onyx.Icon.prototype
		* @private
		*/
		published: {
			/**
			* URL specifying path to icon image.
			* @type {String}
			* @default  ''
			* @public
			*/
			src: '',

			/**
			* If `true`, icon is shown as disabled.
			* @type {Boolean}
			* @default  false
			* @public
			*/
			disabled: false
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			if (this.src) {
				this.srcChanged();
			}
			this.disabledChanged();
		},

		/**
		* @private
		*/
		disabledChanged: function () {
			this.addRemoveClass('disabled', this.disabled);
		},

		/**
		* @private
		*/
		srcChanged: function () {
			this.applyStyle('background-image', 'url(' + enyo.path.rewrite(this.src) + ')');
		}
	});

})(enyo, this);