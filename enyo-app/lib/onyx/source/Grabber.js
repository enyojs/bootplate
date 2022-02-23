(function (enyo, scope) {

	/**
	* {@link onyx.Grabber} is a control styled to indicate that an object may be grabbed
	* and moved. It should only be used in this limited context--to indicate that
	* dragging an object will result in movement.
	*
	* ```
	* 	{kind: 'onyx.Toolbar', components: [
	* 		{kind: 'onyx.Grabber', ondragstart: 'grabberDragstart',
	* 			ondrag: 'grabberDrag', ondragfinish: 'grabberDragFinish'},
	* 		{kind: 'onyx.Button', content: 'More stuff'}
	* 	]}
	* ```
	*
	* When using a Grabber inside a [Fittable]{@link enyo.FittableLayout} control,
	* be sure to set `'noStretch: true'` on the Fittable, or else give it an explicit
	* height. Otherwise, the Grabber may not be visible.
	*
	* @class  onyx.Grabber
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.Grabber.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.Grabber',

		/**
		* @private
		*/
		classes: 'onyx-grabber'
	});

})(enyo, this);