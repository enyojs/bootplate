(function (enyo, scope) {

	/**
	* {@link onyx.IntegerPicker}, a subkind of {@link onyx.Picker}, is used to
	* display a list of integers that may be selected, ranging from
	* [min]{@link onyx.IntegerPicker#min} to [max]{@link onyx.IntegerPicker#max}.
	* It is meant to be used in conjunction with an {@link onyx.PickerDecorator}.
	* The decorator loosely couples the picker with an {@link onyx.PickerButton}--a
	* button that, when tapped, shows the picker. Once an item is selected, the
	* list of items closes,	but the item stays selected and the PickerButton
	* displays the choice that was made.
	*
	* To initialize the IntegerPicker to a particular value, set the
	* [value]{@link onyx.IntegerPicker#value} property to the integer that should
	* be selected.
	*
	* ```
	* {kind: 'onyx.PickerDecorator', components: [
	* 	{}, //this uses the defaultKind property of PickerDecorator to inherit from PickerButton
	* 	{kind: 'onyx.IntegerPicker', min: 0, max: 25, value: 5}
	* ]}
	* ```
	*
	* Each item in the list is an {@link onyx.MenuItem}, so an application may
	* listen for an [onSelect]{@link onyx.MenuItem#onSelect} event with the
	* item to determine which picker item was selected.
	*
	* @class  onyx.IntegerPicker
	* @extends onyx.Picker
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.IntegerPicker.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.IntegerPicker',

		/**
		* @private
		*/
		kind: 'onyx.Picker',

		/**
		* @private
		*/
		published: {
			/**
			* Selected value of the picker.
			*
			* @type {Number}
			* @default  0
			* @memberOf  onyx.IntegerPicker.prototype
			* @public
			*/
			value: 0,

			/**
			* Minimum value of the picker.
			*
			* @type {Number}
			* @default  0
			* @memberOf  onyx.IntegerPicker.prototype
			* @public
			*/
			min: 0,

			/**
			* Maximum value of the picker.
			*
			* @type {Number}
			* @default  9
			* @memberOf onyx.IntegerPicker.prototype
			* @public
			*/
			max: 9
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.rangeChanged();
		},

		/**
		* @private
		*/
		minChanged: function () {
			this.destroyClientControls();
			this.rangeChanged();
			this.render();
		},

		/**
		* @private
		*/
		maxChanged: function () {
			this.destroyClientControls();
			this.rangeChanged();
			this.render();
		},

		/**
		* @private
		*/
		rangeChanged: function () {
			for (var i=this.min; i<=this.max; i++) {
				this.createComponent({content: i, active: (i===this.value) ? true : false});
			}
		},

		/**
		* @private
		*/
		valueChanged: function () {
			var controls = this.getClientControls();
			var len = controls.length;
			// Validate our value
			this.value = Math.min(this.max, Math.max(this.value, this.min));
			for (var i=0; i<len; i++) {
				if (this.value === parseInt(controls[i].content, 10)) {
					this.setSelected(controls[i]);
					break;
				}
			}
		},

		/**
		* @private
		*/
		selectedChanged: function (old) {
			if (old) {
				old.removeClass('selected');
			}
			if (this.selected) {
				this.selected.addClass('selected');
				this.doChange({selected: this.selected, content: this.selected.content});
			}
			this.setValue(parseInt(this.selected.content, 10));
		}
	});

})(enyo, this);