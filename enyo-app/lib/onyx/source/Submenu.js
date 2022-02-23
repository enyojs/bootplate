(function (enyo, scope) {

	/**
	* {@link onyx.Submenu} is a control that collapses several menu items into a drawer,
	* which may be opened and closed by tapping on its label. It is meant to be placed
	* inside an {@link onyx.Menu}.
	*
	* ```
	* {kind: 'onyx.MenuDecorator', components:[
	* 	{content: 'Open menu'},
	* 	{kind: 'onyx.Menu', components:[
	* 		{content: 'One'},
	* 		{content: 'Two'},
	* 		{kind: 'onyx.Submenu', content: 'Sort by...', components: [
	* 			{content: 'A'},
	* 			{content: 'B'},
	* 			{content: 'C'}
	* 		]},
	* 		{content: 'Three'}
	* 	]}
	* ]}
	* ```
	*
	* @class  onyx.Submenu
	* @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.Submenu.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.Submenu',

		/**
		* @private
		*/
		defaultKind: 'onyx.MenuItem',

		/**
		* @private
		*/
		initComponents: function () {
			this.createChrome([
				{
					name: 'label',
					kind: 'enyo.Control',
					classes: 'onyx-menu-item',
					content: this.content || this.name,
					isChrome: true,
					ontap: 'toggleOpen'
				},
				{kind: 'onyx.Drawer', name: 'client', classes: 'client onyx-submenu', isChrome: true, open: false}
			]);

			this.inherited(arguments);
		},

		/**
		* Toggles the submenu's open/closed state.
		*
		* @public
		*/
		toggleOpen: function () {
			this.setOpen(!this.getOpen());
		},

		/**
		* Opens or closes the submenu.
		*
		* @param {Boolean} open - `true` to open the submenu; `false` to close it.
		* @public
		*/
		setOpen: function (open) {
			this.$.client.setOpen(open);
		},

		/**
		* Determines whether the submenu is currently open.
		*
		* @return {Boolean} - `true` if submenu is currently open; otherwise, `false`.
		* @public
		*/
		getOpen: function () {
			return this.$.client.getOpen();
		}
	});

})(enyo, this);