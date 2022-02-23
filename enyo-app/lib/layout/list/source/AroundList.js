(function (enyo, scope) {
	/**
	* {@link enyo.AroundList} is an {@link enyo.List} that allows content to be
	* displayed around its rows.
	*
	* ```
	* {kind: 'enyo.AroundList', onSetupItem: 'setupItem',
	*     aboveComponents: [
	*         {content: 'Content above the list'}
	*     ],
	*     components: [
	*         {content: 'List item'}
	*     ]
	* }
	* ```
	*
	* @ui
	* @class enyo.AroundList
	* @extends enyo.List
	* @public
	*/
	enyo.kind(
		/** @lends enyo.AroundList.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.AroundList',

		/**
		* @private
		*/
		kind: 'enyo.List',

		/**
		* @private
		*/
		listTools: [
			{name: 'port', classes: 'enyo-list-port enyo-border-box', components: [
				{name: 'aboveClient'},
				{name: 'generator', kind: 'FlyweightRepeater', canGenerate: false, components: [
					{tag: null, name: 'client'}
				]},
				{name: 'holdingarea', allowHtml: true, classes: 'enyo-list-holdingarea'},
				{name: 'page0', allowHtml: true, classes: 'enyo-list-page'},
				{name: 'page1', allowHtml: true, classes: 'enyo-list-page'},
				{name: 'belowClient'},
				{name: 'placeholder'},
				{name: 'swipeableComponents', style: 'position:absolute; display:block; top:-1000px; left:0px;'}
			]}
		],

		/**
		* A block of components to be rendered above the list.
		*
		* @type {Object[]}
		* @default null
		* @public
		*/
		aboveComponents: null,

		/**
		* A block of components to be rendered below the list.
		*
		* @type {Object[]}
		* @default null
		* @public
		*/
		belowComponents: null,

		/**
		* @method
		* @private
		*/
		initComponents: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				if (this.aboveComponents) {
					this.$.aboveClient.createComponents(this.aboveComponents, {owner: this.owner});
				}
				if (this.belowComponents) {
					this.$.belowClient.createComponents(this.belowComponents, {owner: this.owner});
				}
			};
		}),

		/**
		* @see enyo.List.updateMetrics
		* @private
		*/
		updateMetrics: function () {
			this.defaultPageSize = this.rowsPerPage * (this.rowSize || 100);
			this.pageCount = Math.ceil(this.count / this.rowsPerPage);
			this.aboveHeight = this.$.aboveClient.getBounds().height;
			this.belowHeight = this.$.belowClient.getBounds().height;
			this.portSize = this.aboveHeight + this.belowHeight;
			for (var i=0; i < this.pageCount; i++) {
				this.portSize += this.getPageSize(i);
			}
			this.adjustPortSize();
		},

		/**
		* @see enyo.List.positionPage
		* @private
		*/
		positionPage: function (pageNumber, target) {
			target.pageNo = pageNumber;
			var y = this.pageToPosition(pageNumber);
			var o = this.bottomUp ? this.belowHeight : this.aboveHeight;
			y += o;
			target.applyStyle(this.pageBound, y + 'px');
		},

		/**
		* Scrolls past the [aboveComponents]{@link enyo.AroundList#aboveComponents}
		* or [belowComponents]{@link enyo.AroundList#belowComponents} components to
		* reveal the list.
		*
		* @public
		*/
		scrollToContentStart: function () {
			var y = this.bottomUp ? this.belowHeight : this.aboveHeight;
			this.setScrollPosition(y);
		}
	});

})(enyo, this);