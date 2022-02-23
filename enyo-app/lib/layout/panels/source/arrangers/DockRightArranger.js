(function (enyo, scope) {
	/**
	* {@link enyo.DockRightArranger} is an {@link enyo.Arranger} that displays the
	* active control, along with some number of inactive controls to fill the
	* available space. The active control is positioned on the right side of the
	* container and the rest of the views are laid out to the right.
	*
	* For best results with DockRightArranger, you should set a minimum width
	* for each control via a CSS style, e.g., `min-width: 25%` or
	* `min-width: 250px`.
	*
	* Transitions between arrangements are handled by sliding the new control	in
	* from the right. If the width of the old control(s) can fit within the
	* container, they will slide to the left. If not, they will collapse to the left.
	*
	* For more information, see the documentation on
	* [Arrangers]{@linkplain $dev-guide/building-apps/layout/arrangers.html} in the
	* Enyo Developer Guide.
	*
	* @class  enyo.DockRightArranger
	* @extends enyo.Arranger
	* @public
	*/
	enyo.kind(
		/** @lends enyo.DockRightArranger.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.DockRightArranger',

		/**
		* @private
		*/
		kind: 'Arranger',

		/**
		* If `true`, the base panel (i.e., the panel at index `0`) will fill the width
		* of the container, while newer controls will slide in and collapse on top of it.
		*
		* @type {Boolean}
		* @default  false
		* @public
		*/
		basePanel: false,

		/**
		* Panels will overlap by this number of pixels.
		*
		* Note that this is imported from the container at construction time.
		*
		* @type {Number}
		* @default  0
		* @public
		*/
		overlap: 0,

		/**
		* The column width in pixels.
		*
		* Note that this is imported from the container at construction time.
		*
		* @type {Number}
		* @default  0
		* @public
		*/
		layoutWidth: 0,

		/**
		* @method
		* @private
		*/
		constructor: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.overlap = this.container.overlap != null ? this.container.overlap : this.overlap;
				this.layoutWidth = this.container.layoutWidth != null ? this.container.layoutWidth : this.layoutWidth;
			};
		}),

		/**
		* @see {@link enyo.Arranger.size}
		* @protected
		*/
		size: function () {
			var c$ = this.container.getPanels();
			var padding = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {};
			var pb = this.containerBounds;
			var i, m, c;
			pb.width -= padding.left + padding.right;
			var nw = pb.width;
			var len = c$.length;
			var offset;
			// panel arrangement positions
			this.container.transitionPositions = {};

			for (i=0; (c=c$[i]); i++) {
				c.width = ((i===0) && (this.container.basePanel)) ? nw : c.getBounds().width;
			}

			for (i=0; (c=c$[i]); i++) {

				if ((i===0) && (this.container.basePanel)) {
					c.setBounds({width: nw});
				}
				c.setBounds({top: padding.top, bottom: padding.bottom});

				for (var j=0; (c=c$[j]); j++) {
					var xPos;
					// index 0 always should always be left-aligned at 0px
					if ((i===0) && (this.container.basePanel)) {
						xPos = 0;
					// else newer panels should be positioned off the viewport
					} else if (j < i) {
						xPos = nw;
					// else active panel should be right-aligned
					} else if (i === j) {
						offset = nw > this.layoutWidth ? this.overlap : 0;
						xPos = (nw - c$[i].width) + offset;
					} else {
						break;
					}
					this.container.transitionPositions[i + '.' + j] = xPos;
				}

				if (j < len) {
					var leftAlign = false;
					for (var k=i+1; k<len; k++) {
						offset = 0;
						// position panel to left: 0px
						if (leftAlign) {
							offset = 0;
						// else if next panel cannot fit within container
						} else if ( (c$[i].width + c$[k].width - this.overlap) > nw ) {
						//} else if ( (c$[i].width + c$[k].width) > nw ) {
							offset = 0;
							leftAlign = true;
						} else {
							offset = c$[i].width - this.overlap;
							for (m=i; m<k; m++) {
								var _w = offset + c$[m+1].width - this.overlap;
								if (_w < nw) {
									offset = _w;
								} else {
									offset = nw;
									break;
								}
							}
							offset = nw - offset;
						}
						this.container.transitionPositions[i + '.' + k] = offset;
					}
				}

			}
		},

		/**
		* Sets the `left` position for each panel according to the `arrangement`.
		*
		* @see {@link enyo.Arranger.arrange}
		* @protected
		*/
		arrange: function (controls, arrangement) {
			var i, c;
			var c$ = this.container.getPanels();
			var s = this.container.clamp(arrangement);

			for (i=0; (c=c$[i]); i++) {
				var xPos = this.container.transitionPositions[i + '.' + s];
				this.arrangeControl(c, {left: xPos});
			}
		},

		/**
		* Calculates the difference in width between the panels at `i0` and `i1`.
		*
		* @see {@link enyo.Arranger.calcArrangementDifference}
		* @protected
		*/
		calcArrangementDifference: function (i0, a0, i1, a1) {
			var p = this.container.getPanels();
			var w = (i0 < i1) ? p[i1].width : p[i0].width;
			return w;
		},

		/**
		* Resets the position of the panels.
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