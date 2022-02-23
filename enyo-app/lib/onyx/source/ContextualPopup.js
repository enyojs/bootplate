(function (enyo, scope) {

	/**
	* Fires when the popup is tapped.
	* @todo  Should this be removed? Never triggered and duplicate of ontap
	* @event onyx.ContextualPopup#onTap
	* @public
	*/

	/**
	* {@link onyx.ContextualPopup} is a subkind of {@link enyo.Popup}. Contextual
	* popups serve as child windows that appear near the point of initiation. Use
	* them to prompt users to make a selection from a defined set of options; to
	* conduct other quick, single-step interactions in which context should be
	* maintained; and to present simple views, such as previews.
	*
	* A contextual popup is meant to be used in conjunction with a decorator, such
	* as an {@link onyx.MenuDecorator}. The decorator couples the popup with an
	* activating control, which may be a button or any other control with an
	* `onActivate` event. When the control is activated, the popup shows itself in
	* the correct position relative to the activator.
	*
	* Note that, by default, the popup is not floating, so toolbars and controls
	* with high z-index values may obscure it. You may set the `floating` property
	* to `true` to have the popup always appear on top; however, the popup will not
	* be in the containing document's flow and so will not scroll with the document.
	*
	* In addition, while contextual popups have their own positioning logic, they
	* do not currently have their own sizing logic, so be sure to take this into
	* account when using them.
	*
	* ```
	* {kind: 'onyx.MenuDecorator', components: [
	* 	{content: 'Show Popup'},
	* 	{kind: 'onyx.ContextualPopup',
	* 		title: 'Sample Popup',
	* 		actionButtons: [
	* 			{content:'Button 1', classes: 'onyx-button-warning'},
	* 			{content:'Button 2'}
	* 		],
	* 		components: [
	* 			{content:'Sample component in popup'}
	* 		]
	* 	}
	* ]}
	* ```
	*
	* @class onyx.ContextualPopup
	* @extends enyo.Popup
	* @ui
	* @public
	*/

	enyo.kind(
		/** @lends onyx.ContextualPopup.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.ContextualPopup',

		/**
		* @private
		*/
		kind: 'enyo.Popup',

		/**
		* @private
		*/
		modal: true,

		/**
		* @private
		*/
		autoDismiss: true,

		/**
		* @private
		*/
		floating:false,

		/**
		* @private
		*/
		classes: 'onyx-contextual-popup enyo-unselectable',

		/**
		* @private
		*/
		published: {
			/**
			* Maximum height of the menu, in pixels.
			*
			* @type {Number}
			* @memberOf onyx.ContextualPopup.prototype
			* @public
			*/
			maxHeight: 100,

			/**
			* Whether scrolling is enabled.
			*
			* @type {Boolean}
			* @memberOf onyx.ContextualPopup.prototype
			* @public
			*/
			scrolling: true,

			/**
			* Popup title content.
			*
			* @type {String}
			* @memberOf onyx.ContextualPopup.prototype
			* @public
			*/
			title: undefined,

			/**
			* Buttons displayed at bottom of popup.
			*
			* @type {Array}
			* @memberOf onyx.ContextualPopup.prototype
			* @public
			*/
			actionButtons: []
		},

		/** @lends onyx.ContextualPopup */
		statics: {
			/**
			* @private
			*/
			subclass: function (ctor, props) {
				var proto = ctor.prototype;
				if (props.actionButtons) {
					proto.kindActionButtons = props.actionButtons;
					delete proto.actionButtons;
				}
			}
		},

		/**
		* Vertical flush layout margin.
		*
		* @type {Number}
		* @private
		*/
		vertFlushMargin: 60,

		/**
		* Horizontal flush layout margin.
		*
		* @type {Number}
		* @private
		*/
		horizFlushMargin: 50,

		/**
		* Popups wider than this value are considered wide (for layout purposes).
		*
		* @type {Number}
		* @private
		*/
		widePopup: 200,

		/**
		* Popups longer than this value are considered long (for layout purposes).
		*
		* @type {Number}
		* @private
		*/
		longPopup: 200,

		/**
		* Do not allow horizontal flush popups past this amount of buffer space on
		* left/right screen edge.
		*
		* @type {Number}
		* @private
		*/
		horizBuffer: 16,

		/**
		* @private
		*/
		events: {
			onTap: ''
		},

		/**
		* @private
		*/
		handlers: {
			onActivate: 'childControlActivated',
			onRequestShowMenu: 'requestShow',
			onRequestHideMenu: 'requestHide'
		},

		/**
		* @private
		*/
		components: [
			{name: 'title', classes: 'onyx-contextual-popup-title'},
			{classes: 'onyx-contextual-popup-scroller', components:[
				{name: 'client', kind: 'enyo.Scroller', vertical: 'auto', classes: 'enyo-unselectable', thumb: false, strategyKind: 'TouchScrollStrategy'}
			]},
			{name: 'actionButtons', classes: 'onyx-contextual-popup-action-buttons'}
		],

		/**
		* Name of the Scroller component.
		*
		* @private
		*/
		scrollerName: 'client',

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.maxHeightChanged();
			this.titleChanged();
			this.actionButtonsChanged();
		},

		/**
		* @private
		*/
		getScroller: function () {
			return this.$[this.scrollerName];
		},

		/**
		* @private
		*/
		titleChanged: function (){
			this.$.title.setContent(this.title);
		},

		/**
		* @private
		*/
		actionButtonsChanged: function () {
			if (this.actionButtons) {
				enyo.forEach(this.actionButtons, function (button) {
					button.kind = 'onyx.Button';
					button.classes = button.classes + ' onyx-contextual-popup-action-button';
					button.popup = this;
					button.actionButton = true;
					this.$.actionButtons.createComponent(button, {
						owner: this.getInstanceOwner()
					});
				}, this);
			} else if (this.kindActionButtons) {
				enyo.forEach(this.kindActionButtons, function (button) {
					button.kind = 'onyx.Button';
					button.classes = button.classes + ' onyx-contextual-popup-action-button';
					button.popup = this;
					button.actionButton = true;
					this.$.actionButtons.createComponent(button, {
						owner: this
					});
				}, this);
			}
			if(this.hasNode()) {
				this.$.actionButtons.render();
			}
		},

		/**
		* @private
		*/
		maxHeightChanged: function () {
			if (this.scrolling) {
				this.getScroller().setMaxHeight(this.maxHeight + 'px');
			}
		},

		/**
		* @private
		*/
		showingChanged: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				if (this.scrolling) {
					this.getScroller().setShowing(this.showing);
				}
				if (!this.showing) {
					this.activator = this.activatorOffset = null;
				}
				this.adjustPosition();
			};
		}),

		/**
		* @todo  document why bubbling is explicitly prevented
		* @private
		*/
		childControlActivated: function (sender, event) {
			return true;
		},

		/**
		* Handles `onRequestShowMenu` events.
		*
		* @private
		*/
		requestShow: function (sender, event) {
			this.activator = event.activator.hasNode();
			this.show();
			return true;
		},

		/**
		* Handles `onRequestHideMenu` events.
		*
		* @private
		*/
		requestHide: function (sender, event) {
			this.setShowing(false);
		},

		/**
		* Positions the popup.
		*
		* @todo seems to duplicate enyo.Control.setBounds()
		* @private
		*/
		applyPosition: function (rect) {
			var s = '';
			for (var n in rect) {
				s += (n + ':' + rect[n] + (isNaN(rect[n]) ? '; ' : 'px; '));
			}
			this.addStyles(s);
		},

		/**
		* Calculates the position of the popup relative to the page.
		*
		* @param {Element} node
		* @private
		*/
		getPageOffset: function (node) {
			var r = this.getBoundingRect(node);

			var pageYOffset = (window.pageYOffset === undefined) ? document.documentElement.scrollTop : window.pageYOffset;
			var pageXOffset = (window.pageXOffset === undefined) ? document.documentElement.scrollLeft : window.pageXOffset;
			var rHeight = (r.height === undefined) ? (r.bottom - r.top) : r.height;
			var rWidth = (r.width === undefined) ? (r.right - r.left) : r.width;

			return {top: r.top + pageYOffset, left: r.left + pageXOffset, height: rHeight, width: rWidth};
		},

		/**
		* Adjusts the popup position + nub location & direction.
		*
		* ContextualPopup positioning rules:
		*
		* 1. Activator Location:
		*    1. If activator is located in a corner then position using a flush style.
		*       1. Attempt vertical first.
		*       2. Horizontal if vertical doesn't fit.
		*    2. If not in a corner then check if the activator is located in one of the 4 "edges"
		*       of the view & position the following way if so:
		*       1.   Activator is in top edge, position popup below it.
		*       2.  Activator is in bottom edge, position popup above it.
		*       3. Activator is in left edge, position popup to the right of it.
		*       4.  Activator is in right edge, position popup to the left of it.
 		*
		* 2. Screen Size - the popup should generally extend in the direction where there’s room
		*    for it.
		*
		*    Note: no specific logic below for this rule since it is built into the positioning
		*    functions, ie we attempt to never position a popup where there isn't enough room for
		*    it.
		*
		* 3. Popup Size:
		*
		*    1. If popup content is wide, use top or bottom positioning.
		*    2. If popup content is long, use horizontal positioning.
		*
		* 4. Favor top or bottom:
		*
		*    If all the above rules have been followed and location can still vary then favor top
		*    or bottom positioning.
		*
		* 5. If top or bottom will work, favor bottom.
		*
		*    Note: There is no specific logic below for this rule since it is built into the
		*    vertical position functions, i.e., we attempt to use a bottom position for the popup
		*    as much as possible. Additionally, within the vertical position function, we center
		*    the popup if the activator is at the vertical center of the view.
		*	
		* @private
		*/
		adjustPosition: function () {
			if (this.showing && this.hasNode() && this.activator) {
				this.resetPositioning();
				this.activatorOffset = this.getPageOffset(this.activator);
				var innerWidth = this.getViewWidth();
				var innerHeight = this.getViewHeight();

				//These are the view "flush boundaries"
				var topFlushPt = this.vertFlushMargin;
				var bottomFlushPt = innerHeight - this.vertFlushMargin;
				var leftFlushPt = this.horizFlushMargin;
				var rightFlushPt = innerWidth - this.horizFlushMargin;

				//Rule 1 - Activator Location based positioning
				//if the activator is in the top or bottom edges of the view, check if the popup needs flush positioning
				if ((this.activatorOffset.top + this.activatorOffset.height) < topFlushPt || this.activatorOffset.top > bottomFlushPt) {
					//check/try vertical flush positioning	(rule 1.a.i)
					if (this.applyVerticalFlushPositioning(leftFlushPt, rightFlushPt)) {
						return;
					}

					//if vertical doesn't fit then check/try horizontal flush (rule 1.a.ii)
					if (this.applyHorizontalFlushPositioning(leftFlushPt, rightFlushPt)) {
						return;
					}

					//if flush positioning didn't work then try just positioning vertically (rule 1.b.i & rule 1.b.ii)
					if (this.applyVerticalPositioning()){
						return;
					}
				//otherwise check if the activator is in the left or right edges of the view & if so try horizontal positioning
				} else if ((this.activatorOffset.left + this.activatorOffset.width) < leftFlushPt || this.activatorOffset.left > rightFlushPt) {
					//if flush positioning didn't work then try just positioning horizontally (rule 1.b.iii & rule 1.b.iv)
					if (this.applyHorizontalPositioning()){
						return;
					}
				}

				//Rule 2 - no specific logic below for this rule since it is inheritent to the positioning functions, ie we attempt to never
				//position a popup where there isn't enough room for it.

				//Rule 3 - Popup Size based positioning
				var clientRect = this.getBoundingRect(this.node);

				//if the popup is wide then use vertical positioning
				if (clientRect.width > this.widePopup) {
					if (this.applyVerticalPositioning()){
						return;
					}
				}
				//if the popup is long then use horizontal positioning
				else if (clientRect.height > this.longPopup) {
					if (this.applyHorizontalPositioning()){
						return;
					}
				}

				//Rule 4 - Favor top or bottom positioning
				if (this.applyVerticalPositioning()) {
					return;
				}
				//but if thats not possible try horizontal
				else if (this.applyHorizontalPositioning()){
					return;
				}

				//Rule 5 - no specific logic below for this rule since it is built into the vertical position functions, ie we attempt to
				//         use a bottom position for the popup as much possible.
			}
		},

		/**
		* Moves the popup below or above the activator and verifies that it fits onscreen.
		*
		* @return {Boolean} `true` if vertical positioning can be used; otherwise, `false`.
		* @private
		*/
		initVerticalPositioning: function () {
			this.resetPositioning();
			this.addClass('vertical');

			var clientRect = this.getBoundingRect(this.node);
			var innerHeight = this.getViewHeight();

			if (this.floating){
				if (this.activatorOffset.top < (innerHeight / 2)) {
					this.applyPosition({top: this.activatorOffset.top + this.activatorOffset.height, bottom: 'auto'});
					this.addClass('below');
				} else {
					this.applyPosition({top: this.activatorOffset.top - clientRect.height, bottom: 'auto'});
					this.addClass('above');
				}
			} else {
				//if the popup's bottom goes off the screen then put it on the top of the invoking control
				if ((clientRect.top + clientRect.height > innerHeight) && ((innerHeight - clientRect.bottom) < (clientRect.top - clientRect.height))){
					this.addClass('above');
				} else {
					this.addClass('below');
				}
			}

			//if moving the popup above or below the activator puts it past the edge of the screen then vertical doesn't work
			clientRect = this.getBoundingRect(this.node);
			if ((clientRect.top + clientRect.height) > innerHeight || clientRect.top < 0){
				return false;
			}

			return true;
		},

		/**
		* Implements positioning rules (rule 1.b.i & rule 1.b.ii).
		*
		* @return {Boolean} `true` if vertical positioning is used; otherwise, `false`.
		* @private
		*/
		applyVerticalPositioning: function () {
			//if we can't fit the popup above or below the activator then forget vertical positioning
			if (!this.initVerticalPositioning()) {
				return false;
			}

			var clientRect = this.getBoundingRect(this.node);
			var innerWidth = this.getViewWidth();

			if (this.floating){
				//Get the left edge delta to horizontally center the popup
				var centeredLeft = this.activatorOffset.left + this.activatorOffset.width/2 - clientRect.width/2;
				if (centeredLeft + clientRect.width > innerWidth) {//popup goes off right edge of the screen if centered
					this.applyPosition({left: this.activatorOffset.left + this.activatorOffset.width - clientRect.width});
					this.addClass('left');
				} else if (centeredLeft < 0) {//popup goes off left edge of the screen if centered
					this.applyPosition({left:this.activatorOffset.left});
					this.addClass('right');
				} else {//center the popup
					this.applyPosition({left: centeredLeft});
				}

			} else {
				//Get the left edge delta to horizontally center the popup
				var centeredLeftDelta = this.activatorOffset.left + this.activatorOffset.width/2 - clientRect.left - clientRect.width/2;
				if (clientRect.right + centeredLeftDelta > innerWidth) {//popup goes off right edge of the screen if centered
					this.applyPosition({left: this.activatorOffset.left + this.activatorOffset.width - clientRect.right});
					this.addRemoveClass('left', true);
				} else if (clientRect.left + centeredLeftDelta < 0) {//popup goes off left edge of the screen if centered
					this.addRemoveClass('right', true);
				} else {//center the popup
					this.applyPosition({left: centeredLeftDelta});
				}
			}

			return true;
		},

		/**
		* Implements positioning (rule 1.a.i).
		*
		* @return {Boolean} `true` if vertical flush positioning is used; otherwise, `false`.
		* @private
		*/
		applyVerticalFlushPositioning: function (leftFlushPt, rightFlushPt) {
			//if we can't fit the popup above or below the activator then forget vertical positioning
			if (!this.initVerticalPositioning()) {
				return false;
			}

			var clientRect = this.getBoundingRect(this.node);
			var innerWidth = this.getViewWidth();

			//If the activator's right side is within our left side cut off use flush positioning
			if ((this.activatorOffset.left + this.activatorOffset.width/2) < leftFlushPt){
				//if the activator's left edge is too close or past the screen left edge
				if (this.activatorOffset.left + this.activatorOffset.width/2 < this.horizBuffer){
					this.applyPosition({left:this.horizBuffer + (this.floating ? 0 : -clientRect.left)});
				} else {
					this.applyPosition({left:this.activatorOffset.width/2  + (this.floating ? this.activatorOffset.left : 0)});
				}

				this.addClass('right');
				this.addClass('corner');
				return true;
			}
			//If the activator's left side is within our right side cut off use flush positioning
			else if (this.activatorOffset.left + this.activatorOffset.width/2 > rightFlushPt) {
				if ((this.activatorOffset.left+this.activatorOffset.width/2) > (innerWidth-this.horizBuffer)){
					this.applyPosition({left:innerWidth - this.horizBuffer - clientRect.right});
				} else {
					this.applyPosition({left: (this.activatorOffset.left + this.activatorOffset.width/2) - clientRect.right});
				}
				this.addClass('left');
				this.addClass('corner');
				return true;
			}

			return false;
		},

		/**
		* Moves the popup left or right of the activator and verifies that it fits onscreen.
		* A return value of `true` is a precondition for using
		* [applyHorizontalPositioning()]{@link onyx.ContextualPopup#applyHorizontalPositioning} and
		* [applyHorizontalFlushPositioning()]{@link onyx.ContextualPopup#applyHorizontalFlushPositioning}.
		*
		* @return {Boolean} `true` if horizontal positioning can be used; otherwise, `false`.
		* @private
		*/
		initHorizontalPositioning: function () {
			this.resetPositioning();

			var clientRect = this.getBoundingRect(this.node);
			var innerWidth = this.getViewWidth();

			//adjust horizontal positioning of the popup & nub vertical positioning
			if (this.floating){
				if ((this.activatorOffset.left + this.activatorOffset.width) < innerWidth/2) {
					this.applyPosition({left: this.activatorOffset.left + this.activatorOffset.width});
					this.addRemoveClass('left', true);
				} else {
					this.applyPosition({left: this.activatorOffset.left - clientRect.width});
					this.addRemoveClass('right', true);
				}
			} else {
				if (this.activatorOffset.left - clientRect.width > 0) {
					this.applyPosition({left: this.activatorOffset.left - clientRect.left - clientRect.width});
					this.addRemoveClass('right', true);
				} else {
					this.applyPosition({left: this.activatorOffset.width});
					this.addRemoveClass('left', true);
				}
			}
			this.addRemoveClass('horizontal', true);

			//if moving the popup left or right of the activator puts it past the edge of the screen then horizontal won't work
			clientRect = this.getBoundingRect(this.node);
			if (clientRect.left < 0 || (clientRect.left + clientRect.width) > innerWidth){
				return false;
			}
			return true;

		},

		/**
		* Implements positioning (rule 1.b.iii & rule 1.b.iv).
		*
		* @return {Boolean} `true` if using horizontal positioning; otherwise, `false`.
		* @private
		*/
		applyHorizontalPositioning: function () {
			//if we can't fit the popup left or right of the activator then forget horizontal positioning
			if (!this.initHorizontalPositioning()) {
				return false;
			}

			var clientRect = this.getBoundingRect(this.node);
			var innerHeight = this.getViewHeight();
			var activatorCenter = this.activatorOffset.top + this.activatorOffset.height/2;

			if (this.floating){
				//if the activator's center is within 10% of the center of the view, vertically center the popup
				if ((activatorCenter >= (innerHeight/2 - 0.05 * innerHeight)) && (activatorCenter <= (innerHeight/2 + 0.05 * innerHeight))) {
					this.applyPosition({top: this.activatorOffset.top + this.activatorOffset.height/2 - clientRect.height/2, bottom: 'auto'});
				} else if (this.activatorOffset.top + this.activatorOffset.height < innerHeight/2) { //the activator is in the top 1/2 of the screen
					this.applyPosition({top: this.activatorOffset.top - this.activatorOffset.height, bottom: 'auto'});
					this.addRemoveClass('high', true);
				} else { //otherwise the popup will be positioned in the bottom 1/2 of the screen
					this.applyPosition({top: this.activatorOffset.top - clientRect.height + this.activatorOffset.height*2, bottom: 'auto'});
					this.addRemoveClass('low', true);
				}
			} else {
				//if the activator's center is within 10% of the center of the view, vertically center the popup
				if ((activatorCenter >= (innerHeight/2 - 0.05 * innerHeight)) && (activatorCenter <= (innerHeight/2 + 0.05 * innerHeight))) {
					this.applyPosition({top: (this.activatorOffset.height - clientRect.height)/2});
				} else if (this.activatorOffset.top + this.activatorOffset.height < innerHeight/2) { //the activator is in the top 1/2 of the screen
					this.applyPosition({top: -this.activatorOffset.height});
					this.addRemoveClass('high', true);
				} else { //otherwise the popup will be positioned in the bottom 1/2 of the screen
					this.applyPosition({top: clientRect.top - clientRect.height - this.activatorOffset.top + this.activatorOffset.height});
					this.addRemoveClass('low', true);
				}
			}
			return true;
		},

		/**
		* Implements positioning (rule 1.a.ii).
		*
		* @return {Boolean} `true` if using flush positioning; otherwise, `false`.
		* @private
		*/
		applyHorizontalFlushPositioning: function (leftFlushPt, rightFlushPt) {
			//if we can't fit the popup left or right of the activator then forget vertical positioning
			if (!this.initHorizontalPositioning()) {
				return false;
			}

			var clientRect = this.getBoundingRect(this.node);
			var innerHeight = this.getViewHeight();

			//adjust vertical positioning (high or low nub & popup position)
			if (this.floating){
				if (this.activatorOffset.top < (innerHeight/2)){
					this.applyPosition({top: this.activatorOffset.top + this.activatorOffset.height/2});
					this.addRemoveClass('high', true);
				} else {
					this.applyPosition({top:this.activatorOffset.top + this.activatorOffset.height/2 - clientRect.height});
					this.addRemoveClass('low', true);
				}
			} else {
				if (((clientRect.top + clientRect.height) > innerHeight) && ((innerHeight - clientRect.bottom) < (clientRect.top - clientRect.height))) {
					this.applyPosition({top: clientRect.top - clientRect.height - this.activatorOffset.top - this.activatorOffset.height/2});
					this.addRemoveClass('low', true);
				} else {
					this.applyPosition({top: this.activatorOffset.height/2});
					this.addRemoveClass('high', true);
				}
			}

			//If the activator's right side is within our left side cut off use flush positioning
			if ((this.activatorOffset.left + this.activatorOffset.width) < leftFlushPt){
				this.addClass('left');
				this.addClass('corner');
				return true;
			}
			//If the activator's left side is within our right side cut off use flush positioning
			else if (this.activatorOffset.left > rightFlushPt) {
				this.addClass('right');
				this.addClass('corner');
				return true;
			}

			return false;
		},

		/**
		* Calculates top/left values that are relative to the viewport and not absolute for the
		* provided Node.
		*
		* @param  {Element} Node.
		* @return {Object}  Object containing the top, bottom, left, right, height, and width of the
		* 	node.
		* @private
		*/
		getBoundingRect:  function (node){
			// getBoundingClientRect returns t
			var o = node.getBoundingClientRect();
			if (!o.width || !o.height) {
				return {
					left: o.left,
					right: o.right,
					top: o.top,
					bottom: o.bottom,
					width: o.right - o.left,
					height: o.bottom - o.top
				};
			}
			return o;
		},

		/**
		* Determines the view height.
		*
		* @return {Number} - Height of the view.
		* @private
		*/
		getViewHeight: function () {
			return (window.innerHeight === undefined) ? document.documentElement.clientHeight : window.innerHeight;
		},

		/**
		* Determines the view width.
		*
		* @return {Number} - Width of the view.
		* @private
		*/
		getViewWidth: function () {
			return (window.innerWidth === undefined) ? document.documentElement.clientWidth : window.innerWidth;
		},

		/**
		* Removes all positioning classes and resets the `'top'` and `'left'` CSS attributes.
		*
		* @private
		*/
		resetPositioning: function () {
			this.removeClass('right');
			this.removeClass('left');
			this.removeClass('high');
			this.removeClass('low');
			this.removeClass('corner');
			this.removeClass('below');
			this.removeClass('above');
			this.removeClass('vertical');
			this.removeClass('horizontal');

			this.applyPosition({left: 'auto'});
			this.applyPosition({top: 'auto'});
		},

		/**
		* Handles `resize` events to reposition the popup.
		*
		* @method
		* @private
		*/
		handleResize: function () {
			this.inherited(arguments);
			this.adjustPosition();
		}
	});

})(enyo, this);