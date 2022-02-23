(function (enyo, scope) {

	/**
	* {@link onyx.TooltipDecorator} is a control that couples an {@link onyx.Tooltip}
	* with an activating control, such as a button. The tooltip is displayed when the
	* activator generates an `onenter` event:
	*
	*  ```
	* 	{kind: 'onyx.TooltipDecorator', components: [
	* 		{kind: 'onyx.Button', content: 'Tooltip'},
	* 		{kind: 'onyx.Tooltip', content: 'I am a tooltip for a button.'}
	* 	]}
	* 	```
	*
	* Here's an example with an {@link onyx.Input} control and an
	* {@link onyx.InputDecorator} around the input:
	*
	* ```
	* 	{kind: 'onyx.TooltipDecorator', components: [
	* 		{kind: 'onyx.InputDecorator', components: [
	* 			{kind: 'onyx.Input', placeholder: 'Just an input...'}
	* 		]},
	* 		{kind: 'onyx.Tooltip', content: 'I am a tooltip for an input.'}
	* 	]}
	* 	```
	*
	* @ui
	* @class onyx.TooltipDecorator
	* @extends enyo.Control
	* @public
	*/

	enyo.kind(
		/** @lends onyx.TooltipDecorator.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.TooltipDecorator',
	
		/**
		* @private
		*/
		kind: 'enyo.Control',

		/**
		* @private
		*/
		defaultKind: 'onyx.Button',

		/**
		* @private
		*/
		classes: 'onyx-popup-decorator',

		/**
		* @private
		*/
		handlers: {
			onenter: 'enter',
			onleave: 'leave'
		},

		/**
		* @private
		*/
		enter: function () {
			this.requestShowTooltip();
		},

		/**
		* @private
		*/
		leave: function () {
			this.requestHideTooltip();
		},

		/**
		* @private
		*/
		tap: function () {
			this.requestHideTooltip();
		},

		/**
		* @private
		*/
		requestShowTooltip: function () {
			this.waterfallDown('onRequestShowTooltip');
		},

		/**
		* @private
		*/
		requestHideTooltip: function () {
			this.waterfallDown('onRequestHideTooltip');
		}
	});

})(enyo, this);
