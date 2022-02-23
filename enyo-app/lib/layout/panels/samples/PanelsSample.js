enyo.kind({
	name: "enyo.sample.MyGridArranger",
	kind: "GridArranger",
	colHeight: "150",
	colWidth: "150"
});

enyo.kind({
	name: "enyo.sample.PanelsSample",
	kind: "FittableRows",
	classes: "enyo-fit",
	components: [
		{kind: "FittableColumns", noStretch: true, classes: "onyx-toolbar onyx-toolbar-inline", components: [
			{kind: "Scroller", thumb: false, fit: true, touch: true, vertical: "hidden", style: "margin: 0;", components: [
				{classes: "onyx-toolbar-inline", style: "white-space: nowrap;", components: [
					{kind: "onyx.MenuDecorator", components: [
						{content:"Arranger"},
						{name:"arrangerPicker", kind: "onyx.Menu", maxHeight: 360, floating: true, onSelect:"arrangerSelected"}
					]},
					{kind: "onyx.Button", content: "Previous", ontap: "prevPanel"},
					{kind: "onyx.Button", content: "Next", ontap: "nextPanel"},
					{kind: "onyx.InputDecorator", style: "width: 60px;", components: [
						{kind: "onyx.Input", value: 0, onchange: "gotoPanel"}
					]},
					{kind: "onyx.Button", content: "Go", ontap: "gotoPanel"},
					{kind: "onyx.Button", content: "Add", ontap: "addPanel"},
					{kind: "onyx.Button", content: "Delete", ontap: "deletePanel"}
				]}
			]}
		]},
		{kind: "Panels", name:"samplePanels", fit:true, realtimeFit: true, classes: "panels-sample-panels enyo-border-box", components: [
			{content:0, style:"background:red;"},
			{content:1, style:"background:orange;"},
			{content:2, style:"background:yellow;"},
			{content:3, style:"background:green;"},
			{content:4, style:"background:blue;"},
			{content:5, style:"background:indigo;"},
			{content:6, style:"background:violet;"}
		]}
	],
	panelArrangers: [
		{name: "CardArranger", arrangerKind: "CardArranger"},
		{name: "CardSlideInArranger", arrangerKind: "CardSlideInArranger"},
		{name: "CarouselArranger", arrangerKind: "CarouselArranger", classes: "panels-sample-wide"},
		{name: "CollapsingArranger", arrangerKind: "CollapsingArranger", classes: "panels-sample-collapsible"},
		{name: "LeftRightArranger", arrangerKind: "LeftRightArranger"},
		{name: "TopBottomArranger", arrangerKind: "TopBottomArranger", classes: "panels-sample-topbottom"},
		{name: "SpiralArranger", arrangerKind: "SpiralArranger", classes: "panels-sample-spiral"},
		{name: "GridArranger", arrangerKind: "enyo.sample.MyGridArranger", classes: "panels-sample-grid"},
		{name: "DockRightArranger", arrangerKind: "DockRightArranger", classes: "panels-sample-collapsible"}
	],
	bgcolors: ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
	create: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			for (var i=0; i<this.panelArrangers.length; i++) {
				this.$.arrangerPicker.createComponent({content:this.panelArrangers[i].name});
			}
			this.panelCount=this.$.samplePanels.getPanels().length;
		};
	}),
	rendered: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
		};
	}),
	arrangerSelected: function(inSender, inEvent) {
		var sp = this.$.samplePanels;
		var p = this.panelArrangers[inEvent.originator.indexInContainer()-1];
		if (this.currentClass) {
			sp.removeClass(this.currentClass);
		}
		if (p.classes) {
			sp.addClass(p.classes);
			this.currentClass = p.classes;
		}
		sp.setArrangerKind(p.arrangerKind);
		if (enyo.Panels.isScreenNarrow()) {
			this.setIndex(1);
		}
	},
	// panels
	prevPanel: function() {
		this.$.samplePanels.previous();
		this.$.input.setValue(this.$.samplePanels.index);
	},
	nextPanel: function() {
		this.$.samplePanels.next();
		this.$.input.setValue(this.$.samplePanels.index);
	},
	gotoPanel: function() {
		this.$.samplePanels.setIndex(this.$.input.getValue());
	},
	panelCount: 0,
	addPanel: function() {
		var sp = this.$.samplePanels;
		var i = this.panelCount++;
		var p = sp.createComponent({
			style:"background:" + this.bgcolors[i % this.bgcolors.length],
			content:i
		});
		p.render();
		sp.reflow();
		sp.setIndex(i);
	},
	deletePanel: function() {
		var p = this.$.samplePanels.getActive();
		if (p) {
			p.destroy();
		}
	}
});