(function (enyo, scope) {
	/**
	* {@link enyo.CardSlideInArranger} is an {@link enyo.Arranger} that
	* displays only one active control. The non-active controls are hidden with
	* `setShowing(false)`. Transitions between arrangements are handled by
	* sliding the new control	over the current one.
	*
	* Note that CardSlideInArranger always slides controls in from the right. If
	* you want an arranger that slides to the right and left, try
	* {@link enyo.LeftRightArranger}.
	*
	* For more information, see the documentation on
	* [Arrangers]{@linkplain $dev-guide/building-apps/layout/arrangers.html} in the
	* Enyo Developer Guide.
	*
	* @class enyo.CardSlideInArranger
	* @extends enyo.CardArranger
	* @public
	*/
	enyo.kind(
		/** @lends  enyo.CardSlideInArranger.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.CardSlideInArranger',

		/**
		* @private
		*/
		kind: 'CardArranger',

		/**
		* Shows the active panel at the start of transition. Also triggers a resize on
		* the active panel if it wasn't previously showing.
		*
		* @todo Seems like poor variable reuse of `i`
		* @todo Should inherit from super and omit the `for` block
		* @see {@link enyo.Arranger.start}
		* @protected
		*/
		start: function () {
			var c$ = this.container.getPanels();
			for (var i=0, c; (c=c$[i]); i++) {
				var wasShowing=c.showing;
				c.setShowing(i == this.container.fromIndex || i == (this.container.toIndex));
				if (c.showing && !wasShowing) {
					c.resize();
				}
			}
			var l = this.container.fromIndex;
			i = this.container.toIndex;
			this.container.transitionPoints = [
				i + '.' + l + '.s',
				i + '.' + l + '.f'
			];
		},

		/**
		* @todo  This method is an exact copy of CardArranger. Since it's calling the super,
		* 	the work is being done twice, so this method should be removed.
		* @see {@link enyo.Arranger.finish}
		* @method
		* @protected
		*/
		finish: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				var c$ = this.container.getPanels();
				for (var i=0, c; (c=c$[i]); i++) {
					c.setShowing(i == this.container.toIndex);
				}
			};
		}),

		/**
		* Parses the transition point value to position the panels to slide in from the right.
		*
		* @see {@link enyo.Arranger.arrange}
		* @protected
		*/
		arrange: function (controls, arrangement) {
			var p = arrangement.split('.'),
				f = p[0],
				s = p[1],
				starting = (p[2] == 's'),
				b = this.containerBounds.width;

			for (var i=0, c$=this.container.getPanels(), c, v; (c=c$[i]); i++) {
				v = b;
				if (s == i) {
					v = starting ? 0 : -b;
				}
				if (f == i) {
					v = starting ? b : 0;
				}
				if (s == i && s == f) {
					v = 0;
				}
				this.arrangeControl(c, {left: v});
			}
		},

		/**
		* Resets the `left` position of all panels.
		*
		* @method
		* @private
		*/
		destroy: enyo.inherit(function (sup) {
			return function () {
				var c$ = this.container.getPanels();
				for (var i=0, c; (c=c$[i]); i++) {
					enyo.Arranger.positionControl(c, {left: null});
				}
				sup.apply(this, arguments);
			};
		})
	});

})(enyo, this);