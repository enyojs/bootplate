(function (enyo, scope) {

	/**
	* {@link onyx.MoreToolbar} extends {@link enyo.Control}, providing a toolbar
	* that can adapt to different screen sizes by moving overflowing controls and
	* content into an {@link onyx.Menu}.
	*
	* ```
	* {kind: 'onyx.MoreToolbar', components: [
	* 	{content: 'More Toolbar', unmoveable: true},
	* 	{kind: 'onyx.Button', content: 'Alpha'},
	* 	{kind: 'onyx.Button', content: 'Beta'},
	* 	{kind: 'onyx.Button', content: 'Gamma', unmoveable: true},
	* 	{kind: 'onyx.Button', content: 'Epsilon'}
	* ]}
	* ```
	*
	* You may prevent a control from being moved into the menu by setting its
	* `unmoveable` property to `true` (the default is `false`).
	*
	* @class  onyx.MoreToolbar
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.MoreToolbar.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.MoreToolbar',

		/**
		* @private
		*/
		classes: 'onyx-toolbar onyx-more-toolbar',

		/**
		* CSS class to be applied to the menu.
		*
		* Note that this is a design-time property and should not be set after object creation.
		*
		* @type {String}
		* @default  ''
		* @public
		*/
		menuClass: '',

		/**
		* CSS class to be applied to individual controls moved from the toolbar to the menu.
		*
		* Note that this is a design-time property and should not be set after object creation.
		*
		* @type {String}
		* @default  ''
		* @public
		*/
		movedClass: '',

		/**
		* @private
		*/
		layoutKind: 'FittableColumnsLayout',

		/**
		* @private
		*/
		noStretch: true,

		/**
		* @private
		*/
		handlers: {
			onHide: 'reflow'
		},

		/**
		* @lends  onyx.MoreToolbar.prototype
		* @private
		*/
		published: {
			/**
			* Layout kind that will be applied to the client controls.
			*
			* @type {String}
			* @default  'FittableColumnsLayout'
			* @public
			*/
			clientLayoutKind: 'FittableColumnsLayout'
		},

		/**
		* @private
		*/
		tools: [
			{name: 'client', noStretch:true, fit: true, classes: 'onyx-toolbar-inline'},
			{name: 'nard', kind: 'onyx.MenuDecorator', showing: false, onActivate: 'activated', components: [
				{kind: 'onyx.IconButton', classes: 'onyx-more-button'},
				{name: 'menu', kind: 'onyx.Menu', scrolling:false, classes: 'onyx-more-menu'}
			]}
		],

		/**
		* @private
		*/
		initComponents: function () {
			if(this.menuClass && this.menuClass.length>0 && !this.$.menu.hasClass(this.menuClass)) {
				this.$.menu.addClass(this.menuClass);
			}
			this.createChrome(this.tools);
			this.inherited(arguments);
			this.$.client.setLayoutKind(this.clientLayoutKind);
		},

		/**
		* @private
		*/
		clientLayoutKindChanged: function () {
			this.$.client.setLayoutKind(this.clientLayoutKind);
		},

		/**
		* @private
		*/
		reflow: function () {
			this.inherited(arguments);
			if (this.isContentOverflowing()) {
				this.$.nard.show();
				if (this.popItem()) {
					this.reflow();
				}
			} else if (this.tryPushItem()) {
				this.reflow();
			} else if (!this.$.menu.children.length) {
				this.$.nard.hide();
				this.$.menu.hide();
			}
		},

		/**
		* Handles [onActivate]{@link enyo.GroupItem#onActivate} events.
		*
		* Adds the `'active'` CSS class to this control if the event's originator is active.
		*
		* @private
		*/
		activated: function (sender, event) {
			this.addRemoveClass('active',event.originator.active);
		},

		/**
		* Removes the next collapsible item from the toolbar and adds it to the menu.
		*
		* @private
		*/
		popItem: function () {
			var c = this.findCollapsibleItem();
			if (c) {
				//apply movedClass is needed
				if(this.movedClass && this.movedClass.length>0 && !c.hasClass(this.movedClass)) {
					c.addClass(this.movedClass);
				}
				// passing null to add child to the front of the control list
				this.$.menu.addChild(c, null);
				var p = this.$.menu.hasNode();
				if (p && c.hasNode()) {
					c.insertNodeInParent(p);
				}
				return true;
			}
		},

		/**
		* Removes the first child of the menu and adds it back to the toolbar.
		*
		* @private
		*/
		pushItem: function () {
			var c$ = this.$.menu.children;
			var c = c$[0];
			if (c) {
				//remove any applied movedClass
				if(this.movedClass && this.movedClass.length>0 && c.hasClass(this.movedClass)) {
					c.removeClass(this.movedClass);
				}
				this.$.client.addChild(c);
				var p = this.$.client.hasNode();
				if (p && c.hasNode()) {
					var nextChild;
					var currIndex;
					for(var i=0; i<this.$.client.children.length; i++) {
						var curr = this.$.client.children[i];
						if(curr.toolbarIndex !== undefined && curr.toolbarIndex != i) {
							nextChild = curr;
							currIndex = i;
							break;
						}
					}
					if(nextChild && nextChild.hasNode()) {
						c.insertNodeInParent(p, nextChild.node);
						var newChild = this.$.client.children.pop();
						this.$.client.children.splice(currIndex, 0, newChild);
					} else {
						c.appendNodeToParent(p);
					}
				}
				return true;
			}
		},

		/**
		* Pushes an item back into the toolbar if doing so doesn't cause the content
		* to overflow.
		*
		* @return {Boolean} - Whether item was successfully pushed.
		* @private
		*/
		tryPushItem: function () {
			if (this.pushItem()) {
				if (!this.isContentOverflowing()) {
					return true;
				} else {
					this.popItem();
				}
			}
		},

		/**
		* Determines whether the toolbar has content that is not visible.
		*
		* @return {Boolean} `true` if some toolbar content is not visible.
		* @private
		*/
		isContentOverflowing: function () {
			if (this.$.client.hasNode()) {
				var c$ = this.$.client.children;
				var n = c$.length && c$[c$.length-1].hasNode();
				if(n) {
					this.$.client.reflow();
					//Workaround: scrollWidth value not working in Firefox, so manually compute
					//return (this.$.client.node.scrollWidth > this.$.client.node.clientWidth);
					return ((n.offsetLeft + n.offsetWidth) > this.$.client.node.clientWidth);
				}
			}
		},

		/**
		* Finds the next control (starting from the end) that can be pushed onto the menu.
		*
		* @private
		*/
		findCollapsibleItem: function () {
			var c$ = this.$.client.children;
			var c;
			for (var i=c$.length-1; (c=c$[i]); i--) {
				if (!c.unmoveable) {
					return c;
				} else {
					if(c.toolbarIndex===undefined) {
						c.toolbarIndex = i;
					}
				}
			}
		}
	});

})(enyo, this);