(function (enyo, scope) {
	/**
	* {@link enyo.CollapsingArranger} is an {@link enyo.Arranger} that displays the
	* active control, along with some number of inactive	controls to fill the
	* available space. The active control is positioned on the left side of the
	* container and the rest of the views are laid out to the right. The last
	* control, if visible, will expand to fill whatever space is not taken up by
	* the previous controls.
	*
	* For best results with CollapsingArranger, you should set a minimum width
	* for each control via a CSS style, e.g., `min-width: 25%` or
	* `min-width: 250px`.
	*
	* Transitions between arrangements are handled by sliding the new control	in
	* from the right and collapsing the old control to the left.
	*
	* For more information, see the documentation on
	* [Arrangers]{@linkplain $dev-guide/building-apps/layout/arrangers.html} in the
	* Enyo Developer Guide.
	*
	* @class enyo.CollapsingArranger
	* @extends enyo.CarouselArranger
	* @public
	*/
	enyo.kind(
		/** @lends enyo.CollapsingArranger.prototype */ {

		/**
		* @private
		*/
		name: "enyo.CollapsingArranger",

		/**
		* @private
		*/
		kind: "CarouselArranger",
		/**
		* The distance (in pixels) that each panel should be offset from the left
		* when it is selected. This allows controls on the underlying panel to the
		* left of the selected one to be partially revealed.
		*
		* Note that this is imported from the container at construction time.
		*
		* @public
		*/
		peekWidth: 0,

		/**
		* If a panel is added or removed after construction, ensures that any control
		* marked to fill remaining space (via its `_fit` member) is reset.
		*
		* @see {@link enyo.Arranger.size}
		* @method
		* @protected
		*/
		size: enyo.inherit(function (sup) {
			return function () {
				this.clearLastSize();
				sup.apply(this, arguments);
			};
		}),

		/**
		* Resets any panel marked to fill remaining space that isn't, in fact, the last panel.
		*
		* @private
		*/
		clearLastSize: function () {
			for (var i=0, c$=this.container.getPanels(), c; (c=c$[i]); i++) {
				if (c._fit && i != c$.length-1) {
					c.applyStyle("width", null);
					c._fit = null;
				}
			}
		},

		/**
		* @method
		* @private
		*/
		constructor: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.peekWidth = this.container.peekWidth != null ? this.container.peekWidth : this.peekWidth;
			};
		}),

		/**
		* Arranges controls from left to right starting with first panel. If
		* [peekWidth]{@link enyo.CollapsingArranger#peekWidth} is set, any visible control
		* whose index is less than `arrangement` (the active panel's index) will be revealed
		* by `peekWidth` pixels.
		*
		* @see {@link enyo.Arranger.arrange}
		* @protected
		*/
		arrange: function (controls, arrangement) {
			var c$ = this.container.getPanels();
			for (var i=0, e=this.containerPadding.left, c, n=0; (c=c$[i]); i++) {
				if(c.getShowing()){
					this.arrangeControl(c, {left: e + n * this.peekWidth});
					if (i >= arrangement) {
						e += c.width + c.marginWidth - this.peekWidth;
					}
					n++;
				} else {
					this.arrangeControl(c, {left: e});
					if (i >= arrangement) {
						e += c.width + c.marginWidth;
					}
				}
				// FIXME: overdragging-ish
				if (i == c$.length - 1 && arrangement < 0) {
					this.arrangeControl(c, {left: e - arrangement});
				}
			}
		},

		/**
		* Calculates the change in `left` position of the last panel between the two
		* arrangements `a0` and `a1`.
		*
		* @see {@link enyo.Arranger.calcArrangementDifference}
		* @private
		*/
		calcArrangementDifference: function (i0, a0, i1, a1) {
			var i = this.container.getPanels().length-1;
			return Math.abs(a1[i].left - a0[i].left);
		},

		/**
		* If the container's `realtimeFit` property is `true`, resizes the last panel to
		* fill the space. This ensures that when dragging or animating to the last index,
		* there is never blank space to the right of the last panel. If `realtimeFit` is
		* falsy, the last panel is not resized until the
		* [finish()]{@link enyo.CollapsingArranger#finish} method is called.
		*
		* @see {@link enyo.Arranger.flowControls}
		* @method
		* @private
		*/
		flowControl: enyo.inherit(function (sup) {
			return function (inControl, inA) {
				sup.apply(this, arguments);
				if (this.container.realtimeFit) {
					var c$ = this.container.getPanels();
					var l = c$.length-1;
					var last = c$[l];
					if (inControl == last) {
						this.fitControl(inControl, inA.left);
					}
				}

			};
		}),

		/**
		* Ensures that the last panel fills the remaining space when a transition completes.
		*
		* @see {@link enyo.Arranger.finish}
		* @method
		* @private
		*/
		finish: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				if (!this.container.realtimeFit && this.containerBounds) {
					var c$ = this.container.getPanels();
					var a$ = this.container.arrangement;
					var l = c$.length-1;
					var c = c$[l];
					this.fitControl(c, a$[l].left);
				}
			};
		}),

		/**
		* Resizes the given `control` to match the width of the container minus the
		* given `offset`.
		*
		* @param {enyo.Control} control - The control that should fit in the remaining space.
		* @param {Number} offset        - The left offset of the control with respect to the
		* container.
		* @private
		*/
		fitControl: function (control, offset) {
			control._fit = true;
			control.applyStyle("width", (this.containerBounds.width - offset) + "px");
			control.resize();
		}
	});

})(enyo, this);