(function (enyo, scope) {
    /**
    * {@link enyo.ContextualLayout} provides the base positioning logic for a contextual
    * layout strategy. This layout strategy is intended for use with a popup in a
    * decorator/activator scenario, in which the popup is positioned relative to
    * the activator, e.g.:
    *
    * ```
    * {kind: 'onyx.ContextualPopupDecorator', components: [
    *   {content: 'Show Popup'},
    *   {kind: 'onyx.ContextualPopup',
    *       title: 'Sample Popup',
    *       actionButtons: [
    *           {content: 'Button 1', classes: 'onyx-button-warning'},
    *           {content: 'Button 2'}
    *       ],
    *       components: [
    *           {content: 'Sample component in popup'}
    *       ]
    *   }
    * ]}
    * ```
    *
    * The decorator contains the popup and activator, with the activator being the
    * first child component (i.e., the "Show Popup" button). The contextual layout
    * strategy is applied because, in the definition of `onyx.ContextualPopup`,
    * its `layoutKind` property is set to `enyo.ContextualLayout`.
    *
    * Note that a popup using ContextualLayout as its `layoutKind` is expected to
    * declare several specific properties:
    *
    * - `vertFlushMargin` - The vertical flush layout margin, i.e., how close the
    * popup's edge may come to the vertical screen edge (in pixels) before
    * being laid out "flush" style.
    * - `horizFlushMargin` - The horizontal flush layout margin, i.e., how close
    * the popup's edge may come to the horizontal screen edge (in pixels)
    * before being laid out "flush" style.
    * - `widePopup` - A popup wider than this value (in pixels) is considered wide
    * for layout calculation purposes.
    * - `longPopup` - A popup longer than this value (in pixels) is considered long
    * for layout calculation purposes.
    * - `horizBuffer` - Horizontal flush popups are not allowed within this buffer
    * area (in pixels) on the left or right screen edge.
    * - `activatorOffset` - The popup activator's offset on the page (in pixels);
    * this should be calculated whenever the popup is to be shown.
    *
    * @typedef {Object} enyo.ContextualLayout
    *
	* @class enyo.ContextualLayout
	* @extends enyo.Layout
	* @public
	*/

    enyo.kind(
        /** @lends  enyo.ContextualLayout.prototype */ {

        /**
        * @private
        */
        name: 'enyo.ContextualLayout',

        /**
		* @private
		*/
        kind: 'Layout',

        /**
        * Adjusts the popup's position, as well as the nub location and direction.
        *
        * @public
        */
        adjustPosition: function() {
            if (this.container.showing && this.container.hasNode()) {
                /****ContextualPopup positioning rules:
                    1. Activator Location:
                        a. If activator is located in a corner then position using a flush style.
                            i.  Attempt vertical first.
                            ii. Horizontal if vertical doesn't fit.
                        b. If not in a corner then check if the activator is located in one of the 4 "edges" of the view & position the
                            following way if so:
                            i.   Activator is in top edge, position popup below it.
                            ii.  Activator is in bottom edge, position popup above it.
                            iii. Activator is in left edge, position popup to the right of it.
                            iv.  Activator is in right edge, position popup to the left of it.

                    2. Screen Size - the pop-up should generally extend in the direction where there’s room for it.
                        Note: no specific logic below for this rule since it is built into the positioning functions, ie we attempt to never
                        position a popup where there isn't enough room for it.

                    3. Popup Size:
                        i.  If popup content is wide, use top or bottom positioning.
                        ii. If popup content is long, use horizontal positioning.

                    4. Favor top or bottom:
                        If all the above rules have been followed and location can still vary then favor top or bottom positioning.

                    5. If top or bottom will work, favor bottom.
                        Note: no specific logic below for this rule since it is built into the vertical position functions, ie we attempt to
                        use a bottom position for the popup as much possible. Additionally within the vetical position function we center the
                        popup if the activator is at the vertical center of the view.
                ****/
                this.resetPositioning();
                var innerWidth = this.getViewWidth();
                var innerHeight = this.getViewHeight();

                //These are the view "flush boundaries"
                var topFlushPt = this.container.vertFlushMargin;
                var bottomFlushPt = innerHeight - this.container.vertFlushMargin;
                var leftFlushPt = this.container.horizFlushMargin;
                var rightFlushPt = innerWidth - this.container.horizFlushMargin;

                //Rule 1 - Activator Location based positioning
                //if the activator is in the top or bottom edges of the view, check if the popup needs flush positioning
                if ((this.offset.top + this.offset.height) < topFlushPt || this.offset.top > bottomFlushPt) {
                    //check/try vertical flush positioning	(rule 1.a.i)
                    if (this.applyVerticalFlushPositioning(leftFlushPt, rightFlushPt)) {
                        return;
                    }

                    //if vertical doesn't fit then check/try horizontal flush (rule 1.a.ii)
                    if (this.applyHorizontalFlushPositioning(leftFlushPt, rightFlushPt)) {
                        return;
                    }

                    //if flush positioning didn't work then try just positioning vertically (rule 1.b.i & rule 1.b.ii)
                    if (this.applyVerticalPositioning()){
                        return;
                    }
                //otherwise check if the activator is in the left or right edges of the view & if so try horizontal positioning
                } else if ((this.offset.left + this.offset.width) < leftFlushPt || this.offset.left > rightFlushPt) {
                    //if flush positioning didn't work then try just positioning horizontally (rule 1.b.iii & rule 1.b.iv)
                    if (this.applyHorizontalPositioning()){
                        return;
                    }
                }

                //Rule 2 - no specific logic below for this rule since it is inheritent to the positioning functions, ie we attempt to never
                //position a popup where there isn't enough room for it.

                //Rule 3 - Popup Size based positioning
                var clientRect = this.getBoundingRect(this.container.node);

                //if the popup is wide then use vertical positioning
                if (clientRect.width > this.container.widePopup) {
                    if (this.applyVerticalPositioning()){
                        return;
                    }
                }
                //if the popup is long then use horizontal positioning
                else if (clientRect.height > this.container.longPopup) {
                    if (this.applyHorizontalPositioning()){
                        return;
                    }
                }

                //Rule 4 - Favor top or bottom positioning
                if (this.applyVerticalPositioning()) {
                    return;
                }
                //but if thats not possible try horizontal
                else if (this.applyHorizontalPositioning()){
                    return;
                }

                //Rule 5 - no specific logic below for this rule since it is built into the vertical position functions, ie we attempt to
                //         use a bottom position for the popup as much possible.
            }
        },
        //

        /**
        * Determines whether the popup will fit onscreen if moved below or above the activator.
        *
        * @return {Boolean} `true` if popup will fit onscreen; otherwise, `false`.
        * @public
        */
        initVerticalPositioning: function() {
            this.resetPositioning();
            this.container.addClass('vertical');

            var clientRect = this.getBoundingRect(this.container.node);
            var innerHeight = this.getViewHeight();

            if (this.container.floating){
                if (this.offset.top < (innerHeight / 2)) {
                    this.applyPosition({top: this.offset.top + this.offset.height, bottom: 'auto'});
                    this.container.addClass('below');
                } else {
                    this.applyPosition({top: this.offset.top - clientRect.height, bottom: 'auto'});
                    this.container.addClass('above');
                }
            } else {
                //if the popup's bottom goes off the screen then put it on the top of the invoking control
                if ((clientRect.top + clientRect.height > innerHeight) && ((innerHeight - clientRect.bottom) < (clientRect.top - clientRect.height))){
                    this.container.addClass('above');
                } else {
                    this.container.addClass('below');
                }
            }

            //if moving the popup above or below the activator puts it past the edge of the screen then vertical doesn't work
            clientRect = this.getBoundingRect(this.container.node);
            if ((clientRect.top + clientRect.height) > innerHeight || clientRect.top < 0){
                return false;
            }

            return true;
        },

        /**
        * Moves the popup below or above the activating control.
        *
        * @return {Boolean} `false` if popup was not moved because it would not fit onscreen
        * in the new position; otherwise, `true`.
        * @public
        */
        applyVerticalPositioning: function() {
            //if we can't fit the popup above or below the activator then forget vertical positioning
            if (!this.initVerticalPositioning()) {
                return false;
            }

            var clientRect = this.getBoundingRect(this.container.node);
            var innerWidth = this.getViewWidth();

            if (this.container.floating){
                //Get the left edge delta to horizontally center the popup
                var centeredLeft = this.offset.left + this.offset.width/2 - clientRect.width/2;
                if (centeredLeft + clientRect.width > innerWidth) {//popup goes off right edge of the screen if centered
                    this.applyPosition({left: this.offset.left + this.offset.width - clientRect.width});
                    this.container.addClass('left');
                } else if (centeredLeft < 0) {//popup goes off left edge of the screen if centered
                    this.applyPosition({left:this.offset.left});
                    this.container.addClass('right');
                } else {//center the popup
                    this.applyPosition({left: centeredLeft});
                }

            } else {
                //Get the left edge delta to horizontally center the popup
                var centeredLeftDelta = this.offset.left + this.offset.width/2 - clientRect.left - clientRect.width/2;
                if (clientRect.right + centeredLeftDelta > innerWidth) {//popup goes off right edge of the screen if centered
                    this.applyPosition({left: this.offset.left + this.offset.width - clientRect.right});
                    this.container.addRemoveClass('left', true);
                } else if (clientRect.left + centeredLeftDelta < 0) {//popup goes off left edge of the screen if centered
                    this.container.addRemoveClass('right', true);
                } else {//center the popup
                    this.applyPosition({left: centeredLeftDelta});
                }
            }

            return true;
        },

        /**
        * Positions the popup vertically flush with the activating control.
        *
        * @param {Number} leftFlushPt - Left side cutoff.
        * @param {Number} rightFlushPt - Right side cutoff.
        * @return {Boolean} `false` if popup will not fit onscreen in new position;
        * otherwise, `true`.
        * @public
        */
        applyVerticalFlushPositioning: function(leftFlushPt, rightFlushPt) {
            //if we can't fit the popup above or below the activator then forget vertical positioning
            if (!this.initVerticalPositioning()) {
                return false;
            }

            var clientRect = this.getBoundingRect(this.container.node);
            var innerWidth = this.getViewWidth();

            //If the activator's right side is within our left side cut off use flush positioning
            if ((this.offset.left + this.offset.width/2) < leftFlushPt){
                //if the activator's left edge is too close or past the screen left edge
                if (this.offset.left + this.offset.width/2 < this.container.horizBuffer){
                    this.applyPosition({left:this.container.horizBuffer + (this.container.floating ? 0 : -clientRect.left)});
                } else {
                    this.applyPosition({left:this.offset.width/2  + (this.container.floating ? this.offset.left : 0)});
                }

                this.container.addClass('right');
                this.container.addClass('corner');
                return true;
            }
            //If the activator's left side is within our right side cut off use flush positioning
            else if (this.offset.left + this.offset.width/2 > rightFlushPt) {
                if ((this.offset.left+this.offset.width/2) > (innerWidth-this.container.horizBuffer)){
                    this.applyPosition({left:innerWidth - this.container.horizBuffer - clientRect.right});
                } else {
                    this.applyPosition({left: (this.offset.left + this.offset.width/2) - clientRect.right});
                }
                this.container.addClass('left');
                this.container.addClass('corner');
                return true;
            }

            return false;
        },

        /**
        * Determines whether popup will fit onscreen if moved to the left or right of the
        * activator.
        *
        * @return {Boolean} `true` if the popup will fit onscreen; otherwise, `false`.
        * @public
        */
        initHorizontalPositioning: function() {
            this.resetPositioning();

            var clientRect = this.getBoundingRect(this.container.node);
            var innerWidth = this.getViewWidth();

            //adjust horizontal positioning of the popup & nub vertical positioning
            if (this.container.floating){
                if ((this.offset.left + this.offset.width) < innerWidth/2) {
                    this.applyPosition({left: this.offset.left + this.offset.width});
                    this.container.addRemoveClass('left', true);
                } else {
                    this.applyPosition({left: this.offset.left - clientRect.width});
                    this.container.addRemoveClass('right', true);
                }
            } else {
                if (this.offset.left - clientRect.width > 0) {
                    this.applyPosition({left: this.offset.left - clientRect.left - clientRect.width});
                    this.container.addRemoveClass('right', true);
                } else {
                    this.applyPosition({left: this.offset.width});
                    this.container.addRemoveClass('left', true);
                }
            }
            this.container.addRemoveClass('horizontal', true);

            //if moving the popup left or right of the activator puts it past the edge of the screen then horizontal won't work
            clientRect = this.getBoundingRect(this.container.node);
            if (clientRect.left < 0 || (clientRect.left + clientRect.width) > innerWidth){
                return false;
            }
            return true;

        },

        /**
        * Moves the popup to the left or right of the activating control.
        *
        * @return {Boolean} `false` if popup was not moved because it would not fit onscreen
        * in the new position; otherwise, `true`.
        * @public
        */
        applyHorizontalPositioning: function() {
            //if we can't fit the popup left or right of the activator then forget horizontal positioning
            if (!this.initHorizontalPositioning()) {
                return false;
            }

            var clientRect = this.getBoundingRect(this.container.node);
            var innerHeight = this.getViewHeight();
            var activatorCenter = this.offset.top + this.offset.height/2;

            if (this.container.floating){
                //if the activator's center is within 10% of the center of the view, vertically center the popup
                if ((activatorCenter >= (innerHeight/2 - 0.05 * innerHeight)) && (activatorCenter <= (innerHeight/2 + 0.05 * innerHeight))) {
                    this.applyPosition({top: this.offset.top + this.offset.height/2 - clientRect.height/2, bottom: 'auto'});
                } else if (this.offset.top + this.offset.height < innerHeight/2) { //the activator is in the top 1/2 of the screen
                    this.applyPosition({top: this.offset.top, bottom: 'auto'});
                    this.container.addRemoveClass('high', true);
                } else { //otherwise the popup will be positioned in the bottom 1/2 of the screen
                    this.applyPosition({top: this.offset.top - clientRect.height + this.offset.height*2, bottom: 'auto'});
                    this.container.addRemoveClass('low', true);
                }
            } else {
                //if the activator's center is within 10% of the center of the view, vertically center the popup
                if ((activatorCenter >= (innerHeight/2 - 0.05 * innerHeight)) && (activatorCenter <= (innerHeight/2 + 0.05 * innerHeight))) {
                    this.applyPosition({top: (this.offset.height - clientRect.height)/2});
                } else if (this.offset.top + this.offset.height < innerHeight/2) { //the activator is in the top 1/2 of the screen
                    this.applyPosition({top: -this.offset.height});
                    this.container.addRemoveClass('high', true);
                } else { //otherwise the popup will be positioned in the bottom 1/2 of the screen
                    this.applyPosition({top: clientRect.top - clientRect.height - this.offset.top + this.offset.height});
                    this.container.addRemoveClass('low', true);
                }
            }
            return true;
        },


        /**
        * Positions the popup horizontally flush with the activating control.
        *
        * @param {Number} leftFlushPt - Left side cutoff.
        * @param {Number} rightFlushPt - Right side cutoff.
        * @return {Boolean} `false` if popup will not fit onscreen in new position;
        * otherwise, `true`.
        * @public
        */
        applyHorizontalFlushPositioning: function(leftFlushPt, rightFlushPt) {
            //if we can't fit the popup left or right of the activator then forget horizontal positioning
            if (!this.initHorizontalPositioning()) {
                return false;
            }

            var clientRect = this.getBoundingRect(this.container.node);
            var innerHeight = this.getViewHeight();

            //adjust vertical positioning (high or low nub & popup position)
            if (this.container.floating){
                if (this.offset.top < (innerHeight/2)){
                    this.applyPosition({top: this.offset.top + this.offset.height/2});
                    this.container.addRemoveClass('high', true);
                } else {
                    this.applyPosition({top:this.offset.top + this.offset.height/2 - clientRect.height});
                    this.container.addRemoveClass('low', true);
                }
            } else {
                if (((clientRect.top + clientRect.height) > innerHeight) && ((innerHeight - clientRect.bottom) < (clientRect.top - clientRect.height))) {
                    this.applyPosition({top: clientRect.top - clientRect.height - this.offset.top - this.offset.height/2});
                    this.container.addRemoveClass('low', true);
                } else {
                    this.applyPosition({top: this.offset.height/2});
                    this.container.addRemoveClass('high', true);
                }
            }

            //If the activator's right side is within our left side cut off use flush positioning
            if ((this.offset.left + this.offset.width) < leftFlushPt){
                this.container.addClass('left');
                this.container.addClass('corner');
                return true;
            }
            //If the activator's left side is within our right side cut off use flush positioning
            else if (this.offset.left > rightFlushPt) {
                this.container.addClass('right');
                this.container.addClass('corner');
                return true;
            }

            return false;
        },

        /**
        * Retrieves an object with properties describing the bounding rectangle for the
        * passed-in DOM node.
        *
        * @param  {String} inNode - DOM node for which to retrieve the bounding rectangle.
        * @return {Object} Object with properties describing the DOM node's bounding rectangle.
        * @private
        */
        getBoundingRect:  function(inNode){
            // getBoundingClientRect returns top/left values which are relative to the viewport and not absolute
            var o = inNode.getBoundingClientRect();
            if (!o.width || !o.height) {
                return {
                    left: o.left,
                    right: o.right,
                    top: o.top,
                    bottom: o.bottom,
                    width: o.right - o.left,
                    height: o.bottom - o.top
                };
            }
            return o;
        },

        /**
        * @private
        */
        getViewHeight: function() {
            return (window.innerHeight === undefined) ? document.documentElement.clientHeight : window.innerHeight;
        },

        /**
        * @private
        */
        getViewWidth: function() {
            return (window.innerWidth === undefined) ? document.documentElement.clientWidth : window.innerWidth;
        },

        /**
        * @private
        */
        applyPosition: function(inRect) {
            var s = '';
            for (var n in inRect) {
                s += (n + ':' + inRect[n] + (isNaN(inRect[n]) ? '; ' : 'px; '));
            }
            this.container.addStyles(s);
        },

        /**
        * @private
        */
        resetPositioning: function() {
            this.container.removeClass('right');
            this.container.removeClass('left');
            this.container.removeClass('high');
            this.container.removeClass('low');
            this.container.removeClass("corner");
            this.container.removeClass('below');
            this.container.removeClass('above');
            this.container.removeClass('vertical');
            this.container.removeClass('horizontal');

            this.applyPosition({left: 'auto'});
            this.applyPosition({top: 'auto'});
        },

        /**
        * @private
        */
        reflow: function() {
            this.offset = this.container.activatorOffset;
            this.adjustPosition();
        }
    });

})(enyo, this);