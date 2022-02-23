enyo.kind({
    name: 'enyo.sample.ListOnyxItemSample',
    classes: 'list-sample enyo-fit',
    components: [{
        name: 'list',
        kind: 'List',
        count: 20000,
        multiSelect: false,
        classes: 'enyo-fit list-sample-list',
        onSetupItem: 'setupItem',
        components: [{
            name: 'item',
            kind: 'onyx.Item',
            tapHighlight: true,
            classes: 'list-sample-item enyo-border-box',
            components: [{
                name: 'index',
                classes: 'list-sample-index'
            }, {
                name: 'name'
            }]
        }]
    }],
    names: [],
    setupItem: function (inSender, inEvent) {
        /* global makeName */
        // this is the row we're setting up
        var i = inEvent.index;
        // make some mock data if we have none for this row
        if (!this.names[i]) {
            this.names[i] = makeName(5, 10, '', '');
        }
        var n = this.names[i];
        var ni = ('00000000' + i).slice(-7);
        // apply selection style if inSender (the list) indicates that this row is selected.
        this.$.item.addRemoveClass('list-sample-selected', (i % 2 === 0));
        this.$.name.setContent(n);
        this.$.index.setContent(ni);
    }
});