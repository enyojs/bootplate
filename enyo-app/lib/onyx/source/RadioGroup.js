(function (enyo, scope) {

	/**
	* {@link onyx.RadioGroup} is a group of {@link onyx.RadioButton} objects laid out
	* horizontally. Within the same radio group, tapping on one radio button will
	* release any previously-tapped radio button.
	*
	* ```
	* {kind: 'onyx.RadioGroup', components: [
	* 	{content: 'foo', active: true},
	* 	{content: 'bar'},
	* 	{content: 'baz'}
	* ]}
	* ```
	*
	* @class  onyx.RadioGroup
	* @extends enyo.Group
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.RadioGroup.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.RadioGroup',

		/**
		* @private
		*/
		kind: 'enyo.Group',

		/**
		* @private
		*/
		defaultKind: 'onyx.RadioButton',

		/**
		* Set to `true` to provide radio button behavior.
		*
		* @private
		*/
		highlander: true
	});

})(enyo, this);