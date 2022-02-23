(function (enyo, scope) {

	/**
	* Requests that the knob label be changed.
	*
	* @event onyx.RangeSlider#onSetLabel
	* @type {String}
	* @public
	* @todo  Event payload is a string rather than an object
	*/

	/**
	* Fires when bar position is set.
	*
	* @event onyx.RangeSlider#onChange
	* @type {Object}
	* @property {Number} value - The new bar position.
	* @property {Boolean} startChanged - Indicates whether the first slider (`rangeStart`)
	* 	triggered the event.
	* @public
	*/

	/**
	* Fires while control knob is being dragged.
	*
	* @event onyx.RangeSlider#onChanging
	* @type {Object}
	* @property {Number} value - The current bar position.
	* @public
	*/

	/**
	* {@link onyx.RangeSlider} is a control that combines a horizontal slider with
	* two control knobs. The user may drag the knobs to select a desired range of
	* values.
	*
	* ```
	* {kind: 'onyx.RangeSlider', rangeMin: 100, rangeMax: 500,
	* 	rangeStart: 200, rangeEnd: 400, interval: 20}
	* ```
	*
	* [onChanging]{@link onyx.RangeSlider#onChanging} events are fired while
	* the control knobs are being dragged, and an
	* [onchange]{@link onyx.RangeSlider#onChange} event is fired when the
	* position is set by finishing a drag.
	*
	* @class  onyx.RangeSlider
	* @extends onyx.ProgressBar
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.RangeSlider.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.RangeSlider',

		/**
		* @private
		*/
		kind: 'onyx.ProgressBar',

		/**
		* @private
		*/
		classes: 'onyx-slider',

		/**
		* @lends  onyx.RangeSlider.prototype
		* @private
		*/
		published: {
			/**
			* Minimum slider value.
			*
			* @type {Number}
			* @default  0
			* @public
			*/
			rangeMin: 0,

			/**
			* Maximum slider value.
			*
			* @type {Number}
			* @default  100
			* @public
			*/
			rangeMax: 100,

			/**
			* Value of first slider, expressed as an integer between
			* [rangeMin]{@link onyx.RangeSlider#rangeMin} and
			* [rangeMax]{@link onyx.RangeSlider#rangeMax}.
			*
			* @type {Number}
			* @default  0
			* @public
			*/
			rangeStart: 0,

			/**
			* Value of second slider, expressed as an integer between
			* [rangeMin]{@link onyx.RangeSlider#rangeMin} and
			* [rangeMax]{@link onyx.RangeSlider#rangeMax}.
			*
			* @type {Number}
			* @default  100
			* @public
			*/
			rangeEnd: 100,

			/**
			* Position of first slider, expressed as an integer between `0` and `100`
			* (percentage).
			*
			* @type {Number}
			* @default  0
			* @public
			*/
			beginValue: 0,

			/**
			* Position of second slider, expressed as an integer between `0` and `100`
			* (percentage).
			*
			* @type {Number}
			* @default  0
			* @public
			*/
			endValue: 0
		},

		/**
		* @private
		*/
		events: {
			onChange: '',
			onChanging: ''
		},

		/**
		* If `true`, stripes are shown in the slider bar.
		*
		* @type {Boolean}
		* @private
		*/
		showStripes: false,

		/**
		* If `true`, a label is shown above each slider knob.
		*
		* Note that this is a design-time property and should not be set after object creation.
		*
		* @type {Boolean}
		* @public
		*/
		showLabels: false,

		/**
		* @private
		*/
		handlers: {
			ondragstart: 'dragstart',
			ondrag: 'drag',
			ondragfinish: 'dragfinish',
			ondown: 'down'
		},

		/**
		* @private
		*/
		moreComponents: [
			{name: 'startKnob', classes: 'onyx-slider-knob'},
			{name: 'endKnob', classes: 'onyx-slider-knob onyx-range-slider-knob'}
		],

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.createComponents(this.moreComponents);
			this.initControls();
		},

		/**
		* @private
		*/
		rendered: function () {
			this.inherited(arguments);
			var p = this.calcPercent(this.beginValue);
			this.updateBarPosition(p);
		},

		/**
		* @private
		* @todo  Why are handlers for ondown/onup added here instead of in the components block?
		*/
		initControls: function () {
			this.$.bar.applyStyle('position', 'relative');
			this.refreshRangeSlider();
			if (this.showLabels) {
				this.$.startKnob.createComponent({name: 'startLabel', kind: 'onyx.RangeSliderKnobLabel'});
				this.$.endKnob.createComponent({name: 'endLabel', kind: 'onyx.RangeSliderKnobLabel'});
			}
			// add handlers for up/down events on knobs for pressed state (workaround for inconsistent (timing-wise) active:hover styling)
			this.$.startKnob.ondown = 'knobDown';
			this.$.startKnob.onup = 'knobUp';
			this.$.endKnob.ondown = 'knobDown';
			this.$.endKnob.onup = 'knobUp';
		},

		/**
		* Refreshes the knob positions.
		*
		* @private
		*/
		refreshRangeSlider: function () {
			// Calculate range percentages, in order to position sliders
			this.beginValue = this.calcKnobPercent(this.rangeStart);
			this.endValue = this.calcKnobPercent(this.rangeEnd);
			this.beginValueChanged();
			this.endValueChanged();
		},

		/**
		* Calculates the completion ratio for the passed-in value.
		*
		* @param  {Number} value - Value for which completion ratio will be calculated.
		* @return {Number}         - Completion ratio (between `0` and `1`).
		*/
		calcKnobRatio: function (value) {
			return (value - this.rangeMin) / (this.rangeMax - this.rangeMin);
		},

		/**
		* Calculates the completion percentage for the passed-in value.
		*
		* @param  {Number} value - Value for which completion percentage will be calculated.
		* @return {Number}         - Completion percentage (between `0` and `100`).
		*/
		calcKnobPercent: function (value) {
			return this.calcKnobRatio(value) * 100;
		},

		/**
		* @private
		*/
		beginValueChanged: function (sliderPos) {
			if (sliderPos === undefined) {
				var p = this.calcPercent(this.beginValue);
				this.updateKnobPosition(p, this.$.startKnob);
			}
		},

		/**
		* @private
		*/
		endValueChanged: function (sliderPos) {
			if (sliderPos === undefined) {
				var p = this.calcPercent(this.endValue);
				this.updateKnobPosition(p, this.$.endKnob);
			}
		},

		/**
		* Calculates the appropriate knob position during a drag event.
		* @param  {Event} event - The drag event.
		* @return {Number}        - The knob position.
		*/
		calcKnobPosition: function (event) {
			var x = event.clientX - this.hasNode().getBoundingClientRect().left;
			return (x / this.getBounds().width) * (this.max - this.min) + this.min;
		},

		/**
		* @private
		*/
		updateKnobPosition: function (percent, control) {
			control.applyStyle('left', percent + '%');
			this.updateBarPosition();
		},

		/**
		* Updates the position of the bar between the knobs.
		*
		* @private
		*/
		updateBarPosition: function () {
			if ((this.$.startKnob !== undefined) && (this.$.endKnob !== undefined)) {
				var barStart = this.calcKnobPercent(this.rangeStart);
				var barWidth = this.calcKnobPercent(this.rangeEnd) - barStart;
				this.$.bar.applyStyle('left', barStart + '%');
				this.$.bar.applyStyle('width', barWidth + '%');
			}
		},

		/**
		* Calculates the ratio of the value within the allowed range.
		*
		* @return {Number}
		* @private
		*/
		calcRangeRatio: function (value) {
			return ((value / 100) * (this.rangeMax - this.rangeMin) + this.rangeMin) - (this.increment/2);
		},

		/**
		* Ensures that the active knob is on top.
		*
		* @param {String} controlName - Name of active knob.
		* @private
		*/
		swapZIndex: function (controlName) {
			if (controlName === 'startKnob') {
				this.$.startKnob.applyStyle('z-index', 1);
				this.$.endKnob.applyStyle('z-index', 0);
			} else if (controlName === 'endKnob') {
				this.$.startKnob.applyStyle('z-index', 0);
				this.$.endKnob.applyStyle('z-index', 1);
			}
		},

		/**
		* @private
		*/
		down: function (sender, event) {
			this.swapZIndex(sender.name);
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
		* @fires onyx.RangeSlider#onChanging
		* @private
		*/
		drag: function (sender, event) {
			if (this.dragging) {
				var knobPos = this.calcKnobPosition(event);
				var _val, val, p;

				if ((sender.name === 'startKnob') && (knobPos >= 0)) {
					if (((knobPos <= this.endValue) && (event.xDirection === -1)) || (knobPos <= this.endValue)) {
						this.setBeginValue(knobPos);
						_val = this.calcRangeRatio(this.beginValue);
						val = (this.increment) ? this.calcIncrement(_val+0.5*this.increment) : _val;
						p = this.calcKnobPercent(val);
						this.updateKnobPosition(p, this.$.startKnob);
						this.setRangeStart(val);
						this.doChanging({value: val});
					} else {
						return this.drag(this.$.endKnob, event);
					}
				} else if ((sender.name === 'endKnob') && (knobPos <= 100)) {
					if (((knobPos >= this.beginValue) && (event.xDirection === 1)) || (knobPos >= this.beginValue)) {
						this.setEndValue(knobPos);
						_val = this.calcRangeRatio(this.endValue);
						val = (this.increment) ? this.calcIncrement(_val+0.5*this.increment) : _val;
						p = this.calcKnobPercent(val);
						this.updateKnobPosition(p, this.$.endKnob);
						this.setRangeEnd(val);
						this.doChanging({value: val});
					} else {
						return this.drag(this.$.startKnob, event);
					}
				}
				return true;
			}
		},

		/**
		* @fires onyx.RangeSlider#onChange
		* @private
		*/
		dragfinish: function (sender, event) {
			this.dragging = false;
			event.preventTap();
			var val;
			if (sender.name === 'startKnob') {
				val = this.calcRangeRatio(this.beginValue);
				this.doChange({value: val, startChanged: true});
			} else if (sender.name === 'endKnob') {
				val = this.calcRangeRatio(this.endValue);
				this.doChange({value: val, startChanged: false});
			}
			sender.removeClass('pressed');
			return true;
		},

		/**
		* @private
		*/
		knobDown: function (sender, event) {
			sender.addClass('pressed');
		},

		/**
		* @private
		*/
		knobUp: function (sender, event) {
			sender.removeClass('pressed');
		},

		/**
		* @private
		*/
		rangeMinChanged: function () {
			this.refreshRangeSlider();
		},

		/**
		* @private
		*/
		rangeMaxChanged: function () {
			this.refreshRangeSlider();
		},

		/**
		* @private
		*/
		rangeStartChanged: function () {
			this.refreshRangeSlider();
		},

		/**
		* @private
		*/
		rangeEndChanged: function () {
			this.refreshRangeSlider();
		},

		/**
		* Sets the label for the start knob.
		*
		* @param {String} content - New label for start knob.
		* @fires onyx.RangeSlider#onSetLabel
		* @public
		*/
		setStartLabel: function (content) {
			this.$.startKnob.waterfallDown('onSetLabel', content);
		},

		/**
		* Sets the label for the end knob.
		*
		* @param {String} content - New label for end knob.
		* @fires onyx.RangeSlider#onSetLabel
		* @public
		*/
		setEndLabel: function (content) {
			this.$.endKnob.waterfallDown('onSetLabel', content);
		}
	});

	/**
	* {@link onyx.RangeSliderKnobLabel} provides the labels for the knobs
	* within a {@link onyx.RangeSlider}.
	*
	* @class onyx.RangeSliderKnobLabel
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.RangeSliderKnobLabel.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.RangeSliderKnobLabel',

		/**
		* @private
		*/
		classes: 'onyx-range-slider-label',

		/**
		* @private
		*/
		handlers: {
			onSetLabel: 'setLabel'
		},

		/**
		* Handles [onSetLabel]{@link onyx.RangeSlider#onSetLabel} events.
		*
		* @private
		*/
		setLabel: function (sender, content) {
			this.setContent(content);
		}
	});

})(enyo, this);