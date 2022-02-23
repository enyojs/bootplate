(function (enyo, scope) {

	/**
	* {@link enyo.AlphaJumpList} is an {@link enyo.List} that features an alphabetical
	* panel from which a selection may be made. Actions are performed based on the item
	* that was selected.
	*
	* ```
	* {kind: 'AlphaJumpList', onSetupItem: 'setupItem',
	* 	onAlphaJump: 'alphaJump',
	* 	components: [
	* 		{name: 'divider'},
	* 		{kind: 'onyx.Item'}
	* 	]
	* }
	* ```
	*
	* @ui
	* @class enyo.AlphaJumpList
	* @extends enyo.List
	* @public
	*/
	enyo.kind(
		/** @lends enyo.AlphaJumpList.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.AlphaJumpList',

		/**
		* @private
		*/
		kind: 'List',

		/**
		* @private
		*/
		scrollTools: [
			{name: 'jumper', kind: 'AlphaJumper'}
		],

		/**
		* @method
		* @private
		*/
		initComponents: enyo.inherit(function (sup) {
			return function () {
				this.createChrome(this.scrollTools);
				sup.apply(this, arguments);
			};
		}),

		/**
		* @method
		* @private
		*/
		rendered: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.centerJumper();
			};
		}),

		/**
		* @method
		* @private
		*/
		handleResize: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.centerJumper();
			};
		}),

		/**
		* Vertically centers the {@link enyo.AlphaJumper} control within the scroller.
		*
		* @private
		*/
		centerJumper: function () {
			var b = this.getBounds(), sb = this.$.jumper.getBounds();
			this.$.jumper.applyStyle('top', ((b.height - sb.height) / 2) + 'px');
		}
	});

})(enyo, this);