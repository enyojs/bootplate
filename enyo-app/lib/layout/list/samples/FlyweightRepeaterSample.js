enyo.kind({
	name: 'enyo.sample.FlyweightRepeaterSample',
	kind: 'FittableRows',
	classes: 'flyweight-repeater-sample enyo-fit onyx',
	components: [
		{kind: 'onyx.Toolbar', components: [
			{content: 'FlyweightRepeater Result'}
		]},
		{name:'result', style:'padding:12px; font-size: 20px;', content: 'Nothing selected yet.'},
		{kind: 'enyo.Scroller', fit: true, components: [
			{name:'repeater', kind:'enyo.FlyweightRepeater', classes:'flyweight-repeater-sample-list', count: 26, onSetupItem: 'setupItem', components: [
				{name: 'item', classes:'flyweight-repeater-sample-item'}
			]}
		]}
	],
	handlers: {
		onSelect: 'itemSelected'
	},
	people: [
		{name: 'Andrew'},
		{name: 'Betty'},
		{name: 'Christopher'},
		{name: 'Donna'},
		{name: 'Ephraim'},
		{name: 'Frankie'},
		{name: 'Gerald'},
		{name: 'Heather'},
		{name: 'Ingred'},
		{name: 'Jack'},
		{name: 'Kevin'},
		{name: 'Lucy'},
		{name: 'Matthew'},
		{name: 'Noreen'},
		{name: 'Oscar'},
		{name: 'Pedro'},
		{name: 'Quentin'},
		{name: 'Ralph'},
		{name: 'Steven'},
		{name: 'Tracy'},
		{name: 'Uma'},
		{name: 'Victor'},
		{name: 'Wendy'},
		{name: 'Xin'},
		{name: 'Yulia'},
		{name: 'Zoltan'}
	],
	setupItem: function(inSender, inEvent) {
		var index = inEvent.index;
		this.$.item.setContent((index+1) + '. ' + this.people[index].name);
		this.$.item.applyStyle('background', (inEvent.selected? 'dodgerblue':'lightgray'));
		/* stop propogation */
		return true;
	},
	itemSelected: function(inSender, inEvent) {
		var index = inEvent.index;
		var count = inEvent.flyweight.count;
		if(index>=0 && index<count){
			this.$.result.setContent(' [' + (index+1) + '. ' + this.people[index].name + '] is selected');
		}
		return true;
	}
});
