(function (enyo, scope) {
	/**
	* {@link enyo.CardArranger} is an {@link enyo.Arranger} that displays only
	* one active control. The non-active controls are hidden with
	* `setShowing(false)`. Transitions between arrangements are handled by fading
	* from one control to the next.
	*
	* For more information, see the documentation on
	* [Arrangers]{@linkplain $dev-guide/building-apps/layout/arrangers.html} in the
	* Enyo Developer Guide.
	*
	* @class  enyo.CardArranger
	* @extends enyo.Arranger
	* @public
	*/
	enyo.kind(
		/** @lends  enyo.CardArranger.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.CardArranger',

		/**
		* @private
		*/
		kind: 'Arranger',

		/**
		* @private
		*/
		layoutClass: 'enyo-arranger enyo-arranger-fit',

		/**
		* @see {@link enyo.Arranger.calcArrangementDifference}
		* @protected
		*/
		calcArrangementDifference: function (i0, a0, i1, a1) {
			return this.containerBounds.width;
		},

		/**
		* Applies opacity to the activation and deactivation of panels. Expects the passed-in
		* array of controls to be ordered such that the first control in the array is the active
		* panel.
		*
		* @see {@link enyo.Arranger.arrange}
		* @protected
		*/
		arrange: function (controls, arrangement) {
			for (var i=0, c, v; (c=controls[i]); i++) {
				v = (i === 0) ? 1 : 0;
				this.arrangeControl(c, {opacity: v});
			}
		},

		/**
		* Shows the active panel at the start of transition. Also triggers a resize on
		* the active panel if it wasn't previously showing.
		*
		* @see {@link enyo.Arranger.start}
		* @method
		* @protected
		*/
		start: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				var c$ = this.container.getPanels();
				for (var i=0, c; (c=c$[i]); i++) {
					var wasShowing=c.showing;
					c.setShowing(i == this.container.fromIndex || i == (this.container.toIndex));
					if (c.showing && !wasShowing) {
						c.resize();
					}
				}
			};
		}),

		/**
		* Hides all non-active panels when the transition completes.
		*
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
		* Ensures all panels are showing and visible when the arranger is destroyed.
		*
		* @method
		* @private
		*/
		destroy: enyo.inherit(function (sup) {
			return function () {
				var c$ = this.container.getPanels();
				for (var i=0, c; (c=c$[i]); i++) {
					enyo.Arranger.opacifyControl(c, 1);
					if (!c.showing) {
						c.setShowing(true);
					}
				}
				sup.apply(this, arguments);
			};
		})
	});

})(enyo, this);