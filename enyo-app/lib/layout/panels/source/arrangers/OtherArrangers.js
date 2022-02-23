(function (enyo, scope) {
	/**
	* {@link enyo.LeftRightArranger} is an {@link enyo.Arranger} that displays
	* the active control and some of the previous and next controls. The active
	* control is centered horizontally in the container, and the previous and next
	* controls are laid out to the left and right, respectively.
	*
	* Transitions between arrangements are handled by sliding the new control in
	* from the right and sliding the active control out to the left.
	*
	* For more information, see the documentation on
	* [Arrangers]{@linkplain $dev-guide/building-apps/layout/arrangers.html} in the
	* Enyo Developer Guide.
	*
	* @class  enyo.LeftRightArranger
	* @extends enyo.Arranger
	* @public
	*/
	enyo.kind(
		/** @lends enyo.LeftRightArranger.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.LeftRightArranger',

		/**
		* @private
		*/
		kind: 'Arranger',

		/**
		 * The margin width (i.e., how much of the previous and next controls
		 * are visible) in pixels.
		 *
		 * Note that this is imported from the container at construction time.
		 *
		 * @type {Number}
		 * @default 40
		 * @public
		 */
		margin: 40,

		/**
		 * The axis along which the panels will animate.
		 *
		 * @type {String}
		 * @readOnly
		 * @default 'width'
		 * @protected
		 */
		axisSize: 'width',

		/**
		 * The axis along which the panels will **not** animate.
		 *
		 * @type {String}
		 * @readOnly
		 * @default 'height'
		 * @protected
		 */
		offAxisSize: 'height',

		/**
		 * The axis position at which the panel will animate.
		 *
		 * @type {String}
		 * @readOnly
		 * @default 'left'
		 * @protected
		 */
		axisPosition: 'left',

		/**
		* @method
		* @private
		*/
		constructor: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.margin = this.container.margin != null ? this.container.margin : this.margin;
			};
		}),

		/**
		* Sizes the panels such that they fill [offAxisSize]{@link enyo.LeftRightArranger#offAxisSize}
		* and yield [margin]{@link enyo.LeftRightArranger#margin} pixels on each side of
		* [axisSize]{@link enyo.LeftRightArranger#axisSize}.
		*
		* @see {@link enyo.Arranger.size}
		* @protected
		*/
		size: function () {
			var c$ = this.container.getPanels();
			var port = this.containerBounds[this.axisSize];
			var box = port - this.margin -this.margin;
			for (var i=0, b, c; (c=c$[i]); i++) {
				b = {};
				b[this.axisSize] = box;
				b[this.offAxisSize] = '100%';
				c.setBounds(b);
			}
		},

		/**
		* To prevent a panel that is switching sides (to maintain the balance) from overlapping
		* the active panel during the animation, updates the `z-index` of the switching panel
		* to ensure that it stays behind the other panels.
		*
		* @todo Could use some optimization in its `for` loop (e.g. .length lookup and calc)
		* @see {@link enyo.Arranger.start}
		* @method
		* @protected
		*/
		start: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);

				var s = this.container.fromIndex;
				var f = this.container.toIndex;
				var c$ = this.getOrderedControls(f);
				var o = Math.floor(c$.length/2);

				for (var i=0, c; (c=c$[i]); i++) {
					if (s > f){
						if (i == (c$.length - o)){
							c.applyStyle('z-index', 0);
						} else {
							c.applyStyle('z-index', 1);
						}
					} else {
						if (i == (c$.length-1 - o)){
							c.applyStyle('z-index', 0);
						} else {
							c.applyStyle('z-index', 1);
						}
					}
				}
			};
		}),

		/**
		* Balances the panels laid out to each side of the active panel
		* such that, for a set of `n` panels, `floor(n/2)` are before and `ceil(n/2)` are after
		* the active panel.
		*
		* @protected
		*/
		arrange: function (controls, arrangement) {
			var i,c,b;
			if (this.container.getPanels().length==1){
				b = {};
				b[this.axisPosition] = this.margin;
				this.arrangeControl(this.container.getPanels()[0], b);
				return;
			}
			var o = Math.floor(this.container.getPanels().length/2);
			var c$ = this.getOrderedControls(Math.floor(arrangement)-o);
			var box = this.containerBounds[this.axisSize] - this.margin - this.margin;
			var e = this.margin - box * o;
			for (i=0; (c=c$[i]); i++) {
				b = {};
				b[this.axisPosition] = e;
				this.arrangeControl(c, b);
				e += box;
			}
		},

		/**
		* Calculates the difference along the
		* [axisPosition]{@link enyo.LeftRightArranger#axisPosition} (e.g., `'left'`).
		*
		* @param {Number} inI0 - The initial layout setting.
		* @param {Object} inA0 - The initial arrangement.
		* @param {Number} inI1 - The target layout setting.
		* @param {Object} inA1 - The target arrangement.
		* @protected
		*/
		calcArrangementDifference: function (inI0, inA0, inI1, inA1) {
			if (this.container.getPanels().length==1){
				return 0;
			}

			var i = Math.abs(inI0 % this.c$.length);
			//enyo.log(inI0, inI1);
			return inA0[i][this.axisPosition] - inA1[i][this.axisPosition];
		},

		/**
		* Resets the positioning and opacity of panels.
		*
		* @method
		* @private
		*/
		destroy: enyo.inherit(function (sup) {
			return function () {
				var c$ = this.container.getPanels();
				for (var i=0, c; (c=c$[i]); i++) {
					enyo.Arranger.positionControl(c, {left: null, top: null});
					enyo.Arranger.opacifyControl(c, 1);
					c.applyStyle('left', null);
					c.applyStyle('top', null);
					c.applyStyle('height', null);
					c.applyStyle('width', null);
				}
				sup.apply(this, arguments);
			};
		})
	});

	//* @public
	/**
	* {@link enyo.TopBottomArranger} is an {@link enyo.Arranger} that displays
	* the active control and some of the previous and next controls. The active
	* control is centered vertically in the container, and the previous and next
	* controls are laid out above and below, respectively.
	*
	* Transitions between arrangements are handled by sliding the new control in
	* from the bottom and sliding the active control out the top.
	*
	* For more information, see the documentation on
	* [Arrangers]{@linkplain $dev-guide/building-apps/layout/arrangers.html} in the
	* Enyo Developer Guide.
	*
	* @class enyo.TopBottomArranger
	* @extends enyo.LeftRightArranger
	* @public
	*/
	enyo.kind(
		/** @lends enyo.TopBottomArranger.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.TopBottomArranger',

		/**
		* @private
		*/
		kind: 'LeftRightArranger',

		/**
		* @see {@link enyo.Arranger.dragProp}
		* @private
		*/
		dragProp: 'ddy',

		/**
		* @see {@link enyo.Arranger.dragDirectionProp}
		* @private
		*/
		dragDirectionProp: 'yDirection',

		/**
		* @see {@link enyo.Arranger.canDragProp}
		* @private
		*/
		canDragProp: 'vertical',

		/**
		* @see {@link enyo.LeftRightArranger.axisSize}
		* @protected
		*/
		axisSize: 'height',

		/**
		* @see {@link enyo.LeftRightArranger.offAxisSize}
		* @protected
		*/
		offAxisSize: 'width',

		/**
		* @see {@link enyo.LeftRightArranger.axisPosition}
		* @protected
		*/
		axisPosition: 'top'
	});

	/**
	* {@link enyo.SpiralArranger} is an {@link enyo.Arranger} that arranges
	* controls in a spiral. The active control is positioned on top and the other
	* controls are laid out in a spiral pattern below.
	*
	* Transitions between arrangements are handled by rotating the new control up
	* from below and rotating the active control down to the end of the spiral.
	*
	* For more information, see the documentation on
	* [Arrangers]{@linkplain $dev-guide/building-apps/layout/arrangers.html} in the
	* Enyo Developer Guide.
	*
	* @class  enyo.SpiralArranger
	* @extends enyo.Arranger
	* @public
	*/
	enyo.kind(
		/** @lends enyo.SpiralArranger.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.SpiralArranger',

		/**
		* @private
		*/
		kind: 'Arranger',

		/**
		* @see {@link enyo.Arranger.incrementalPoints}
		* @private
		*/
		incrementalPoints: true,

		/**
		* The amount of space between successive controls
		*
		* @private
		*/
		inc: 20,

		/**
		* Sizes each panel to one third of the container.
		*
		* @see  {@link enyo.Arranger.size}
		* @protected
		*/
		size: function () {
			var c$ = this.container.getPanels();
			var b = this.containerBounds;
			var w = this.controlWidth = b.width/3;
			var h = this.controlHeight = b.height/3;
			for (var i=0, c; (c=c$[i]); i++) {
				c.setBounds({width: w, height: h});
			}
		},

		/**
		* Arranges panels in a spiral with the active panel at the center.
		*
		* @see {@link enyo.Arranger.arrange}
		* @protected
		*/
		arrange: function (controls, arrangement) {
			var s = this.inc;
			for (var i=0, l=controls.length, c; (c=controls[i]); i++) {
				var x = Math.cos(i/l * 2*Math.PI) * i * s + this.controlWidth;
				var y = Math.sin(i/l * 2*Math.PI) * i * s + this.controlHeight;
				this.arrangeControl(c, {left: x, top: y});
			}
		},

		/**
		* Applies descending `z-index` values to each panel, starting with the active panel.
		*
		* @see {@link enyo.Arranger.start}
		* @method
		* @protected
		*/
		start: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				var c$ = this.getOrderedControls(this.container.toIndex);
				for (var i=0, c; (c=c$[i]); i++) {
					c.applyStyle('z-index', c$.length - i);
				}
			};
		}),

		/**
		* @see {@link enyo.Arranger.calcArrangementDifference}
		* @protected
		*/
		calcArrangementDifference: function (inI0, inA0, inI1, inA1) {
			return this.controlWidth;
		},

		/**
		* Resets position and z-index of all panels.
		*
		* @method
		* @private
		*/
		destroy: enyo.inherit(function (sup) {
			return function () {
				var c$ = this.container.getPanels();
				for (var i=0, c; (c=c$[i]); i++) {
					c.applyStyle('z-index', null);
					enyo.Arranger.positionControl(c, {left: null, top: null});
					c.applyStyle('left', null);
					c.applyStyle('top', null);
					c.applyStyle('height', null);
					c.applyStyle('width', null);
				}
				sup.apply(this, arguments);
			};
		})
	});

	/**
	* {@link enyo.GridArranger} is an {@link enyo.Arranger} that arranges
	* controls in a grid. The active control is positioned at the top-left of the
	* grid and the other controls are laid out from left to right and then from
	* top to bottom.
	*
	* Transitions between arrangements are handled by moving the active control to
	* the end of the grid and shifting the other controls	to the left, or by
	* moving it up to the previous row, to fill the space.
	*
	* For more information, see the documentation on
	* [Arrangers]{@linkplain $dev-guide/building-apps/layout/arrangers.html} in the
	* Enyo Developer Guide.
	*/
	enyo.kind(
		/** @lends enyo.GridArranger.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.GridArranger',

		/**
		* @private
		*/
		kind: 'Arranger',

		/**
		* @see {@link enyo.Arranger.incrementalPoints}
		* @private
		*/
		incrementalPoints: true,

		/**
		 * The column width in pixels.
		 *
		 * @type {Number}
		 * @default 100
		 * @public
		 */
		colWidth: 100,

		/**
		 * The column height in pixels.
		 *
		 * @type {Number}
		 * @default 100
		 * @public
		 */
		colHeight: 100,

		/**
		* Sizes each panel to be [colWidth]{@link enyo.GridArranger#colWidth} pixels wide
		* and [colHeight]{@link enyo.GridArranger#colHeight} pixels high.
		*
		* @see {@link enyo.Arranger.size}
		* @protected
		*/
		size: function () {
			var c$ = this.container.getPanels();
			var w=this.colWidth, h=this.colHeight;
			for (var i=0, c; (c=c$[i]); i++) {
				c.setBounds({width: w, height: h});
			}
		},

		/**
		* Calculates the number of columns based on the container's width and
		* [colWidth]{@link enyo.GridArranger#colWidth}. Each row is positioned
		* starting at the top-left of the container.
		*
		* @see {@link enyo.Arranger.arrange}
		* @protected
		*/
		arrange: function (controls, arrangement) {
			var w=this.colWidth, h=this.colHeight;
			var cols = Math.max(1, Math.floor(this.containerBounds.width / w));
			var c;
			for (var y=0, i=0; i<controls.length; y++) {
				for (var x=0; (x<cols) && (c=controls[i]); x++, i++) {
					this.arrangeControl(c, {left: w*x, top: h*y});
				}
			}
		},

		/**
		* If the control is moving between rows, adjusts its opacity during the transition.
		*
		* @see {@link enyo.Arranger.flowControl}
		* @method
		* @protected
		*/
		flowControl: enyo.inherit(function (sup) {
			return function (inControl, inA) {
				sup.apply(this, arguments);
				enyo.Arranger.opacifyControl(inControl, inA.top % this.colHeight !== 0 ? 0.25 : 1);
			};
		}),

		/**
		* @see {@link enyo.Arranger.calcArrangementDifference}
		* @protected
		*/
		calcArrangementDifference: function (inI0, inA0, inI1, inA1) {
			return this.colWidth;
		},

		/**
		* Resets position of panels.
		*
		* @method
		* @private
		*/
		destroy: enyo.inherit(function (sup) {
			return function () {
				var c$ = this.container.getPanels();
				for (var i=0, c; (c=c$[i]); i++) {
					enyo.Arranger.positionControl(c, {left: null, top: null});
					c.applyStyle('left', null);
					c.applyStyle('top', null);
					c.applyStyle('height', null);
					c.applyStyle('width', null);
				}
				sup.apply(this, arguments);
			};
		})
	});

})(enyo, this);