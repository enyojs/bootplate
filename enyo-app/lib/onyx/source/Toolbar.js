(function (enyo, scope) {
	/**
	* {@link onyx.Toolbar} is a horizontal bar containing controls used to perform
	* common UI actions.
	*
	* A toolbar customizes the styling of the controls it hosts, including buttons,
	* icons, and inputs.
	*
	*  ```
	*	{kind: 'onyx.Toolbar', components: [
	*		{kind: 'onyx.Button', content: 'Favorites'},
	*		{kind: 'onyx.InputDecorator', components: [
	*			{kind: 'onyx.Input', placeholder: 'Enter a search term...'}
	*		]},
	*		{kind: 'onyx.IconButton', src: 'go.png'}
	*	]}
	*  ```
	*
	* @ui
	* @class onyx.Toolbar
	* @extends enyo.Control
	* @public
	*/

	enyo.kind(
		/** @lends  onyx.Toolbar.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.Toolbar',

		/**
		* @private
		*/
		classes: 'onyx onyx-toolbar onyx-toolbar-inline',

		/**
		* @private
		*/
		create: function (){
			this.inherited(arguments);

			//workaround for android 4.0.3 rendering glitch (ENYO-674)
			if (this.hasClass('onyx-menu-toolbar') && (enyo.platform.android >= 4)){
				this.applyStyle('position', 'static');
			}
		}
	});

})(enyo, this);
