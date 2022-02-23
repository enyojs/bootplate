(function (enyo, scope) {

	/**
	* Fires when the Node is tapped. No additional data is sent with this event.
	*
	* @event enyo.Node#onNodeTap
	* @type {Object}
	* @public
	*/

	/**
	* Fires when the Node is double-clicked. No additional data is sent with this event.
	*
	* @event enyo.Node#onNodeDblClick
	* @type {Object}
	* @public
	*/

	/**
	* Fires when the Node expands or contracts, as indicated by the
	* `expanded` property in the event data.
	*
	* @event enyo.Node#onExpand
	* @type {Object}
	* @property {Boolean} expanded - `true` if the node is currently expanded;
	* otherwise, `false`.
	* @public
	*/

	/**
	* Fires when the Node is destroyed. No additional data is sent with this event.
	*
	* @event enyo.Node#onDestroyed
	* @type {Object}
	* @public
	*/

	/**
	* {@link enyo.Node} is a control that creates structured trees based on Enyo's child
	* component hierarchy format, e.g.:
	*
	* ```
	* {kind: 'Node', icon: 'images/folder-open.png', content: 'Tree',
	* 	expandable: true, expanded: true, components: [
	* 		{icon: 'images/file.png', content: 'Alpha'},
	* 		{icon: 'images/folder-open.png', content: 'Bravo',
	* 			expandable: true, expanded: false, components: [
	* 				{icon: 'images/file.png', content: 'Bravo-Alpha'},
	* 				{icon: 'images/file.png', content: 'Bravo-Bravo'},
	* 				{icon: 'images/file.png', content: 'Bravo-Charlie'}
	* 			]
	* 		}
	* 	]
	* }
	* ```
	*
	* The default kind of components within a node is itself {@link enyo.Node}, so only
	* the top-level node of the tree needs to be explicitly defined as such.
	*
	* When an expandable tree node expands, an [onExpand]{@link enyo.Node#onExpand}
	* event is sent; when it is tapped, an [onNodeTap]{@link enyo.Node#onNodeTap}
	* event is sent.
	*
	* When the optional [onlyIconExpands]{@link enyo.Node#onlyIconExpands} property is
	* set to `true`, expandable nodes may only be opened by tapping the icon; tapping the
	* content label will fire the `onNodeTap` event, but will not expand the node.
	*
	* @ui
	* @class  enyo.Node
	* @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends  enyo.Node.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.Node',

		/**
		* @lends enyo.Node.prototype
		* @private
		*/
		published: {
			/**
			* Indicates whether the Node is expandable and has child branches.
			*
			* @type {Boolean}
			* @default  false
			* @public
			*/
			expandable: false,

			/**
			* Indicates whether the Node is currently expanded (open).
			*
			* @type {Boolean}
			* @default  false
			* @public
			*/
			expanded: false,

			/**
			* Path to an image to be used as the icon for this Node.
			*
			* @type {String}
			* @default  ''
			* @public
			*/
			icon: '',

			/**
			* Optional flag that, when `true`, causes the Node to expand only when
			* the icon is tapped (not when the contents are tapped).
			*
			* @type {Boolean}
			*/
			onlyIconExpands: false,

			/**
			* If `true`, adds the `'enyo-selected'` CSS class; changing value from `true`
			* to `false` removes the class.
			*
			* @type {Boolean}
			* @default  false
			* @public
			*/
			selected: false
		},

		/**
		* @todo remove inline styles
		* @private
		*/
		style: 'padding: 0 0 0 16px;',

		/**
		* @private
		*/
		content: 'Node',

		/**
		* @private
		*/
		defaultKind: 'Node',

		/**
		* @private
		*/
		classes: 'enyo-node',

		/**
		* @private
		*/
		components: [
			{name: 'icon', kind: 'Image', showing: false},
			{kind: 'Control', name: 'caption', Xtag: 'span', style: 'display: inline-block; padding: 4px;', allowHtml: true},
			{kind: 'Control', name: 'extra', tag: 'span', allowHtml: true}
		],

		/**
		* @private
		*/
		childClient: [
			{kind: 'Control', name: 'box', classes: 'enyo-node-box', Xstyle: 'border: 1px solid orange;', components: [
				{kind: 'Control', name: 'client', classes: 'enyo-node-client', Xstyle: 'border: 1px solid lightblue;'}
			]}
		],

		/**
		* @private
		*/
		handlers: {
			ondblclick: 'dblclick'
		},

		/**
		* @private
		*/
		events: {
			onNodeTap: 'nodeTap',
			onNodeDblClick: 'nodeDblClick',
			onExpand: 'nodeExpand',
			onDestroyed: 'nodeDestroyed'
		},

		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				//this.expandedChanged();
				//this.levelChanged();
				this.selectedChanged();
				this.iconChanged();
			};
		}),

		/**
		* @method
		* @fires enyo.Node#onDestroyed
		* @private
		*/
		destroy: enyo.inherit(function (sup) {
			return function () {
				this.doDestroyed();
				sup.apply(this, arguments);
			};
		}),

		/**
		* @method
		* @private
		*/
		initComponents: enyo.inherit(function (sup) {
			return function () {
				// TODO: optimize to create the childClient on demand
				//this.hasChildren = this.components;
				if (this.expandable) {
					this.kindComponents = this.kindComponents.concat(this.childClient);
				}
				sup.apply(this, arguments);
			};
		}),

		/**
		* @private
		*/
		contentChanged: function () {
			//this.$.caption.setContent((this.expandable ? (this.expanded ? '-' : '+') : '') + this.content);
			this.$.caption.setContent(this.content);
		},

		/**
		* @private
		*/
		iconChanged: function () {
			this.$.icon.setSrc(this.icon);
			this.$.icon.setShowing(Boolean(this.icon));
		},

		/**
		* @private
		*/
		selectedChanged: function () {
			this.addRemoveClass('enyo-selected', this.selected);
		},

		/**
		* @method
		* @private
		*/
		rendered: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				if (this.expandable && !this.expanded) {
					this.quickCollapse();
				}
			};
		}),

		/**
		* Adds nodes as children of this control.
		*
		* @param {Object[]} nodes - An array of component configurations.
		* @public
		*/
		addNodes: function (nodes) {
			this.destroyClientControls();
			for (var i=0, n; (n=nodes[i]); i++) {
				this.createComponent(n);
			}
			this.$.client.render();
		},

		/**
		* Adds new Nodes as children of this Node; each value in the `nodes` array
		* becomes the content of a new child Node.
		*
		* @param {String[]} nodes - An array of strings.
		* @public
		*/
		addTextNodes: function (nodes) {
			this.destroyClientControls();
			for (var i=0, n; (n=nodes[i]); i++) {
				this.createComponent({content: n});
			}
			this.$.client.render();
		},

		/**
		* @fires enyo.Node#onNodeTap
		* @private
		*/
		tap: function (sender, event) {
			if(!this.onlyIconExpands) {
				this.toggleExpanded();
				this.doNodeTap();
			} else {
				if((event.target==this.$.icon.hasNode())) {
					this.toggleExpanded();
				} else {
					this.doNodeTap();
				}
			}
			return true;
		},

		/**
		* @fires enyo.Node#onNodeDblClick
		* @private
		*/
		dblclick: function (sender, event) {
			this.doNodeDblClick();
			return true;
		},

		/**
		* Toggles the value of [expanded]{@link enyo.Node#expanded}.
		*
		* @public
		*/
		toggleExpanded: function () {
			this.setExpanded(!this.expanded);
		},

		/**
		* Immediately collapses the control's children.
		*
		* @private
		*/
		quickCollapse: function () {
			this.removeClass('enyo-animate');
			this.$.box.applyStyle('height', '0');
			var h = this.$.client.getBounds().height;
			this.$.client.setBounds({top: -h});
		},

		/**
		* Animates the expansion (using CSS transitions).
		*
		* @private
		*/
		_expand: function () {
			this.addClass('enyo-animate');
			var h = this.$.client.getBounds().height;
			this.$.box.setBounds({height: h});
			this.$.client.setBounds({top: 0});
			setTimeout(this.bindSafely(function () {
				// things may have happened in the interim, make sure
				// we only fix height if we are still expanded
				if (this.expanded) {
					this.removeClass('enyo-animate');
					this.$.box.applyStyle('height', 'auto');
				}
			}), 225);
		},

		/**
		* Animates the collapsing (using CSS transitions).
		*
		* @private
		*/
		_collapse: function () {
			// disable transitions
			this.removeClass('enyo-animate');
			// fix the height of our box (rather than 'auto'), this
			// gives webkit something to lerp from
			var h = this.$.client.getBounds().height;
			this.$.box.setBounds({height: h});
			// yield the thead so DOM can make those changes (without transitions)
			setTimeout(this.bindSafely(function () {
				// enable transitions
				this.addClass('enyo-animate');
				// shrink our box to 0
				this.$.box.applyStyle('height', '0');
				// slide the contents up
				this.$.client.setBounds({top: -h});
			}), 25);
		},

		/**
		* @fires enyo.Node#onExpand
		* @private
		*/
		expandedChanged: function (old) {
			if (!this.expandable) {
				this.expanded = false;
			} else {
				var event = {expanded: this.expanded};
				this.doExpand(event);
				if (!event.wait) {
					this.effectExpanded();
				}
			}
		},

		/**
		* @private
		*/
		effectExpanded: function () {
			if (this.$.client) {
				if (!this.expanded) {
					this._collapse();
				} else {
					this._expand();
				}
			}
			//this.contentChanged();
		}
	});

})(enyo, this);