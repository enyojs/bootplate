(function (enyo, scope) {

	/**
	* {@link onyx.IconButton} is an {@link onyx.Icon} that acts like a button. The
	* icon image is specified by setting the [src]{@link onyx.Icon#src} property
	* to a URL.
	*
	* If you want to combine an icon with text inside a button, use an
	* {@link onyx.Icon} inside an {@link onyx.Button}.
	*
	* The image associated with the `src` property of the IconButton is assumed to
	* be a 32x64-pixel strip, with the top half showing the button's normal state
	* and the bottom half showing its state when hovered-over or active.
	*
	* For more information, see the documentation on
	* [Buttons]{@linkplain $dev-guide/building-apps/controls/buttons.html} in the
	* Enyo Developer Guide.
	*
	* @class  onyx.IconButton
	* @extends onyx.Icon
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.IconButton.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.IconButton',

		/**
		* @private
		*/
		kind: 'onyx.Icon',

		/**
		* @lends  onyx.IconButton.prototype
		* @private
		*/
		published: {
			/**
			* Used when the IconButton is part of an {@link enyo.Group}; a value
			* of `true` indicates that this is the active button of the group.
			*
			* @type {Boolean}
			* @default  false
			* @public
			*/
			active: false
		},

		/**
		* @private
		*/
		classes: 'onyx-icon-button',

		/**
		* @private
		*/
		handlers: {
			ondown: 'down',
			onenter: 'enter',
			ondragfinish: 'dragfinish',
			onleave: 'leave',
			onup: 'up'
		},

		/**
		* @private
		*/
		rendered: function () {
			this.inherited(arguments);
			this.activeChanged();
		},

		/**
		* Makes the control [active]{@link onyx.IconButton#active} (if it is not
		* [disabled]{@link onyx.Icon#disabled}).
		*
		* @private
		*/
		tap: function () {
			if (this.disabled) {
				return true;
			}
			this.setActive(true);
		},

		/**
		* @private
		*/
		down: function (sender, event) {
			if (this.disabled) {
				return true;
			}
			this.addClass('pressed');
			this._isPressed = true;
		},

		/**
		* @private
		*/
		enter: function (sender, event) {
			if (this.disabled) {
				return true;
			}
			if(this._isPressed) {
				this.addClass('pressed');
			}
		},

		/**
		* @private
		*/
		dragfinish: function (sender, event) {
			if (this.disabled) {
				return true;
			}
			this.removeClass('pressed');
			this._isPressed = false;
		},

		/**
		* @private
		*/
		leave: function (sender, event) {
			if (this.disabled) {
				return true;
			}
			this.removeClass('pressed');
		},

		/**
		* @private
		*/
		up: function (sender, event) {
			if (this.disabled) {
				return true;
			}
			this.removeClass('pressed');
			this._isPressed = false;
		},

		/**
		* @fires enyo.GroupItem#onActivate
		* @private
		*/
		activeChanged: function () {
			this.bubble('onActivate');
		}
	});

})(enyo, this);