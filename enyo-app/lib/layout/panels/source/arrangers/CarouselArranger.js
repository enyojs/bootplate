(function (enyo, scope) {
	/**
	* {@link enyo.CarouselArranger} is an {@link enyo.Arranger} that displays
	* the active control, along with some number of inactive controls to fill the
	* available space. The active control is positioned on the left side of the
	* container, and the rest of the views are laid out to the right.
	*
	* One of the controls may have `fit: true` set, in which case it will take up
	* any remaining space after all of the other controls have been sized.
	*
	* For best results with CarouselArranger, you should set a minimum width for
	* each control via a CSS style, e.g., `min-width: 25%` or `min-width: 250px`.
	*
	* Transitions between arrangements are handled by sliding the new controls in
	* from the right and sliding the old controls off to the left.
	*
	* For more information, see the documentation on
	* [Arrangers]{@linkplain $dev-guide/building-apps/layout/arrangers.html} in the
	* Enyo Developer Guide.
	*
	* @class  enyo.CarouselArranger
	* @extends enyo.Arranger
	* @public
	*/
	enyo.kind(
		/** @lends enyo.CarouselArranger */ {

		/**
		* @private
		*/
		name: 'enyo.CarouselArranger',

		/**
		* @private
		*/
		kind: 'Arranger',

		/**
		* Calculates the size of each panel. Considers the padding of the container by calling
		* {@link enyo.dom#calcPaddingExtents} and control margin by calling
		* {@link enyo.dom#calcMarginExtents}. If the container is larger than the combined sizes of
		* the controls, one control may be set to fill the remaining space by setting its `fit`
		* property to `true`. If multiple controls have `fit: true` set, the last control to be so
		* marked will have precedence.
		*
		* @protected
		*/
		size: function () {
			var c$ = this.container.getPanels();
			var padding = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {};
			var pb = this.containerBounds;
			var i, e, s, m, c;
			pb.height -= padding.top + padding.bottom;
			pb.width -= padding.left + padding.right;
			// used space
			var fit;
			for (i=0, s=0; (c=c$[i]); i++) {
				m = enyo.dom.calcMarginExtents(c.hasNode());
				c.width = c.getBounds().width;
				c.marginWidth = m.right + m.left;
				s += (c.fit ? 0 : c.width) + c.marginWidth;
				if (c.fit) {
					fit = c;
				}
			}
			if (fit) {
				var w = pb.width - s;
				fit.width = w >= 0 ? w : fit.width;
			}
			for (i=0, e=padding.left; (c=c$[i]); i++) {
				c.setBounds({top: padding.top, bottom: padding.bottom, width: c.fit ? c.width : null});
			}
		},

		/**
		* @see {@link enyo.Arranger.arrange}
		* @protected
		*/
		arrange: function (controls, arrangement) {
			if (this.container.wrap) {
				this.arrangeWrap(controls, arrangement);
			} else {
				this.arrangeNoWrap(controls, arrangement);
			}
		},

		/**
		* A non-wrapping carousel arranges the controls from left to right without regard to the
		* ordered array passed via `controls`. `arrangement` will contain the index of the active
		* panel.
		*
		* @private
		*/
		arrangeNoWrap: function (controls, arrangement) {
			var i, aw, cw, c;
			var c$ = this.container.getPanels();
			var s = this.container.clamp(arrangement);
			var nw = this.containerBounds.width;
			// do we have enough content to fill the width?
			for (i=s, cw=0; (c=c$[i]); i++) {
				cw += c.width + c.marginWidth;
				if (cw > nw) {
					break;
				}
			}
			// if content width is less than needed, adjust starting point index and offset
			var n = nw - cw;
			var o = 0;
			if (n > 0) {
				for (i=s-1, aw=0; (c=c$[i]); i--) {
					aw += c.width + c.marginWidth;
					if (n - aw <= 0) {
						o = (n - aw);
						s = i;
						break;
					}
				}
			}
			// arrange starting from needed index with detected offset so we fill space
			var w, e;
			for (i=0, e=this.containerPadding.left + o; (c=c$[i]); i++) {
				w = c.width + c.marginWidth;
				if (i < s) {
					this.arrangeControl(c, {left: -w});
				} else {
					this.arrangeControl(c, {left: Math.floor(e)});
					e += w;
				}
			}
		},

		/**
		* Arranges `controls` from left to right such that the active panel is always the
		* leftmost, with subsequent panels positioned to its right.
		*
		* @private
		*/
		arrangeWrap: function (controls, arrangement) {
			for (var i=0, e=this.containerPadding.left, c; (c=controls[i]); i++) {
				this.arrangeControl(c, {left: e});
				e += c.width + c.marginWidth;
			}
		},

		/**
		* Calculates the change in `left` position between the two arrangements `a0` and `a1`.
		* @protected
		*/
		calcArrangementDifference: function (i0, a0, i1, a1) {
			var i = Math.abs(i0 % this.c$.length);
			return a0[i].left - a1[i].left;
		},

		/**
		* Resets the size and position of all panels.
		*
		* @method
		* @private
		*/
		destroy: enyo.inherit(function (sup) {
			return function () {
				var c$ = this.container.getPanels();
				for (var i=0, c; (c=c$[i]); i++) {
					enyo.Arranger.positionControl(c, {left: null, top: null});
					c.applyStyle('top', null);
					c.applyStyle('bottom', null);
					c.applyStyle('left', null);
					c.applyStyle('width', null);
				}
				sup.apply(this, arguments);
			};
		})
	});

})(enyo, this);