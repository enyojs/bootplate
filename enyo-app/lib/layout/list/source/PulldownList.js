(function (enyo, scope) {

	/**
	* Fires when user initiates a pull action. No additional data is included with
	* this event.
	*
	* @event enyo.PulldownList#onPullStart
	* @type {Object}
	* @public
	*/

	/**
	* Fires when user cancels a pull action. No additional data is included with
	* this event.
	*
	* @event enyo.PulldownList#onPullCancel
	* @type {Object}
	* @public
	*/

	/**
	* Fires while a pull action is in progress. No additional data is included with
	* this event.
	*
	* @event enyo.PulldownList#onPull
	* @type {Object}
	* @public
	*/

	/**
	* Fires when the list is released following a pull action, indicating
	* that we are ready to retrieve data. No additional data is included with
	* this event.
	*
	* @event enyo.PulldownList#onPullRelease
	* @type {Object}
	* @public
	*/

	/**
	* Fires when data retrieval is complete, indicating that the data is
	* is ready to be displayed. No additional data is included with
	* this event.
	*
	* @event enyo.PulldownList#onPullComplete
	* @type {Object}
	* @public
	*/

	/**
	* {@link enyo.PulldownList} is a list that provides a pull-to-refresh feature, which
	* allows new data to be retrieved and updated in the list.
	*
	* PulldownList provides the [onPullRelease]{@link enyo.PulldownList#onPullRelease}
	* event to allow an application to start retrieving new data.  The
	* [onPullComplete]{@link enyo.PulldownList#onPullComplete} event indicates that
	* the pull is complete and it's time to update the list with the new data.
	*
	* ```
	* {name: 'list', kind: 'PulldownList', onSetupItem: 'setupItem',
	* 	onPullRelease: 'pullRelease', onPullComplete: 'pullComplete',
	* 	components: [
	* 		{name: 'item'}
	* 	]
	* }
	*
	* pullRelease: function () {
	* 	this.search();
	* },
	* processSearchResults: function (inRequest, inResponse) {
	* 	this.results = inResponse.results;
	* 	this.$.list.setCount(this.results.length);
	* 	this.$.list.completePull();
	* },
	* pullComplete: function () {
	* 	this.$.list.reset();
	* }
	* ```
	*
	* @ui
	* @class enyo.PulldownList
	* @extends enyo.List
	* @public
	*/
	enyo.kind(
		/** @lends enyo.PulldownList.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.PulldownList',

		/**
		* @private
		*/
		kind: 'List',

		/**
		* Sets `touch` to `true` in inherited Scroller kind for touch-based scrolling strategy.
		*
		* @see {@link enyo.Scroller.touch}
		* @type {Boolean}
		* @default true
		* @public
		*/
		touch: true,

		/**
		* The pull notification area at the top of the list.
		*
		* @type {enyo.Control}
		* @default null
		* @private
		*/
		pully: null,

		/**
		* @private
		*/
		pulldownTools: [
			{name: 'pulldown', classes: 'enyo-list-pulldown', components: [
				{name: 'puller', kind: 'Puller'}
			]}
		],

		/**
		* @private
		*/
		events: {
			//* Fires when user initiates a pull action.
			onPullStart: '',
			//* Fires when user cancels a pull action.
			onPullCancel: '',
			//* Fires while a pull action is in progress.
			onPull: '',
			//* Fires when the list is released following a pull action, indicating
			//* that we are ready to retrieve data.
			onPullRelease: '',
			//* Fires when data retrieval is complete, indicating that the data is
			//* is ready to be displayed.
			onPullComplete: ''
		},

		/**
		* @private
		*/
		handlers: {
			onScrollStart: 'scrollStartHandler',
			onScrollStop: 'scrollStopHandler',
			ondragfinish: 'dragfinish'
		},

		/**
		* Message displayed when list is not being pulled.
		*
		* @type {String}
		* @default 'Pull down to refresh...'
		* @public
		*/
		pullingMessage: 'Pull down to refresh...',

		/**
		* Message displayed while a pull action is in progress.
		*
		* @type {String}
		* @default 'Release to refresh...'
		* @public
		*/
		pulledMessage: 'Release to refresh...',

		/**
		* Message displayed while data is being retrieved.
		*
		* @type {String}
		* @default 'Loading...'
		* @public
		*/
		loadingMessage: 'Loading...',

		/**
		* @private
		*/
		pullingIconClass: 'enyo-puller-arrow enyo-puller-arrow-down',

		/**
		* @private
		*/
		pulledIconClass: 'enyo-puller-arrow enyo-puller-arrow-up',

		/**
		* @private
		*/
		loadingIconClass: '',

		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function (sup) {
			return function () {
				var p = {kind: 'Puller', showing: false, text: this.loadingMessage, iconClass: this.loadingIconClass, onCreate: 'setPully'};
				this.listTools.splice(0, 0, p);
				sup.apply(this, arguments);
				this.setPulling();
			};
		}),

		/**
		* @method
		* @private
		*/
		initComponents: enyo.inherit(function (sup) {
			return function () {
				this.createChrome(this.pulldownTools);
				this.accel = enyo.dom.canAccelerate();
				this.translation = this.accel ? 'translate3d' : 'translate';
				this.strategyKind = this.resetStrategyKind();
				sup.apply(this, arguments);
			};
		}),

		/**
		* Temporarily use TouchScrollStrategy on iOS devices (see ENYO-1714).
		*
		* @private
		*/
		resetStrategyKind: function () {
			return (enyo.platform.android >= 3)
				? 'TranslateScrollStrategy'
				: 'TouchScrollStrategy';
		},

		/**
		* @private
		*/
		setPully: function (sender, event) {
			this.pully = event.originator;
		},

		/**
		* @private
		*/
		scrollStartHandler: function () {
			this.firedPullStart = false;
			this.firedPull = false;
			this.firedPullCancel = false;
		},

		/**
		* Monitors the scroll position to display and position the
		* [pully]{@link enyo.PulldownList#pully}.
		*
		* @see {@link enyo.Scroller.scroll}
		* @method
		* @private
		*/
		scroll: enyo.inherit(function (sup) {
			return function (sender, event) {
				var r = sup.apply(this, arguments);
				if (this.completingPull) {
					this.pully.setShowing(false);
				}
				var s = this.getStrategy().$.scrollMath || this.getStrategy();
				var over = -1*this.getScrollTop();
				if (s.isInOverScroll() && over > 0) {
					enyo.dom.transformValue(this.$.pulldown, this.translation, '0,' + over + 'px' + (this.accel ? ',0' : ''));
					if (!this.firedPullStart) {
						this.firedPullStart = true;
						this.pullStart();
						this.pullHeight = this.$.pulldown.getBounds().height;
					}
					if (over > this.pullHeight && !this.firedPull) {
						this.firedPull = true;
						this.firedPullCancel = false;
						this.pull();
					}
					if (this.firedPull && !this.firedPullCancel && over < this.pullHeight) {
						this.firedPullCancel = true;
						this.firedPull = false;
						this.pullCancel();
					}
				}
				return r;
			};
		}),

		/**
		* @private
		*/
		scrollStopHandler: function () {
			if (this.completingPull) {
				this.completingPull = false;
				this.doPullComplete();
			}
		},

		/**
		* If the pull has been fired, offset the scroll top by the height of the
		* [pully]{@link enyo.PulldownList#pully} until
		* [completePull()]{@link enyo.PulldownList#completePull} is called.
		*
		* @private
		*/
		dragfinish: function () {
			if (this.firedPull) {
				var s = this.getStrategy().$.scrollMath || this.getStrategy();
				s.setScrollY(-1*this.getScrollTop() - this.pullHeight);
				this.pullRelease();
			}
		},

		/**
		* Signals that the list should execute pull completion. This is usually
		* called after the application has received new data.
		*
		* @public
		*/
		completePull: function () {
			this.completingPull = true;
			var s = this.getStrategy().$.scrollMath || this.getStrategy();
			s.setScrollY(this.pullHeight);
			s.start();
		},

		/**
		* @fires enyo.PulldownList#onPullStart
		* @private
		*/
		pullStart: function () {
			this.setPulling();
			this.pully.setShowing(false);
			this.$.puller.setShowing(true);
			this.doPullStart();
		},

		/**
		* @fires enyo.PulldownList#onPull
		* @private
		*/
		pull: function () {
			this.setPulled();
			this.doPull();
		},

		/**
		* @fires enyo.PulldownList#onPullCancel
		* @private
		*/
		pullCancel: function () {
			this.setPulling();
			this.doPullCancel();
		},

		/**
		* @fires enyo.PulldownList#onPullRelease
		* @private
		*/
		pullRelease: function () {
			this.$.puller.setShowing(false);
			this.pully.setShowing(true);
			this.doPullRelease();
		},

		/**
		* @private
		*/
		setPulling: function () {
			this.$.puller.setText(this.pullingMessage);
			this.$.puller.setIconClass(this.pullingIconClass);
		},

		/**
		* @private
		*/
		setPulled: function () {
			this.$.puller.setText(this.pulledMessage);
			this.$.puller.setIconClass(this.pulledIconClass);
		}
	});

	/**
	* Fires when the Puller is created.
	*
	* @event enyo.Puller#onCreate
	* @type {Object}
	* @public
	*/

	/**
	* {@link enyo.Puller} is a control displayed within an {@link enyo.PulldownList}
	* to indicate that the list is refreshing due to a pull-to-refresh.
	*
	* @ui
	* @class enyo.Puller
	* @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends enyo.Puller.prototype */ {
	
		/**
		* @private
		*/
		name: 'enyo.Puller',
	
		/**
		* @private
		*/
		kind: 'enyo.Control',
	
		/**
		* @private
		*/
		classes: 'enyo-puller',
	
		/**
		* @lends enyo.Puller.prototype
		* @private
		*/
		published: {
			/**
			* Text to display below icon.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			text: '',

			/**
			* CSS classes to apply to the icon control.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			iconClass: ''
		},
	
		/**
		* @private
		*/
		events: {
			onCreate: ''
		},
	
		/**
		* @private
		*/
		components: [
			{name: 'icon'},
			{name: 'text', tag: 'span', classes: 'enyo-puller-text'}
		],
	
		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.doCreate();
				this.textChanged();
				this.iconClassChanged();
			};
		}),
	
		/**
		* @private
		*/
		textChanged: function () {
			this.$.text.setContent(this.text);
		},
	
		/**
		* @private
		*/
		iconClassChanged: function () {
			this.$.icon.setClasses(this.iconClass);
		}
	});

})(enyo, this);