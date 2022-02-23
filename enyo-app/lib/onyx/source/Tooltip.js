(function (enyo, scope) {
	/**
	* {@link onyx.Tooltip} is a subkind of {@link onyx.Popup} that works in
	* conjunction with an {@link onyx.TooltipDecorator}. It automatically displays
	* a tooltip when the user hovers over the decorator. The tooltip is positioned
	* around the decorator where there is available window space.
	*
	*  ```
	*	{kind: 'onyx.TooltipDecorator', components: [
	*		{kind: 'onyx.Button', content: 'Tooltip'},
	*		{kind: 'onyx.Tooltip', content: 'I am a tooltip for a button.'}
	*	]}
	*  ```
	*
	* You may also force a tooltip to be displayed by calling its `show()` method.
	*
	* @ui
	* @class onyx.Tooltip
	* @extends onyx.Popup
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.Tooltip.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.Tooltip',

		/**
		* @private
		*/
		kind: 'onyx.Popup',

		/**
		* @private
		*/
		classes: 'onyx-tooltip below left-arrow',

		/**
		* If `true`, the tooltip is automatically dismissed when user stops hovering
		* over the decorator.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		autoDismiss: false,

		/**
		* Hovering over the decorator for this length of time (in milliseconds)
		* causes the tooltip to appear.
		*
		* @type {Number}
		* @default 500
		* @public
		*/
		showDelay: 500,

		/**
		* Default `'margin-left'` value.
		*
		* @type {Number}
		* @default -6
		* @public
		*/
		defaultLeft: -6,

		/**
		* @private
		*/
		handlers: {
			onRequestShowTooltip: 'requestShow',
			onRequestHideTooltip: 'requestHide'
		},

		/**
		* @private
		*/
		requestShow: function () {
			this.showJob = setTimeout(this.bindSafely('show'), this.showDelay);
			return true;
		},

		/**
		* @private
		*/
		cancelShow: function () {
			clearTimeout(this.showJob);
		},

		/**
		* @private
		*/
		requestHide: function () {
			this.cancelShow();
			return this.inherited(arguments);
		},

		/**
		* @private
		*/
		showingChanged: function () {
			this.cancelShow();
			this.adjustPosition(true);
			this.inherited(arguments);
		},

		/**
		* @private
		*/
		applyPosition: function (inRect) {
			var s = '';
			for (var n in inRect) {
				s += (n + ':' + inRect[n] + (isNaN(inRect[n]) ? '; ' : 'px; '));
			}
			this.addStyles(s);
		},

		/**
		* @private
		*/
		adjustPosition: function (belowActivator) {
			if (this.showing && this.hasNode()) {
				var b = this.node.getBoundingClientRect();

				//when the tooltip bottom goes below the window height move it above the decorator
				if (b.top + b.height > window.innerHeight) {
					this.addRemoveClass('below', false);
					this.addRemoveClass('above', true);
				} else {
					this.addRemoveClass('above', false);
					this.addRemoveClass('below', true);
				}

				// when the tooltip's right edge is out of the window, align its right edge with the decorator left
				// edge (approx)
				if (b.left + b.width > window.innerWidth){
					this.applyPosition({'margin-left': -b.width, bottom: 'auto'});
					//use the right-arrow
					this.addRemoveClass('left-arrow', false);
					this.addRemoveClass('right-arrow', true);
				}
			}
		},

		/**
		* @private
		*/
		handleResize: function () {
			//reset the tooltip to align its left edge with the decorator
			this.applyPosition({'margin-left': this.defaultLeft, bottom: 'auto'});
			this.addRemoveClass('left-arrow', true);
			this.addRemoveClass('right-arrow', false);

			this.adjustPosition(true);
			this.inherited(arguments);
		}
	});

})(enyo, this);
