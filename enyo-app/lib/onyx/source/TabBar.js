(function (enyo, scope) {

	/**
	* {@link onyx.TabBar} is a scrolled set of radio buttons that is used by
	* {@link onyx.TabPanels}. This bar may also be used by other kinds to provide
	* a similar layout. By default, a tap on a tab will immediately switch the
	* tab and fire an `onTabChanged` event.
	*
	*
	* Here's an example:
	*
	* ```
	* enyo.kind({
	* 	name: 'myStuff'
	* });
	*
	* enyo.kind({
	* 	name: 'App',
	* 	fit: true,
	* 	components: [
	* 		{name:'bar',kind: 'onyx.TabBar'},
	* 		{kind: 'MyStuff'}
	* 	],
	*
	* 	handlers: {
	* 		onTabChanged: 'switchStuff'
	* 	},
	*
	* 	rendered: function () {
	* 		this.inherited(arguments);
	* 		this.$.bar.addTab({
	* 				'caption': 'greetings',
	* 				'data' : { 'msg': 'Hello World !' } // arbitrary user data
	* 			}
	* 		) ;
	* 	},
	*
	* 	switchStuff: function (inSender,inEvent) {
	* 		this.log('Tapped tab with caption '+ inEvent.caption
	* 			+ ' and message ' + inEvent.data.msg );
	* 	}
	* });
	* ```
	*
	* Tabs must be created after construction, i.e. in rendered function. If tabs are created in
	* 'create' function, the last created tabs will not be selected.
	*
	* You can also setup the TabBar so a tap on a tab will fire a
	* 'onTabChangeRequest' event:
	*
	* ```
	* enyo.kind({
	* 	name: 'App',
	* 	fit: true,
	* 	components: [
	* 		{name:'bar',kind: 'onyx.TabBar', checkBeforeChanging: true },
	* 		{kind: 'MyStuff'}
	* 	],
	*
	*     handlers: {
	* 		onTabChangeRequest: 'switchStuff'
	* 	},
	*
	*     // same rendered function as above
	* 	switchStuff: function (inSender,inEvent) {
	* 		this.log('Tapped tab with caption ' + inEvent.caption
	* 			+ ' and message ' + inEvent.data.msg );
	* 		// do switch
	* 		inEvent.next();
	* 	}
	* });
	* ```
	*
	* In this mode, no event is fired *after* the actual switch.
	*
	* @class  onyx.TabBar
	* @extends enyo.FittableColumns
	* @ui
	* @private
	*/
	enyo.kind (
		/** @lends  onyx.TabBar.prototype */ {

		name: 'onyx.TabBar',
		kind: 'enyo.FittableColumns',
		isPanel: true,
		classes: 'onyx-tab-bar',

		checkBeforeClosing: false,
		checkBeforeChanging: false,

		debug: false,

		events: {
			/*
			Fired when a tab different from the one currently selected is tapped.
			inEvent contains :

			{
				'index': 3, // index of tab in tab bar
				'userId': 1234, // unique id in tab managed by user
				'caption': 'bar.js', // tab label
				'data': { 'lang': 'javascript' },
				'next': callback // call with error message if problem
			}

			*/
			onTabChanged: '',

			/*
			Fired when a tab different from the one currently selected is tapped
			when checkBeforeChanging is true.
			inEvent contains the same structure as onTabChanged event. Call next()
			when the tab change can be completed.

			*/

			onTabChangeRequested: '',

			/*
			* Fired when a tab is about to be removed. inEvent
			* contains the same data as onTabChanged.
			*
			* if (removeOk) { inEvent.next() ;}
			* else ( inEvent.next('not now') ;}
			*
			* Once a tab is removed (by calling next() ), a replacement
			* tab will be activated and a doTabChanged event will be
			* fired.
			*/
			onTabRemoveRequested: '',

			/*
			* Fired when a tab is removed. inEvent contains the same
			* data as onTabChanged (minus the next callback)
			*/
			onTabRemoved: ''
		},

		/*
		* Set a maximum height for the scrollable menu that can be raised on the right of
		* the tab bar.
		*/
		published: {
			maxMenuHeight: 600
		},

		handlers: {
			onShowTooltip: 'showTooltip',
			onHideTooltip: 'hideTooltip'
		},

		components: [
			{
				fit:true,
				components: [
					{
						name: 'scroller',
						kind: 'enyo.Scroller',

						maxHeight: '100px',

						touch: true,

						thumb: false,
						vertical: 'hidden',
						horizontal: 'auto',
						classes: 'onyx-tab-bar-scroller',
						components: [
							{
								classes: 'onyx-tab-wrapper',
								components: [
									{
										// double level of components is required to add padding
										// at this level. This avoid '> div' in selectors
										components: [
											{
												name: 'tabs',
												classes: 'onyx-tab-holder',
												kind: 'onyx.RadioGroup',
												defaultKind: 'onyx.TabBarItem',
												style: 'text-align: left; white-space: nowrap;',
												onTabCloseRequest: 'requestTabClose',
												onTabSwitchRequest: 'requestTabSwitch'
											},
											{ classes: 'onyx-tab-line'},
											{ classes: 'onyx-tab-rug'}
										]
									}
								]
							}
						]
					},
					{kind: 'onyx.TooltipDecorator', components:[
						{kind: 'onyx.Tooltip', classes: 'onyx-tab-tooltip'}
					]}
				]

			},
			{
				kind: 'onyx.MenuDecorator',
				name: 'tabPicker',
				onSelect: 'popupButtonTapped',
				components: [
					{
						kind: 'onyx.IconButton',
						classes: 'onyx-more-button',
						ontap: 'showPopupAtEvent'
					},
					{
						kind: 'onyx.Menu',
						name: 'popup'
					}
				]
			}
		],

		// lastIndex is required to avoid duplicate index in the tab bar.
		lastIndex: 0,

		//* @protected
		clientTransitionStart: function (inSender, inEvent) {
			var i = inEvent.toIndex;
			var t = this.$.tabs.getClientControls()[i];
			if (t && t.hasNode()) {
				this.$.tabs.setActive(t);
				var tn = t.node;
				var tl = tn.offsetLeft;
				var tr = tl + tn.offsetWidth;
				var sb = this.$.scroller.getScrollBounds();
				if (tr < sb.left || tr > sb.left + sb.clientWidth) {
					this.$.scroller.scrollToControl(t);
				}
			}
			return true;
		},

		create: function () {
			this.inherited(arguments);
			this.maxMenuHeightChanged();
		},

		maxMenuHeightChanged: function () {
			this.$.popup.setMaxHeight(this.getMaxMenuHeight());
		},

		rendered: function () {
			this.inherited(arguments);
			this.resetWidth();
		},

		//* @public
		/*
		*
		* Append a new tab to the tab bar. inControl is an object
		* with optional caption and data attributes. When not
		* specified the tab will have a generated caption like
		* 'Tab 0', 'Tab 1'. etc... data is an arbitrary object that will
		* be given back with onTabChanged events
		*
		*/
		addTab: function (inControl) {
			var c = inControl.caption || ('Tab ' + this.lastIndex);
			this.selectedId = this.lastIndex++ ;
			var t = this.$.tabs.createComponent(
				{
					content:  c,
					userData: inControl.data || { },
					tooltipMsg: inControl.tooltipMsg, //may be null
					userId:   inControl.userId, // may be null
					tabIndex: this.selectedId,
					addBefore: this.$.line
				}
			);

			t.render();
			this.resetWidth();
			t.raise();
			t.setActive(true);
			return t;
		},

		//* @public
		/*
		*
		* Remove a tab from the tab bar. target is an object with
		* either a caption attribute or an index. The tab(s) matching
		* the caption will be destroyed or the tab with matching
		* index will be destroyed.
		*
		* Example:

			myTab.removeTab({'index':0}); // remove the leftmost tab
			myTab.removeTab({'caption':'foo.js'});

		*/

		removeTab: function (target) {
			var tab = this.resolveTab(target,'removeTab');

			if (! tab) { return; }

			var activeTab = this.$.tabs.active ;
			var keepActiveTab = activeTab !== tab ;
			var gonerIndex = tab.indexInContainer();
			var tabData = {
				index:   tab.tabIndex,
				caption: tab.content,
				userId:  tab.userId,
				data:    tab.userData
			} ;

			tab.destroy();
			this.resetWidth();

			var ctrls = this.$.tabs.controls;
			var ctrlLength = ctrls.length ;
			var replacementTab
					= keepActiveTab           ? activeTab
					: gonerIndex < ctrlLength ? ctrls[gonerIndex]
					:                           ctrls[ ctrlLength - 1 ];

			// replacementTab may be undef if all tabs were removed
			if (replacementTab) {
				replacementTab.setActive(true) ;
				replacementTab.raise();
				this.$.scroller.scrollIntoView(replacementTab);

				this.doTabChanged({
					index:   replacementTab.tabIndex,
					caption: replacementTab.content,
					tooltipMsg: replacementTab.tooltipMsg,
					data:    replacementTab.userData,
					userId:  replacementTab.userId
				});
			}

			this.doTabRemoved(tabData);
		},

		//* @public
		/*
		*
		* Request to remove a tab from the tab bar. This is a bit
		* like removeTab, except that a onTabRemoveRequested event is
		* fired to let the application the possibility to cancel the
		* request.
		*
		*/

		requestRemoveTab: function (target) {
			var tab = this.resolveTab(target,'removeTab');
			var tabData = {
				index:   tab.tabIndex,
				caption: tab.content,
				tooltipMsg: tab.tooltipMsg,
				userId:  tab.userId,
				data:    tab.userData
			} ;
			var that = this ;
			if (tab) {
				tabData.next = function (err) {
					if (err) { throw new Error(err);   }
					else     { that.removeTab(target); }
				} ;
				this.doTabRemoveRequested( tabData ) ;
			}
		},

		//* @protected
		resolveTab: function (target,action_name){
			var targetTab ;
			if (target.userId) {
				enyo.forEach(
					this.$.tabs.controls,
					function (tab){
						if (tab.userId === target.userId) {
							targetTab = tab;
						}
					}
				);
			}
			else if (target.caption) {
				enyo.forEach(
					this.$.tabs.controls,
					function (tab){
						if (tab.content === target.caption) {
							targetTab = tab;
						}
					}
				);
			}
			else if (typeof target.index !== 'undefined') {
				enyo.forEach(
					this.$.tabs.controls,
					function (tab){
						if (tab.tabIndex === target.index) {
							targetTab = tab;
						}
					}
				);
			}
			else {
				throw new Error('internal: ' + action_name+ ' called without index or caption');
			}
			return targetTab ;
		},

		//@ protected
		requestTabClose: function (inSender,inEvent) {
			if (this.checkBeforeClosing) {
				this.requestRemoveTab(inEvent) ;
			}
			else {
				this.removeTab(inEvent);
			}
		},

		//* @public
		/*
		*
		* Activate a tab in the tab bar. target is an object with
		* either a caption attribute or an index. The tab(s) matching
		* the caption will be activated or the tab with matching
		* index will be activated
		*
		* Example:

			myTab.activate({'index':0}); // activate the leftmost tab
			myTab.activate({'caption':'foo.js'});

		* Note that tabActivated event will be fired.
		*
		*/
		activate: function (target) {
			var tab = this.resolveTab(target,'activate');
			if (tab) {
				this.raiseTab(tab);
			}
		},

		raiseTab: function (tab) {
			tab.setActive(true) ;
			this.$.scroller.scrollIntoView(tab);
		},

		//@ protected
		requestTabSwitch: function (inSender,inEvent) {
			var tab = inEvent.originator;
			this._requestTabSwitch(tab);
		},

		_requestTabSwitch: function (tab) {
			var event, next;

			if (this.checkBeforeChanging) {
				// polite mode, ask before
				event = 'onTabChangeRequested';
				// then change the tab
				next = enyo.bind(tab, tab.setActiveTrue);
			} else {
				// rough mode, change the tab
				tab.setActiveTrue();
				event = 'onTabChanged';
				// and then undo if necessary
				next =  enyo.bind(this,'undoSwitchOnError', oldIndex);
			}

			var data = {
				index:   tab.tabIndex,
				caption: tab.content,
				tooltipMsg: tab.tooltipMsg,
				data:    tab.userData,
				userId:  tab.userId
			} ;

			var oldIndex = this.selectedId ;
			this.selectedId = data.index;

			if ( this.selectedId != oldIndex ) {
				data.next = next;
				this.bubble(event, data);
			}
			else {
				// when clicking on a tab, the tab is always deactivated even
				// if user clicks on the active tab. So the activation
				// must be put back.
				tab.setActiveTrue();
			}
			return true;
		},

		showTooltip: function (inSender, inEvent) {
			var t = inEvent.tooltipContent;
			var bounds = inEvent.bounds;
			if(t){
				if(!this.$.tooltip.showing){
					this.$.tooltip.setContent(t);
					var leftSpace = bounds.left + ( bounds.width / 2 );
					this.$.tooltipDecorator.applyStyle('left', leftSpace + 'px');
					this.$.tooltip.show();
				}
			}
			return true ;
		},

		hideTooltip: function () {
			this.$.tooltip.hide();
			return true ;
		},

		//* @protected
		undoSwitchOnError: function (oldIndex, err) {
			if (err) {
				this.activate({ 'index': oldIndex } ) ;
			}
		},

		// resize stuff:
		// use scroller's getScrollBounds to get scroll boundaries
		handleResize: function () {
			this.inherited(arguments);
			this.adjustTabWidth() ;
		},

		// compute tab width by adding width of tabs contained in tab bar.
		computeOrigTabWidth: function () {
			var result = 0;
			enyo.forEach(
				this.$.tabs.getControls(),
				function (tab){
					var w = tab.origWidth() ;
					// must add margin and padding of inner button and outer tab-item
					result += w + 18 ;
				}
			);
			return result;
		},

		origTabWidth: null,
		adjustTabWidth: function (inSender, inEvent) {
			var scrolledWidth = this.$.scroller.getBounds().width;
			var tabsWidth = this.origTabWidth ;
			var coeff = scrolledWidth > tabsWidth ? 1 : scrolledWidth / tabsWidth ;
			coeff = coeff < 0.5 ? 0.5 : coeff;
			this.applyCoeff(coeff) ;
		},

		applyCoeff: function (coeff) {
			enyo.forEach(
				this.$.tabs.getControls(),
				function (tab){
					tab.reduce(coeff) ;
				}
			);
		},

		resetWidth: function () {
			this.applyCoeff(1) ; // restore original size to all tabs
			this.origTabWidth = this.computeOrigTabWidth(); // measure tab width
			this.adjustTabWidth();
		},

		isEmpty: function () {
			return ! this.$.tabs.getControls().length ;
		},

		// Since action buttons of Contextual Popups are not dynamic, this
		// kind is created on the fly and destroyed once the user clicks
		// on a button
		showPopupAtEvent: function (inSender, inEvent) {
			var that = this ;
			var popup = this.$.popup;

			for (var name in popup.$) {
				if (popup.$.hasOwnProperty(name) && /menuItem/.test(name)) {
					popup.$[name].destroy();
				}
			}

			//popup.render();
			enyo.forEach(
				this.$.tabs.getControls(),
				function (tab) {
					that.$.popup.createComponent({
						content: tab.content,
						value: tab.tabIndex
					}) ;
				}
			);

			popup.maxHeightChanged();
			popup.showAtPosition({top: 30, right:30});
			this.render();
			this.resize(); // required for IE10 to work correctly
			return ;
		},

		popupButtonTapped: function (inSender, inEvent) {
			var target = { index: inEvent.originator.value } ;
			var tab = this.resolveTab(target,'activate');
			if (tab) {
				this._requestTabSwitch(tab);
			}
		}
	});

})(enyo, this);