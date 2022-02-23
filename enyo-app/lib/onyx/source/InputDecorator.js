(function (enyo, scope) {

	/**
	* {@link onyx.InputDecorator} is a control that provides input styling. Any
	* controls in the InputDecorator will appear to be inside an area styled as an
	* input. Usually, an InputDecorator surrounds an {@link onyx.Input}.
	*
	* ```
	* {kind: 'onyx.InputDecorator', components: [
	* 	{kind: 'onyx.Input'}
	* ]}
	* ```
	*
	* Other controls, such as buttons, may be placed to the right or left of the
	* input control, e.g.:
	*
	* ```
	* {kind: 'onyx.InputDecorator', components: [
	* 	{kind: 'onyx.IconButton', src: 'search.png'},
	* 	{kind: 'onyx.Input'},
	* 	{kind: 'onyx.IconButton', src: 'cancel.png'}
	* ]}
	* ```
	*
	* Note that the InputDecorator fits around the content inside it. If the
	* decorator is sized, then its contents will likely need to be sized as well.
	*
	* ```
	* {kind: 'onyx.InputDecorator', style: 'width: 500px;', components: [
	* 	{kind: 'onyx.Input', style: 'width: 100%;'}
	* ]}
	* ```
	*
	* @class  onyx.InputDecorator
	* @extends enyo.ToolDecorator
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.InputDecorator.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.InputDecorator',

		/**
		* @private
		*/
		kind: 'enyo.ToolDecorator',

		/**
		* @private
		*/
		tag: 'label',

		/**
		* @private
		*/
		classes: 'onyx-input-decorator',

		/**
		* @lends  onyx.InputDecorator.prototype
		* @private
		*/
		published: {
			/**
			* If set to `true`, the input will look focused, even when it doesn't
			* actually have focus.
			* @type {Boolean}
			* @default  false
			* @public
			*/
			alwaysLooksFocused: false
		},

		/**
		* @private
		*/
		handlers: {
			onDisabledChange: 'disabledChange',
			onfocus: 'receiveFocus',
			onblur: 'receiveBlur'
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.updateFocus(false);
		},

		/**
		* @private
		*/
		alwaysLooksFocusedChanged: function (oldValue) {
			this.updateFocus(this.focus);
		},

		/**
		* Updates the focus state of the control unless
		* [alwaysLooksFocused]{@link onyx.InputDecorator#alwaysLooksFocused} is `true`.
		*
		* @param  {Boolean} focus - The requested focus state.
		* @private
		*/
		updateFocus: function (focus) {
			this.focused = focus;
			this.addRemoveClass('onyx-focused', this.alwaysLooksFocused || this.focused);
		},

		/**
		* Handles `onfocus` events triggered by child components.
		*
		* @private
		*/
		receiveFocus: function () {
			this.updateFocus(true);
		},

		/**
		* Handles `onblur` events triggered by child components.
		*
		* @private
		*/
		receiveBlur: function () {
			this.updateFocus(false);
		},

		/**
		* Handles `onDisabledChange` events triggered by child components.
		*
		* @private
		*/
		disabledChange: function (sender, event) {
			this.addRemoveClass('onyx-disabled', event.originator.disabled);
		}
	});

})(enyo, this);