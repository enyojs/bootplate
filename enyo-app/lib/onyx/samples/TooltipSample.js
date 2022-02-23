enyo.kind({
	name: "onyx.sample.TooltipSample",
	classes: "onyx onyx-sample",
	handlers: {
		onSelect: "itemSelected"
	},
	components: [
		{classes: "onyx-sample-divider", content: "Tooltips on Toolbar"},
		{kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
			{kind: "onyx.TooltipDecorator", components: [
				{kind: "onyx.Button", content: "Tooltip"},
				{kind: "onyx.Tooltip", content: "I'm a tooltip for a button."}
			]},
			{kind: "onyx.TooltipDecorator", components: [
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", style:"width:130px;", placholder: "Just an input..."}
				]},
				{kind: "onyx.Tooltip", content: "I'm a tooltip for an input."}
			]}
		]},
		{tag: "br"},
		{kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
			{kind: "onyx.MenuDecorator", components: [
				{kind: "onyx.IconButton", src: "assets/menu-icon-bookmark.png"},
				{kind: "onyx.Tooltip", content: "Bookmarks menu"},
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
			{kind: "onyx.MenuDecorator", components: [
				{content: "Bookmarks menu"},
				{kind: "onyx.Tooltip", content: "Tap to open..."},
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
		{classes: "onyx-sample-divider", content: "Tooltips on items"},
		{kind: "onyx.TooltipDecorator", components: [
			{kind: "onyx.Button", content: "Tooltip"},
			{kind: "onyx.Tooltip", content: "I'm a tooltip for a button."}
		]},
		{tag: "br"},
		{kind: "onyx.TooltipDecorator", components: [
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", style:"width:130px;", placholder: "Just an input..."}
			]},
			{kind: "onyx.Tooltip", content: "I'm a tooltip for an input."}
		]},
		{tag: "br"},
		{kind: "onyx.MenuDecorator", components: [
			{kind: "onyx.IconButton", src: "assets/menu-icon-bookmark.png"},
			{kind: "onyx.Tooltip", content: "Bookmarks menu"},
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
		{tag: "br"},
		{kind: "onyx.MenuDecorator", components: [
			{content: "Bookmarks menu"},
			{kind: "onyx.Tooltip", content: "Tap to open..."},
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
	]
});