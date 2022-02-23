(function (enyo, scope) {

	/**
	* Fires when bar position is set.
	*
	* @event onyx.Slider#onChange
	* @type {Object}
	* @property {Number} value - The new bar position.
	* @public
	*/

	/**
	* Fires while control knob is being dragged.
	*
	* @event onyx.Slider#onChanging
	* @type {Object}
	* @property {Number} value - The current bar position.
	* @public
	*/

	/**
	* Fires when animation to a position finishes.
	*
	* @event onyx.Slider#onAnimateFinish
	* @type {enyo.Animator}
	* @public
	* @todo  Animator as the payload; overlap with
	* 	{@link onyx.ProgressBar#onAnimateProgressFinish}
	*/

	/**
	* {@link onyx.Slider} is a control that presents a range of selection options
	* in the form of a horizontal slider with a control knob. The knob may be
	* tapped and dragged to the desired location.
	*
	* ```
	* {kind: 'onyx.Slider', value: 30}
	* ```
	*
	* [onChanging]{@link onyx.Slider#onChanging} events are fired while the
	* control knob is being dragged, and an [onChange]{@link onyx.Slider#onChange}
	* event is fired when the position is set, either by finishing a drag or by tapping
	* the bar.
	*
	* @class  onyx.Slider
	* @extends onyx.ProgressBar
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.Slider.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.Slider',

		/**
		* @private
		*/
		kind: 'onyx.ProgressBar',

		/**
		* @private
		*/
		classes: 'onyx-slider',

		/**
		* @lends onyx.Slider.prototype
		* @private
		*/
		published: {
			/**
			* Position of slider, expressed as an integer between `0` and `100`, inclusive.
			*
			* @type {Number}
			* @default  0
			* @public
			*/
			value: 0,

			/**
			* When `true`, current progress will be styled differently from rest of bar.
			*
			* @type {Boolean}
			* @default  true
			* @public
			*/
			lockBar: true,

			/**
			* When `true`, tapping on bar will change current position.
			*
			* @type {Boolean}
			* @default  true
			* @public
			*/
			tappable: true
		},

		/**
		* @private
		*/
		events: {
			onChange: '',
			onChanging: '',
			onAnimateFinish: ''
		},

		/**
		* If `true`, stripes are shown in the slider bar.
		*
		* @type {Boolean}
		* @default  false
		* @public
		*/
		showStripes: false,

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
		moreComponents: [
			{kind: 'Animator', onStep: 'animatorStep', onEnd: 'animatorComplete'},
			{classes: 'onyx-slider-taparea'},
			{name: 'knob', classes: 'onyx-slider-knob'}
		],

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);

			// add handlers for up/down events on knob for pressed state (workaround for inconsistent (timing-wise) active:hover styling)
			this.moreComponents[2].ondown = 'knobDown';
			this.moreComponents[2].onup = 'knobUp';

			this.createComponents(this.moreComponents);
			this.valueChanged();
		},

		/**
		* @private
		*/
		valueChanged: function () {
			this.value = this.clampValue(this.min, this.max, this.value);
			if (!this.$.animator.isAnimating()) {
				this.updateBar(this.value);
			}
		},

		/**
		* @private
		*/
		updateBar: function (value) {
			var p = this.calcPercent(value);
			this.updateKnobPosition(p);
			if (this.lockBar) {
				this.setProgress(value);
			}
		},

		/**
		* @private
		*/
		updateKnobPosition: function (percent) {
			this.$.knob.applyStyle('left', percent + '%');
		},

		/**
		* @private
		*/
		calcKnobPosition: function (event) {
			var x = event.clientX - this.hasNode().getBoundingClientRect().left;
			return (x / this.getBounds().width) * (this.max - this.min) + this.min;
		},

		/**
		* @private
		*/
		dragstart: function (sender, event) {
			if (event.horizontal) {
				event.preventDefault();
				this.dragging = true;
				sender.addClass('pressed');
				return true;
			}
		},

		/**
		* @fires onyx.Slider#onChanging
		* @private
		*/
		drag: function (sender, event) {
			if (this.dragging) {
				var v = this.calcKnobPosition(event);
				v = (this.increment) ? this.calcIncrement(v) : v;
				this.setValue(this.clampValue(this.min, this.max, v));
				this.doChanging({value: this.value});
				return true;
			}
		},

		/**
		* @fires onyx.Slider#onChange
		* @private
		*/
		dragfinish: function (sender, event) {
			this.dragging = false;
			event.preventTap();
			this.doChange({value: this.value});
			sender.removeClass('pressed');
			return true;
		},

		/**
		* @private
		*/
		tap: function (sender, event) {
			if (this.tappable) {
				var v = this.calcKnobPosition(event);
				v = (this.increment) ? this.calcIncrement(v) : v;
				this.tapped = true;
				this.animateTo(v);
				return true;
			}
		},

		/**
		* @private
		*/
		knobDown: function (sender, event) {
			this.$.knob.addClass('pressed');
		},

		/**
		* @private
		*/
		knobUp: function (sender, event) {
			this.$.knob.removeClass('pressed');
		},

		/**
		* Animates to the given value.
		*
		* @param  {Number} value - The value to animate to.
		* @public
		* @todo  functional overlap with {@link onyx.ProgressBar#animateProgressTo}
		*/
		animateTo: function (value) {
			this.$.animator.play({
				startValue: this.value,
				endValue: value,
				node: this.hasNode()
			});

			this.setValue(value);
		},

		/**
		* @private
		*/
		animatorStep: function (sender) {
			this.updateBar(sender.value);
			return true;
		},

		/**
		* @fires onyx.Slider#onChange
		* @fires onyx.Slider#onAnimateFinish
		* @private
		*/
		animatorComplete: function (sender) {
			if (this.tapped) {
				this.tapped = false;
				this.doChange({value: this.value});
			}
			this.doAnimateFinish(sender);
			return true;
		}
	});

})(enyo, this);