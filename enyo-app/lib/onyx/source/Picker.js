(function (enyo, scope) {

	/**
	* Fires when the currently selected item changes.
	*
	* @event onyx.Picker#onChange
	* @type {Object}
	* @property {enyo.Control} selected - The currently selected item.
	* @property {String} content - The content of the currently selected item.
	* @public
	*/

	/**
	* {@link onyx.Picker}, a subkind of {@link onyx.Menu}, is used to display a
	* list of items that may be selected. It is meant to be used together with an
	* {@link onyx.PickerDecorator}. The decorator loosely couples the picker with
	* an {@link onyx.PickerButton}--a button that, when tapped, shows the picker.
	* Once an item is selected, the list of items closes, but the item stays
	* selected and the PickerButton displays the choice that was made.
	*
	* To initialize the Picker to a particular value, set the `active` property to
	* `true` for the item that should be selected.
	*
	* 	{kind: 'onyx.PickerDecorator', components: [
	* 		{}, //this uses the defaultKind property of PickerDecorator to inherit from PickerButton
	* 		{kind: 'onyx.Picker', components: [
	* 			{content: 'Gmail', active: true},
	* 			{content: 'Yahoo'},
	* 			{content: 'Outlook'},
	* 			{content: 'Hotmail'}
	* 		]}
	* 	]}
	*
	* Each item in the list is an {@link onyx.MenuItem}, so a client app may
	* listen for an [onSelect]{@link onyx.MenuItem#onSelect} event with the
	* item to determine which picker item was selected.
	*
	* @class  onyx.Picker
	* @extends onyx.Menu
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.Picker.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.Picker',

		/**
		* @private
		*/
		kind: 'onyx.Menu',

		/**
		* @private
		*/
		classes: 'onyx-picker enyo-unselectable',

		/**
		* @lends  onyx.Picker.prototype
		* @private
		*/
		published: {
			/**
			* Currently selected item, if any
			* @type {onyx.MenuItem}
			* @default  null
			* @public
			*/
			selected: null
		},

		/**
		* @private
		*/
		events: {
			onChange: ''
		},

		/**
		* @private
		*/
		handlers: {
			onItemContentChange: 'itemContentChange'
		},

		/**
		* When `true`, the picker is rendered in a floating layer outside of other
		* controls. This can be used to guarantee that the picker will be shown on
		* top of other controls.
		*
		* @private
		*/
		floating: true,

		/**
		* Overrides default value from {@link onyx.Menu}.
		*
		* @private
		*/
		showOnTop: true,

		/**
		* @private
		*/
		initComponents: function () {
			this.setScrolling(true);
			this.inherited(arguments);
		},

		/**
		* @private
		*/
		showingChanged: function () {
			this.getScroller().setShowing(this.showing);
			this.inherited(arguments);
			if (this.showing && this.selected) {
				this.scrollToSelected();
			}
		},

		/**
		* Ensures that the selected item is visible.
		*
		* @private
		*/
		scrollToSelected: function () {
			this.getScroller().scrollToControl(this.selected, !this.menuUp);
		},

		/**
		* Handles [onActivate]{@link enyo.GroupItem#onActivate} event,
		* selecting the activated item.
		*
		* @private
		*/
		itemActivated: function (sender, event) {
			this.processActivatedItem(event.originator);
			return this.inherited(arguments);
		},

		/**
		* If passed-in control is `active`, selects it.
		* @param {enyo.Control} item
		*
		* @private
		*/
		processActivatedItem: function (item) {
			if (item.active) {
				this.setSelected(item);
			}
		},

		/**
		* Highlights the selected item with the CSS class `'selected'`.
		*
		* @fires onyx.Picker#onChange
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
		},

		/**
		* Handles [onItemContentChange]{@link onyx.MenuItem#onItemContentChange}
		* events.
		*
		* @fires onyx.Picker#onChange
		* @private
		*/
		itemContentChange: function (sender, event) {
			if(event.originator == this.selected){
				this.doChange({selected: this.selected, content: this.selected.content});
			}
		},

		/**
		* Handles `onresize` events.
		*
		* @private
		*/
		handleResize: function () {
			this.inherited(arguments);
			this.adjustPosition();
		}
	});

})(enyo, this);