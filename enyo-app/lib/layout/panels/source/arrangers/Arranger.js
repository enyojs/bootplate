(function (enyo, scope) {

	/**
	* {@link enyo.Arranger} is an {@link enyo.Layout} that considers one of the
	* controls it lays out as active. The other controls are placed relative to
	* the active control as makes sense for the layout.
	*
	* `enyo.Arranger` supports dynamic layouts, meaning it's possible to transition
	* between an arranger's layouts	via animation. Typically, arrangers should lay out
	* controls using CSS transforms, since these are optimized for animation. To
	* support this, the controls in an arranger are absolutely positioned, and
	* the Arranger kind has an [accelerated]{@link enyo.Arranger#accelerated} property,
	* which marks controls for CSS compositing. The default setting of `'auto'` ensures
	* that this will occur if enabled by the platform.
	*
	* For more information, see the documentation on
	* [Arrangers]{@linkplain $dev-guide/building-apps/layout/arrangers.html} in the
	* Enyo Developer Guide.
	*
	* @class  enyo.Arranger
	* @extends enyo.Layout
	* @public
	*/
	enyo.kind(
		/** @lends  enyo.Arranger.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.Arranger',

		/**
		* @private
		*/
		kind: 'Layout',

		/**
		* @private
		*/
		layoutClass: 'enyo-arranger',

		/**
		* Flag indicating whether the Arranger should lay out controls using CSS
		* compositing. The default setting `('auto')` will mark controls for compositing
		* if the platform supports it.
		*
		* @type {String|Boolean}
		* @default 'auto'
		* @protected
		*/
		accelerated: 'auto',

		/**
		* A property of the drag event, used to calculate the amount that a drag will
		* move the layout.
		*
		* @type {String}
		* @default 'ddx'
		* @private
		*/
		dragProp: 'ddx',

		/**
		* A property of the drag event, used to calculate the direction of the drag.
		*
		* @type {String}
		* @default 'xDirection'
		* @private
		*/
		dragDirectionProp: 'xDirection',

		/**
		* A property of the drag event, used to calculate whether a drag should occur.
		*
		* @type {String}
		* @default 'horizontal'
		* @private
		*/
		canDragProp: 'horizontal',

		/**
		* If set to `true`, transitions between non-adjacent arrangements will go
		* through the intermediate arrangements. This is useful when direct
		* transitions between arrangements would be visually jarring.
		*
		* @type {Boolean}
		* @default false
		* @protected
		*/
		incrementalPoints: false,

		/**
		* Called when removing an arranger (e.g., when switching a Panels control to a
		* different `arrangerKind`). Subkinds should implement this function to reset
		* whatever properties they've changed on child controls. Note that you **must**
		* call the superkind implementation in your subkind's `destroy()` function.
		*
		* @method
		* @private
		*/
		destroy: enyo.inherit(function (sup) {
			return function () {
				var c$ = this.container.getPanels();
				for (var i=0, c; (c=c$[i]); i++) {
					c._arranger = null;
				}
				sup.apply(this, arguments);
			};
		}),

		/**
		* Arranges the given array of `controls` in the layout specified by `index`. When
		* implementing this method, rather than applying styling directly to controls, call
		* [arrangeControl()]{@link enyo.Arranger#arrangeControl} and pass in an arrangement
		* object with styling settings. The styles will then be applied via
		* [flowControl()]{@link enyo.Arranger#flowControl}.
		*
		* @param {enyo.Control[]} controls
		* @param {Number} index
		* @virtual
		* @protected
		*/
		arrange: function (controls, index) {
		},

		/**
		* Sizes the controls in the layout. This method is called only at reflow time.
		* Note that the sizing operation has been separated from the layout done in
		* [arrange()]{@link enyo.Arranger#arrange} because it is expensive and not suitable
		* for dynamic layout.
		*
		* @virtual
		* @protected
		*/
		size: function () {
		},

		/**
		* Called when a layout transition begins. Implement this method to perform
		* tasks that should only occur when a transition starts; for example, some
		* controls might be shown or hidden. In addition, the `transitionPoints`
		* array may be set on the container to dictate the named arrangements
		* between which the transition occurs.
		*
		* @protected
		*/
		start: function () {
			var f = this.container.fromIndex, t = this.container.toIndex;
			var p$ = this.container.transitionPoints = [f];
			// optionally add a transition point for each index between from and to.
			if (this.incrementalPoints) {
				var d = Math.abs(t - f) - 2;
				var i = f;
				while (d >= 0) {
					i = i + (t < f ? -1 : 1);
					p$.push(i);
					d--;
				}
			}
			p$.push(this.container.toIndex);
		},

		/**
		* Called when a layout transition completes. Implement this method to
		* perform tasks that should only occur when a transition ends; for
		* example, some controls might be shown or hidden.
		*
		* @virtual
		* @protected
		*/
		finish: function () {
		},

		/**
		* Called when dragging the layout, this method returns the difference in
		* pixels between the arrangement `a0` for layout setting `i0`	and
		* arrangement `a1` for layout setting `i1`. This data is used to calculate
		* the percentage that a drag should move the layout between two active states.
		*
		* @param {Number} i0 - The initial layout setting.
		* @param {Object} a0 - The initial arrangement.
		* @param {Number} i1 - The target layout setting.
		* @param {Object} a1 - The target arrangement.
		* @virtual
		* @protected
		*/
		calcArrangementDifference: function (i0, a0, i1, a1) {
		},

		/**
		* @private
		*/
		canDragEvent: function (event) {
			return event[this.canDragProp];
		},

		/**
		* @private
		*/
		calcDragDirection: function (event) {
			return event[this.dragDirectionProp];
		},

		/**
		* @private
		*/
		calcDrag: function (event) {
			return event[this.dragProp];
		},

		/**
		* @private
		*/
		drag: function (dp, an, a, bn, b) {
			var f = this.measureArrangementDelta(-dp, an, a, bn, b);
			return f;
		},

		/**
		* @private
		*/
		measureArrangementDelta: function (x, i0, a0, i1, a1) {
			var d = this.calcArrangementDifference(i0, a0, i1, a1);
			var s = d ? x / Math.abs(d) : 0;
			s = s * (this.container.fromIndex > this.container.toIndex ? -1 : 1);
			return s;
		},

		/**
		* Arranges the panels, with the panel at `index` being designated as active.
		*
		* @param  {Number} index - The index of the active panel.
		* @private
		*/
		_arrange: function (index) {
			// guard against being called before we've been rendered
			if (!this.containerBounds) {
				this.reflow();
			}
			var c$ = this.getOrderedControls(index);
			this.arrange(c$, index);
		},

		/**
		* Arranges `control` according to the specified `arrangement`.
		*
		* Note that this method doesn't actually modify `control` but rather sets the
		* arrangement on a private member of the control to be retrieved by
		* {@link enyo.Panels}.
		*
		* @param  {enyo.Control} control
		* @param  {Object} arrangement
		* @private
		*/
		arrangeControl: function (control, arrangement) {
			control._arranger = enyo.mixin(control._arranger || {}, arrangement);
		},

		/**
		* Called before HTML is rendered. Applies CSS to panels to ensure GPU acceleration if
		* [accelerated]{@link enyo.Arranger#accelerated} is `true`.
		*
		* @private
		*/
		flow: function () {
			this.c$ = [].concat(this.container.getPanels());
			this.controlsIndex = 0;
			for (var i=0, c$=this.container.getPanels(), c; (c=c$[i]); i++) {
				enyo.dom.accelerate(c, !c.preventAccelerate && this.accelerated);
				if (enyo.platform.safari) {
					// On Safari-desktop, sometimes having the panel's direct child set to accelerate isn't sufficient
					// this is most often the case with Lists contained inside another control, inside a Panels
					var grands=c.children;
					for (var j=0, kid; (kid=grands[j]); j++) {
						enyo.dom.accelerate(kid, this.accelerated);
					}
				}
			}
		},

		/**
		* Called during "rendered" phase to [size]{@link enyo.Arranger#size} the controls.
		*
		* @private
		*/
		reflow: function () {
			var cn = this.container.hasNode();
			this.containerBounds = cn ? {width: cn.clientWidth, height: cn.clientHeight} : {};
			this.size();
		},

		/**
		* If the {@link enyo.Panels} has an arrangement, flows each control according to that
		* arrangement.
		*
		* @private
		*/
		flowArrangement: function () {
			var a = this.container.arrangement;
			if (a) {
				for (var i=0, c$=this.container.getPanels(), c; (c=c$[i]) && (a[i]); i++) {
					this.flowControl(c, a[i]);
				}
			}
		},
		/**
		* Lays out the given `control` according to the settings stored in the
		* `arrangement` object. By default, `flowControl()` will apply settings for
		* `left`, `top`, and `opacity`. This method should only be implemented to apply
		* other settings made via [arrangeControl()]{@link enyo.Arranger#arrangeControl}.
		*
		* @param {enyo.Control} control - The control to be laid out.
		* @param {Object} arrangement - An object whose members specify the layout settings.
		* @protected
		*/
		flowControl: function (control, arrangement) {
			enyo.Arranger.positionControl(control, arrangement);
			var o = arrangement.opacity;
			if (o != null) {
				enyo.Arranger.opacifyControl(control, o);
			}
		},

		/**
		* Gets an array of controls arranged in state order.
		* note: optimization, dial around a single array.
		*
		* @param  {Number} index     - The index of the active panel.
		* @return {enyo.Control[]}   - Ordered array of controls.
		* @private
		*/
		getOrderedControls: function (index) {
			var whole = Math.floor(index);
			var a = whole - this.controlsIndex;
			var sign = a > 0;
			var c$ = this.c$ || [];
			for (var i=0; i<Math.abs(a); i++) {
				if (sign) {
					c$.push(c$.shift());
				} else {
					c$.unshift(c$.pop());
				}
			}
			this.controlsIndex = whole;
			return c$;
		},

		/**
		* @lends  enyo.Arranger
		* @private
		*/
		statics: {
			/**
			* Positions a control via transform--`translateX/translateY` if supported,
			* falling back to `left/top` if not.
			*
			* @param  {enyo.Control} control - The control to position.
			* @param  {Object} bounds        - The new bounds for `control`.
			* @param  {String} unit          - The unit for `bounds` members.
			* @public
			*/
			positionControl: function (control, bounds, unit) {
				unit = unit || 'px';
				if (!this.updating) {
					// IE10 uses setBounds because of control hit caching problems seem in some apps
					if (enyo.dom.canTransform() && !control.preventTransform && !enyo.platform.android && enyo.platform.ie !== 10) {
						var l = bounds.left, t = bounds.top;
						l = enyo.isString(l) ? l : l && (l + unit);
						t = enyo.isString(t) ? t : t && (t + unit);
						enyo.dom.transform(control, {translateX: l || null, translateY: t || null});
					} else {
						// If a previously positioned control has subsequently been marked with
						// preventTransform, we need to clear out any old translation values.
						if (enyo.dom.canTransform() && control.preventTransform) {
							enyo.dom.transform(control, {translateX: null, translateY: null});
						}
						control.setBounds(bounds, unit);
					}
				}
			},

			/**
			* Sets the opacity value for a given control.
			*
			* @param  {enyo.Control} inControl - The control whose opacity is to be set.
			* @param  {Number} inOpacity - The new opacity value for the control.
			* @public
			*/
			opacifyControl: function (inControl, inOpacity) {
				var o = inOpacity;
				// FIXME: very high/low settings of opacity can cause a control to
				// blink so cap this here.
				o = o > 0.99 ? 1 : (o < 0.01 ? 0 : o);
				// note: we only care about ie8
				if (enyo.platform.ie < 9) {
					inControl.applyStyle('filter', 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + (o * 100) + ')');
				} else {
					inControl.applyStyle('opacity', o);
				}
			}
		}
	});

})(enyo, this);