(function (enyo, scope) {

	/**
	* {@link onyx.Button} is an {@link enyo.Button} with Onyx styling applied. The
	* color of the button may be customized by specifying a background color.
	*
	* The `'onyx-affirmative'`, `'onyx-negative'`, and `'onyx-blue'` classes provide
	* some built-in presets.
	* ```
	* {kind: 'onyx.Button', content: 'Button'},
	* {kind: 'onyx.Button', content: 'Affirmative', classes: 'onyx-affirmative'},
	* {kind: 'onyx.Button', content: 'Negative', classes: 'onyx-negative'},
	* {kind: 'onyx.Button', content: 'Blue', classes: 'onyx-blue'},
	* {kind: 'onyx.Button', content: 'Custom', style: 'background-color: purple; color: #F1F1F1;'}
	* ```
	* For more information, see the documentation on
	* [Buttons]{@linkplain $dev-guide/building-apps/controls/buttons.html} in the
	* Enyo Developer Guide.
	*
	* @class onyx.Button
	* @extends enyo.Button
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends onyx.Button.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.Button',

		/**
		* @private
		*/
		kind: 'enyo.Button',

		/**
		* @private
		*/
		classes: 'onyx-button enyo-unselectable',

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
		}
	});

})(enyo, this);