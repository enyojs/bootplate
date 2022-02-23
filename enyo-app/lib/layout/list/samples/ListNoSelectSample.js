enyo.kind({
	name: 'enyo.sample.ListNoSelectSample',
	classes: 'list-sample enyo-fit',
	components: [
		{name: 'list', kind: 'List', count: 20000, noSelect: true, multiSelect: false, classes: 'enyo-fit list-sample-list',
			onSetupItem: 'setupItem', components: [
			{name: 'item', classes: 'list-sample-item enyo-border-box', components: [
				{name: 'index', classes: 'list-sample-index'},
				{name: 'name'}
			]}
		]}
	],
	names: [],
	setupItem: function(inSender, inEvent) {
		/* global makeName */
		// this is the row we're setting up
		var i = inEvent.index;
		// make some mock data if we have none for this row
		if (!this.names[i]) {
			this.names[i] = makeName(5, 10, '', '');
		}
		var n = this.names[i];
		var ni = ('00000000' + i).slice(-7);
		this.$.name.setContent(n);
		this.$.index.setContent(ni);
		return true;
	}
});