(function (enyo, scope) {

	/**
	* Fires whenever the user adjusts the zoom via double-tap/double-click, mousewheel,
	* or pinch-zoom.
	*
	* @event enyo.PanZoomView#onZoom
	* @type {Object}
	* @property {Number} scale - The new scaling factor.
	* @public
	*/

	/**
	* Fires after a zoom to notify children to position non-zooming controls.
	*
	* @event enyo.PanZoomView#onPositionPin
	* @type {Object}
	* @property {Numer} scale   - The new scaling factor.
	* @property {Object} bounds - An object containing the current viewport bounds.
	* @public
	*/

	/**
	* {@link enyo.PanZoomView} is a control that displays arbitrary content at a given
	* scaling factor, with enhanced support for double-tap/double-click to zoom,
	* panning, mousewheel zooming and pinch-zoom (on touchscreen devices that
	* support it).
	*
	* ```
	* {kind: 'PanZoomView', scale: 'auto', contentWidth: 500, contentHeight: 500,
	* 	style: 'width: 500px; height: 400px;',
	* 	components: [{content: 'Hello World'}]
	* }
	* ```
	*
	* An [onZoom]{@link enyo.PanZoomView#onZoom} event is triggered when the
	* user changes the zoom level.
	*
	* If you wish, you may add {@link enyo.ScrollThumb} indicators, disable zoom
	* animation, allow panning overscroll (with a bounce-back effect), and control
	* the propagation of drag events, all via Boolean properties.
	*
	* For the PanZoomView to work, you must either specify the width and height of
	* the scaled content (via the `contentWidth` and `contentHeight` properties) or
	* bubble an `onSetDimensions` event from one of the underlying components.
	*
	* Note that it's best to specify a size for the PanZoomView in order to avoid
	* complications.
	*
	* @ui
	* @class enyo.PanZoomView
	* @extends enyo.Scroller
	* @public
	*/
	enyo.kind(
		/** @lends enyo.PanZoomView.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.PanZoomView',

		/**
		* @private
		*/
		kind: 'enyo.Scroller',

		/**
		* If `true`, allows overscrolling during panning, with a bounce-back effect.
		*
		* @type {Boolean}
		* @default false
		* @see {@link enyo.Scroller.touchOverscroll}
		* @public
		*/
		touchOverscroll: false,

		/**
		* If `true`, a ScrollThumb is used to indicate scroll position/bounds.
		*
		* @type {Boolean}
		* @default false
		* @see {@link enyo.Scroller.thumb}
		* @public
		*/
		thumb: false,

		/**
		* If `true` (the default), animates the zoom action triggered by a double-tap
		* (or double-click).
		*
		* @type {Boolean}
		* @default true
		* @see {@link enyo.Scroller.animate}
		* @public
		*/
		animate: true,

		/**
		* If `true` (the default), allows propagation of vertical drag events when
		* already at the top or bottom of the pannable area.
		*
		* @type {Boolean}
		* @default true
		* @see {@link enyo.Scroller.verticalDragPropagation}
		* @public
		*/
		verticalDragPropagation: true,

		/**
		* If `true` (the default), allows propagation of horizontal drag events when
		* already at the left or right edge of the pannable area.
		*
		* @type {Boolean}
		* @default true
		* @see {@link enyo.Scroller.horizontalDragPropagation}
		* @public
		*/
		horizontalDragPropagation: true,

		/**
		* @lends enyo.PanZoomViews.prototype
		* @public
		*/
		published: {
			/**
			* The scale at which the content should be displayed. This may be any
			* positive numeric value or one of the following key words (which will
			* be resolved to a value dynamically):
			*
			* * `'auto'`: Fits the content to the size of the PanZoomView.
			* * `'width'`: Fits the content to the width of the PanZoomView.
			* * `'height'`: Fits the content to the height of the PanZoomView.
			* * `'fit'`: Fits the content to the height and width of the PanZoomView; the
			* 	overflow of the larger dimension is cropped and the content is centered
			* 	along that axis.
			*
			* @type {String}
			* @default 'auto'
			* @public
			*/
			scale: 'auto',

			/**
			* If `true`, zoom functionality is disabled.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			disableZoom: false,

			/**
			* Width of the scaled content.
			*
			* @type {Number}
			* @default null
			* @private
			*/
			contentWidth: null,

			/**
			* Height of the scaled content.
			*
			* @type {Number}
			* @default null
			* @public
			*/
			contentHeight: null
		},

		/**
		* @private
		*/
		events: {
			onZoom:''
		},

		/**
		* @private
		*/
		touch: true,

		/**
		* @private
		*/
		preventDragPropagation: false,

		/**
		* @private
		*/
		handlers: {
			ondragstart: 'dragPropagation',
			onSetDimensions: 'setDimensions'
		},

		/**
		* @private
		*/
		components: [
			{name: 'animator', kind: 'Animator', onStep: 'zoomAnimationStep', onEnd: 'zoomAnimationEnd'},
			{name:'viewport', style:'overflow:hidden;min-height:100%;min-width:100%;', classes:'enyo-fit', ongesturechange: 'gestureTransform', ongestureend: 'saveState', ontap: 'singleTap', ondblclick:'doubleClick', onmousewheel:'mousewheel', components: [
				{name: 'content'}
			]}
		],

		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function (sup) {
			return function () {
				// remember scale keyword
				this.scaleKeyword = this.scale;

				// Cache instance components
				var instanceComponents = this.components;
				this.components = [];
				sup.apply(this, arguments);
				this.$.content.applyStyle('width', this.contentWidth + 'px');
				this.$.content.applyStyle('height', this.contentHeight + 'px');

				if(this.unscaledComponents){
					var owner = this.hasOwnProperty('unscaledComponents') ? this.getInstanceOwner() : this;
					this.createComponents(this.unscaledComponents, {owner: owner});
				}

				// Change controlParentName so PanZoomView instance components are created into viewport
				this.controlParentName = 'content';
				this.discoverControlParent();
				this.createComponents(instanceComponents);

				this.canTransform = enyo.dom.canTransform();
				if(!this.canTransform) {
					this.$.content.applyStyle('position', 'relative');
				}
				this.canAccelerate = enyo.dom.canAccelerate();

				//	For panzoomview, disable drags during gesture (to fix flicker: ENYO-1208)
				this.getStrategy().setDragDuringGesture(false);
			};
		}),

		/**
		* @method
		* @private
		*/
		rendered: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.getOriginalScale();
			};
		}),

		/**
		* @private
		*/
		dragPropagation: function (sender, event) {
			// Propagate drag events at the edges of the content as desired by the
			// verticalDragPropagation and horizontalDragPropagation properties
			var bounds = this.getStrategy().getScrollBounds();
			var verticalEdge = ((bounds.top===0 && event.dy>0) || (bounds.top>=bounds.maxTop-2 && event.dy<0));
			var horizontalEdge = ((bounds.left===0 && event.dx>0) || (bounds.left>=bounds.maxLeft-2 && event.dx<0));
			return !((verticalEdge && this.verticalDragPropagation) || (horizontalEdge && this.horizontalDragPropagation));
		},

		/**
		* @private
		*/
		mousewheel: function (sender, event) {
			event.pageX |= (event.clientX + event.target.scrollLeft);
			event.pageY |= (event.clientY + event.target.scrollTop);
			var zoomInc = (this.maxScale - this.minScale)/10;
			var oldScale = this.scale;
			if((event.wheelDelta > 0) || (event.detail < 0)) { //zoom in
				this.scale = this.limitScale(this.scale + zoomInc);
			} else if((event.wheelDelta < 0) || (event.detail > 0)) { //zoom out
				this.scale = this.limitScale(this.scale - zoomInc);
			}
			this.eventPt = this.calcEventLocation(event);
			this.transform(this.scale);
			if(oldScale != this.scale) {
				this.doZoom({scale:this.scale});
			}
			this.ratioX = this.ratioY = null;
			// Prevent default scroll wheel action and prevent event from bubbling up to to touch scroller
			event.preventDefault();
			return true;
		},

		/**
		* @method
		* @private
		*/
		handleResize: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.scaleChanged();
			};
		}),

		/**
		* @private
		*/
		setDimensions: function (sender, event) {
			this.$.content.applyStyle('width', event.width + 'px');
			this.$.content.applyStyle('height', event.height + 'px');
			this.originalWidth = event.width;
			this.originalHeight = event.height;
			this.scale = this.scaleKeyword;
			this.scaleChanged();
			return true;
		},

		/**
		* Caches the initial height and width of the component (in `originalHeight`
		* and `originalWidth`, respectively) at render time.
		*
		* @private
		*/
		getOriginalScale : function () {
			if(this.$.content.hasNode()){
				this.originalWidth  = this.$.content.node.clientWidth;
				this.originalHeight = this.$.content.node.clientHeight;
				this.scale = this.scaleKeyword;
				this.scaleChanged();
			}
		},

		/**
		* Calculates the `minScale` and `maxScale` and zooms the content according to the
		* clamped scale value.
		*
		* @private
		*/
		scaleChanged: function () {
			var containerNode = this.hasNode();
			if(containerNode) {
				this.containerWidth = containerNode.clientWidth;
				this.containerHeight = containerNode.clientHeight;
				var widthScale = this.containerWidth / this.originalWidth;
				var heightScale = this.containerHeight / this.originalHeight;
				this.minScale = Math.min(widthScale, heightScale);
				this.maxScale = (this.minScale*3 < 1) ? 1 : this.minScale*3;
				//resolve any keyword scale values to solid numeric values
				if(this.scale == 'auto') {
					this.scale = this.minScale;
				} else if(this.scale == 'width') {
					this.scale = widthScale;
				} else if(this.scale == 'height') {
					this.scale = heightScale;
				} else if(this.scale == 'fit') {
					this.fitAlignment = 'center';
					this.scale = Math.max(widthScale, heightScale);
				} else {
					this.maxScale = Math.max(this.maxScale, this.scale);
					this.scale = this.limitScale(this.scale);
				}
			}
			this.eventPt = this.calcEventLocation();
			this.transform(this.scale);
			// start scroller
			if(this.getStrategy().$.scrollMath) {
				this.getStrategy().$.scrollMath.start();
			}
			this.align();
		},

		/**
		* Centers the content in the scroller.
		*
		* @private
		*/
		align: function () {
			if (this.fitAlignment && this.fitAlignment === 'center') {
				var sb = this.getScrollBounds();
				this.setScrollLeft(sb.maxLeft / 2);
				this.setScrollTop(sb.maxTop / 2);
			}
		},

		/**
		* @private
		*/
		gestureTransform: function (sender, event) {
			this.eventPt = this.calcEventLocation(event);
			this.transform(this.limitScale(this.scale * event.scale));
		},

		/**
		* Determines the target coordinates on the PanZoomView from an event.
		*
		* @private
		*/
		calcEventLocation: function (event) {
			var eventPt = {x: 0, y:0};
			if(event && this.hasNode()) {
				var rect = this.node.getBoundingClientRect();
				eventPt.x = Math.round((event.pageX - rect.left) - this.bounds.x);
				eventPt.x = Math.max(0, Math.min(this.bounds.width, eventPt.x));
				eventPt.y = Math.round((event.pageY - rect.top) - this.bounds.y);
				eventPt.y = Math.max(0, Math.min(this.bounds.height, eventPt.y));
			}
			return eventPt;
		},

		/**
		* Scales the content.
		*
		* @param {Number} scale - The scaling factor.
		* @private
		*/
		transform: function (scale) {
			this.tapped = false;

			var prevBounds = this.bounds || this.innerBounds(scale);
			this.bounds = this.innerBounds(scale);

			//style cursor if needed to indicate the content is movable
			if(this.scale>this.minScale) {
				this.$.viewport.applyStyle('cursor', 'move');
			} else {
				this.$.viewport.applyStyle('cursor', null);
			}
			this.$.viewport.setBounds({width: this.bounds.width + 'px', height: this.bounds.height + 'px'});

			//determine the exact ratio where on the content was tapped
			this.ratioX = this.ratioX || (this.eventPt.x + this.getScrollLeft()) / prevBounds.width;
			this.ratioY = this.ratioY || (this.eventPt.y + this.getScrollTop()) / prevBounds.height;
			var scrollLeft, scrollTop;
			if(this.$.animator.ratioLock) { //locked for smartzoom
				scrollLeft = (this.$.animator.ratioLock.x * this.bounds.width) - (this.containerWidth / 2);
				scrollTop = (this.$.animator.ratioLock.y * this.bounds.height) - (this.containerHeight / 2);
			} else {
				scrollLeft = (this.ratioX * this.bounds.width) - this.eventPt.x;
				scrollTop = (this.ratioY * this.bounds.height) - this.eventPt.y;
			}
			scrollLeft = Math.max(0, Math.min((this.bounds.width - this.containerWidth), scrollLeft));
			scrollTop = Math.max(0, Math.min((this.bounds.height - this.containerHeight), scrollTop));

			if(this.canTransform) {
				var params = {scale: scale};
				// translate needs to be first, or scale and rotation will not be in the correct spot
				if(this.canAccelerate) {
					//translate3d rounded values to avoid distortion; ref: http://martinkool.com/post/27618832225/beware-of-half-pixels-in-css
					params = enyo.mixin({translate3d: Math.round(this.bounds.left) + 'px, ' + Math.round(this.bounds.top) + 'px, 0px'}, params);
				} else {
					params = enyo.mixin({translate: this.bounds.left + 'px, ' + this.bounds.top + 'px'}, params);
				}
				enyo.dom.transform(this.$.content, params);
			} else if (enyo.platform.ie) {
				// IE8 does not support transforms, but filter should work
				// http://www.useragentman.com/IETransformsTranslator/
				var matrix = '"progid:DXImageTransform.Microsoft.Matrix(M11='+scale+', M12=0, M21=0, M22='+scale+', SizingMethod=\'auto expand\')"';
				this.$.content.applyStyle('-ms-filter', matrix);
				this.$.content.setBounds({width: this.bounds.width*scale + 'px', height: this.bounds.height*scale + 'px',
						left:this.bounds.left + 'px', top:this.bounds.top + 'px'});
				this.$.content.applyStyle('width', scale*this.bounds.width);
				this.$.content.applyStyle('height', scale*this.bounds.height);
			} else {
				// ...no transforms and not IE... there's nothin' I can do.
			}

			//adjust scroller to new position that keeps ratio with the new content size
			this.setScrollLeft(scrollLeft);
			this.setScrollTop(scrollTop);

			this.positionClientControls(scale);

			//this.stabilize();
		},

		/**
		* Clamps the scaling factor between `minScale` and `maxScale`.
		*
		* @private
		*/
		limitScale: function (scale) {
			if(this.disableZoom) {
				scale = this.scale;
			} else if(scale > this.maxScale) {
				scale = this.maxScale;
			} else if(scale < this.minScale) {
				scale = this.minScale;
			}
			return scale;
		},

		/**
		* Calculates the offsets for the content for the given scaling factor.
		*
		* @param {Number} scale - The scaling factor.
		* @return {Object}      - Object containing offsets for content (in its `left`, `top`,
		* `width`, `height`, `x`, and `y` properties).
		* @private
		*/
		innerBounds: function (scale) {
			var width = this.originalWidth * scale;
			var height = this.originalHeight * scale;
			var offset = {x:0, y:0, transX:0, transY:0};
			if(width < this.containerWidth) {
				offset.x += (this.containerWidth - width)/2;
			}
			if(height < this.containerHeight) {
				offset.y += (this.containerHeight - height)/2;
			}
			if(this.canTransform) { //adjust for the css translate, which doesn't alter content offsetWidth and offsetHeight
				offset.transX -= (this.originalWidth - width)/2;
				offset.transY -= (this.originalHeight - height)/2;
			}
			return {left:offset.x + offset.transX, top:offset.y + offset.transY, width:width, height:height, x:offset.x, y:offset.y};
		},

		/**
		* Persists the scaling factor when a gesture finishes.
		*
		* @fires enyo.PanZoomView#onZoom
		* @private
		*/
		saveState: function (sender, event) {
			var oldScale = this.scale;
			this.scale *= event.scale;
			this.scale = this.limitScale(this.scale);
			if(oldScale != this.scale) {
				this.doZoom({scale:this.scale});
			}
			this.ratioX = this.ratioY = null;
		},

		/**
		* Normalizes the event and forwards it to
		* [singleTap()]{@link enyo.PanZoomView#singleTap}.
		*
		* IE 8 Only
		*
		* @private
		*/
		doubleClick: function (sender, event) {
			//IE 8 fix; dblclick fires rather than multiple successive click events
			if(enyo.platform.ie==8) {
				this.tapped = true;
				//normalize event
				event.pageX = event.clientX + event.target.scrollLeft;
				event.pageY = event.clientY + event.target.scrollTop;
				this.singleTap(sender, event);
				event.preventDefault();
			}
		},

		/**
		* Simulates double-tap by watching for two taps within 300ms of each other.
		*
		* @private
		*/
		singleTap: function (sender, event) {
			setTimeout(this.bindSafely(function () {
				this.tapped = false;
			}), 300);
			if(this.tapped) { //dbltap
				this.tapped = false;
				this.smartZoom(sender, event);
			} else {
				this.tapped = true;
			}
		},

		/**
		* Zooms at the event location.
		*
		* @private
		*/
		smartZoom: function (sender, event) {
			var containerNode = this.hasNode();
			var imgNode = this.$.content.hasNode();
			if(containerNode && imgNode && this.hasNode() && !this.disableZoom) {
				var prevScale = this.scale;
				if(this.scale != this.minScale) { //zoom out
					this.scale = this.minScale;
				} else { //zoom in
					this.scale = this.maxScale;
				}
				this.eventPt = this.calcEventLocation(event);
				if(this.animate) {
					//lock ratio position of event, and animate the scale change
					var ratioLock = {
						x: ((this.eventPt.x + this.getScrollLeft()) / this.bounds.width),
						y: ((this.eventPt.y + this.getScrollTop()) / this.bounds.height)
					};
					this.$.animator.play({
						duration: 350,
						ratioLock: ratioLock,
						baseScale: prevScale,
						deltaScale: this.scale - prevScale
					});
				} else {
					this.transform(this.scale);
					this.doZoom({scale:this.scale});
				}
			}
		},

		/**
		* @private
		*/
		zoomAnimationStep: function (inSender, inEvent) {
			var currScale = this.$.animator.baseScale + (this.$.animator.deltaScale * this.$.animator.value);
			this.transform(currScale);
			return true;
		},

		/**
		* @private
		*/
		zoomAnimationEnd: function (inSender, inEvent) {
			this.stabilize();
			this.doZoom({scale:this.scale});
			this.$.animator.ratioLock = undefined;
			return true;
		},

		/**
		* @fires enyo.PanZoomView#onPositionPin
		* @private
		*/
		positionClientControls: function (scale) {
			this.waterfallDown('onPositionPin', {
				scale: scale,
				bounds: this.bounds
			});
		}
	});

})(enyo, this);