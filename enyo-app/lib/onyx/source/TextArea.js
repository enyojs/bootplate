(function (enyo, scope) {

	/**
	* {@link onyx.TextArea} is an Onyx-styled TextArea control, derived from
	* {@link enyo.TextArea}. Typically, an `onyx.TextArea` is placed inside an
	* {@link onyx.InputDecorator}, which provides styling, e.g.:
	*
	* ```
	* {kind: 'onyx.InputDecorator', components: [
	* 	{kind: 'onyx.TextArea', onchange: 'inputChange'}
	* ]}
	* ```
	*
	* For more information, see the documentation on
	* [Text Fields]{@linkplain $dev-guide/building-apps/controls/text-fields.html}
	* in the Enyo Developer Guide.
	*
	* @ui
	* @class  onyx.TextArea
	* @extends enyo.TextArea
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.TextArea.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.TextArea',

		/**
		* @private
		*/
		kind: 'enyo.TextArea',

		/**
		* @private
		*/
		classes: 'onyx-textarea'
	});

})(enyo, this);