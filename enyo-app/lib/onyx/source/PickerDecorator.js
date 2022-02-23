(function (enyo, scope) {

	/**
	* {@link onyx.PickerDecorator} is a control that loosely couples an
	* {@link onyx.Picker} with an activating {@link onyx.PickerButton}. The
	* decorator must surround both the activating button and the picker itself.
	* When the button is activated, the picker shows itself in the correct
	* position relative to the activator.
	*
	* ```
	* {kind: 'onyx.PickerDecorator', components: [
	* 	{}, //this uses the defaultKind property of PickerDecorator to inherit from PickerButton
	* 	{kind: 'onyx.Picker', components: [
	* 		{content: 'Gmail', active: true},
	* 		{content: 'Yahoo'},
	* 		{content: 'Outlook'},
	* 		{content: 'Hotmail'}
	* 	]}
	* ]}
	* ```
	*
	* @class  onyx.PickerDecorator
	* @extends onyx.MenuDecorator
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.PickerDecorator.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.PickerDecorator',

		/**
		* @private
		*/
		kind: 'onyx.MenuDecorator',

		/**
		* @private
		*/
		classes: 'onyx-picker-decorator',

		/**
		* @private
		*/
		defaultKind: 'onyx.PickerButton',

		/**
		* @private
		*/
		handlers: {
			onChange: 'change'
		},

		/**
		* Handles [onChange]{@link onyx.Picker#onChange} event, waterfalling
		* it down to children.
		*
		* @private
		*/
		change: function (sender, event) {
			this.waterfallDown('onChange', event);
		}
	});

})(enyo, this);