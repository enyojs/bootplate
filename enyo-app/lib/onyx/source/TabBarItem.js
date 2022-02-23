(function (enyo, scope) {

	/**
	* onyx.TabBar.Item is a special button for TabBar. This widget is
	* designed to be used only within TabBar.
	*
	* @class  onyx.TabBar.Item
	* @extends enyo.GroupItem
	* @ui
	* @private
	*/
	enyo.kind (
		/** @lends  onyx.TabBar.Item */ {

		name: 'onyx.TabBarItem', // Due to a correction in path resolving for Enyo 2.5.0, onyx.TabBar.Item was renamed to onyx.TabBarItem
		classes: "onyx-tab-item",
		kind: 'enyo.GroupItem',
		events: {
			onTabActivated: '',
			onTabCloseRequest: '',
			onTabSwitchRequest: '',
			onActivate: '',
			onShowTooltip: '',
			onHideTooltip: ''
		},
		handlers: {
			onmouseover: "navOver",
			onmouseout: "navOut"
		} ,
		navOver: function(item) {
			this.$.dissolve.addClass('onyx-tab-item-hovered');
		},
		navOut: function(item) {
			this.$.dissolve.removeClass('onyx-tab-item-hovered');
		},
		components: [
			{
				kind: "enyo.Button", // no need of onyx.RadioButton
				name: 'button',
				ontap: 'requestSwitch',
				onmouseover: 'showTooltipFromTab',
				onmouseout: 'doHideTooltip'
			},
			{
				classes: 'onyx-tab-item-dissolve',
				ontap: 'requestSwitch',
				name: 'dissolve',
				showing: false,
				onmouseover: 'showTooltipFromTab',
				onmouseout: 'doHideTooltip'
			},
			{
				classes: 'onyx-tab-item-close',
				name: 'closeButton' ,
				ontap: 'requestClose'
			}
		],

		create: function() {
			this.inherited(arguments);
			this.$.button.setContent(this.content);
		},

		raise: function() {
			this.addClass('active');
			this.$.dissolve.addClass('active');
		},
		putBack: function() {
			this.removeClass('active');
			this.$.dissolve.removeClass('active');
		},

		setActiveTrue: function() {
			this.setActive(true);
		},

		activeChanged: function(inOldValue) {
			// called during destruction, hence the test on this.container
			if (this.container && this.hasNode()) {
				if (this.active) {
					this.raise();
				}
				else {
					this.putBack();
				}
				this.doActivate();
			}
			// do not return true;
			// activate event must be propagated to my RadioGroup owner
		},

		_origWidth: null,
		origWidth: function() {
			this._origWidth = this._origWidth || this.getBounds().width ;
			return this._origWidth;
		},
		reduce: function(coeff) {
			var width = Math.floor( this.origWidth() * coeff )
					- this.$.closeButton.getBounds().width -7 ;

			if (coeff === 1) {
				this.$.dissolve.hide();
			}
			else {
				this.$.dissolve.show();
			}

			this.$.button.applyStyle('width', width + 'px');
		},

		requestSwitch: function(inSender, inEvent) {
			var i = this.indexInContainer();
			this.doTabSwitchRequest({
				index:    i,
				caption:  this.content,
				userData: this.userData,
				userId:   this.userId
			});
			return true;
		},

		requestClose: function(inSender, inEvent) {
			this.doTabCloseRequest({ index: this.tabIndex });
			return true;
		},

		showTooltipFromTab: function(inSender, inEvent){
			this.doShowTooltip({tooltipContent: this.tooltipMsg, bounds:this.getBounds()});

		}
	});

})(enyo, this);