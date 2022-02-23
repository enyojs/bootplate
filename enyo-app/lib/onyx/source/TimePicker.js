(function (enyo, scope) {
	/**
	* Fires when one of the [TimePicker]{@link onyx.TimePicker}'s fields is selected.
	*
	* @event onyx.TimePicker#onSelect
	* @type {Object}
	* @property {String} name - Name of the [TimePicker]{@link onyx.TimePicker} that
	* generated the event.
	* @property {Date} value  - Current {@glossary Date} value of the control.
	* @public
	*/

	/**
	* {@link onyx.TimePicker} is a group of {@link onyx.Picker} controls that,
	* collectively, display the current time. The user may change the hour, minute,
	* and meridiem (AM/PM) values.
	*
	* By default, TimePicker tries to determine the current locale and use that
	* locale's rules to format the time (including AM/PM). In order to do this
	* successfully, the [iLib]{@glossary ilib} library must be loaded; if it is
	* not loaded, the control defaults to using standard U.S. time formatting.
	*
	* @ui
	* @class onyx.TimePicker
	* @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.TimePicker.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.TimePicker',

		/**
		* @private
		*/
		classes: 'onyx-toolbar-inline',

		/**
		* @lends onyx.TimePicker.prototype
		* @private
		*/
		published: {
			/**
			* If `true`, the control is shown as disabled and users cannot select new values.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			disabled: false,

			/**
			* Current locale used for formatting; may be set after control creation, in
			* which case the control will be updated to reflect the new value.
			*
			* @type {String}
			* @default 'en-US'
			* @public
			*/
			locale: 'en-US',

			/**
			* If `true`, 24-hour time is used. When the locale is changed, this value is
			* updated to reflect the new locale's rules.
			*
			* @type {Boolean|null}
			* @default null
			* @public
			*/
			is24HrMode: null,

			/**
			* {@glossary Date} object representing the currently-selected date/time.
			* When a Date object is passed to `setValue()`, the object is stored here
			* and the control is updated to reflect the new date/time.
			*
			* @type {Object|null}
			* @default null
			* @public
			*/
			value: null
		},

		/**
		* @private
		*/
		events: {
			onSelect: ''
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			if (scope.ilib) {
				this.locale = scope.ilib.getLocale();
			}
			this.initDefaults();
		},

		/**
		* @private
		*/
		initDefaults: function () {
			// defaults that match en_US for when ilib isn't loaded
			this._strAm = 'AM';
			this._strPm = 'PM';
			// Attempt to use the ilib lib (ie assume it is loaded)
			if (scope.ilib) {
				this._tf = new scope.ilib.DateFmt({locale:this.locale});

				var objAmPm = new scope.ilib.DateFmt({locale:this.locale, type: 'time', template: 'a'});
				var timeobj = scope.ilib.Date.newInstance({locale:this.locale, hour: 1});
				this._strAm = objAmPm.format(timeobj);
				timeobj.hour = 13;
				this._strPm = objAmPm.format(timeobj);

				if (this.is24HrMode == null) {
					this.is24HrMode = (this._tf.getClock() == '24');
				}
			}
			else if (this.is24HrMode == null) {
				this.is24HrMode = false;
			}

			this.setupPickers(this._tf ? this._tf.getTimeComponents() : 'hma');

			var d = this.value = this.value || new Date();

			// create hours
			var i;
			if (!this.is24HrMode){
				var h = d.getHours();
				h = (h === 0) ? 12 : h;
				for (i=1; i<=12; i++) {
					this.$.hourPicker.createComponent({content: i, value:i, active: (i == (h>12 ? h%12 : h))});
				}
			} else {
				for (i=0; i<24; i++) {
					this.$.hourPicker.createComponent({content: i, value:i, active: (i == d.getHours())});
				}
			}

			// create minutes
			for (i=0; i<=59; i++) {
				this.$.minutePicker.createComponent({content: (i < 10) ? ('0'+i):i, value:i, active: i == d.getMinutes()});
			}

			// create am/pm
			if (d.getHours() >= 12) {
				this.$.ampmPicker.createComponents([{content: this._strAm},{content:this._strPm, active: true}]);
			}
			else {
				this.$.ampmPicker.createComponents([{content: this._strAm, active: true},{content:this._strPm}]);
			}
			this.$.ampmPicker.getParent().setShowing(!this.is24HrMode);
		},

		/**
		* @private
		*/
		setupPickers: function (timeComponents) {
			// order is always fixed hours, minutes, am/pm
			if (timeComponents.indexOf('h') !== -1) {
				this.createHour();
			}
			if (timeComponents.indexOf('m') !== -1) {
				this.createMinute();
			}
			if (timeComponents.indexOf('a') !== -1) {
				this.createAmPm();
			}
		},

		/**
		* @private
		*/
		createHour: function () {
			this.createComponent(
				{kind: 'onyx.PickerDecorator', onSelect: 'updateHour', components: [
					{classes:'onyx-timepicker-hour', name: 'hourPickerButton', disabled: this.disabled},
					{name: 'hourPicker', kind: 'onyx.Picker'}
				]}
			);
		},

		/**
		* @private
		*/
		createMinute: function () {
			this.createComponent(
				{kind: 'onyx.PickerDecorator', onSelect: 'updateMinute', components: [
					{classes:'onyx-timepicker-minute', name: 'minutePickerButton', disabled: this.disabled},
					{name: 'minutePicker', kind: 'onyx.Picker'}
				]}
			);
		},

		/**
		* @private
		*/
		createAmPm: function () {
			this.createComponent(
				{kind: 'onyx.PickerDecorator', onSelect: 'updateAmPm', components: [
					{classes:'onyx-timepicker-ampm', name: 'ampmPickerButton', disabled: this.disabled},
					{name: 'ampmPicker', kind: 'onyx.Picker'}
				]}
			);
		},

		/**
		* @private
		*/
		disabledChanged: function () {
			this.$.hourPickerButton.setDisabled(this.disabled);
			this.$.minutePickerButton.setDisabled(this.disabled);
			this.$.ampmPickerButton.setDisabled(this.disabled);
		},

		/**
		* @private
		*/
		localeChanged: function () {
			//reset 24 hour mode when changing locales
			this.is24HrMode = null;
			this.refresh();
		},

		/**
		* @private
		*/
		is24HrModeChanged: function () {
			this.refresh();
		},

		/**
		* @private
		*/
		valueChanged: function (){
			this.refresh();
		},

		/**
		* @fires onyx.TimePicker#onSelect
		* @private
		*/
		updateHour: function (inSender, inEvent){
			var h = inEvent.selected.value;
			if (!this.is24HrMode){
				var ampm = this.$.ampmPicker.getParent().controlAtIndex(0).content;
				h = h + (h == 12 ? -12 : 0) + (this.isAm(ampm) ? 0 : 12);
			}
			this.setValue(this.calcTime(h, this.value.getMinutes()));
			this.doSelect({name:this.name, value:this.value});
			return true;
		},

		/**
		* @fires onyx.TimePicker#onSelect
		* @private
		*/
		updateMinute: function (inSender, inEvent){
			this.setValue(this.calcTime(this.value.getHours(), inEvent.selected.value));
			this.doSelect({name:this.name, value:this.value});
			return true;
		},

		/**
		* @fires onyx.TimePicker#onSelect
		* @private
		*/
		updateAmPm: function (inSender, inEvent){
			var h = this.value.getHours();
			if (!this.is24HrMode){
				h = h + (h > 11 ? (this.isAm(inEvent.content) ? -12 : 0) : (this.isAm(inEvent.content) ? 0 : 12));
			}
			this.setValue(this.calcTime(h, this.value.getMinutes()));
			this.doSelect({name:this.name, value:this.value});
			return true;
		},

		/**
		* @private
		*/
		calcTime: function (hour, minute){
			return new Date(this.value.getFullYear(),
							this.value.getMonth(),
							this.value.getDate(),
							hour, minute,
							this.value.getSeconds(),
							this.value.getMilliseconds());
		},

		/**
		* @private
		*/
		isAm: function (value){
			if (value == this._strAm){
				return true;
			} else {
				return false;
			}
		},

		/**
		* @private
		*/
		refresh: function (){
			this.destroyClientControls();
			this.initDefaults();
			this.render();
		}
	});

})(enyo, this);
