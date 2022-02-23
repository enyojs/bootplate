(function (enyo, scope) {

	/**
	* Fires at the start of a panel transition, when [setIndex()]{@link enyo.Panels#setIndex}
	* is called, and also during dragging.
	*
	* @event enyo.Panels#onTransitionStart
	* @type {Object}
	* @property {Number} fromIndex - The index of the old panel.
	* @property {Number} toIndex   - The index of the new panel.
	* @public
	*/

	/**
	* Fires at the end of a panel transition, when [setIndex()]{@link enyo.Panels#setIndex}
	* is called, and also during dragging.
	*
	* @event enyo.Panels#onTransitionFinish
	* @type {Object}
	* @property {Number} fromIndex - The index of the old panel.
	* @property {Number} toIndex   - The index of the new panel.
	* @public
	*/

	/**
	* The {@link enyo.Panels} kind is designed to satisfy a variety of common use cases
	* for application layout. Using `enyo.Panels`, controls may be arranged as (among
	* other things) a carousel, a set of collapsing panels, a card stack that fades
	* between panels, or a grid.
	*
	* Any Enyo control may be placed inside an `enyo.Panels`, but by convention we
	* refer to each of these controls as a "panel". From the set of panels in an
	* `enyo.Panels`, one is considered to be active. The active panel is set by index
	* using the [setIndex()]{@link enyo.Panels#setIndex} method. The actual layout of
	* the panels typically changes each time the active panel is set, such that the new
	* active panel has the most prominent position.
	*
	* For more information, see the documentation on
	* [Panels]{@linkplain $dev-guide/building-apps/layout/panels.html} in the
	* Enyo Developer Guide.
	*
	* @ui
	* @class enyo.Panels
	* @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends  enyo.Panels.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.Panels',

		/**
		* @private
		*/
		classes: 'enyo-panels',

		/**
		* @lends enyo.Panels.prototype
		* @private
		*/
		published: {
			/**
			* The index of the active panel. The layout of panels is controlled by the
			* [layoutKind]{@link enyo.Panels#layoutKind}, but as a rule, the active panel
			* is displayed in the most prominent position. For example, in the (default)
			* {@link enyo.CardArranger} layout, the active panel is shown and the other
			* panels are hidden.
			*
			* @type {Number}
			* @default  0
			* @public
			*/
			index: 0,

			/**
			* Indicates whether the user may drag between panels.
			*
			* @type {Boolean}
			* @default  true
			* @public
			*/
			draggable: true,

			/**
			* Indicates whether the panels animate when transitioning, e.g., when
			* [setIndex()]{@link enyo.Panels#setIndex} is called.
			*
			* @type {Boolean}
			* @default  true
			* @public
			*/
			animate: true,

			/**
			* Indicates whether panels "wrap around" when moving past the end.
			* The actual effect depends upon the arranger in use.
			*
			* @type {Boolean}
			* @default  false
			* @public
			*/
			wrap: false,

			/**
			* The arranger kind to be used for dynamic layout.
			*
			* @type {String}
			* @default  'CardArranger'
			* @public
			*/
			arrangerKind: 'CardArranger',

			/**
			* By default, each panel will be sized to fit the Panels' width when the
			* screen size is sufficiently narrow (less than 800px). Set to `false` to
			* avoid this behavior.
			*
			* @type {Boolean}
			* @default  true
			* @public
			*/
			narrowFit: true
		},

		/**
		* @private
		*/
		events: {
			onTransitionStart: '',
			onTransitionFinish: ''
		},

		/**
		* @private
		*/
		handlers: {
			ondragstart: 'dragstart',
			ondrag: 'drag',
			ondragfinish: 'dragfinish',
			onscroll: 'domScroll'
		},

		/**
		* @private
		*/
		tools: [
			{kind: 'Animator', onStep: 'step', onEnd: 'animationEnded'}
		],

		/**
		* Tracks completion percentage for a transition between two panels.
		*
		* @private
		*/
		fraction: 0,

		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function (sup) {
			return function () {
				this.transitionPoints = [];
				sup.apply(this, arguments);
				this.arrangerKindChanged();
				this.narrowFitChanged();
				this.indexChanged();
			};
		}),

		/**
		* @method
		* @private
		*/
		rendered: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				enyo.makeBubble(this, 'scroll');
			};
		}),

		/**
		* @private
		*/
		domScroll: function (sender, event) {
			if (this.hasNode()) {
				if (this.node.scrollLeft > 0) {
					// Reset scrollLeft position
					this.node.scrollLeft = 0;
				}
			}
		},

		/**
		* @method
		* @private
		*/
		initComponents: enyo.inherit(function (sup) {
			return function () {
				this.createChrome(this.tools);
				sup.apply(this, arguments);
			};
		}),

		/**
		* @private
		*/
		arrangerKindChanged: function () {
			this.setLayoutKind(this.arrangerKind);
		},

		/**
		* @private
		*/
		narrowFitChanged: function () {
			this.addRemoveClass(enyo.Panels.getNarrowClass(), this.narrowFit);
		},

		/**
		* @method
		* @private
		*/
		destroy: enyo.inherit(function (sup) {
			return function () {
				// When the entire panels is going away, take note so we don't try and do single-panel
				// remove logic such as changing the index and reflowing when each panel is destroyed
				this.destroying = true;
				sup.apply(this, arguments);
			};
		}),

		/**
		* Adjusts the index if the removed control is the active panel and reflows the layout.
		*
		* @method
		* @private
		*/
		removeControl: enyo.inherit(function (sup) {
			return function (control) {
				// Skip extra work during panel destruction.
				if (this.destroying) {
					return sup.apply(this, arguments);
				}
				// adjust index if the current panel is being removed
				// so it's either the previous panel or the first one.
				var newIndex = -1;
				var controlIndex = enyo.indexOf(control, this.controls);
				if (controlIndex === this.index) {
					newIndex = Math.max(controlIndex - 1, 0);
				}
				sup.apply(this, arguments);
				if (newIndex !== -1 && this.controls.length > 0) {
					this.setIndex(newIndex);
					this.flow();
					this.reflow();
				}
			};
		}),

		/**
		* Designed to be overridden in kinds derived from Panels that have
		* non-panel client controls.
		*
		* @return {Boolean} [description]
		* @protected
		* @todo  Assume that this should take a control as a parameter.
		*/
		isPanel: function () {
			return true;
		},

		/**
		* @method
		* @private
		*/
		flow: enyo.inherit(function (sup) {
			return function () {
				this.arrangements = [];
				sup.apply(this, arguments);
			};
		}),

		/**
		* @method
		* @private
		*/
		reflow: enyo.inherit(function (sup) {
			return function () {
				this.arrangements = [];
				sup.apply(this, arguments);
				this.refresh();
			};
		}),

		/**
		* Returns the array of contained panels. Subclasses may override this if they
		* don't want the arranger to lay out all of their children.
		*
		* @return {enyo.Control[]} - The array of contained panels.
		*/
		getPanels: function () {
			var p = this.controlParent || this;
			return p.children;
		},

		/**
		* Returns a reference to the active panel--i.e., the panel at the specified index.
		*
		* @return {enyo.Control} - The active panel.
		*/
		getActive: function () {
			var p$ = this.getPanels();
			//Constrain the index within the array of panels, needed if wrapping is enabled
			var index = this.index % p$.length;
			if (index < 0) {
				index += p$.length;
			}
			return p$[index];
		},

		/**
		* Returns a reference to the {@link enyo.Animator} instance used to
		* animate panel transitions. The Panels' animator may be used to set the
		* duration of panel transitions, e.g.:
		*
		* ```
		* this.getAnimator().setDuration(1000);
		* ```
		*
		* @return {enyo.Animator} - The {@link enyo.Animator} instance used to animate
		* panel transitions.
		* @public
		*/
		getAnimator: function () {
			return this.$.animator;
		},

		/**
		* Sets the active panel to the panel specified by the given index.
		* Note that if the [animate]{@link enyo.Panels#animate} property is set to
		* `true`, the active panel will animate into view.
		*
		* @param {Number} index - The index of the panel to activate.
		* @public
		*/
		setIndex: function (index) {
			// override setIndex so that indexChanged is called
			// whether this.index has actually changed or not. Also, do
			// index clamping here.
			var prevIndex = this.get('index'),
				newIndex = this.clamp(index);
			this.index = newIndex;
			this.notifyObservers('index', prevIndex, newIndex);
		},

		/**
		* Sets the active panel to the panel specified by the given index.
		* The transition to the next panel will be immediate and will not be animated,
		* regardless of the value of the [animate]{@link enyo.Panels#animate} property.
		*
		* @param {Number} index - The index of the panel to activate.
		* @public
		*/
		setIndexDirect: function (index) {
			if (this.animate) {
				this.animate = false;
				this.setIndex(index);
				this.animate = true;
			} else {
				this.setIndex(index);
			}
		},

		/**
		* Selects the named component owned by the Panels and returns its index.
		*
		* @param  {String} name - The name of the panel to activate.
		* @return {Number} The index of the newly activated panel.
		* @public
		*/
		selectPanelByName: function (name) {
			if (!name) {
				return;
			}
			var idx = 0;
			var panels = this.getPanels();
			var len = panels.length;
			for (; idx < len; ++idx) {
				if (name === panels[idx].name) {
					this.setIndex(idx);
					return idx;
				}
			}
		},

		/**
		* Transitions to the previous panel--i.e., the panel whose index value is one
		* less than that of the current active panel.
		*
		* @public
		*/
		previous: function () {
			var prevIndex = this.index - 1;
			if (this.wrap && prevIndex < 0) {
				prevIndex = this.getPanels().length - 1;
			}
			this.setIndex(prevIndex);
		},

		/**
		* Transitions to the next panel--i.e., the panel whose index value is one
		* greater than that of the current active panel.
		*
		* @public
		*/
		next: function () {
			var nextIndex = this.index+1;
			if (this.wrap && nextIndex >= this.getPanels().length) {
				nextIndex = 0;
			}
			this.setIndex(nextIndex);
		},

		/**
		* Ensures that `value` references a valid panel, accounting for
		* [wrapping]{@link enyo.Panels#wrap}.
		*
		* @param  {Number} value - The index of a panel.
		* @return {Number}       - The valid index of a panel.
		* @private
		*/
		clamp: function (value) {
			var l = this.getPanels().length;
			if (this.wrap) {
				// FIXME: dragging makes assumptions about direction and from->start indexes.
				//return value < 0 ? l : (value > l ? 0 : value);
				value %= l;
				return (value < 0) ? value + l : value;
			} else {
				return Math.max(0, Math.min(value, l - 1));
			}
		},

		/**
		* @private
		*/
		indexChanged: function (old) {
			this.lastIndex = old;
			if (!this.dragging && this.$.animator && this.hasNode()) {
				if (this.shouldAnimate()) {
					// If we're mid-transition, complete it and indicate we need to transition
					if (this.$.animator.isAnimating()) {
						this.transitionOnComplete = true;
						this.$.animator.complete();
					} else {
						this.animateTransition();
					}
				} else {
					this.directTransition();
				}
			}
		},

		/**
		* Returns `true` if the panels should animate in the transition from `fromIndex` to
		* `toIndex`. This can be overridden in a {@glossary subkind} for greater customization.
		*
		* @protected
		*/
		shouldAnimate: function () {
			return this.animate;
		},

		/**
		* @private
		*/
		step: function (sender) {
			this.fraction = sender.value;
			this.stepTransition();
			return true;
		},

		/**
		* @private
		*/
		animationEnded: function (sender, event) {
			this.completed();
		},

		/**
		* @private
		*/
		completed: function () {
			this.finishTransition();

			// Animator.onEnd fires asynchronously so we need an internal flag to indicate we need
			// to start the next transition when the previous completes
			if (this.transitionOnComplete) {
				this.transitionOnComplete = false;
				this.animateTransition();
			}

			return true;
		},

		/**
		* @private
		*/
		dragstart: function (sender, event) {
			if (this.draggable && this.layout && this.layout.canDragEvent(event)) {
				event.preventDefault();
				this.dragstartTransition(event);
				this.dragging = true;
				this.$.animator.stop();
				return true;
			}
		},

		/**
		* @private
		*/
		drag: function (sender, event) {
			if (this.dragging) {
				event.preventDefault();
				this.dragTransition(event);
			}
		},

		/**
		* @private
		*/
		dragfinish: function (sender, event) {
			if (this.dragging) {
				this.dragging = false;
				event.preventTap();
				this.dragfinishTransition(event);
			}
		},

		/**
		* @private
		*/
		dragstartTransition: function (event) {
			if (!this.$.animator.isAnimating()) {
				var f = this.fromIndex = this.index;
				this.toIndex = f - (this.layout ? this.layout.calcDragDirection(event) : 0);
			} else {
				this.verifyDragTransition(event);
			}
			this.fromIndex = this.clamp(this.fromIndex);
			this.toIndex = this.clamp(this.toIndex);
			//this.log(this.fromIndex, this.toIndex);
			this.fireTransitionStart();
			if (this.layout) {
				this.layout.start();
			}
		},

		/**
		* @private
		*/
		dragTransition: function (event) {
			// note: for simplicity we choose to calculate the distance directly between
			// the first and last transition point.
			var d = this.layout ? this.layout.calcDrag(event) : 0;
			var t$ = this.transitionPoints, s = t$[0], f = t$[t$.length-1];
			var as = this.fetchArrangement(s);
			var af = this.fetchArrangement(f);
			var dx = this.layout ? this.layout.drag(d, s, as, f, af) : 0;
			var dragFail = d && !dx;
			if (dragFail) {
				//this.log(dx, s, as, f, af);
			}
			this.fraction += dx;
			var fr = this.fraction;
			if (fr > 1 || fr < 0 || dragFail) {
				if (fr > 0 || dragFail) {
					this.dragfinishTransition(event);
				}
				this.dragstartTransition(event);
				this.fraction = 0;
				// FIXME: account for lost fraction
				//this.dragTransition(event);
			}
			this.stepTransition();
		},

		/**
		* @private
		*/
		dragfinishTransition: function (event) {
			this.verifyDragTransition(event);
			this.setIndex(this.toIndex);
			// note: if we're still dragging, then we're at a transition boundary
			// and should fire the finish event
			if (this.dragging) {
				this.fireTransitionFinish();
			}
		},

		/**
		* @private
		*/
		verifyDragTransition: function (event) {
			var d = this.layout ? this.layout.calcDragDirection(event) : 0;
			var f = Math.min(this.fromIndex, this.toIndex);
			var t = Math.max(this.fromIndex, this.toIndex);
			if (d > 0) {
				var s = f;
				f = t;
				t = s;
			}
			if (f != this.fromIndex) {
				this.fraction = 1 - this.fraction;
			}
			//this.log('old', this.fromIndex, this.toIndex, 'new', f, t);
			this.fromIndex = f;
			this.toIndex = t;
		},

		/**
		* Resets the panels without sending any events.
		*
		* @private
		*/
		refresh: function () {
			if (this.$.animator && this.$.animator.isAnimating()) {
				this.$.animator.stop();
			}
			this.setupTransition();
			this.fraction = 1;
			this.stepTransition();
			this.transitioning = false;
			this.completeTransition();
		},

		/**
		* Transitions to the new index without animation
		*
		* @private
		*/
		directTransition: function () {
			this.startTransition();
			this.fraction = 1;
			this.stepTransition();
			this.finishTransition();
		},

		/**
		* Animates the transition to the new index
		*
		* @private
		*/
		animateTransition: function () {
			this.startTransition();
			this.$.animator.play({
				startValue: this.fraction
			});
		},

		/**
		* Starts the transition between two panels. if a transition is already in progress, this is
		* a no-op.
		*
		* @private
		*/
		startTransition: function () {
			if (!this.transitioning) {
				this.transitioning = true;
				this.setupTransition();
				this.fireTransitionStart();
			}
		},

		/**
		* Sets up transition state
		*
		* @private
		*/
		setupTransition: function () {
			this.fromIndex = this.fromIndex != null ? this.fromIndex : this.lastIndex || 0;
			this.toIndex = this.toIndex != null ? this.toIndex : this.index;
			if (this.layout) {
				this.layout.start();
			}
		},

		/**
		* Completes the transition between two panels.
		*
		* @private
		*/
		finishTransition: function () {
			this.transitioning = false;
			this.completeTransition(true);
		},

		/**
		* Completes the transition by performing any tasks to be run when the transition ends,
		* including firing events and clean-up.
		*
		* @param {Boolean} [fire] - If `true`, will fire the {@link enyo.Panels#onTransitionFinish}
		*	event if deemed necessary.
		* @private
		*/
		completeTransition: function (fire) {
			if (this.layout) {
				this.layout.finish();
			}

			if (fire) {
				this.fireTransitionFinish(true);
			} else {
				this.clearTransitionData();
			}
		},

		/**
		* Clears transition-related data.
		*
		* @private
		*/
		clearTransitionData: function() {
			this.transitionPoints = [];
			this.fraction = 0;
			this.fromIndex = this.toIndex = null;
		},

		/**
		* @fires enyo.Panels#onTransitionStart
		* @private
		*/
		fireTransitionStart: function () {
			var t = this.startTransitionInfo;
			if (this.hasNode() && (!t || (t.fromIndex != this.fromIndex || t.toIndex != this.toIndex))) {
				this.startTransitionInfo = {fromIndex: this.fromIndex, toIndex: this.toIndex};
				this.doTransitionStart(enyo.clone(this.startTransitionInfo));
			}
		},

		/**
		* @fires enyo.Panels#onTransitionFinish
		* @param {Boolean} [clearData] - If `true`, {@link enyo.Panels#clearTransitionData} will be
		*	called after recording the values needed for the callback.
		* @private
		*/
		fireTransitionFinish: function (clearData) {
			var t = this.finishTransitionInfo,
				fromIndex = t ? t.fromIndex : null,
				toIndex = t ? t.toIndex : null;
			if (this.hasNode() && (!t || (fromIndex != this.fromIndex || toIndex != this.toIndex))) {
				if (this.transitionOnComplete) {
					this.finishTransitionInfo = {fromIndex: toIndex, toIndex: this.lastIndex};
				} else {
					this.finishTransitionInfo = {fromIndex: this.lastIndex, toIndex: this.index};
				}
				if (clearData) {
					this.clearTransitionData();
				}
				this.doTransitionFinish(enyo.clone(this.finishTransitionInfo));
			} else if (clearData) {
				this.clearTransitionData();
			}
		},

		/**
		* Interpolates between arrangements as needed.
		*
		* @private
		*/
		stepTransition: function () {
			if (this.hasNode()) {
				// select correct transition points and normalize fraction.
				var t$ = this.transitionPoints;
				var r = (this.fraction || 0) * (t$.length-1);
				var i = Math.floor(r);
				r = r - i;
				var s = t$[i], f = t$[i+1];
				// get arrangements and lerp between them
				var s0 = this.fetchArrangement(s);
				var s1 = this.fetchArrangement(f);
				this.arrangement = s0 && s1 ? enyo.Panels.lerp(s0, s1, r) : (s0 || s1);
				if (this.arrangement && this.layout) {
					this.layout.flowArrangement();
				}
			}
		},

		/**
		* Fetches the arrangement at a specified index, initializing it if necessary.
		*
		* @param  {Number} index - The index of the desired arrangement from `transitionPoints`.
		* @return {Object} The desired arrangement object.
		* @private
		*/
		fetchArrangement: function (index) {
			if ((index != null) && !this.arrangements[index] && this.layout) {
				this.layout._arrange(index);
				this.arrangements[index] = this.readArrangement(this.getPanels());
			}
			return this.arrangements[index];
		},

		/**
		* Iterates over `panels` and retrieves a copy of each panel's `_arranger`.
		*
		* @param  {enyo.Control[]} panels - The array of panels.
		* @return {Object[]}              - The array of arrangement objects.
		*/
		readArrangement: function (panels) {
			var r = [];
			for (var i=0, c$=panels, c; (c=c$[i]); i++) {
				r.push(enyo.clone(c._arranger));
			}
			return r;
		},

		/**
		* @lends  enyo.Panels
		* @private
		*/
		statics: {
			/**
			* Returns `true` for iOS and Android phone form factors, or when window width
			* is 800px or less. Approximates work done using media queries in `Panels.css`.
			*
			* @return {Boolean} `true` for narrow devices or viewports; otherwise, `false`.
			* @public
			*/
			isScreenNarrow: function () {
				if(enyo.Panels.isNarrowDevice()) {
					return true;
				} else {
					return enyo.dom.getWindowWidth() <= 800;
				}
			},

			/**
			* Returns the class name to apply for narrow fitting. See media queries
			* in `Panels.css`.
			*
			* @return {String} The CSS class name to apply.
			*/
			getNarrowClass: function () {
				if(enyo.Panels.isNarrowDevice()) {
					return 'enyo-panels-force-narrow';
				} else {
					return 'enyo-panels-fit-narrow';
				}
			},

			/**
			* Lerps between arrangements.
			*
			* @param  {Object[]} a0     - Array of current arrangement objects.
			* @param  {Object[]} a1     - Array of target arrangement object.
			* @param  {Number} fraction - The fraction (between 0 and 1) with which to lerp.
			* @return {Object[]}        - Array of arrangements that is `fraction` between
			*	`a0` and `a1`.
			* @private
			*/
			lerp: function (a0, a1, fraction) {
				var r = [];
				for (var i=0, k$=enyo.keys(a0), k; (k=k$[i]); i++) {
					r.push(this.lerpObject(a0[k], a1[k], fraction));
				}
				return r;
			},

			/**
			* Lerps between the values of arrangement objects.
			*
			* @param  {Object} a0       - The source arragement.
			* @param  {Object} a1       - The destination arragement.
			* @param  {Number} fraction - The fraction (between 0 and 1) with which to lerp.
			*
			* @return {Object}          - The lerped arrangement.
			* @private
			*/
			lerpObject: function (a0, a1, fraction) {
				var b = enyo.clone(a0), n, o;
				// a1 might be undefined when deleting panels
				if (a1) {
					for (var i in a0) {
						n = a0[i];
						o = a1[i];
						if (n != o) {
							b[i] = n - (n - o) * fraction;
						}
					}
				}
				return b;
			},

			/**
			* Tests User Agent strings to identify narrow devices.
			*
			* @return {Boolean} `true` if the current device is a narrow device;
			* otherwise, `false`.
			*/
			isNarrowDevice: function () {
				var ua = navigator.userAgent;
				switch (enyo.platform.platformName) {
					case 'ios':
						return (/iP(?:hone|od;(?: U;)? CPU) OS (\d+)/).test(ua);
					case 'android':
						return (/Mobile/).test(ua) && (enyo.platform.android > 2);
					case 'androidChrome':
						return (/Mobile/).test(ua);
				}
				return false;
			}
		}
	});

})(enyo, this);
