(function (enyo, scope) {

	/**
	* enyo.TabPanels is a subkind of enyo.Panels that
	* displays a set of tabs, which allow navigation between the individual panels.
	* Unlike enyo.Panels, by default, the user cannot drag between the panels of a
	* TabPanels. This behavior may be enabled by setting _draggable_ to _true_.
	*
	* ```
	* enyo.kind({
	* 	name: 'App',
	* 	kind: 'onyx.TabPanels',
	* 	fit: true,
	* 	components: [
	* 		{kind: 'MyStartPanel'},
	* 		{kind: 'MyMiddlePanel'},
	* 		{kind: 'MyLastPanel'}
	* 	]
	* });
	* new App().renderInto(document.body);
	* ```
	*
	* @ui
	* @class  onyx.TabPanels
	* @extends enyo.Panels
	* @private
	*/
	enyo.kind(
		/** @lends  onyx.TabPanels.prototype */ {

		name: 'onyx.TabPanels',
		kind: 'enyo.Panels',
		//* @protected
		draggable: false,

		handlers: {
			onTabChanged: 'switchPanel'
		},

		/*
		* Set a maximum height for the scrollable menu that can be raised on the right of
		* the tab bar.
		*/
		published: {
			maxMenuHeight: null
		},

		tabTools: [
			{
				kind: 'onyx.TabBar',
				isPanel: true,
				name: 'bar'
			},
			{
				name: 'client',
				isPanel: true,
				fit: true,
				kind: 'Panels',
				classes: 'enyo-tab-panels',
				onTransitionStart: 'clientTransitionStart'
			}
		],

		create: function () {
			this.inherited(arguments);

			if (this.getMaxMenuHeight()) {
				this.maxMenuHeightChanged();
			}

			// getPanels called on client will return panels of *this* kind
			this.$.client.getPanels = this.bindSafely('getClientPanels');

			// basically, set all these Panel parameters to false
			this.draggableChanged();
			this.animateChanged();
			this.wrapChanged();
		},

		maxMenuHeightChanged: function () {
			this.$.bar.setMaxMenuHeight(this.getMaxMenuHeight()) ;
		},
		initComponents: function () {
			this.createChrome(this.tabTools);
			this.inherited(arguments);
		},
		getClientPanels: function () {
			return this.getPanels();
		},

		flow: function () {
			this.inherited(arguments);
			this.$.client.flow();
		},
		reflow: function () {
			this.inherited(arguments);
			this.$.client.reflow();
		},
		draggableChanged: function () {
			this.$.client.setDraggable(this.draggable);
			this.draggable = false;
		},
		animateChanged: function () {
			this.$.client.setAnimate(this.animate);
			this.animate = false;
		},
		wrapChanged: function () {
			this.$.client.setWrap(this.wrap);
			this.wrap = false;
		},

		isClient: function (inControl) {
			return ! inControl.isPanel ;
		},

		initDone: false ,
		rendered: function () {

			if (this.initDone) { return ;}

			var that = this ;
			enyo.forEach(
				this.controls,
				function (c) {
					if (that.isClient(c)) {
						that.$.bar.addTab(c) ;
					}
				}
			);

			this.setIndex(this.controls.length - 1);
			this.initDone = true;

			// must be called at the end otherwise kind size is weird
			this.inherited(arguments);
		},

		//* @public
		/*
		*
		* Add a new control managed by the tab bar. inControl is a
		* control with optional caption attribute. When not specified
		* the tab will have a generated caption like 'Tab 0', 'Tab
		* 1'. etc...
		*
		*/
		addTab: function (inControl){
			this.$.bar.addTab(inControl);
			this.setIndex(this.controls.length - 1);
		},

		//* @public
		/*
		*
		* Remove a tab from the tab bar. The control managed by the
		* tab will also be destroyed. target is an object with either
		* a caption attribute or an index. The tab(s) matching the
		* caption will be destroyed or the tab with matching index
		* will be destroyed.
		*
		* Example:

			myTab.removeTab({'index':0}); // remove the leftmost tab
			myTab.removeTab({'caption':'foo.js'});

		*/

		removeTab: function (indexData) {
			this.$.bar.removeTab(indexData);
		},

		// layout is a property of inherited UiComponent
		layoutKindChanged: function () {
			if (!this.layout) {
				this.layout = enyo.createFromKind('FittableRowsLayout', this);
			}
			this.$.client.setLayoutKind(this.layoutKind);
		},
		indexChanged: function () {
			// FIXME: initialization order problem
			if (this.$.client.layout) {
				this.$.client.setIndex(this.index);
			}
			this.index = this.$.client.getIndex();
		},
		switchPanel: function (inSender, inEvent) {
			if (this.hasNode()) {
				var i = inEvent.index;
				if (this.getIndex() != i) {
					this.setIndex(i);
				}
			}
		},
		startTransition: enyo.nop,
		finishTransition: enyo.nop,
		stepTransition: enyo.nop,
		refresh: enyo.nop
	});

})(enyo, this);