enyo.kind({
	name: 'enyo.sample.PanZoomViewSample',
	components: [
		{kind:'PanZoomView', contentWidth: 600, contentHeight: 600, classes:'panzoomview-demo', onZoom:'zoom', components: [
			{kind: 'FittableColumns', components: [
				{content: 'Hello World', style:'background: orange; width: 200px; height: 200px;'},
				{content: 'Hello World', style:'background: blue; width: 200px; height: 200px;'},
				{content: 'Hello World', style:'background: cyan; width: 200px; height: 200px;'}
			]},
			{kind: 'FittableColumns', components: [
				{content: 'Hello World', style:'background: lightblue; width: 200px; height: 200px;'},
				{content: 'Hello World', style:'background: yellow; width: 200px; height: 200px;'},
				{content: 'Hello World', style:'background: red; width: 200px; height: 200px;'}
			]},
			{kind: 'FittableColumns', components: [
				{content: 'Hello World', style:'background: brown; width: 200px; height: 200px;'},
				{content: 'Hello World', style:'background: green; width: 200px; height: 200px;'},
				{content: 'Hello World', style:'background: pink; width: 200px; height: 200px;'}
			]}
		]},

		{kind:'onyx.Groupbox',  style:'padding-top:10px; width:60%; margin:auto;', components: [
			{kind:'onyx.GroupboxHeader', content: 'panZoomView Scale'},
			{style:'text-align:center;', components: [
				{kind:'onyx.Button', content:'auto',   ontap:'autoScale',   classes:'panzoomview-demoButton'},
				{kind:'onyx.Button', content:'width',  ontap:'widthScale',  classes:'panzoomview-demoButton'},
				{kind:'onyx.Button', content:'height', ontap:'heightScale', classes:'panzoomview-demoButton'},
				{kind:'onyx.Button', content:'fit',    ontap:'fitScale',    classes:'panzoomview-demoButton'},
				{kind:'onyx.Button', content:'0.5', ontap:'halfScale', classes:'panzoomview-demoButton'},
				{kind:'onyx.Button', content:'1.0', ontap:'normalScale', classes:'panzoomview-demoButton'},
				{kind:'onyx.Button', content:'2.0', ontap:'doubleScale', classes:'panzoomview-demoButton'}
			]}
		]}
	],
	create: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this.scale = 'auto';
		};
	}),
	handleResize: function(inSender, inEvent) {
		this.inherited(arguments);
		this.$.panZoomView.setScale(this.scale);
	},
	autoScale: function(inSender, inEvent) {
		this.scale = 'auto';
		this.$.panZoomView.setScale(this.scale);
	},
	widthScale: function(inSender, inEvent) {
		this.scale = 'width';
		this.$.panZoomView.setScale(this.scale);
	},
	heightScale: function(inSender, inEvent) {
		this.scale = 'height';
		this.$.panZoomView.setScale(this.scale);
	},
	fitScale: function(inSender, inEvent) {
		this.scale = 'fit';
		this.$.panZoomView.setScale(this.scale);
	},
	halfScale: function(inSender, inEvent) {
		this.scale = 0.5;
		this.$.panZoomView.setScale(this.scale);
	},
	normalScale: function(inSender, inEvent) {
		this.scale = 1.0;
		this.$.panZoomView.setScale(this.scale);
	},
	doubleScale: function(inSender, inEvent) {
		this.scale = 2.0;
		this.$.panZoomView.setScale(this.scale);
	}
});
