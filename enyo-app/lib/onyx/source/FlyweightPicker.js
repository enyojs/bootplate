(function (enyo, scope) {

	/**
	* Fires when a row is being initialized.
	*
	* @event onyx.FlyweightPicker#onSetupItem
	* @type {Object}
	* @property {Number} index - The row index.
	* @property {enyo.Control} flyweight - The row control, for decoration.
	* @see enyo.FlyweightRepeater.onSetupItem
	* @public
	*/

	/**
	* Fires when an item is selected.
	*
	* @event onyx.FlyweightPicker#onSelect
	* @type {Object}
	* @property {String} content - Content of the selected item.
	* @property {Number} selected - Row index of the selected item.
	* @public
	*/

	/**
	* {@link onyx.FlyweightPicker}, a subkind of {@link onyx.Picker}, is a picker
	* that employs the flyweight pattern. It is used to display a large list of
	* selectable items.	As with {@link enyo.FlyweightRepeater}, the
	* [onSetupItem]{@link onyx.FlyweightPicker#onSetupItem} event allows for
	* customization of item rendering.
	*
	* To initialize the FlyweightPicker to a particular value, call `setSelected()`
	* with the index of the item you wish to select, and call `setContent()` with
	* the item that should be shown in the activator button.
	*
	* When an item is selected, FlyweightPicker sends an
	* [onSelect]{@link onyx.FlyweightPicker#onSelect} event with the selected
	* item's information. This may be handled by a client application to determine
	* which item was selected.
	*
	* ```
	* enyo.kind({
	* 	handlers: {
	* 		onSelect: 'itemSelected'
	* 	},
	* 	components: [
	* 		{kind: 'onyx.PickerDecorator', components: [
	* 			{},
	* 			{name: 'yearPicker', kind: 'onyx.FlyweightPicker', count: 200,
	* 				onSetupItem: 'setupYear', components: [
	* 					{name: 'year'}
	* 				]
	* 			}
	* 		]}
	* 	],
	* 	create: function () {
	* 		var d = new Date();
	* 		var y = d.getYear();
	* 		this.$.yearPicker.setSelected(y);
	* 		this.$.year.setContent(1900+y);
	* 	},
	* 	setupYear: function (sender, event) {
	* 		this.$.year.setContent(1900+event.index);
	* 	},
	* 	itemSelected: function (sender, event) {
	* 		enyo.log('Picker Item Selected: ' + event.selected.content);
	* 	}
	* })
	* ```
	*
	* @class   onyx.FlyweightPicker
	* @extends onyx.Picker
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends onyx.FlyweightPicker.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.FlyweightPicker',

		/**
		* @private
		*/
		kind: 'onyx.Picker',

		/**
		* @private
		*/
		classes: 'onyx-flyweight-picker',

		/**
		* @lends  onyx.FlyweightPicker.prototype
		* @private
		*/
		published: {
			/**
			* The number of rows to render.
			*
			* @type {Number}
			* @default  0
			* @public
			*/
			count: 0
		},

		/**
		* @private
		*/
		events: {
			onSetupItem: '',
			onSelect: ''
		},

		/**
		* @private
		*/
		handlers: {
			onSelect: 'itemSelect'
		},

		/**
		* @private
		*/
		components: [
			{name: 'scroller', kind: 'enyo.Scroller', strategyKind: 'TouchScrollStrategy', components: [
				{name: 'flyweight', kind: 'FlyweightRepeater', noSelect: true, ontap: 'itemTap'}
			]}
		],

		/**
		* @private
		*/
		scrollerName: 'scroller',

		/**
		* Force the flyweight's client control ([MenuItem]{@link onyx.MenuItem} by default)
		* to activate. This will result in a call to `processActivatedItem()`, which preps
		* our picker selection logic. This is a workaround for changes caused by ENYO-1609
		* which resulted in ENYO-1611.
		*
		* @private
		*/
		initComponents: function () {
			this.controlParentName = 'flyweight';
	        this.inherited(arguments);
			this.$.flyweight.$.client.children[0].setActive(true);
	    },

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.countChanged();
		},

		/**
		* @private
		*/
		rendered: function () {
			this.inherited(arguments);
			this.selectedChanged();
		},

		/**
		* Scrolls the [selected]{@link onyx.FlyweightPicker#selected} control into view.
		*
		* @public
		*/
		scrollToSelected: function () {
			var n = this.$.flyweight.fetchRowNode(this.selected);
			this.getScroller().scrollToNode(n, !this.menuUp);
		},

		/**
		* @private
		*/
		countChanged: function () {
			this.$.flyweight.count = this.count;
		},

		/**
		* @private
		*/
		processActivatedItem: function (item) {
			this.item = item;
		},

		/**
		* @fires onyx.Picker#onChange
		* @private
		*/
		selectedChanged: function (old) {
			if (!this.item) {
				return;
			}
			if (old != null) {
				this.item.removeClass('selected');
				this.$.flyweight.renderRow(old);
			}
			var n;
			if (this.selected != null) {
				this.item.addClass('selected');
				this.$.flyweight.renderRow(this.selected);
				// need to remove the class from control to make sure it won't apply to other rows
				this.item.removeClass('selected');
				n = this.$.flyweight.fetchRowNode(this.selected);
			}
			this.doChange({selected: this.selected, content: n && n.textContent || this.item.content});
		},

		/**
		* @fires onyx.FlyweightPicker#onSelect
		* @private
		*/
		itemTap: function (sender, event) {
			this.setSelected(event.rowIndex);
			//Send the select event that we want the client to receive.
			this.doSelect({selected: this.item, content: this.item.content});
		},

		/**
		* Blocks all `select` events that aren't coming from this control. This is to
		* prevent `select` events from MenuItems since they won't have the correct value
		* in a Flyweight context.
		*
		* @private
		*/
		itemSelect: function (sender, event) {
			if (event.originator != this) {
				return true;
			}
		}
	});

})(enyo, this);