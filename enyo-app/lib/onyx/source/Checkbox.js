(function (enyo, scope) {

	/**
	* {@link onyx.Checkbox} is a box that shows or hides a checkmark when clicked. The
	* [onActivate]{@link enyo.Checkbox#onActivate} event is fired when the box is clicked.
	* Call `getValue()` to retrieve a boolean indicating whether the box is currently
	* checked.
	*
	* ```
	* {kind: 'onyx.Checkbox', onchange: 'checkboxClicked'}
	*
	* checkboxClicked: function (sender) {
	* 	if (sender.getValue()) {
	* 		this.log('I've been checked!');
	* 	}
	* }
	* ```
	*
	* @class  onyx.Checkbox
	* @extends enyo.Checkbox
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  enyo.Checkbox.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.Checkbox',

		/**
		* @private
		*/
		classes: 'onyx-checkbox',

		/**
		* @private
		*/
		kind: 'enyo.Checkbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
		* @private
		*/
		handlers: {
			// prevent double onchange bubble in IE
			onclick: ''
		},

		/**
		* @private
		*/
		tap: function (sender, e) {
			if (!this.disabled) {
				this.setChecked(!this.getChecked());
				this.bubble('onchange');
			}
			return !this.disabled;
		},

		/**
		* Overrides {@link enyo.Input} `dragstart` handler, to allow drags to propagate
		* for Checkbox.
		*
		* @private
		*/
		dragstart: enyo.nop
	});

})(enyo, this);