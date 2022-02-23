enyo.kind({
	name: "onyx.sample.MenuSample",
	classes: "onyx onyx-sample",
	components: [
		{classes: "onyx-sample-divider", content: "Menus in Toolbars"},
		{kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
			{kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
				{kind: "onyx.IconButton", src: "assets/menu-icon-bookmark.png"},
				{kind: "onyx.Menu", components: [
					{components: [
						{kind: "onyx.IconButton", src: "assets/menu-icon-bookmark.png"},
						{content: "Bookmarks"}
					]},
					{content: "Favorites"},
					{classes: "onyx-menu-divider"},
					{content: "Recents"}
				]}
			]},
			{kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
				{content: "Bookmarks menu"},
				{kind: "onyx.Menu", components: [
					{components: [
						{kind: "onyx.IconButton", src: "assets/menu-icon-bookmark.png"},
						{content: "Bookmarks"}
					]},
					{content: "Favorites"},
					{classes: "onyx-menu-divider"},
					{content: "Recents"}
				]}
			]}
		]},
		{tag: "br"},
		{classes: "onyx-sample-divider", content: "Menus from Buttons"},
		{kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
			{content: "Popup menu (floating)"},
			{kind: "onyx.Menu", floating: true, components: [
				{content: "1"},
				{content: "2"},
				{classes: "onyx-menu-divider"},
				{content: "3"}
			]}
		]},
		{tag: "br"},
		{kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
			{content: "Scrolling Popup menu"},
			{kind: "onyx.Menu", components: [
				{name: "menuScroller", kind: "enyo.Scroller", defaultKind: "onyx.MenuItem", vertical: "auto", classes: "enyo-unselectable", maxHeight: "200px", strategyKind: "TouchScrollStrategy", components: [
					{content: "1"},
					{content: "2"},
					{classes: "onyx-menu-divider"},
					{content: "3"},
					{content: "4"},
					{content: "5"},
					{classes: "onyx-menu-divider"},
					{content: "6"},
					{content: "7"}
				]}
			]}
		]},
		{tag: "br"},
		{kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
			{content: "Split Popup menu", kind: "onyx.Button", onActivate: "preventMenuActivate", style: "border-radius: 3px 0 0 3px;"},
			{content: "v", allowHtml:true, style: "border-radius: 0 3px 3px 0;"},
			{kind: "onyx.Menu", components: [
				{content: "1"},
				{content: "2"},
				{classes: "onyx-menu-divider"},
				{content: "3"}
			]}
		]},
		{tag: "br"},
		{kind: "onyx.Groupbox", classes:"onyx-sample-result-box", components: [
			{kind: "onyx.GroupboxHeader", content: "Result"},
			{name:"menuSelection", classes:"onyx-sample-result", content:"No menu selection yet."}
		]}
	],
	create: function() {
		this.inherited(arguments);
	},
	showPopup: function(inSender) {
		var p = this.$[inSender.popup];
		if (p) {
			p.show();
		}
	},
	preventMenuActivate: function() {
		return true;
	},
	itemSelected: function(inSender, inEvent) {
		//Menu items send an onSelect event with a reference to themselves & any directly displayed content
		if (inEvent.originator.content){
			this.$.menuSelection.setContent(inEvent.originator.content + " Selected");
		} else if (inEvent.selected){
			//	Since some of the menu items do not have directly displayed content (they are kinds with subcomponents),
			//	we have to handle those items differently here.
			this.$.menuSelection.setContent(inEvent.selected.controlAtIndex(1).content + " Selected");
		}
	}
});