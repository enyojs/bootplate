(function (enyo, scope) {

	/**
	* Fires when the Slideable finishes animating.
	*
	* @event enyo.Slideable#onAnimateFinish
	* @type {enyo.Animator}
	* @public
	*/

	/**
	* Fires when the position (i.e., [value]{@link enyo.Slideable#value}) of the
	* Slideable changes.
	*
	* @event enyo.Slideable#onChange
	* @type {Object}
	* @public
	*/

	/**
	* {@link enyo.Slideable} is a control that may be dragged either horizontally
	* or vertically between a minimum and a maximum value. When released from
	* dragging, a Slideable will animate to its minimum or maximum position,
	* depending on the direction of the drag.
	*
	* The [min]{@link enyo.Slideable#min} value specifies a position to the left of,
	* or above, the initial position, to which the Slideable may be dragged.
	* The [max]{@link enyo.Slideable#max} value specifies a position to the right of,
	* or below, the initial position, to which the Slideable may be dragged.
	* The [value]{@link enyo.Slideable#value} property specifies the current position
	* of the Slideable, between the minimum and maximum positions.
	*
	* `min`, `max`, and `value` may be specified in units of 'px' or '%'.
	*
	* The [axis]{@link enyo.Slideable#axis} property determines whether the Slideable
	* slides left-to-right ('h') or up-and-down ('v').
	*
	* The following control is placed 90% off the screen to the right, and slides
	* to its natural position:
	*
	* ```
	* {kind: 'enyo.Slideable', value: -90, min: -90, unit: '%',
	* 	classes: 'enyo-fit', style: 'width: 300px;',
	* 	components: [
	* 		{content: 'stuff'}
	* 	]
	* }
	* ```
	*
	* @ui
	* @class  enyo.Slideable
	* @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends  enyo.Slideable.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.Slideable',

		/**
		* @private
		*/
		kind: 'Control',

		/**
		* @lends enyo.Slideable.prototype
		* @private
		*/
		published: {
			/**
			* Direction of sliding; valid values are `'h'` for horizonal or `'v'` for vertical.
			*
			* @type {String}
			* @default 'h'
			* @public
			*/
			axis: 'h',

			/**
			* Current position of the Slideable (a value between
			* [min]{@link enyo.Slideable#min} and [max]{@link enyo.Slideable#max}).
			*
			* @type {Number}
			* @default  0
			* @public
			*/
			value: 0,

			/**
			* Unit for [min]{@link enyo.Slideable#min}, [max]{@link enyo.Slideable#max},
			* and [value]{@link enyo.Slideable#value}; valid values are `'px'` or `'%'`.
			*
			* @type {String}
			* @default  'px'
			* @public
			*/
			unit: 'px',

			/**
			* The minimum value to slide to.
			*
			* @type {Number}
			* @default 0
			* @public
			*/
			min: 0,

			/**
			* The maximum value to slide to.
			*
			* @type {Number}
			* @default  0
			* @public
			*/
			max: 0,

			/**
			* When truthy, applies CSS styles to allow GPU compositing of slideable
			* content, if allowed by the platform.
			*
			* @type {String}
			* @default  'auto'
			* @public
			*/
			accelerated: 'auto',

			/**
			* Set to `false` to prevent the Slideable from dragging with elasticity
			* past its [min]{@link enyo.Slideable#min} or [max]{@link enyo.Slideable#max}
			* value.
			*
			* @type {Boolean}
			* @default  true
			* @public
			*/
			overMoving: true,

			/**
			* Indicates whether dragging is allowed. Set to `false` to disable dragging.
			*
			* @type {Boolean}
			* @default  true
			* @public
			*/
			draggable: true
		},

		/**
		* @private
		*/
		events: {
			onAnimateFinish: '',
			onChange: ''
		},

		/**
		* Set to `true` to prevent drag events from bubbling beyond the Slideable.
		*
		* @private
		*/
		preventDragPropagation: false,

		/**
		* @private
		*/
		tools: [
			{kind: 'Animator', onStep: 'animatorStep', onEnd: 'animatorComplete'}
		],

		/**
		* @private
		*/
		handlers: {
			ondragstart: 'dragstart',
			ondrag: 'drag',
			ondragfinish: 'dragfinish'
		},

		/**
		* @private
		*/
		kDragScalar: 1,

		/**
		* @private
		*/
		dragEventProp: 'dx',

		/**
		* @private
		*/
		unitModifier: false,

		/**
		* @private
		*/
		canTransform: false,

		/**
		* Indicates which property of the drag event is used to position the control.
		*
		* @private
		*/
		dragMoveProp: 'dx',

		/**
		* Indicates which property of the drag event is used to allow dragging.
		*
		* @private
		*/
		shouldDragProp: 'horizontal',

		/**
		* The transform property to modify, provided that
		* [canTransform]{@link enyo.Slideable#canTransform} is `true`.
		*
		* @private
		*/
		transform: 'translateX',

		/**
		* The dimension attribute to modify; will be either `'height'` or `'width'`.
		*
		* @private
		*/
		dimension: 'width',

		/**
		* The position attribute to modify; will be either `'top'` or `'left'`.
		*
		* @private
		*/
		boundary: 'left',

		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.acceleratedChanged();
				this.transformChanged();
				this.axisChanged();
				this.valueChanged();
				this.addClass('enyo-slideable');
			};
		}),

		/**
		* @method
		* @private
		*/
		initComponents: enyo.inherit(function (sup) {
			return function () {
				this.createComponents(this.tools);
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
				this.canModifyUnit();
				this.updateDragScalar();
			};
		}),

		/**
		* @method
		* @private
		*/
		handleResize: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.updateDragScalar();
			};
		}),

		/**
		* If transforms can't be used and inline style is using 'px' while
		* [unit]{@link enyo.Slideable#unit} is `'%'`, this sets the
		* [unitModifier]{@link enyo.Slideable#unitModifier} property to the current
		* value of [dimension]{@link enyo.Slideable#dimension}.
		*
		* @private
		*/
		canModifyUnit: function () {
			if (!this.canTransform) {
				var b = this.getInitialStyleValue(this.hasNode(), this.boundary);
				// If inline style of 'px' exists, while unit is '%'
				if (b.match(/px/i) && (this.unit === '%')) {
					// Set unitModifier - used to over-ride '%'
					this.unitModifier = this.getBounds()[this.dimension];
				}
			}
		},

		/**
		* @private
		*/
		getInitialStyleValue: function (node, boundary) {
			var s = enyo.dom.getComputedStyle(node);
			if (s) {
				return s.getPropertyValue(boundary);
			} else if (node && node.currentStyle) {
				return node.currentStyle[boundary];
			}
			return '0';
		},

		/**
		* @private
		*/
		updateBounds: function (inValue, inDimensions) {
			var inBounds = {};
			inBounds[this.boundary] = inValue;
			this.setBounds(inBounds, this.unit);

			this.setInlineStyles(inValue, inDimensions);
		},

		/**
		* @private
		*/
		updateDragScalar: function () {
			if (this.unit == '%') {
				var d = this.getBounds()[this.dimension];
				this.kDragScalar = d ? 100 / d : 1;

				if (!this.canTransform) {
					this.updateBounds(this.value, 100);
				}
			}
		},

		/**
		* @private
		*/
		transformChanged: function () {
			this.canTransform = enyo.dom.canTransform();
		},

		/**
		* @private
		*/
		acceleratedChanged: function () {
			if (!enyo.platform.android || enyo.platform.android <= 2) {
				enyo.dom.accelerate(this, this.accelerated);
			}
		},

		/**
		* @private
		*/
		axisChanged: function () {
			var h = this.axis == 'h';
			this.dragMoveProp = h ? 'dx' : 'dy';
			this.shouldDragProp = h ? 'horizontal' : 'vertical';
			this.transform = h ? 'translateX' : 'translateY';
			this.dimension = h ? 'width' : 'height';
			this.boundary = h ? 'left' : 'top';
		},

		/**
		* @private
		*/
		setInlineStyles: function (value, dimensions) {
			var inBounds = {};

			if (this.unitModifier) {
				inBounds[this.boundary] = this.percentToPixels(value, this.unitModifier);
				inBounds[this.dimension] = this.unitModifier;
				this.setBounds(inBounds);
			} else {
				if (dimensions) {
					inBounds[this.dimension] = dimensions;
				} else {
					inBounds[this.boundary] = value;
				}
				this.setBounds(inBounds, this.unit);
			}
		},

		/**
		* @fires enyo.Slideable#onChange
		* @private
		*/
		valueChanged: function (inLast) {
			var v = this.value;
			if (this.isOob(v) && !this.isAnimating()) {
				this.value = this.overMoving ? this.dampValue(v) : this.clampValue(v);
			}
			// FIXME: android cannot handle nested compositing well so apply acceleration only if needed
			// desktop chrome doesn't like this code path so avoid...
			if (enyo.platform.android > 2) {
				if (this.value) {
					if (inLast === 0 || inLast === undefined) {
						enyo.dom.accelerate(this, this.accelerated);
					}
				} else {
					enyo.dom.accelerate(this, false);
				}
			}

			// If platform supports transforms
			if (this.canTransform) {
				enyo.dom.transformValue(this, this.transform, this.value + this.unit);
			// else update inline styles
			} else {
				this.setInlineStyles(this.value, false);
			}
			this.doChange();
		},

		/**
		* @private
		*/
		getAnimator: function () {
			return this.$.animator;
		},

		/**
		* @private
		*/
		isAtMin: function () {
			return this.value <= this.calcMin();
		},

		/**
		* @private
		*/
		isAtMax: function () {
			return this.value >= this.calcMax();
		},

		/**
		* @private
		*/
		calcMin: function () {
			return this.min;
		},

		/**
		* @private
		*/
		calcMax: function () {
			return this.max;
		},

		/**
		* @private
		*/
		clampValue: function (inValue) {
			var min = this.calcMin();
			var max = this.calcMax();
			return Math.max(min, Math.min(inValue, max));
		},

		/**
		* @private
		*/
		dampValue: function (inValue) {
			return this.dampBound(this.dampBound(inValue, this.min, 1), this.max, -1);
		},

		/**
		* @private
		*/
		dampBound: function (inValue, inBoundary, inSign) {
			var v = inValue;
			if (v * inSign < inBoundary * inSign) {
				v = inBoundary + (v - inBoundary) / 4;
			}
			return v;
		},

		/**
		* Calculates the pixel value corresponding to the specified `percent` and
		* `dimension`.
		*
		* @param  {Number} percent
		* @param  {Number} dimension
		*
		* @return {Number}
		* @private
		*/
		percentToPixels: function (percent, dimension) {
			return Math.floor((dimension / 100) * percent);
		},

		/**
		* @private
		*/
		pixelsToPercent: function (value) {
			var boundary = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
			return (value / boundary) * 100;
		},

		/**
		* @private
		*/
		shouldDrag: function (inEvent) {
			return this.draggable && inEvent[this.shouldDragProp];
		},

		/**
		* Determines whether the specified value is out of bounds (i.e., greater than
		* [max]{@link enyo.Slideable#max} or less than [min]{@link enyo.Slideable#min}).
		*
		* @param {Number} inValue - The value to check.
		* @return {Boolean} `true` if `inValue` is out of bounds; otherwise, `false`.
		* @private
		*/
		isOob: function (inValue) {
			return inValue > this.calcMax() || inValue < this.calcMin();
		},

		/**
		* @private
		*/
		dragstart: function (inSender, inEvent) {
			if (this.shouldDrag(inEvent)) {
				inEvent.preventDefault();
				this.$.animator.stop();
				inEvent.dragInfo = {};
				this.dragging = true;
				this.drag0 = this.value;
				this.dragd0 = 0;
				return this.preventDragPropagation;
			}
		},

		/**
		* Updates [value]{@link enyo.Slideable#value} during a drag and determines the
		* direction of the drag.
		*
		* @private
		*/
		drag: function (inSender, inEvent) {
			if (this.dragging) {
				inEvent.preventDefault();
				var d = this.canTransform ? inEvent[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(inEvent[this.dragMoveProp]);
				var v = this.drag0 + d;
				var dd = d - this.dragd0;
				this.dragd0 = d;
				if (dd) {
					inEvent.dragInfo.minimizing = dd < 0;
				}
				this.setValue(v);
				return this.preventDragPropagation;
			}
		},

		/**
		* @private
		*/
		dragfinish: function (sender, event) {
			if (this.dragging) {
				this.dragging = false;
				this.completeDrag(event);
				event.preventTap();
				return this.preventDragPropagation;
			}
		},

		/**
		* Animates the control to either the [min]{@link enyo.Slideable#min} or
		* [max]{@link enyo.Slideable#max} value when dragging completes, based on the
		* direction of the drag (determined in [drag()]{@link enyo.Slideable#drag}).
		*
		* @private
		*/
		completeDrag: function (event) {
			if (this.value !== this.calcMax() && this.value != this.calcMin()) {
				this.animateToMinMax(event.dragInfo.minimizing);
			}
		},

		/**
		* @private
		*/
		isAnimating: function () {
			return this.$.animator.isAnimating();
		},

		/**
		* @private
		*/
		play: function (start, end) {
			this.$.animator.play({
				startValue: start,
				endValue: end,
				node: this.hasNode()
			});
		},

		/**
		* Animates to the given value.
		*
		* @param   {Number} value - The value to animate to.
		* @public
		*/
		animateTo: function (value) {
			this.play(this.value, value);
		},

		/**
		* Animates to the [minimum]{@link enyo.Slideable#min} value.
		*
		* @public
		*/
		animateToMin: function () {
			this.animateTo(this.calcMin());
		},

		/**
		* Animates to the [maximum]{@link enyo.Slideable#max} value.
		*
		* @public
		*/
		animateToMax: function () {
			this.animateTo(this.calcMax());
		},

		/**
		* Helper method to toggle animation to either the [min]{@link enyo.Slideable#min}
		* or [max]{@link enyo.Slideable#max} value.
		*
		* @param  {Boolean} min - Whether to animate to the minimum value.
		* @private
		*/
		animateToMinMax: function (min) {
			if (min) {
				this.animateToMin();
			} else {
				this.animateToMax();
			}
		},

		/**
		* Updates the [value]{@link enyo.Slideable#value} property during animation.
		*
		* @private
		*/
		animatorStep: function (sender) {
			this.setValue(sender.value);
			return true;
		},

		/**
		* @fires enyo.Slideable#onAnimateFinish
		* @private
		*/
		animatorComplete: function (sender) {
			this.doAnimateFinish(sender);
			return true;
		},

		/**
		* Toggles animation to either the [min]{@link enyo.Slideable#min} or
		* [max]{@link enyo.Slideable#max} value.
		*
		* @public
		*/
		toggleMinMax: function () {
			this.animateToMinMax(!this.isAtMin());
		}
	});

})(enyo, this);