enyo.kind({
	name: "enyo.sample.PanelsFlickrSample",
	kind: "Panels",
	classes: "panels-sample-flickr-panels enyo-unselectable enyo-fit",
	arrangerKind: "CollapsingArranger",
	components: [
		{layoutKind: "FittableRowsLayout", components: [
			{kind: "onyx.Toolbar", components: [
				{kind: "onyx.InputDecorator", style: "width: 90%;", layoutKind: "FittableColumnsLayout", components: [
					{name: "searchInput", fit: true, kind: "onyx.Input", value: "Japan", onchange: "search"},
					{kind: "Image", src: "assets/search-input-search.png", style: "width: 20px; height: 20px;"}
				]},
				{name: "searchSpinner", kind: "Image", src: "assets/spinner.gif", showing: false}
			]},
			{kind: "List", fit: true, touch: true, onSetupItem: "setupItem", components: [
				{name: "item", style: "padding: 10px;", classes: "panels-sample-flickr-item enyo-border-box", ontap: "itemTap", components: [
					{name: "thumbnail", kind: "Image", classes: "panels-sample-flickr-thumbnail"},
					{name: "title", classes: "panels-sample-flickr-title"}
				]},
				{name: "more", style: "background-color: #323232;", components: [
					{kind: "onyx.Button", content: "more photos", classes: "onyx-dark panels-sample-flickr-more-button", ontap: "more"},
					{name: "moreSpinner", kind: "Image", src: "assets/spinner.gif", classes: "panels-sample-flickr-more-spinner"}
				]}
			]}
		]},
		{name: "pictureView", fit: true, kind: "FittableRows", classes: "enyo-fit panels-sample-flickr-main", components: [
			{name: "backToolbar", kind: "onyx.Toolbar", showing: false, components: [
				{kind: "onyx.Button", content: "Back", ontap: "showList"}
			]},
			{fit: true, style: "position: relative;", components: [
				{name: "flickrImage", kind: "Image", classes: "enyo-fit panels-sample-flickr-center panels-sample-flickr-image", showing: false, onload: "imageLoaded", onerror: "imageLoaded"},
				{name: "imageSpinner", kind: "Image", src: "assets/spinner-large.gif", classes: "enyo-fit panels-sample-flickr-center", showing: false}
			]}
		]},
		{name: "flickrSearch", kind: "enyo.sample.PanelsFlickrSearch", onResults: "searchResults"}
	],
	rendered: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this.search();
		};
	}),
	reflow: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			var backShowing = this.$.backToolbar.showing;
			this.$.backToolbar.setShowing(enyo.Panels.isScreenNarrow());
			if (this.$.backToolbar.showing != backShowing) {
				this.$.pictureView.resize();
			}
		};
	}),
	search: function() {
		this.searchText = this.$.searchInput.getValue();
		this.page = 0;
		this.results = [];
		this.$.searchSpinner.show();
		this.$.flickrSearch.search(this.searchText);
	},
	searchResults: function(inSender, inResults) {
		this.$.searchSpinner.hide();
		this.$.moreSpinner.hide();
		this.results = this.results.concat(inResults);
		this.$.list.setCount(this.results.length);
		if (this.page === 0) {
			this.$.list.reset();
		} else {
			this.$.list.refresh();
		}
	},
	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.results[i];
		this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
		this.$.thumbnail.setSrc(item.thumbnail);
		this.$.title.setContent(item.title || "Untitled");
		this.$.more.canGenerate = !this.results[i+1];
		return true;
	},
	more: function() {
		this.page++;
		this.$.moreSpinner.show();
		this.$.flickrSearch.search(this.searchText, this.page);
	},
	itemTap: function(inSender, inEvent) {
		if (enyo.Panels.isScreenNarrow()) {
			this.setIndex(1);
		}
		this.$.imageSpinner.show();
		var item = this.results[inEvent.index];

		if (item.original == this.$.flickrImage.getSrc()) {
			this.imageLoaded();
		} else {
			this.$.flickrImage.hide();
			this.$.flickrImage.setSrc(item.original);
		}
	},
	imageLoaded: function() {
		var img = this.$.flickrImage;
		img.removeClass("tall");
		img.removeClass("wide");
		img.show();
		var b = img.getBounds();
		var r = b.height / b.width;
		if (r >= 1.25) {
			img.addClass("tall");
		} else if (r <= 0.8 ) {
			img.addClass("wide");
		}
		this.$.imageSpinner.hide();
	},
	showList: function() {
		this.setIndex(0);
	}
});

// A simple component to do a Flickr search.
enyo.kind({
	name: "enyo.sample.PanelsFlickrSearch",
	kind: "Component",
	published: {
		searchText: ""
	},
	events: {
		onResults: ""
	},
	url: "https://api.flickr.com/services/rest/",
	pageSize: 200,
	api_key: "2a21b46e58d207e4888e1ece0cb149a5",
	search: function(inSearchText, inPage) {
		this.searchText = inSearchText || this.searchText;
		var i = (inPage || 0) * this.pageSize;
		var params = {
			method: "flickr.photos.search",
			format: "json",
			api_key: this.api_key,
			per_page: this.pageSize,
			page: i,
			text: this.searchText
		};
		var req;
		if (window.location.protocol === "ms-appx:") {
			params.nojsoncallback = 1;
			// Use ajax for platforms with no jsonp support (Windows 8)
			req = new enyo.Ajax({url: this.url, handleAs: "text"})
				.response(this, "processAjaxResponse")
				.go(params);
		} else {
			req = new enyo.JsonpRequest({url: this.url, callbackName: "jsoncallback"})
				.response(this, "processResponse")
				.go(params);
		}
		return req;
	},
	processAjaxResponse: function(inSender, inResponse) {
		inResponse = enyo.json.parse(inResponse);
		this.processResponse(inSender, inResponse);
	},
	processResponse: function(inSender, inResponse) {
		var photos = inResponse.photos ? inResponse.photos.photo || [] : [];
		for (var i=0, p; (p=photos[i]); i++) {
			var urlprefix = "http://farm" + p.farm + ".static.flickr.com/" + p.server + "/" + p.id + "_" + p.secret;
			p.thumbnail = urlprefix + "_s.jpg";
			p.original = urlprefix + ".jpg";
		}
		this.doResults(photos);
		return photos;
	}
});
