enyo.kind({
	name: "onyx.sample.TimePickerSample",
	kind: "FittableRows",
	classes: "onyx enyo-fit",
	handlers: {
		onSelect: "updateTimeValues"
	},
	components: [
		{kind: "onyx.Toolbar", content:$L("Times")},
		{kind: "FittableColumns", style: "padding: 10px", components:[
			{components: [
				{content:$L("Choose Locale:"), classes:"onyx-sample-divider"},
				{kind: "onyx.PickerDecorator", style:"padding:10px;", onSelect: "localeChanged", components: [
					{content: "Pick One...", style: "width: 200px"},
					{kind: "onyx.Picker", name: "localePicker", components: [
						{content: "en-US", active:true},
						{content: "en-CA"},
						{content: "en-IE"},
						{content: "en-GB"},
						{content: "en-MX"},
						{content: "de-DE"},
						{content: "fr-FR"},
						{content: "fr-CA"},
						{content: "it-IT"},
						{content: "es-ES"},
						{content: "es-MX"},
						{content: "es-US"},
						{content: "ko-KR"},
						{content: "ja-JP"},
						{content: "zh-HK"}
					]}
				]}
			]}
		]},

		{kind:"onyx.Button",content:"Get Times", style:"margin:10px;", ontap:"getTimes"},
		{kind:"onyx.Button",content:"Reset Times", ontap:"resetTimes"},

		{style:"width:100%;height:5px;background-color:black;margin-bottom:5px;"},
		{caption: "Dates", style: "padding: 10px", components:
		[
			{content:"TIME",classes:"onyx-sample-divider"},
			{classes: "onyx-toolbar-inline", components: [
				{name:"timePicker1", kind:"onyx.TimePicker"}
			]},
			{kind: "onyx.Groupbox", style:"padding:5px;", components: [
				{kind: "onyx.GroupboxHeader", content: "Value"},
				{name:"timePicker1Value", style:"padding:15px;"}
			]},
			{content:"TIME 24 HOUR MODE",classes:"onyx-sample-divider"},
			{classes: "onyx-toolbar-inline", components: [
				{name:"timePicker2", kind:"onyx.TimePicker", is24HrMode:true}
			]},
			{kind: "onyx.Groupbox", style:"padding:5px;", components: [
				{kind: "onyx.GroupboxHeader", content: "Localized Value"},
				{name:"timePicker2Value", style:"padding:15px;"}
			]},
			{content:"DISABLED",classes:"onyx-sample-divider"},
			{classes: "onyx-toolbar-inline", components: [
				{name:"timePicker3", kind:"onyx.TimePicker", disabled: true}
			]}
		]}
	],
	bindings: [
		{from: ".$.localePicker.selected.content", to: ".locale"}
	],
	rendered: function() {
		this.inherited(arguments);
		this.localeChanged();
	},
	localeChanged: function() {
		this.$.timePicker1.setLocale(this.locale);
		this.$.timePicker2.setLocale(this.locale);
		this.$.timePicker2.setIs24HrMode(true);
		this.$.timePicker3.setLocale(this.locale);
		return true;
	},
	resetTimes: function(date) {
		var d = new Date();
		this.$.timePicker1.setValue(d);
		this.$.timePicker2.setValue(d);
		this.$.timePicker3.setValue(d);

		this.getTimes();
	},
	getTimes: function() {
		var fmt = new ilib.DateFmt({
			type: "time",
			length: "short",
			locale: this.locale,
			timezone: "local"
		});

		this.$.timePicker1Value.setContent(fmt.format(this.$.timePicker1.getValue()));
		this.$.timePicker2Value.setContent(fmt.format(this.$.timePicker2.getValue()));
	},
	updateTimeValues: function(inSender, inEvent){
		var fmt = new ilib.DateFmt({
			type: "time",
			length: "short",
			locale: this.locale,
			timezone: "local"
		});

		this.$[inEvent.name + "Value"].setContent(fmt.format(inEvent.value));
	}
});