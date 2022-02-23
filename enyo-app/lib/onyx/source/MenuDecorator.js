(function (enyo, scope) {

	/**
	* {@link onyx.MenuDecorator} is a control that loosely couples an {@link onyx.Menu}
	* with an activating control, which may be a button or any other control with an
	* [onActivate]{@link enyo.GroupItem#onActivate} event. The decorator must
	* surround both the activating control and the menu itself. When the menu is
	* activated, it shows itself in the correct position relative to the activator.
	*
	* ```
	* {kind: 'onyx.MenuDecorator', components: [
	* 	{content: 'Show menu'},
	* 	{kind: 'onyx.Menu', components: [
	* 		{content: '1'},
	* 		{content: '2'},
	* 		{classes: 'onyx-menu-divider'},
	* 		{content: 'Label', classes: 'onyx-menu-label'},
	* 		{content: '3'},
	* 	]}
	* ]}
	* ```
	*
	* @class  onyx.MenuDecorator
	* @extends onyx.TooltipDecorator
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.MenuDecorator.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.MenuDecorator',

		/**
		* @private
		*/
		kind: 'onyx.TooltipDecorator',

		/**
		* @private
		*/
		defaultKind: 'onyx.Button',

		/**
		* Selection on iOS prevents tap events, so avoid.
		*
		* @private
		*/
		classes: 'onyx-popup-decorator enyo-unselectable',

		/**
		* @private
		*/
		handlers: {
			onActivate: 'activated',
			onHide: 'menuHidden'
		},

		/**
		* Handles [onActivate]{@link enyo.GroupItem#onActivate} events.
		*
		* @private
		*/
		activated: function (sender, event) {
			this.requestHideTooltip();
			if (event.originator.active) {
				this.menuActive = true;
				this.activator = event.originator;
				this.activator.addClass('active');
				this.requestShowMenu();
			}
		},

		/**
		* Requests that the child menu be shown.
		*
		* @fires onyx.Menu#onRequestShowMenu
		* @private
		*/
		requestShowMenu: function () {
			this.waterfallDown('onRequestShowMenu', {activator: this.activator});
		},

		/**
		* Requests that the child menu be hidden.
		*
		* @fires onyx.Menu#onRequestHideMenu
		* @private
		*/
		requestHideMenu: function () {
			this.waterfallDown('onRequestHideMenu');
		},

		/**
		* Handles [onHide]{@link enyo.Popup#onHide} events.
		*
		* @private
		*/
		menuHidden: function () {
			this.menuActive = false;
			if (this.activator) {
				this.activator.setActive(false);
				this.activator.removeClass('active');
			}
		},

		/**
		* Handles `onenter` events. Suppresses default behavior if menu is not active.
		*
		* @private
		*/
		enter: function (sender) {
			if (!this.menuActive) {
				this.inherited(arguments);
			}
		},

		/**
		* Handles `onleave` events. Suppresses default behavior if menu is not active.
		*
		* @private
		*/
		leave: function (sender, event) {
			if (!this.menuActive) {
				this.inherited(arguments);
			}
		}
	});

})(enyo, this);