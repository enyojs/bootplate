(function (enyo, scope) {

	/**
	* {@link enyo.ImageViewPin} is a control that can be used to display
	* non-zooming content inside of a zoomable {@link enyo.ImageView} control. The
	* [anchor]{@link enyo.ImageViewPin#anchor} and
	* [position]{@link enyo.ImageViewPin#position} properties may be used to
	* position both the ImageViewPin and its content in a specific location within
	* the ImageView.
	*
	* @ui
	* @class enyo.ImageViewPin
	* @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends enyo.ImageViewPin.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.ImageViewPin',

		/**
		* @private
		*/
		kind: 'enyo.Control',

		/**
		* @lends enyo.ImageViewPin.prototype
		* @private
		*/
		published: {
			/**
			* If `true`, the anchor point for this pin will be highlighted in yellow,
			* which can be useful for debugging. Defaults to `false`.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			highlightAnchorPoint: false,

			/**
			* The coordinates at which this control should be anchored inside
			* of the parent ImageView control. This position is relative to the
			* ImageView control's original size. Works like standard CSS positioning,
			* and accepts both px and percentage values.
			*
			* * `top`: Distance from the parent's top edge.
			* * `bottom`: Distance from the parent's bottom edge (overrides `top`).
			* * `left`: Distance from the parent's left edge.
			* * `right`: Distance from the parent's right edge (overrides `left`).
			*
			* @type {Object}
			* @default {top: 0px, left: 0px}
			* @public
			*/
			anchor: {
				top: 0,
				left: 0
			},

			/**
			* The coordinates at which the contents of this control should be
			* positioned relative to the ImageViewPin itself. Works like standard
			* CSS positioning. Only accepts px values. Defaults to
			* `{top: 0px, left: 0px}`.
			*
			* * `top`: Distance from the ImageViewPin's top edge.
			* * `bottom`: Distance from the ImageViewPin's bottom edge.
			* * `left`: Distance from the ImageViewPin's left edge.
			* * `right`: Distance from the ImageViewPin's right edge.
			*
			* @type {Object}
			* @default {top: 0px, left: 0px}
			* @public
			*/
			position: {
				top: 0,
				left: 0
			}
		},

		/**
		* @private
		*/
		style: 'position:absolute;z-index:1000;width:0px;height:0px;',

		/**
		* @private
		*/
		handlers: {
			onPositionPin: 'reAnchor'
		},

		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.styleClientControls();
				this.positionClientControls();
				this.highlightAnchorPointChanged();
				this.anchorChanged();
			};
		}),

		/**
		* Absolutely positions client controls.
		*
		* @private
		*/
		styleClientControls: function () {
			var controls = this.getClientControls();
			for (var i=0;i<controls.length;i++) {
				controls[i].applyStyle('position','absolute');
			}
		},

		/**
		* Applies specified positioning to client controls.
		*
		* @private
		*/
		positionClientControls: function () {
			var controls = this.getClientControls();
			for (var i=0;i<controls.length;i++) {
				for (var p in this.position) {
					controls[i].applyStyle(p, this.position[p]+'px');
				}
			}
		},

		/**
		* Updates styling of anchor point.
		*
		* @private
		*/
		highlightAnchorPointChanged: function () {
			this.addRemoveClass('pinDebug', this.highlightAnchorPoint);
		},

		/**
		* Creates `coords` object for each anchor, containing value and units.
		*
		* @private
		*/
		anchorChanged: function () {
			var coords = null, a = null;
			for (a in this.anchor) {
				coords = this.anchor[a].toString().match(/^(\d+(?:\.\d+)?)(.*)$/);
				if (!coords) {
					continue;
				}
				this.anchor[a+'Coords'] = {
					value: coords[1],
					units: coords[2] || 'px'
				};
			}
		},

		/*
		* Applies positioning to ImageViewPin specified in `this.anchor`.
		* Called anytime the parent ImageView is rescaled. If `right/bottom`
		* are specified, they override `top/left`.
		*
		* @private
		*/
		reAnchor: function (sender, event) {
			var scale = event.scale;
			var bounds = event.bounds;
			var left = (this.anchor.right)
				// Right
				? (this.anchor.rightCoords.units == 'px')
					? (bounds.width + bounds.x - this.anchor.rightCoords.value*scale)
					: (bounds.width*(100-this.anchor.rightCoords.value)/100 + bounds.x)
				// Left
				: (this.anchor.leftCoords.units == 'px')
					? (this.anchor.leftCoords.value*scale + bounds.x)
					: (bounds.width*this.anchor.leftCoords.value/100 + bounds.x);
			var top = (this.anchor.bottom)
				// Bottom
				? (this.anchor.bottomCoords.units == 'px')
					? (bounds.height + bounds.y - this.anchor.bottomCoords.value*scale)
					: (bounds.height*(100-this.anchor.bottomCoords.value)/100 + bounds.y)
				// Top
				: (this.anchor.topCoords.units == 'px')
					? (this.anchor.topCoords.value*scale + bounds.y)
					: (bounds.height*this.anchor.topCoords.value/100 + bounds.y);
			this.applyStyle('left', left+'px');
			this.applyStyle('top', top+'px');
		}
	});

})(enyo, this);