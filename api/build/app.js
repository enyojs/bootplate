
// minifier: path aliases

enyo.path.addPaths({layout: "/Users/bencombee/git/enyojs/api-tool/enyo/tools/../../lib/layout/"});

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var e = 0, t = this.container.children, n; n = t[e]; e++) if (n.fit && n.showing) return e;
},
getFitControl: function() {
var e = this.container.children, t = e[this.fitIndex];
return t && t.fit && t.showing || (this.fitIndex = this.calcFitIndex(), t = e[this.fitIndex]), t;
},
getLastControl: function() {
var e = this.container.children, t = e.length - 1, n = e[t];
while ((n = e[t]) && !n.showing) t--;
return n;
},
_reflow: function(e, t, n, r) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var i = this.getFitControl();
if (!i) return;
var s = 0, o = 0, u = 0, a, f = this.container.hasNode();
f && (a = enyo.dom.calcPaddingExtents(f), s = f[t] - (a[n] + a[r]));
var l = i.getBounds();
o = l[n] - (a && a[n] || 0);
var c = this.getLastControl();
if (c) {
var h = enyo.dom.getComputedBoxValue(c.hasNode(), "margin", r) || 0;
if (c != i) {
var p = c.getBounds(), d = l[n] + l[e], v = p[n] + p[e] + h;
u = v - d;
} else u = h;
}
var m = s - (o + u);
i.applyStyle(e, m + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
}
}), enyo.kind({
name: "enyo.FittableColumnsLayout",
kind: "FittableLayout",
orient: "h",
layoutClass: "enyo-fittable-columns-layout"
}), enyo.kind({
name: "enyo.FittableRowsLayout",
kind: "FittableLayout",
layoutClass: "enyo-fittable-rows-layout",
orient: "v"
});

// FittableRows.js

enyo.kind({
name: "enyo.FittableRows",
layoutKind: "FittableRowsLayout",
noStretch: !1
});

// FittableColumns.js

enyo.kind({
name: "enyo.FittableColumns",
layoutKind: "FittableColumnsLayout",
noStretch: !1
});

// FlyweightRepeater.js

enyo.kind({
name: "enyo.FlyweightRepeater",
published: {
count: 0,
multiSelect: !1,
toggleSelected: !1,
clientClasses: "",
clientStyle: ""
},
events: {
onSetupItem: ""
},
components: [ {
kind: "Selection",
onSelect: "selectDeselect",
onDeselect: "selectDeselect"
}, {
name: "client"
} ],
rowOffset: 0,
bottomUp: !1,
create: function() {
this.inherited(arguments), this.multiSelectChanged(), this.clientClassesChanged(), this.clientStyleChanged();
},
multiSelectChanged: function() {
this.$.selection.setMulti(this.multiSelect);
},
clientClassesChanged: function() {
this.$.client.setClasses(this.clientClasses);
},
clientStyleChanged: function() {
this.$.client.setStyle(this.clientStyle);
},
setupItem: function(e) {
this.doSetupItem({
index: e,
selected: this.isSelected(e)
});
},
generateChildHtml: function() {
var e = "";
this.index = null;
for (var t = 0, n = 0; t < this.count; t++) n = this.rowOffset + (this.bottomUp ? this.count - t - 1 : t), this.setupItem(n), this.$.client.setAttribute("index", n), e += this.inherited(arguments), this.$.client.teardownRender();
return e;
},
previewDomEvent: function(e) {
var t = this.index = this.rowForEvent(e);
e.rowIndex = e.index = t, e.flyweight = this;
},
decorateEvent: function(e, t, n) {
var r = t && t.index != null ? t.index : this.index;
t && r != null && (t.index = r, t.flyweight = this), this.inherited(arguments);
},
tap: function(e, t) {
this.toggleSelected ? this.$.selection.toggle(t.index) : this.$.selection.select(t.index);
},
selectDeselect: function(e, t) {
this.renderRow(t.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(e) {
return this.getSelection().isSelected(e);
},
renderRow: function(e) {
var t = this.fetchRowNode(e);
t && (this.setupItem(e), t.innerHTML = this.$.client.generateChildHtml(), this.$.client.teardownChildren());
},
fetchRowNode: function(e) {
if (this.hasNode()) {
var t = this.node.querySelectorAll('[index="' + e + '"]');
return t && t[0];
}
},
rowForEvent: function(e) {
var t = e.target, n = this.hasNode().id;
while (t && t.parentNode && t.id != n) {
var r = t.getAttribute && t.getAttribute("index");
if (r !== null) return Number(r);
t = t.parentNode;
}
return -1;
},
prepareRow: function(e) {
var t = this.fetchRowNode(e);
enyo.FlyweightRepeater.claimNode(this.$.client, t);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(e, t, n) {
t && (this.prepareRow(e), enyo.call(n || null, t), this.lockRow());
},
statics: {
claimNode: function(e, t) {
var n = t && t.querySelectorAll("#" + e.id);
n = n && n[0], e.generated = Boolean(n || !e.tag), e.node = n, e.node && e.rendered();
for (var r = 0, i = e.children, s; s = i[r]; r++) this.claimNode(s, t);
}
}
});

// List.js

enyo.kind({
name: "enyo.List",
kind: "Scroller",
classes: "enyo-list",
published: {
count: 0,
rowsPerPage: 50,
bottomUp: !1,
multiSelect: !1,
toggleSelected: !1,
fixedHeight: !1
},
events: {
onSetupItem: ""
},
handlers: {
onAnimateFinish: "animateFinish"
},
rowHeight: 0,
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
} ]
} ],
create: function() {
this.pageHeights = [], this.inherited(arguments), this.getStrategy().translateOptimized = !0, this.bottomUpChanged(), this.multiSelectChanged(), this.toggleSelectedChanged();
},
createStrategy: function() {
this.controlParentName = "strategy", this.inherited(arguments), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
},
rendered: function() {
this.inherited(arguments), this.$.generator.node = this.$.port.hasNode(), this.$.generator.generated = !0, this.reset();
},
resizeHandler: function() {
this.inherited(arguments), this.refresh();
},
bottomUpChanged: function() {
this.$.generator.bottomUp = this.bottomUp, this.$.page0.applyStyle(this.pageBound, null), this.$.page1.applyStyle(this.pageBound, null), this.pageBound = this.bottomUp ? "bottom" : "top", this.hasNode() && this.reset();
},
multiSelectChanged: function() {
this.$.generator.setMultiSelect(this.multiSelect);
},
toggleSelectedChanged: function() {
this.$.generator.setToggleSelected(this.toggleSelected);
},
countChanged: function() {
this.hasNode() && this.updateMetrics();
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.portSize = 0;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
generatePage: function(e, t) {
this.page = e;
var n = this.$.generator.rowOffset = this.rowsPerPage * this.page, r = this.$.generator.count = Math.min(this.count - n, this.rowsPerPage), i = this.$.generator.generateChildHtml();
t.setContent(i);
var s = t.getBounds().height;
!this.rowHeight && s > 0 && (this.rowHeight = Math.floor(s / r), this.updateMetrics());
if (!this.fixedHeight) {
var o = this.getPageHeight(e);
o != s && s > 0 && (this.pageHeights[e] = s, this.portSize += s - o);
}
},
update: function(e) {
var t = !1, n = this.positionToPageInfo(e), r = n.pos + this.scrollerHeight / 2, i = Math.floor(r / Math.max(n.height, this.scrollerHeight) + .5) + n.no, s = i % 2 == 0 ? i : i - 1;
this.p0 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page0), this.positionPage(s, this.$.page0), this.p0 = s, t = !0), s = i % 2 == 0 ? Math.max(1, i - 1) : i, this.p1 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page1), this.positionPage(s, this.$.page1), this.p1 = s, t = !0), t && !this.fixedHeight && (this.adjustBottomPage(), this.adjustPortSize());
},
updateForPosition: function(e) {
this.update(this.calcPos(e));
},
calcPos: function(e) {
return this.bottomUp ? this.portSize - this.scrollerHeight - e : e;
},
adjustBottomPage: function() {
var e = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(e.pageNo, e);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var e = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", e + "px");
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e);
t.applyStyle(this.pageBound, n + "px");
},
pageToPosition: function(e) {
var t = 0, n = e;
while (n > 0) n--, t += this.getPageHeight(n);
return t;
},
positionToPageInfo: function(e) {
var t = -1, n = this.calcPos(e), r = this.defaultPageHeight;
while (n >= 0) t++, r = this.getPageHeight(t), n -= r;
return {
no: t,
height: r,
pos: n + r
};
},
isPageInRange: function(e) {
return e == Math.max(0, Math.min(this.pageCount - 1, e));
},
getPageHeight: function(e) {
return this.pageHeights[e] || this.defaultPageHeight;
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(e, t) {
var n = this.inherited(arguments);
return this.update(this.getScrollTop()), n;
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
setScrollTop: function(e) {
this.update(e), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(e) {
this.setScrollTop(this.calcPos(e));
},
scrollToRow: function(e) {
var t = Math.floor(e / this.rowsPerPage), n = e % this.rowsPerPage, r = this.pageToPosition(t);
this.updateForPosition(r), r = this.pageToPosition(t), this.setScrollPosition(r);
if (t == this.p0 || t == this.p1) {
var i = this.$.generator.fetchRowNode(e);
if (i) {
var s = i.offsetTop;
this.bottomUp && (s = this.getPageHeight(t) - i.offsetHeight - s);
var o = this.getScrollPosition() + s;
this.setScrollPosition(o);
}
}
},
scrollToStart: function() {
this[this.bottomUp ? "scrollToBottom" : "scrollToTop"]();
},
scrollToEnd: function() {
this[this.bottomUp ? "scrollToTop" : "scrollToBottom"]();
},
refresh: function() {
this.invalidatePages(), this.update(this.getScrollTop()), this.stabilize(), enyo.platform.android === 4 && this.twiddle();
},
reset: function() {
this.getSelection().clear(), this.invalidateMetrics(), this.invalidatePages(), this.stabilize(), this.scrollToStart();
},
getSelection: function() {
return this.$.generator.getSelection();
},
select: function(e, t) {
return this.getSelection().select(e, t);
},
isSelected: function(e) {
return this.$.generator.isSelected(e);
},
renderRow: function(e) {
this.$.generator.renderRow(e);
},
prepareRow: function(e) {
this.$.generator.prepareRow(e);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(e, t, n) {
this.$.generator.performOnRow(e, t, n);
},
animateFinish: function(e) {
return this.twiddle(), !0;
},
twiddle: function() {
var e = this.getStrategy();
enyo.call(e, "twiddle");
}
});

// PulldownList.js

enyo.kind({
name: "enyo.PulldownList",
kind: "List",
touch: !0,
pully: null,
pulldownTools: [ {
name: "pulldown",
classes: "enyo-list-pulldown",
components: [ {
name: "puller",
kind: "Puller"
} ]
} ],
events: {
onPullStart: "",
onPullCancel: "",
onPull: "",
onPullRelease: "",
onPullComplete: ""
},
handlers: {
onScrollStart: "scrollStartHandler",
onScrollStop: "scrollStopHandler",
ondragfinish: "dragfinish"
},
pullingMessage: "Pull down to refresh...",
pulledMessage: "Release to refresh...",
loadingMessage: "Loading...",
pullingIconClass: "enyo-puller-arrow enyo-puller-arrow-down",
pulledIconClass: "enyo-puller-arrow enyo-puller-arrow-up",
loadingIconClass: "",
create: function() {
var e = {
kind: "Puller",
showing: !1,
text: this.loadingMessage,
iconClass: this.loadingIconClass,
onCreate: "setPully"
};
this.listTools.splice(0, 0, e), this.inherited(arguments), this.setPulling();
},
initComponents: function() {
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.inherited(arguments);
},
setPully: function(e, t) {
this.pully = t.originator;
},
scrollStartHandler: function() {
this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
},
scroll: function(e, t) {
var n = this.inherited(arguments);
this.completingPull && this.pully.setShowing(!1);
var r = this.getStrategy().$.scrollMath, i = r.y;
return r.isInOverScroll() && i > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + i + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), i > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && i < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel())), n;
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var e = this.getStrategy().$.scrollMath;
e.setScrollY(e.y - this.pullHeight), this.pullRelease();
}
},
completePull: function() {
this.completingPull = !0, this.$.strategy.$.scrollMath.setScrollY(this.pullHeight), this.$.strategy.$.scrollMath.start();
},
pullStart: function() {
this.setPulling(), this.pully.setShowing(!1), this.$.puller.setShowing(!0), this.doPullStart();
},
pull: function() {
this.setPulled(), this.doPull();
},
pullCancel: function() {
this.setPulling(), this.doPullCancel();
},
pullRelease: function() {
this.$.puller.setShowing(!1), this.pully.setShowing(!0), this.doPullRelease();
},
setPulling: function() {
this.$.puller.setText(this.pullingMessage), this.$.puller.setIconClass(this.pullingIconClass);
},
setPulled: function() {
this.$.puller.setText(this.pulledMessage), this.$.puller.setIconClass(this.pulledIconClass);
}
}), enyo.kind({
name: "enyo.Puller",
classes: "enyo-puller",
published: {
text: "",
iconClass: ""
},
events: {
onCreate: ""
},
components: [ {
name: "icon"
}, {
name: "text",
tag: "span",
classes: "enyo-puller-text"
} ],
create: function() {
this.inherited(arguments), this.doCreate(), this.textChanged(), this.iconClassChanged();
},
textChanged: function() {
this.$.text.setContent(this.text);
},
iconClassChanged: function() {
this.$.icon.setClasses(this.iconClass);
}
});

// Slideable.js

enyo.kind({
name: "enyo.Slideable",
kind: "Control",
published: {
axis: "h",
value: 0,
unit: "px",
min: 0,
max: 0,
accelerated: "auto",
overMoving: !0,
draggable: !0
},
events: {
onAnimateFinish: "",
onChange: ""
},
preventDragPropagation: !1,
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
} ],
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
kDragScalar: 1,
dragEventProp: "dx",
unitModifier: !1,
canTransform: !1,
create: function() {
this.inherited(arguments), this.acceleratedChanged(), this.transformChanged(), this.axisChanged(), this.valueChanged(), this.addClass("enyo-slideable");
},
initComponents: function() {
this.createComponents(this.tools), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.canModifyUnit(), this.updateDragScalar();
},
resizeHandler: function() {
this.inherited(arguments), this.updateDragScalar();
},
canModifyUnit: function() {
if (!this.canTransform) {
var e = this.getInitialStyleValue(this.hasNode(), this.boundary);
e.match(/px/i) && this.unit === "%" && (this.unitModifier = this.getBounds()[this.dimension]);
}
},
getInitialStyleValue: function(e, t) {
var n = enyo.dom.getComputedStyle(e);
return n ? n.getPropertyValue(t) : e && e.currentStyle ? e.currentStyle[t] : "0";
},
updateBounds: function(e, t) {
var n = {};
n[this.boundary] = e, this.setBounds(n, this.unit), this.setInlineStyles(e, t);
},
updateDragScalar: function() {
if (this.unit == "%") {
var e = this.getBounds()[this.dimension];
this.kDragScalar = e ? 100 / e : 1, this.canTransform || this.updateBounds(this.value, 100);
}
},
transformChanged: function() {
this.canTransform = enyo.dom.canTransform();
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var e = this.axis == "h";
this.dragMoveProp = e ? "dx" : "dy", this.shouldDragProp = e ? "horizontal" : "vertical", this.transform = e ? "translateX" : "translateY", this.dimension = e ? "width" : "height", this.boundary = e ? "left" : "top";
},
setInlineStyles: function(e, t) {
var n = {};
this.unitModifier ? (n[this.boundary] = this.percentToPixels(e, this.unitModifier), n[this.dimension] = this.unitModifier, this.setBounds(n)) : (t ? n[this.dimension] = t : n[this.boundary] = e, this.setBounds(n, this.unit));
},
valueChanged: function(e) {
var t = this.value;
this.isOob(t) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(t) : this.clampValue(t)), enyo.platform.android > 2 && (this.value ? (e === 0 || e === undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), this.doChange();
},
getAnimator: function() {
return this.$.animator;
},
isAtMin: function() {
return this.value <= this.calcMin();
},
isAtMax: function() {
return this.value >= this.calcMax();
},
calcMin: function() {
return this.min;
},
calcMax: function() {
return this.max;
},
clampValue: function(e) {
var t = this.calcMin(), n = this.calcMax();
return Math.max(t, Math.min(e, n));
},
dampValue: function(e) {
return this.dampBound(this.dampBound(e, this.min, 1), this.max, -1);
},
dampBound: function(e, t, n) {
var r = e;
return r * n < t * n && (r = t + (r - t) / 4), r;
},
percentToPixels: function(e, t) {
return Math.floor(t / 100 * e);
},
pixelsToPercent: function(e) {
var t = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
return e / t * 100;
},
shouldDrag: function(e) {
return this.draggable && e[this.shouldDragProp];
},
isOob: function(e) {
return e > this.calcMax() || e < this.calcMin();
},
dragstart: function(e, t) {
if (this.shouldDrag(t)) return t.preventDefault(), this.$.animator.stop(), t.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(e, t) {
if (this.dragging) {
t.preventDefault();
var n = this.canTransform ? t[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(t[this.dragMoveProp]), r = this.drag0 + n, i = n - this.dragd0;
return this.dragd0 = n, i && (t.dragInfo.minimizing = i < 0), this.setValue(r), this.preventDragPropagation;
}
},
dragfinish: function(e, t) {
if (this.dragging) return this.dragging = !1, this.completeDrag(t), t.preventTap(), this.preventDragPropagation;
},
completeDrag: function(e) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(e.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(e, t) {
this.$.animator.play({
startValue: e,
endValue: t,
node: this.hasNode()
});
},
animateTo: function(e) {
this.play(this.value, e);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(e) {
e ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.doAnimateFinish(e), !0;
},
toggleMinMax: function() {
this.animateToMinMax(!this.isAtMin());
}
});

// Arranger.js

enyo.kind({
name: "enyo.Arranger",
kind: "Layout",
layoutClass: "enyo-arranger",
accelerated: "auto",
dragProp: "ddx",
dragDirectionProp: "xDirection",
canDragProp: "horizontal",
incrementalPoints: !1,
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n._arranger = null;
this.inherited(arguments);
},
arrange: function(e, t) {},
size: function() {},
start: function() {
var e = this.container.fromIndex, t = this.container.toIndex, n = this.container.transitionPoints = [ e ];
if (this.incrementalPoints) {
var r = Math.abs(t - e) - 2, i = e;
while (r >= 0) i += t < e ? -1 : 1, n.push(i), r--;
}
n.push(this.container.toIndex);
},
finish: function() {},
canDragEvent: function(e) {
return e[this.canDragProp];
},
calcDragDirection: function(e) {
return e[this.dragDirectionProp];
},
calcDrag: function(e) {
return e[this.dragProp];
},
drag: function(e, t, n, r, i) {
var s = this.measureArrangementDelta(-e, t, n, r, i);
return s;
},
measureArrangementDelta: function(e, t, n, r, i) {
var s = this.calcArrangementDifference(t, n, r, i), o = s ? e / Math.abs(s) : 0;
return o *= this.container.fromIndex > this.container.toIndex ? -1 : 1, o;
},
calcArrangementDifference: function(e, t, n, r) {},
_arrange: function(e) {
this.containerBounds || this.reflow();
var t = this.getOrderedControls(e);
this.arrange(t, e);
},
arrangeControl: function(e, t) {
e._arranger = enyo.mixin(e._arranger || {}, t);
},
flow: function() {
this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) {
enyo.dom.accelerate(n, this.accelerated);
if (enyo.platform.safari) {
var r = n.children;
for (var i = 0, s; s = r[i]; i++) enyo.dom.accelerate(s, this.accelerated);
}
}
},
reflow: function() {
var e = this.container.hasNode();
this.containerBounds = e ? {
width: e.clientWidth,
height: e.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var e = this.container.arrangement;
if (e) for (var t = 0, n = this.container.getPanels(), r; r = n[t]; t++) this.flowControl(r, e[t]);
},
flowControl: function(e, t) {
enyo.Arranger.positionControl(e, t);
var n = t.opacity;
n != null && enyo.Arranger.opacifyControl(e, n);
},
getOrderedControls: function(e) {
var t = Math.floor(e), n = t - this.controlsIndex, r = n > 0, i = this.c$ || [];
for (var s = 0; s < Math.abs(n); s++) r ? i.push(i.shift()) : i.unshift(i.pop());
return this.controlsIndex = t, i;
},
statics: {
positionControl: function(e, t, n) {
var r = n || "px";
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android) {
var i = t.left, s = t.top, i = enyo.isString(i) ? i : i && i + r, s = enyo.isString(s) ? s : s && s + r;
enyo.dom.transform(e, {
translateX: i || null,
translateY: s || null
});
} else e.setBounds(t, n);
},
opacifyControl: function(e, t) {
var n = t;
n = n > .99 ? 1 : n < .01 ? 0 : n, enyo.platform.ie < 9 ? e.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + n * 100 + ")") : e.applyStyle("opacity", n);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width;
},
arrange: function(e, t) {
for (var n = 0, r, i, s; r = e[n]; n++) s = n == 0 ? 1 : 0, this.arrangeControl(r, {
opacity: s
});
},
start: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.opacifyControl(n, 1), n.showing || n.setShowing(!0);
this.inherited(arguments);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
var i = this.container.fromIndex, t = this.container.toIndex;
this.container.transitionPoints = [ t + "." + i + ".s", t + "." + i + ".f" ];
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
arrange: function(e, t) {
var n = t.split("."), r = n[0], i = n[1], s = n[2] == "s", o = this.containerBounds.width;
for (var u = 0, a = this.container.getPanels(), f, l; f = a[u]; u++) l = o, i == u && (l = s ? 0 : -o), r == u && (l = s ? o : 0), i == u && i == r && (l = 0), this.arrangeControl(f, {
left: l
});
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null
});
this.inherited(arguments);
}
});

// CarouselArranger.js

enyo.kind({
name: "enyo.CarouselArranger",
kind: "Arranger",
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds;
n.height -= t.top + t.bottom, n.width -= t.left + t.right;
var r;
for (var i = 0, s = 0, o, u; u = e[i]; i++) o = enyo.dom.calcMarginExtents(u.hasNode()), u.width = u.getBounds().width, u.marginWidth = o.right + o.left, s += (u.fit ? 0 : u.width) + u.marginWidth, u.fit && (r = u);
if (r) {
var a = n.width - s;
r.width = a >= 0 ? a : r.width;
}
for (var i = 0, f = t.left, o, u; u = e[i]; i++) u.setBounds({
top: t.top,
bottom: t.bottom,
width: u.fit ? u.width : null
});
},
arrange: function(e, t) {
this.container.wrap ? this.arrangeWrap(e, t) : this.arrangeNoWrap(e, t);
},
arrangeNoWrap: function(e, t) {
var n = this.container.getPanels(), r = this.container.clamp(t), i = this.containerBounds.width;
for (var s = r, o = 0, u; u = n[s]; s++) {
o += u.width + u.marginWidth;
if (o > i) break;
}
var a = i - o, f = 0;
if (a > 0) {
var l = r;
for (var s = r - 1, c = 0, u; u = n[s]; s--) {
c += u.width + u.marginWidth;
if (a - c <= 0) {
f = a - c, r = s;
break;
}
}
}
for (var s = 0, h = this.containerPadding.left + f, p, u; u = n[s]; s++) p = u.width + u.marginWidth, s < r ? this.arrangeControl(u, {
left: -p
}) : (this.arrangeControl(u, {
left: Math.floor(h)
}), h += p);
},
arrangeWrap: function(e, t) {
for (var n = 0, r = this.containerPadding.left, i, s; s = e[n]; n++) this.arrangeControl(s, {
left: r
}), r += s.width + s.marginWidth;
},
calcArrangementDifference: function(e, t, n, r) {
var i = Math.abs(e % this.c$.length);
return t[i].left - r[i].left;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// CollapsingArranger.js

enyo.kind({
name: "enyo.CollapsingArranger",
kind: "CarouselArranger",
size: function() {
this.clearLastSize(), this.inherited(arguments);
},
clearLastSize: function() {
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) n._fit && e != t.length - 1 && (n.applyStyle("width", null), n._fit = null);
},
arrange: function(e, t) {
var n = this.container.getPanels();
for (var r = 0, i = this.containerPadding.left, s, o; o = n[r]; r++) this.arrangeControl(o, {
left: i
}), r >= t && (i += o.width + o.marginWidth), r == n.length - 1 && t < 0 && this.arrangeControl(o, {
left: i - t
});
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels().length - 1;
return Math.abs(r[i].left - t[i].left);
},
flowControl: function(e, t) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var n = this.container.getPanels(), r = n.length - 1, i = n[r];
e == i && this.fitControl(e, t.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var e = this.container.getPanels(), t = this.container.arrangement, n = e.length - 1, r = e[n];
this.fitControl(r, t[n].left);
}
},
fitControl: function(e, t) {
e._fit = !0, e.applyStyle("width", this.containerBounds.width - t + "px"), e.resized();
}
});

// OtherArrangers.js

enyo.kind({
name: "enyo.LeftRightArranger",
kind: "Arranger",
margin: 40,
axisSize: "width",
offAxisSize: "height",
axisPosition: "left",
constructor: function() {
this.inherited(arguments), this.margin = this.container.margin != null ? this.container.margin : this.margin;
},
size: function() {
var e = this.container.getPanels(), t = this.containerBounds[this.axisSize], n = t - this.margin - this.margin;
for (var r = 0, i, s; s = e[r]; r++) i = {}, i[this.axisSize] = n, i[this.offAxisSize] = "100%", s.setBounds(i);
},
start: function() {
this.inherited(arguments);
var e = this.container.fromIndex, t = this.container.toIndex, n = this.getOrderedControls(t), r = Math.floor(n.length / 2);
for (var i = 0, s; s = n[i]; i++) e > t ? i == n.length - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1) : i == n.length - 1 - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1);
},
arrange: function(e, t) {
if (this.container.getPanels().length == 1) {
var n = {};
n[this.axisPosition] = this.margin, this.arrangeControl(this.container.getPanels()[0], n);
return;
}
var r = Math.floor(this.container.getPanels().length / 2), i = this.getOrderedControls(Math.floor(t) - r), s = this.containerBounds[this.axisSize] - this.margin - this.margin, o = this.margin - s * r;
for (var u = 0, a, n, f; a = i[u]; u++) n = {}, n[this.axisPosition] = o, this.arrangeControl(a, n), o += s;
},
calcArrangementDifference: function(e, t, n, r) {
if (this.container.getPanels().length == 1) return 0;
var i = Math.abs(e % this.c$.length);
return t[i][this.axisPosition] - r[i][this.axisPosition];
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), enyo.Arranger.opacifyControl(n, 1), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.TopBottomArranger",
kind: "LeftRightArranger",
dragProp: "ddy",
dragDirectionProp: "yDirection",
canDragProp: "vertical",
axisSize: "height",
offAxisSize: "width",
axisPosition: "top"
}), enyo.kind({
name: "enyo.SpiralArranger",
kind: "Arranger",
incrementalPoints: !0,
inc: 20,
size: function() {
var e = this.container.getPanels(), t = this.containerBounds, n = this.controlWidth = t.width / 3, r = this.controlHeight = t.height / 3;
for (var i = 0, s; s = e[i]; i++) s.setBounds({
width: n,
height: r
});
},
arrange: function(e, t) {
var n = this.inc;
for (var r = 0, i = e.length, s; s = e[r]; r++) {
var o = Math.cos(r / i * 2 * Math.PI) * r * n + this.controlWidth, u = Math.sin(r / i * 2 * Math.PI) * r * n + this.controlHeight;
this.arrangeControl(s, {
left: o,
top: u
});
}
},
start: function() {
this.inherited(arguments);
var e = this.getOrderedControls(this.container.toIndex);
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", e.length - t);
},
calcArrangementDifference: function(e, t, n, r) {
return this.controlWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", null), enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var e = this.container.getPanels(), t = this.colWidth, n = this.colHeight;
for (var r = 0, i; i = e[r]; r++) i.setBounds({
width: t,
height: n
});
},
arrange: function(e, t) {
var n = this.colWidth, r = this.colHeight, i = Math.max(1, Math.floor(this.containerBounds.width / n)), s;
for (var o = 0, u = 0; u < e.length; o++) for (var a = 0; a < i && (s = e[u]); a++, u++) this.arrangeControl(s, {
left: n * a,
top: r * o
});
},
flowControl: function(e, t) {
this.inherited(arguments), enyo.Arranger.opacifyControl(e, t.top % this.colHeight !== 0 ? .25 : 1);
},
calcArrangementDifference: function(e, t, n, r) {
return this.colWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// Panels.js

enyo.kind({
name: "enyo.Panels",
classes: "enyo-panels",
published: {
index: 0,
draggable: !0,
animate: !0,
wrap: !1,
arrangerKind: "CardArranger",
narrowFit: !0
},
events: {
onTransitionStart: "",
onTransitionFinish: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
tools: [ {
kind: "Animator",
onStep: "step",
onEnd: "completed"
} ],
fraction: 0,
create: function() {
this.transitionPoints = [], this.inherited(arguments), this.arrangerKindChanged(), this.narrowFitChanged(), this.indexChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
arrangerKindChanged: function() {
this.setLayoutKind(this.arrangerKind);
},
narrowFitChanged: function() {
this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit);
},
removeControl: function(e) {
this.inherited(arguments), this.controls.length > 1 && this.isPanel(e) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
},
isPanel: function() {
return !0;
},
flow: function() {
this.arrangements = [], this.inherited(arguments);
},
reflow: function() {
this.arrangements = [], this.inherited(arguments), this.refresh();
},
getPanels: function() {
var e = this.controlParent || this;
return e.children;
},
getActive: function() {
var e = this.getPanels();
return e[this.index];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(e) {
this.setPropertyValue("index", e, "indexChanged");
},
setIndexDirect: function(e) {
this.setIndex(e), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(e) {
var t = this.getPanels().length - 1;
return this.wrap ? e : Math.max(0, Math.min(e, t));
},
indexChanged: function(e) {
this.lastIndex = e, this.index = this.clamp(this.index), this.dragging || (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(e) {
this.fraction = e.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(e, t) {
if (this.draggable && this.layout && this.layout.canDragEvent(t)) return t.preventDefault(), this.dragstartTransition(t), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(e, t) {
this.dragging && (t.preventDefault(), this.dragTransition(t));
},
dragfinish: function(e, t) {
this.dragging && (this.dragging = !1, t.preventTap(), this.dragfinishTransition(t));
},
dragstartTransition: function(e) {
if (!this.$.animator.isAnimating()) {
var t = this.fromIndex = this.index;
this.toIndex = t - (this.layout ? this.layout.calcDragDirection(e) : 0);
} else this.verifyDragTransition(e);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(e) {
var t = this.layout ? this.layout.calcDrag(e) : 0, n = this.transitionPoints, r = n[0], i = n[n.length - 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i), u = this.layout ? this.layout.drag(t, r, s, i, o) : 0, a = t && !u;
a, this.fraction += u;
var f = this.fraction;
if (f > 1 || f < 0 || a) (f > 0 || a) && this.dragfinishTransition(e), this.dragstartTransition(e), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(e) {
this.verifyDragTransition(e), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(e) {
var t = this.layout ? this.layout.calcDragDirection(e) : 0, n = Math.min(this.fromIndex, this.toIndex), r = Math.max(this.fromIndex, this.toIndex);
if (t > 0) {
var i = n;
n = r, r = i;
}
n != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = n, this.toIndex = r;
},
refresh: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
startTransition: function() {
this.fromIndex = this.fromIndex != null ? this.fromIndex : this.lastIndex || 0, this.toIndex = this.toIndex != null ? this.toIndex : this.index, this.layout && this.layout.start(), this.fireTransitionStart();
},
finishTransition: function() {
this.layout && this.layout.finish(), this.transitionPoints = [], this.fraction = 0, this.fromIndex = this.toIndex = null, this.fireTransitionFinish();
},
fireTransitionStart: function() {
var e = this.startTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.fromIndex || e.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var e = this.finishTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.lastIndex || e.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo))), this.lastIndex = this.index;
},
stepTransition: function() {
if (this.hasNode()) {
var e = this.transitionPoints, t = (this.fraction || 0) * (e.length - 1), n = Math.floor(t);
t -= n;
var r = e[n], i = e[n + 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i);
this.arrangement = s && o ? enyo.Panels.lerp(s, o, t) : s || o, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(e) {
return e != null && !this.arrangements[e] && this.layout && (this.layout._arrange(e), this.arrangements[e] = this.readArrangement(this.getPanels())), this.arrangements[e];
},
readArrangement: function(e) {
var t = [];
for (var n = 0, r = e, i; i = r[n]; n++) t.push(enyo.clone(i._arranger));
return t;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(e, t, n) {
var r = [];
for (var i = 0, s = enyo.keys(e), o; o = s[i]; i++) r.push(this.lerpObject(e[o], t[o], n));
return r;
},
lerpObject: function(e, t, n) {
var r = enyo.clone(e), i, s;
if (t) for (var o in e) i = e[o], s = t[o], i != s && (r[o] = i - (i - s) * n);
return r;
}
}
});

// Node.js

enyo.kind({
name: "enyo.Node",
published: {
expandable: !1,
expanded: !1,
icon: "",
onlyIconExpands: !1,
selected: !1
},
style: "padding: 0 0 0 16px;",
content: "Node",
defaultKind: "Node",
classes: "enyo-node",
components: [ {
name: "icon",
kind: "Image",
showing: !1
}, {
kind: "Control",
name: "caption",
Xtag: "span",
style: "display: inline-block; padding: 4px;",
allowHtml: !0
}, {
kind: "Control",
name: "extra",
tag: "span",
allowHtml: !0
} ],
childClient: [ {
kind: "Control",
name: "box",
classes: "enyo-node-box",
Xstyle: "border: 1px solid orange;",
components: [ {
kind: "Control",
name: "client",
classes: "enyo-node-client",
Xstyle: "border: 1px solid lightblue;"
} ]
} ],
handlers: {
ondblclick: "dblclick"
},
events: {
onNodeTap: "nodeTap",
onNodeDblClick: "nodeDblClick",
onExpand: "nodeExpand",
onDestroyed: "nodeDestroyed"
},
create: function() {
this.inherited(arguments), this.selectedChanged(), this.iconChanged();
},
destroy: function() {
this.doDestroyed(), this.inherited(arguments);
},
initComponents: function() {
this.expandable && (this.kindComponents = this.kindComponents.concat(this.childClient)), this.inherited(arguments);
},
contentChanged: function() {
this.$.caption.setContent(this.content);
},
iconChanged: function() {
this.$.icon.setSrc(this.icon), this.$.icon.setShowing(Boolean(this.icon));
},
selectedChanged: function() {
this.addRemoveClass("enyo-selected", this.selected);
},
rendered: function() {
this.inherited(arguments), this.expandable && !this.expanded && this.quickCollapse();
},
addNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent(n);
this.$.client.render();
},
addTextNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent({
content: n
});
this.$.client.render();
},
tap: function(e, t) {
return this.onlyIconExpands ? t.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(e, t) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var e = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -e
});
},
_expand: function() {
this.addClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -e
});
}), 25);
},
expandedChanged: function(e) {
if (!this.expandable) this.expanded = !1; else {
var t = {
expanded: this.expanded
};
this.doExpand(t), t.wait || this.effectExpanded();
}
},
effectExpanded: function() {
this.$.client && (this.expanded ? this._expand() : this._collapse());
}
});

// runtime-machine.js

runtimeMachine = {
_head: function(e, t, n) {
this._inflight = !0;
var r = document.createElement(e);
for (var i in t) r.setAttribute(i, t[i]);
return n && (r.innerText = n), this._headElt || (this._headElt = document.getElementsByTagName("head")[0]), this._headElt.appendChild(r), r;
},
sheet: function(e) {
this._head("link", {
type: "text/css",
media: "screen",
rel: "stylesheet",
href: e
});
},
inject: function(e) {
this._head("script", {
type: "text/javascript"
}, e);
},
_scripts: [],
script: function(e) {
this._inflight ? this._scripts.push(e) : this._script(e);
},
_require: function(e) {},
_script: function(e) {
this._inflight = !0;
var t = this._head("script", {
type: "text/javascript",
src: e
}), n = this;
enyo.platform.ie && enyo.platform.ie <= 8 ? t.onreadystatechange = function() {
if (t.readyState === "complete" || t.readyState === "loaded") t.onreadystatechange = "", n._loaded(e);
} : (t.onload = function() {
n._loaded(e);
}, t.onerror = function() {
n._error(e);
});
},
_continue: function() {
this._inflight = !1;
var e = this._scripts.pop();
e && this._script(e);
},
_loaded: function(e) {
this._continue();
},
_error: function(e) {
this._continue();
}
};

// Walker.js

enyo.kind({
name: "Walker",
kind: enyo.Component,
published: {
verbose: !1
},
events: {
onProgress: "",
onFinish: ""
},
walk: function(e) {
this.loader = new enyo.loaderFactory(runtimeMachine), this.loader.loadScript = function() {}, this.loader.loadSheet = function() {}, this.loader.verbose = this.verbose, this.loader.report = enyo.bind(this, "walkReport"), this.loader.finish = enyo.bind(this, "walkFinish"), enyo.loader = this.loader;
var t = enyo.path.rewrite(e);
return enyo.asyncMethod(enyo.loader, "load", t), this.async = new enyo.Async;
},
walkReport: function(e, t) {
this.doProgress({
action: e,
name: t
});
},
walkFinish: function() {
this.modules = this.loader.modules, this.async.respond({
modules: this.modules
}), this.doFinish({
modules: this.modules
});
}
});

// Reader.js

enyo.kind({
name: "Reader",
kind: enyo.Async,
go: function(e) {
return this.modules = e.modules, this.moduleIndex = 0, enyo.asyncMethod(this, "nextModule"), this;
},
nextModule: function() {
var e = this.modules[this.moduleIndex++];
e ? this.loadModule(e) : this.modulesFinished();
},
loadModule: function(e) {
enyo.xhr.request({
url: e.path,
callback: enyo.bind(this, "moduleLoaded", e)
});
},
moduleLoaded: function(e, t) {
this.addModule(e, t), this.nextModule();
},
addModule: function(e, t) {
t && t.length && (e.code = t);
},
modulesFinished: function() {
this.respond({
modules: this.modules
});
}
});

// Iterator.js

enyo.kind({
name: "Iterator",
kind: null,
i: -1,
nodes: null,
constructor: function(e) {
this.stream = e;
},
next: function() {
return this.i++, this._read();
},
prev: function() {
return this.i--, this._read();
},
_read: function(e) {
return this.past = this.stream[this.i - 1], this.value = this.stream[this.i], this.future = this.stream[this.i + 1], this.value;
}
});

// Lexer.js

enyo.kind({
name: "AbstractLexer",
kind: null,
constructor: function(e) {
if (e) return this.start(e), this.finish(), this.r;
},
p0: 0,
p: 0,
start: function(e) {
this.s = e, this.l = this.s.length, this.r = [], this.d = "", this.p0 = 0, this.p = 0, this.n = 0, this.analyze();
},
search: function(e) {
var t = e.global ? e : new RegExp(e.source, "g");
return t.lastIndex = this.p, this.m = t.exec(this.s), this.p = this.m ? this.m.index : -1, t.lastIndex != this.p0 && (this.d = this.s.charAt(this.p));
},
lookahead: function(e) {
return this.s.charAt(this.p + e);
},
getToken: function() {
return this.s.slice(this.p0, this.p);
},
tokenize: function(e) {
this.p += e || 0;
},
pushToken: function(e, t, n) {
this.tokenize(t);
var r = this.getToken();
if (!r && !n) return {};
var i = (r.match(/\n/g) || []).length, s = {
kind: e,
token: r,
start: this.p0,
end: this.p,
line: this.n,
height: i
};
return this.r.push(s), this.n += i, this.p0 = this.p, s;
},
tossToken: function(e) {
this.tokenize(e), this.p0 = this.p;
},
finish: function() {
this.pushToken("gah");
}
}), enyo.kind({
name: "Lexer",
kind: AbstractLexer,
symbols: "(){}[];,:<>+-=*/&",
operators: [ "++", "--", "+=", "-=", "==", "!=", "<=", ">=", "===", "&&", "||", '"', "'" ],
keywords: [ "function", "new", "return", "if", "else", "while", "do", "break", "continue", "switch", "case", "var" ],
constructor: function(e) {
return this.buildPattern(), this.inherited(arguments);
},
buildPattern: function() {
var e = '"(?:\\\\"|[^"])*?"', t = "'(?:\\\\'|[^'])*?'", n = e + "|" + t, r = "\\b(?:" + this.keywords.join("|") + ")\\b", i = "[\\" + this.symbols.split("").join("\\") + "]", s = [];
for (var o = 0, u; u = this.operators[o]; o++) s.push("\\" + u.split("").join("\\"));
s = s.join("|"), i = s + "|" + i;
var a = [ '\\\\"|\\\\/', n, r, "\\/\\/", "\\/\\*", i, "\\s" ];
this.matchers = [ "doSymbol", "doString", "doKeyword", "doLineComment", "doCComment", "doSymbol", "doWhitespace" ], this.pattern = "(" + a.join(")|(") + ")";
},
analyze: function() {
var e = new RegExp(this.pattern, "gi");
while (this.search(e)) this.pushToken("identifier"), this.process(this.matchers), this.pushToken("identifier");
},
process: function(e) {
for (var t = 0, n; n = e[t]; t++) if (this.m[t + 1] && this[n]) {
this[n].apply(this);
return;
}
this.doSymbol();
},
doWhitespace: function() {
this.tokenize(1), this.search(/\S/g), this.pushToken("ws"), this.r.pop();
},
doEscape: function() {
this.tokenize(2);
},
doLiteral: function() {
this.tossToken(1);
var e = this.d, t = new RegExp("\\" + e + "|\\\\", "g");
while (this.search(t)) switch (this.d) {
case "\\":
this.doEscape();
break;
default:
this.pushToken("literal", 0, !0).delimiter = e, this.tossToken(1);
return;
}
},
doSymbol: function() {
this.pushToken(this.d == ";" || this.d == "," ? "terminal" : "symbol", this.m[0].length);
},
doKeyword: function() {
this.pushToken("keyword", this.m[0].length);
},
doLineComment: function() {
this.tokenize(2), this.search(/[\r\n]/g) && this.tokenize(0), this.pushToken("comment");
},
doCComment: function() {
this.tokenize(2);
var e = 1;
while (e && this.search(/\/\*|\*\//g)) e += this.d == "/" ? 1 : this.d == "*" ? -1 : 0, this.tokenize(2);
this.pushToken("comment");
},
doString: function() {
this.pushToken("string", this.m[0].length);
}
});

// Parser.js

enyo.kind({
name: "Parser",
kind: null,
constructor: function(e) {
return this.parse(e);
},
parse: function(e) {
var t = [], n = new Iterator(e);
while (n.next()) n.value.kind !== "ws" && t.push(n.value);
var n = new Iterator(t);
return this.walk(n);
},
combine: function(e) {
var t = "";
for (var n = 0, r; r = e[n]; n++) t += r.token;
return t;
},
walk: function(e, t) {
var n = [], r;
try {
while (e.next()) {
r = e.value;
if (r.kind == "ws") continue;
if (r.kind == "comment") r.kind = "comment"; else if (t == "array") {
if (r.kind == "terminal") continue;
e.prev(), r = {
kind: "element",
token: "expr",
children: this.walk(e, "expression")
};
if (e.value && e.value.token == "]") return r.children.length && n.push(r), n;
} else if (r.token == "[") r.kind = "array", r.children = this.walk(e, r.kind), e.value ? r.end = e.value.end : console.log("No end token for array?"); else {
if (t == "expression" && r.token == "]") return n;
if (r.token == "var") r.kind = "var", r.children = this.walk(e, "expression"); else {
if (r.kind == "terminal" && (t == "expression" || t == "var")) return n;
if (r.kind == "terminal") continue;
if (r.token == "{") {
r.kind = "block", r.children = this.walk(e, r.kind), e.value ? r.end = e.value.end : console.log("No end token for block?");
if (t == "expression" || t == "function") return n.push(r), n;
} else {
if (t == "expression" && (r.token == "}" || r.token == ")")) return e.prev(), n;
if (t == "block" && r.token == "}") return n;
if (r.token == "=" || r.token == ":" && t != "expression") {
var i = n.pop();
i.kind == "identifier" ? (i.op = r.token, i.kind = "assignment", i.children = this.walk(e, "expression"), e.value && e.value.kind == "terminal" && e.prev(), r = i) : n.push(i);
} else if (r.token == "(") r.kind = "association", r.children = this.walk(e, r.kind); else {
if (t == "association" && r.token == ")") return n;
if (r.token == "function") {
r.kind = "function", r.children = this.walk(e, r.kind);
if (t !== "expression" && r.children && r.children.length && r.children[0].kind == "identifier") {
r.name = r.children[0].token, r.children.shift();
var s = {
kind: "assignment",
token: r.name,
children: [ r ]
};
r = s;
}
if (t == "expression" || t == "function") return n.push(r), n;
}
}
}
}
}
n.push(r);
}
} catch (o) {
console.error(o);
}
return n;
}
});

// Documentor.js

enyo.kind({
name: "Documentor",
kind: null,
group: "public",
constructor: function(e) {
return this.comment = [], this.parse(e);
},
parse: function(e) {
var t = new Iterator(e);
return this.walk(t);
},
walk: function(e, t) {
var n = [], r, i;
while (e.next()) {
r = e.value;
if (r.kind == "comment") this.cook_comment(r.token); else if (r.token == "enyo.kind" && e.future.kind == "association") i = this.cook_kind(e); else if (r.kind == "assignment") i = this.cook_assignment(e); else if (r.kind == "association" && r.children && r.children.length == 1 && r.children[0].kind == "function") {
var s = r.children[0];
if (s.children && s.children.length == 2) {
var o = s.children[1], u = this.walk(new Iterator(o.children));
n = n.concat(u);
}
e.next();
}
i && (n.push(i), i = null);
}
return n;
},
cook_kind: function(e) {
var t = function(e, t) {
var n = Documentor.indexByName(e, t), r;
return n >= 0 && (r = e[n], e.splice(r, 1)), r && r.value && r.value.length && r.value[0].token;
}, n = this.make("kind", e.value);
e.next();
var r = e.value.children;
return r && r[0] && r[0].kind == "block" && (n.properties = this.cook_block(r[0].children), n.name = Documentor.stripQuotes(t(n.properties, "name") || ""), n.superkind = Documentor.stripQuotes(t(n.properties, "kind") || "enyo.Control"), n.superkind == "null" && (n.superkind = null)), n;
},
cook_block: function(e) {
var t = [];
for (var n = 0, r; r = e[n]; n++) if (r.kind == "comment") this.cook_comment(r.token); else if (r.kind == "assignment") {
var i = this.make("property", r);
r.children && (i.value = [ this.walkValue(new Iterator(r.children)) ]), t.push(i);
}
return t;
},
walkValue: function(e, t) {
while (e.next()) {
var n = e.value, r;
if (n.kind != "comment") {
if (n.kind == "block") return r = this.make("block", n), r.properties = this.cook_block(n.children), r;
if (n.kind == "array") return this.cook_array(e);
if (n.kind == "function") return this.cook_function(e);
r = this.make("expression", n);
var i = n.token;
while (e.next()) i += e.value.token;
return r.token = i, r;
}
this.cook_comment(n.token);
}
},
cook_function: function(e) {
var t = e.value, n = this.make("expression", t);
return n.arguments = enyo.map(t.children[0].children, function(e) {
return e.token;
}), n;
},
cook_array: function(e) {
var t = e.value, n = this.make("array", t), r = t.children;
if (r) {
var i = [];
for (var s = 0, o, u; o = r[s]; s++) o.children && (u = this.walkValue(new Iterator(o.children)), u && i.push(u));
n.properties = i;
}
return n;
},
cook_assignment: function(e) {
var t = e.value, n = this.make("global", t);
return t.children && (t.children[0] && t.children[0].token == "function" && (n.type = "function"), n.value = [ this.walkValue(new Iterator(t.children)) ]), n;
},
make: function(e, t) {
return {
line: t.line,
start: t.start,
end: t.end,
height: t.height,
token: t.token,
name: t.token,
type: e,
group: this.group,
comment: this.consumeComment()
};
},
commentRx: /\/\*\*([\s\S]*)\*\/|\/\/\*(.*)/m,
cook_comment: function(e) {
var t = e.match(this.commentRx);
if (t) {
t = t[1] ? t[1] : t[2];
var n = this.extractPragmas(t);
this.honorPragmas(n);
}
},
extractPragmas: function(e) {
var t = /^[*\s]*@[\S\s]*/g, n = [], r = e;
return r.length && (r = e.replace(t, function(e) {
var t = e.slice(2);
return n.push(t), "";
}), r.length && this.comment.push(r)), n;
},
honorPragmas: function(e) {
var t = {
"protected": 1,
"public": 1
};
for (var n = 0, r; r = e[n]; n++) t[r] && (this.group = r);
},
consumeComment: function() {
var e = this.comment.join(" ");
this.comment = [];
var t = Documentor.removeIndent(e);
return t;
},
statics: {
indexByProperty: function(e, t, n) {
for (var r = 0, i; i = e[r]; r++) if (i[t] == n) return r;
return -1;
},
findByProperty: function(e, t, n) {
return e[this.indexByProperty(e, t, n)];
},
indexByName: function(e, t) {
return this.indexByProperty(e, "name", t);
},
findByName: function(e, t) {
return e[this.indexByName(e, t)];
},
stripQuotes: function(e) {
var t = e.charAt(0), n = t == '"' || t == "'" ? 1 : 0, r = e.charAt(e.length - 1), i = r == '"' || r == "'" ? -1 : 0;
return n || i ? e.slice(n, i) : e;
},
removeIndent: function(e) {
var t = 0, n = e.split(/\r?\n/), r, i;
for (r = 0; (i = n[r]) != null; r++) if (i.length > 0) {
t = i.search(/\S/), t < 0 && (t = i.length);
break;
}
if (t) for (r = 0; (i = n[r]) != null; r++) n[r] = i.slice(t);
return n.join("\n");
}
}
});

// Indexer.js

enyo.kind({
name: "Indexer",
kind: null,
group: "public",
constructor: function() {
this.objects = [];
},
findByName: function(e) {
return Documentor.findByProperty(this.objects, "name", e);
},
findByTopic: function(e) {
return Documentor.findByProperty(this.objects, "topic", e);
},
addModules: function(e) {
enyo.forEach(e, this.addModule, this), this.objects.sort(Indexer.nameCompare);
},
addModule: function(e) {
this.indexModule(e), this.mergeModule(e);
},
mergeModule: function(e) {
this.objects.push(e), this.objects = this.objects.concat(e.objects), enyo.forEach(e.objects, this.mergeProperties, this);
},
mergeProperties: function(e) {
e.properties ? this.objects = this.objects.concat(e.properties) : e.value && e.value[0] && e.value[0].properties && (this.objects = this.objects.concat(e.value[0].properties));
},
indexModule: function(e) {
e.type = "module", e.name = e.name || e.rawPath, e.objects = new Documentor(new Parser(new Lexer(e.code))), this.indexObjects(e);
},
indexObjects: function(e) {
enyo.forEach(e.objects, function(t) {
t.module = e, this.indexObject(t);
}, this);
},
indexObject: function(e) {
switch (e.type) {
case "kind":
this.indexKind(e);
}
this.indexProperties(e);
},
indexProperties: function(e) {
var t = e.properties || e.value && e.value[0] && e.value[0].properties;
enyo.forEach(t, function(t) {
t.object = e, t.topic = t.object.name ? t.object.name + "::" + t.name : t.name;
}, this);
},
indexKind: function(e) {
this.listComponents(e), this.indexInheritance(e);
},
indexInheritance: function(e) {
e.superkinds = this.listSuperkinds(e), e.allProperties = this.listInheritedProperties(e);
},
listSuperkinds: function(e) {
var t = [], n;
while (e && e.superkind) n = e.superkind, e = this.findByName(n), e || (e = this.findByName("enyo." + n), e && (n = "enyo." + n)), t.push(n);
return t;
},
listInheritedProperties: function(e) {
var t = [], n = {};
for (var r = e.superkinds.length - 1, i; i = e.superkinds[r]; r--) {
var s = this.findByName(i);
s && this.mergeInheritedProperties(s.properties, n, t);
}
return this.mergeInheritedProperties(e.properties, n, t), t.sort(Indexer.nameCompare), t;
},
mergeInheritedProperties: function(e, t, n) {
for (var r = 0, i; i = e[r]; r++) {
var s = t.hasOwnProperty(i.name) && t[i.name];
s ? (i.overrides = s, n[enyo.indexOf(s, n)] = i) : n.push(i), t[i.name] = i;
}
},
listComponents: function(e) {
e.components = this._listComponents(e, [], {});
var t = Documentor.findByName(e.properties, "components");
t && t.value && (e.componentsBlockStart = t.value[0].start, e.componentsBlockEnd = t.value[0].end);
},
_listComponents: function(e, t, n) {
var r = Documentor.findByName(e.properties, "components");
if (r && r.value && r.value.length) {
var i = r.value[0].properties;
for (var s = 0, o; o = i[s]; s++) {
var u = Documentor.findByName(o.properties, "name");
u && (u = Documentor.stripQuotes(u.value[0].token || ""));
var a = Documentor.findByName(o.properties, "kind");
a = Documentor.stripQuotes(a && a.value[0].token || "Control");
if (!u) {
var f = a.split(".").pop();
u = enyo.uncap(f), n[u] ? u += ++n[u] : n[u] = 1;
}
o.kind = a, o.name = u, t.push(o), this._listComponents(o, t, n);
}
}
return t;
},
statics: {
nameCompare: function(e, t) {
var n = e.name.toLowerCase(), r = t.name.toLowerCase();
return n < r ? -1 : n > r ? 1 : 0;
}
}
});

// Analyzer.js

enyo.kind({
name: "Analyzer",
kind: "Component",
events: {
onIndexReady: ""
},
create: function() {
this.index = new Indexer, this.inherited(arguments);
},
analyze: function(e) {
this.walk(e);
},
walk: function(e) {
var t = [], n, r = function(i, s) {
if (s) {
for (var o = 0; o < s.modules.length; ++o) s.modules[o].label = n;
t = t.concat(s.modules);
}
var u = e.shift(), a = "";
u ? (enyo.isString(u) || (n = u.label, u = u.path), (new Walker).walk(u).response(this, r)) : this.walkFinished(t);
};
r.call(this);
},
walkFinished: function(e) {
this.read(e);
},
read: function(e) {
(new Reader).go({
modules: e
}).response(this, function(e, t) {
this.indexModules(t.modules);
});
},
indexModules: function(e) {
this.index.addModules(e), this.doIndexReady();
}
});

// foss/showdown-v0.9/compressed/showdown.js

var Showdown = {};

Showdown.converter = function() {
var e, t, n, r = 0;
this.makeHtml = function(r) {
return e = new Array, t = new Array, n = new Array, r = r.replace(/~/g, "~T"), r = r.replace(/\$/g, "~D"), r = r.replace(/\r\n/g, "\n"), r = r.replace(/\r/g, "\n"), r = "\n\n" + r + "\n\n", r = O(r), r = r.replace(/^[ \t]+$/mg, ""), r = s(r), r = i(r), r = u(r), r = L(r), r = r.replace(/~D/g, "$$"), r = r.replace(/~T/g, "~"), r;
};
var i = function(n) {
var n = n.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|\Z)/gm, function(n, r, i, s, o) {
return r = r.toLowerCase(), e[r] = T(i), s ? s + o : (o && (t[r] = o.replace(/"/g, "&quot;")), "");
});
return n;
}, s = function(e) {
e = e.replace(/\n/g, "\n\n");
var t = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del", n = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math";
return e = e.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm, o), e = e.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm, o), e = e.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g, o), e = e.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g, o), e = e.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g, o), e = e.replace(/\n\n/g, "\n"), e;
}, o = function(e, t) {
var r = t;
return r = r.replace(/\n\n/g, "\n"), r = r.replace(/^\n/, ""), r = r.replace(/\n+$/g, ""), r = "\n\n~K" + (n.push(r) - 1) + "K\n\n", r;
}, u = function(e) {
e = d(e);
var t = y("<hr />");
return e = e.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm, t), e = e.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm, t), e = e.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm, t), e = m(e), e = g(e), e = S(e), e = s(e), e = x(e), e;
}, a = function(e) {
return e = b(e), e = f(e), e = N(e), e = h(e), e = l(e), e = C(e), e = T(e), e = E(e), e = e.replace(/  +\n/g, " <br />\n"), e;
}, f = function(e) {
var t = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;
return e = e.replace(t, function(e) {
var t = e.replace(/(.)<\/?code>(?=.)/g, "$1`");
return t = M(t, "\\`*_"), t;
}), e;
}, l = function(e) {
return e = e.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, c), e = e.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, c), e = e.replace(/(\[([^\[\]]+)\])()()()()()/g, c), e;
}, c = function(n, r, i, s, o, u, a, f) {
f == undefined && (f = "");
var l = r, c = i, h = s.toLowerCase(), p = o, d = f;
if (p == "") {
h == "" && (h = c.toLowerCase().replace(/ ?\n/g, " ")), p = "#" + h;
if (e[h] != undefined) p = e[h], t[h] != undefined && (d = t[h]); else {
if (!(l.search(/\(\s*\)$/m) > -1)) return l;
p = "";
}
}
p = M(p, "*_");
var v = '<a href="' + p + '"';
return d != "" && (d = d.replace(/"/g, "&quot;"), d = M(d, "*_"), v += ' title="' + d + '"'), v += ">" + c + "</a>", v;
}, h = function(e) {
return e = e.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, p), e = e.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, p), e;
}, p = function(n, r, i, s, o, u, a, f) {
var l = r, c = i, h = s.toLowerCase(), p = o, d = f;
d || (d = "");
if (p == "") {
h == "" && (h = c.toLowerCase().replace(/ ?\n/g, " ")), p = "#" + h;
if (e[h] == undefined) return l;
p = e[h], t[h] != undefined && (d = t[h]);
}
c = c.replace(/"/g, "&quot;"), p = M(p, "*_");
var v = '<img src="' + p + '" alt="' + c + '"';
return d = d.replace(/"/g, "&quot;"), d = M(d, "*_"), v += ' title="' + d + '"', v += " />", v;
}, d = function(e) {
return e = e.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm, function(e, t) {
return y("<h1>" + a(t) + "</h1>");
}), e = e.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm, function(e, t) {
return y("<h2>" + a(t) + "</h2>");
}), e = e.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm, function(e, t, n) {
var r = t.length;
return y("<h" + r + ">" + a(n) + "</h" + r + ">");
}), e;
}, v, m = function(e) {
e += "~0";
var t = /^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
return r ? e = e.replace(t, function(e, t, n) {
var r = t, i = n.search(/[*+-]/g) > -1 ? "ul" : "ol";
r = r.replace(/\n{2,}/g, "\n\n\n");
var s = v(r);
return s = s.replace(/\s+$/, ""), s = "<" + i + ">" + s + "</" + i + ">\n", s;
}) : (t = /(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g, e = e.replace(t, function(e, t, n, r) {
var i = t, s = n, o = r.search(/[*+-]/g) > -1 ? "ul" : "ol", s = s.replace(/\n{2,}/g, "\n\n\n"), u = v(s);
return u = i + "<" + o + ">\n" + u + "</" + o + ">\n", u;
})), e = e.replace(/~0/, ""), e;
};
v = function(e) {
return r++, e = e.replace(/\n{2,}$/, "\n"), e += "~0", e = e.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm, function(e, t, n, r, i) {
var s = i, o = t, f = n;
return o || s.search(/\n{2,}/) > -1 ? s = u(A(s)) : (s = m(A(s)), s = s.replace(/\n$/, ""), s = a(s)), "<li>" + s + "</li>\n";
}), e = e.replace(/~0/g, ""), r--, e;
};
var g = function(e) {
return e += "~0", e = e.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g, function(e, t, n) {
var r = t, i = n;
return r = w(A(r)), r = O(r), r = r.replace(/^\n+/g, ""), r = r.replace(/\n+$/g, ""), r = "<pre><code>" + r + "\n</code></pre>", y(r) + i;
}), e = e.replace(/~0/, ""), e;
}, y = function(e) {
return e = e.replace(/(^\n+|\n+$)/g, ""), "\n\n~K" + (n.push(e) - 1) + "K\n\n";
}, b = function(e) {
return e = e.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm, function(e, t, n, r, i) {
var s = r;
return s = s.replace(/^([ \t]*)/g, ""), s = s.replace(/[ \t]*$/g, ""), s = w(s), t + "<code>" + s + "</code>";
}), e;
}, w = function(e) {
return e = e.replace(/&/g, "&amp;"), e = e.replace(/</g, "&lt;"), e = e.replace(/>/g, "&gt;"), e = M(e, "*_{}[]\\", !1), e;
}, E = function(e) {
return e = e.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g, "<strong>$2</strong>"), e = e.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g, "<em>$2</em>"), e;
}, S = function(e) {
return e = e.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm, function(e, t) {
var n = t;
return n = n.replace(/^[ \t]*>[ \t]?/gm, "~0"), n = n.replace(/~0/g, ""), n = n.replace(/^[ \t]+$/gm, ""), n = u(n), n = n.replace(/(^|\n)/g, "$1  "), n = n.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(e, t) {
var n = t;
return n = n.replace(/^  /mg, "~0"), n = n.replace(/~0/g, ""), n;
}), y("<blockquote>\n" + n + "\n</blockquote>");
}), e;
}, x = function(e) {
e = e.replace(/^\n+/g, ""), e = e.replace(/\n+$/g, "");
var t = e.split(/\n{2,}/g), r = new Array, i = t.length;
for (var s = 0; s < i; s++) {
var o = t[s];
o.search(/~K(\d+)K/g) >= 0 ? r.push(o) : o.search(/\S/) >= 0 && (o = a(o), o = o.replace(/^([ \t]*)/g, "<p>"), o += "</p>", r.push(o));
}
i = r.length;
for (var s = 0; s < i; s++) while (r[s].search(/~K(\d+)K/) >= 0) {
var u = n[RegExp.$1];
u = u.replace(/\$/g, "$$$$"), r[s] = r[s].replace(/~K\d+K/, u);
}
return r.join("\n\n");
}, T = function(e) {
return e = e.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;"), e = e.replace(/<(?![a-z\/?\$!])/gi, "&lt;"), e;
}, N = function(e) {
return e = e.replace(/\\(\\)/g, _), e = e.replace(/\\([`*_{}\[\]()>#+-.!])/g, _), e;
}, C = function(e) {
return e = e.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi, '<a href="$1">$1</a>'), e = e.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi, function(e, t) {
return k(L(t));
}), e;
}, k = function(e) {
function t(e) {
var t = "0123456789ABCDEF", n = e.charCodeAt(0);
return t.charAt(n >> 4) + t.charAt(n & 15);
}
var n = [ function(e) {
return "&#" + e.charCodeAt(0) + ";";
}, function(e) {
return "&#x" + t(e) + ";";
}, function(e) {
return e;
} ];
return e = "mailto:" + e, e = e.replace(/./g, function(e) {
if (e == "@") e = n[Math.floor(Math.random() * 2)](e); else if (e != ":") {
var t = Math.random();
e = t > .9 ? n[2](e) : t > .45 ? n[1](e) : n[0](e);
}
return e;
}), e = '<a href="' + e + '">' + e + "</a>", e = e.replace(/">.+:/g, '">'), e;
}, L = function(e) {
return e = e.replace(/~E(\d+)E/g, function(e, t) {
var n = parseInt(t);
return String.fromCharCode(n);
}), e;
}, A = function(e) {
return e = e.replace(/^(\t|[ ]{1,4})/gm, "~0"), e = e.replace(/~0/g, ""), e;
}, O = function(e) {
return e = e.replace(/\t(?=\t)/g, "    "), e = e.replace(/\t/g, "~A~B"), e = e.replace(/~B(.+?)~A/g, function(e, t, n) {
var r = t, i = 4 - r.length % 4;
for (var s = 0; s < i; s++) r += " ";
return r;
}), e = e.replace(/~A/g, "    "), e = e.replace(/~B/g, ""), e;
}, M = function(e, t, n) {
var r = "([" + t.replace(/([\[\]\\])/g, "\\$1") + "])";
n && (r = "\\\\" + r);
var i = new RegExp(r, "g");
return e = e.replace(i, _), e;
}, _ = function(e, t) {
var n = t.charCodeAt(0);
return "~E" + n + "E";
};
};

// foss/syntaxhighlighter_3.0.83_fork/sh-min.js

var XRegExp;

if (XRegExp) throw Error("can't load XRegExp twice in the same frame");

(function() {
function e(e, n) {
if (!XRegExp.isRegExp(e)) throw TypeError("type RegExp expected");
var r = e._xregexp;
return e = XRegExp(e.source, t(e) + (n || "")), r && (e._xregexp = {
source: r.source,
captureNames: r.captureNames ? r.captureNames.slice(0) : null
}), e;
}
function t(e) {
return (e.global ? "g" : "") + (e.ignoreCase ? "i" : "") + (e.multiline ? "m" : "") + (e.extended ? "x" : "") + (e.sticky ? "y" : "");
}
function n(e, t, n, r) {
var i = a.length, s, o, f;
u = !0;
try {
while (i--) {
f = a[i];
if (n & f.scope && (!f.trigger || f.trigger.call(r))) {
f.pattern.lastIndex = t, o = f.pattern.exec(e);
if (o && o.index === t) {
s = {
output: f.handler.call(r, o, n),
match: o
};
break;
}
}
}
} catch (l) {
throw l;
} finally {
u = !1;
}
return s;
}
function r(e, t, n) {
if (Array.prototype.indexOf) return e.indexOf(t, n);
for (var r = n || 0; r < e.length; r++) if (e[r] === t) return r;
return -1;
}
XRegExp = function(t, r) {
var i = [], o = XRegExp.OUTSIDE_CLASS, a = 0, l, c, h, p, v;
if (XRegExp.isRegExp(t)) {
if (r !== undefined) throw TypeError("can't supply flags when constructing one RegExp from another");
return e(t);
}
if (u) throw Error("can't call the XRegExp constructor within token definition functions");
r = r || "", l = {
hasNamedCapture: !1,
captureNames: [],
hasFlag: function(e) {
return r.indexOf(e) > -1;
},
setFlag: function(e) {
r += e;
}
};
while (a < t.length) c = n(t, a, o, l), c ? (i.push(c.output), a += c.match[0].length || 1) : (h = f.exec.call(d[o], t.slice(a))) ? (i.push(h[0]), a += h[0].length) : (p = t.charAt(a), p === "[" ? o = XRegExp.INSIDE_CLASS : p === "]" && (o = XRegExp.OUTSIDE_CLASS), i.push(p), a++);
return v = RegExp(i.join(""), f.replace.call(r, s, "")), v._xregexp = {
source: t,
captureNames: l.hasNamedCapture ? l.captureNames : null
}, v;
}, XRegExp.version = "1.5.0", XRegExp.INSIDE_CLASS = 1, XRegExp.OUTSIDE_CLASS = 2;
var i = /\$(?:(\d\d?|[$&`'])|{([$\w]+)})/g, s = /[^gimy]+|([\s\S])(?=[\s\S]*\1)/g, o = /^(?:[?*+]|{\d+(?:,\d*)?})\??/, u = !1, a = [], f = {
exec: RegExp.prototype.exec,
test: RegExp.prototype.test,
match: String.prototype.match,
replace: String.prototype.replace,
split: String.prototype.split
}, l = f.exec.call(/()??/, "")[1] === undefined, c = function() {
var e = /^/g;
return f.test.call(e, ""), !e.lastIndex;
}(), h = function() {
var e = /x/g;
return f.replace.call("x", e, ""), !e.lastIndex;
}(), p = RegExp.prototype.sticky !== undefined, d = {};
d[XRegExp.INSIDE_CLASS] = /^(?:\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S]))/, d[XRegExp.OUTSIDE_CLASS] = /^(?:\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??)/, XRegExp.addToken = function(t, n, r, i) {
a.push({
pattern: e(t, "g" + (p ? "y" : "")),
handler: n,
scope: r || XRegExp.OUTSIDE_CLASS,
trigger: i || null
});
}, XRegExp.cache = function(e, t) {
var n = e + "/" + (t || "");
return XRegExp.cache[n] || (XRegExp.cache[n] = XRegExp(e, t));
}, XRegExp.copyAsGlobal = function(t) {
return e(t, "g");
}, XRegExp.escape = function(e) {
return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}, XRegExp.execAt = function(t, n, r, i) {
n = e(n, "g" + (i && p ? "y" : "")), n.lastIndex = r = r || 0;
var s = n.exec(t);
return i ? s && s.index === r ? s : null : s;
}, XRegExp.freezeTokens = function() {
XRegExp.addToken = function() {
throw Error("can't run addToken after freezeTokens");
};
}, XRegExp.isRegExp = function(e) {
return Object.prototype.toString.call(e) === "[object RegExp]";
}, XRegExp.iterate = function(t, n, r, i) {
var s = e(n, "g"), o = -1, u;
while (u = s.exec(t)) r.call(i, u, ++o, t, s), s.lastIndex === u.index && s.lastIndex++;
n.global && (n.lastIndex = 0);
}, XRegExp.matchChain = function(t, n) {
return function r(t, i) {
var s = n[i].regex ? n[i] : {
regex: n[i]
}, o = e(s.regex, "g"), u = [], a;
for (a = 0; a < t.length; a++) XRegExp.iterate(t[a], o, function(e) {
u.push(s.backref ? e[s.backref] || "" : e[0]);
});
return i === n.length - 1 || !u.length ? u : r(u, i + 1);
}([ t ], 0);
}, RegExp.prototype.apply = function(e, t) {
return this.exec(t[0]);
}, RegExp.prototype.call = function(e, t) {
return this.exec(t);
}, RegExp.prototype.exec = function(e) {
var n = f.exec.apply(this, arguments), i, s;
if (n) {
!l && n.length > 1 && r(n, "") > -1 && (s = RegExp(this.source, f.replace.call(t(this), "g", "")), f.replace.call(e.slice(n.index), s, function() {
for (var e = 1; e < arguments.length - 2; e++) arguments[e] === undefined && (n[e] = undefined);
}));
if (this._xregexp && this._xregexp.captureNames) for (var o = 1; o < n.length; o++) i = this._xregexp.captureNames[o - 1], i && (n[i] = n[o]);
!c && this.global && !n[0].length && this.lastIndex > n.index && this.lastIndex--;
}
return n;
}, c || (RegExp.prototype.test = function(e) {
var t = f.exec.call(this, e);
return t && this.global && !t[0].length && this.lastIndex > t.index && this.lastIndex--, !!t;
}), String.prototype.match = function(e) {
XRegExp.isRegExp(e) || (e = RegExp(e));
if (e.global) {
var t = f.match.apply(this, arguments);
return e.lastIndex = 0, t;
}
return e.exec(this);
}, String.prototype.replace = function(e, t) {
var n = XRegExp.isRegExp(e), s, o, u;
return n && typeof t.valueOf() == "string" && t.indexOf("${") === -1 && h ? f.replace.apply(this, arguments) : (n ? e._xregexp && (s = e._xregexp.captureNames) : e += "", typeof t == "function" ? o = f.replace.call(this, e, function() {
if (s) {
arguments[0] = new String(arguments[0]);
for (var r = 0; r < s.length; r++) s[r] && (arguments[0][s[r]] = arguments[r + 1]);
}
return n && e.global && (e.lastIndex = arguments[arguments.length - 2] + arguments[0].length), t.apply(null, arguments);
}) : (u = this + "", o = f.replace.call(u, e, function() {
var e = arguments;
return f.replace.call(t, i, function(t, n, i) {
if (!n) {
var o = +i;
return o <= e.length - 3 ? e[o] : (o = s ? r(s, i) : -1, o > -1 ? e[o + 1] : t);
}
switch (n) {
case "$":
return "$";
case "&":
return e[0];
case "`":
return e[e.length - 1].slice(0, e[e.length - 2]);
case "'":
return e[e.length - 1].slice(e[e.length - 2] + e[0].length);
default:
var u = "";
n = +n;
if (!n) return t;
while (n > e.length - 3) u = String.prototype.slice.call(n, -1) + u, n = Math.floor(n / 10);
return (n ? e[n] || "" : "$") + u;
}
});
})), n && e.global && (e.lastIndex = 0), o);
}, String.prototype.split = function(e, t) {
if (!XRegExp.isRegExp(e)) return f.split.apply(this, arguments);
var n = this + "", r = [], i = 0, s, o;
if (t === undefined || +t < 0) t = Infinity; else {
t = Math.floor(+t);
if (!t) return [];
}
e = XRegExp.copyAsGlobal(e);
while (s = e.exec(n)) {
if (e.lastIndex > i) {
r.push(n.slice(i, s.index)), s.length > 1 && s.index < n.length && Array.prototype.push.apply(r, s.slice(1)), o = s[0].length, i = e.lastIndex;
if (r.length >= t) break;
}
e.lastIndex === s.index && e.lastIndex++;
}
return i === n.length ? (!f.test.call(e, "") || o) && r.push("") : r.push(n.slice(i)), r.length > t ? r.slice(0, t) : r;
}, XRegExp.addToken(/\(\?#[^)]*\)/, function(e) {
return f.test.call(o, e.input.slice(e.index + e[0].length)) ? "" : "(?:)";
}), XRegExp.addToken(/\((?!\?)/, function() {
return this.captureNames.push(null), "(";
}), XRegExp.addToken(/\(\?<([$\w]+)>/, function(e) {
return this.captureNames.push(e[1]), this.hasNamedCapture = !0, "(";
}), XRegExp.addToken(/\\k<([\w$]+)>/, function(e) {
var t = r(this.captureNames, e[1]);
return t > -1 ? "\\" + (t + 1) + (isNaN(e.input.charAt(e.index + e[0].length)) ? "" : "(?:)") : e[0];
}), XRegExp.addToken(/\[\^?]/, function(e) {
return e[0] === "[]" ? "\\b\\B" : "[\\s\\S]";
}), XRegExp.addToken(/^\(\?([imsx]+)\)/, function(e) {
return this.setFlag(e[1]), "";
}), XRegExp.addToken(/(?:\s+|#.*)+/, function(e) {
return f.test.call(o, e.input.slice(e.index + e[0].length)) ? "" : "(?:)";
}, XRegExp.OUTSIDE_CLASS, function() {
return this.hasFlag("x");
}), XRegExp.addToken(/\./, function() {
return "[\\s\\S]";
}, XRegExp.OUTSIDE_CLASS, function() {
return this.hasFlag("s");
});
})();

var SyntaxHighlighter = function() {
function e(e) {
return e.split("\n");
}
function t(e, t, n) {
n = Math.max(n || 0, 0);
for (var r = n; r < e.length; r++) if (e[r] == t) return r;
return -1;
}
function n(e, t) {
var n = {}, r;
for (r in e) n[r] = e[r];
for (r in t) n[r] = t[r];
return n;
}
function r(e) {
var t = {
"true": !0,
"false": !1
}[e];
return t == null ? e : t;
}
function i(t, n) {
var r = e(t);
for (var i = 0; i < r.length; i++) r[i] = n(r[i], i);
return r.join("\n");
}
function s(e) {
return e.replace(/^[ ]*[\n]+|[\n]*[ ]*$/g, "");
}
function o(e, t) {
return e == null || e.length == 0 || e == "\n" ? e : (e = e.replace(/</g, "&lt;"), e = e.replace(/ {2,}/g, function(e) {
var t = "";
for (var n = 0; n < e.length - 1; n++) t += m.config.space;
return t + " ";
}), t != null && (e = i(e, function(e) {
if (e.length == 0) return "";
var n = "";
return e = e.replace(/^(&nbsp;| )+/, function(e) {
return n = e, "";
}), e.length == 0 ? n : n + '<code class="' + t + '">' + e + "</code>";
})), e);
}
function u(e, t) {
var n = e.toString();
while (n.length < t) n = "0" + n;
return n;
}
function a(e, t) {
var n = "";
for (var r = 0; r < t; r++) n += " ";
return e.replace(/\t/g, n);
}
function f(t, n) {
function r(e, t, n) {
return e.substr(0, t) + u.substr(0, n) + e.substr(t + 1, e.length);
}
var s = e(t), o = "	", u = "";
for (var a = 0; a < 50; a++) u += "                    ";
return t = i(t, function(e) {
if (e.indexOf(o) == -1) return e;
var t = 0;
while ((t = e.indexOf(o)) != -1) {
var i = n - t % n;
e = r(e, t, i);
}
return e;
}), t;
}
function l(e) {
var t = /<br\s*\/?>|&lt;br\s*\/?&gt;/gi;
return e = e.replace(t, "\n"), m.config.stripBrs == 1 && (e = e.replace(t, "")), e;
}
function c(e) {
return e.replace(/^\s+|\s+$/g, "");
}
function h(t) {
var n = e(l(t)), r = new Array, i = /^\s*/, s = 1e3;
for (var o = 0; o < n.length && s > 0; o++) {
var u = n[o];
if (c(u).length == 0) continue;
var a = i.exec(u);
if (a == null) return t;
s = Math.min(a[0].length, s);
}
if (s > 0) for (var o = 0; o < n.length; o++) n[o] = n[o].substr(s);
return n.join("\n");
}
function p(e, t) {
return e.index < t.index ? -1 : e.index > t.index ? 1 : e.length < t.length ? -1 : e.length > t.length ? 1 : 0;
}
function d(e, t) {
function n(e, t) {
return e[0];
}
var r = 0, i = null, s = [], o = t.func ? t.func : n;
while ((i = t.regex.exec(e)) != null) {
var u = o(i, t);
typeof u == "string" && (u = [ new m.Match(u, i.index, t.css) ]), s = s.concat(u);
}
return s;
}
function v(e) {
var t = /(.*)((&gt;|&lt;).*)/;
return e.replace(m.regexLib.url, function(e) {
var n = "", r = null;
if (r = t.exec(e)) e = r[1], n = r[2];
return '<a href="' + e + '">' + e + "</a>" + n;
});
}
var m = {
defaults: {
"class-name": "",
"first-line": 1,
"pad-line-numbers": !1,
highlight: null,
"smart-tabs": !0,
"tab-size": 4,
gutter: !0,
"auto-links": !0
},
config: {
space: "&nbsp;",
stripBrs: !1,
strings: {
alert: "SyntaxHighlighter\n\n",
noBrush: "Can't find brush for: ",
brushNotHtmlScript: "Brush wasn't configured for html-script option: "
}
},
brushes: {},
regexLib: {
multiLineCComments: /\/\*[\s\S]*?\*\//gm,
singleLineCComments: /\/\/.*$/gm,
singleLinePerlComments: /#.*$/gm,
doubleQuotedString: /"([^\\"\n]|\\.)*"/g,
singleQuotedString: /'([^\\'\n]|\\.)*'/g,
multiLineDoubleQuotedString: new XRegExp('"([^\\\\"]|\\\\.)*"', "gs"),
multiLineSingleQuotedString: new XRegExp("'([^\\\\']|\\\\.)*'", "gs"),
xmlComments: /(&lt;|<)!--[\s\S]*?--(&gt;|>)/gm,
url: /\w+:\/\/[\w-.\/?%&=:@;]*/g,
phpScriptTags: {
left: /(&lt;|<)\?=?/g,
right: /\?(&gt;|>)/g
},
aspScriptTags: {
left: /(&lt;|<)%=?/g,
right: /%(&gt;|>)/g
},
scriptScriptTags: {
left: /(&lt;|<)\s*script.*?(&gt;|>)/gi,
right: /(&lt;|<)\/\s*script\s*(&gt;|>)/gi
}
}
};
return m.Match = function(e, t, n) {
this.value = e, this.index = t, this.length = e.length, this.css = n, this.brushName = null;
}, m.Match.prototype.toString = function() {
return this.value;
}, m.Highlighter = function() {}, m.Highlighter.prototype = {
getParam: function(e, t) {
var n = this.params[e];
return r(n == null ? t : n);
},
create: function(e) {
return document.createElement(e);
},
findMatches: function(e, t) {
var n = [];
if (e != null) for (var r = 0; r < e.length; r++) typeof e[r] == "object" && (n = n.concat(d(t, e[r])));
return this.removeNestedMatches(n.sort(p));
},
removeNestedMatches: function(e) {
for (var t = 0; t < e.length; t++) {
if (e[t] === null) continue;
var n = e[t], r = n.index + n.length;
for (var i = t + 1; i < e.length && e[t] !== null; i++) {
var s = e[i];
if (s === null) continue;
if (s.index > r) break;
s.index == n.index && s.length > n.length ? e[t] = null : s.index >= n.index && s.index < r && (e[i] = null);
}
}
return e;
},
figureOutLineNumbers: function(e) {
var t = [], n = parseInt(this.getParam("first-line"));
return i(e, function(e, r) {
t.push(r + n);
}), t;
},
isLineHighlighted: function(e) {
var n = this.getParam("highlight", []);
return typeof n != "object" && n.push == null && (n = [ n ]), t(n, e.toString()) != -1;
},
getLineHtml: function(e, t, n) {
var r = [ "line", "number" + t, "index" + e, "alt" + (t % 2 == 0 ? 1 : 2).toString() ];
return this.isLineHighlighted(t) && r.push("highlighted"), t == 0 && r.push("break"), '<div class="' + r.join(" ") + '">' + n + "</div>";
},
getLineNumbersHtml: function(t, n) {
var r = "", i = e(t).length, s = parseInt(this.getParam("first-line")), o = this.getParam("pad-line-numbers");
o == 1 ? o = (s + i - 1).toString().length : isNaN(o) == 1 && (o = 0);
for (var a = 0; a < i; a++) {
var f = n ? n[a] : s + a, t = f == 0 ? m.config.space : u(f, o);
r += this.getLineHtml(a, f, t);
}
return r;
},
getCodeLinesHtml: function(t, n) {
t = c(t);
var r = e(t), i = this.getParam("pad-line-numbers"), s = parseInt(this.getParam("first-line")), t = "", o = this.getParam("brush");
for (var u = 0; u < r.length; u++) {
var a = r[u], f = /^(&nbsp;|\s)+/.exec(a), l = null, h = n ? n[u] : s + u;
f != null && (l = f[0].toString(), a = a.substr(l.length), l = l.replace(" ", m.config.space)), a = c(a), a.length == 0 && (a = m.config.space), t += this.getLineHtml(u, h, (l != null ? '<code class="' + o + ' spaces">' + l + "</code>" : "") + a);
}
return t;
},
getMatchesHtml: function(e, t) {
function n(e) {
var t = e ? e.brushName || s : s;
return t ? t + " " : "";
}
var r = 0, i = "", s = this.getParam("brush", "");
for (var u = 0; u < t.length; u++) {
var a = t[u], f;
if (a === null || a.length === 0) continue;
f = n(a), i += o(e.substr(r, a.index - r), f + "plain") + o(a.value, f + a.css), r = a.index + a.length + (a.offset || 0);
}
return i += o(e.substr(r), n() + "plain"), i;
},
getHtml: function(e) {
var t = "", n = [ "syntaxhighlighter" ], r, i, o;
return className = "syntaxhighlighter", (gutter = this.getParam("gutter")) == 0 && n.push("nogutter"), n.push(this.getParam("class-name")), n.push(this.getParam("brush")), e = s(e).replace(/\r/g, " "), r = this.getParam("tab-size"), e = this.getParam("smart-tabs") == 1 ? f(e, r) : a(e, r), e = h(e), gutter && (o = this.figureOutLineNumbers(e)), i = this.findMatches(this.regexList, e), t = this.getMatchesHtml(e, i), t = this.getCodeLinesHtml(t, o), this.getParam("auto-links") && (t = v(t)), typeof navigator != "undefined" && navigator.userAgent && navigator.userAgent.match(/MSIE/) && n.push("ie"), t = '<div class="' + n.join(" ") + '">' + '<table border="0" cellpadding="0" cellspacing="0">' + "<tbody>" + "<tr>" + (gutter ? '<td class="gutter">' + this.getLineNumbersHtml(e) + "</td>" : "") + '<td class="code">' + '<div class="container">' + t + "</div>" + "</td>" + "</tr>" + "</tbody>" + "</table>" + "</div>", t;
},
init: function(e) {
this.params = n(m.defaults, e || {});
},
getKeywords: function(e) {
return e = e.replace(/^\s+|\s+$/g, "").replace(/\s+/g, "|"), "\\b(?:" + e + ")\\b";
}
}, m;
}();

(function() {
function e() {
var e = "break case catch continue default delete do else false  for function if in instanceof new null return super switch this throw true try typeof var while with", t = SyntaxHighlighter.regexLib;
this.regexList = [ {
regex: t.multiLineDoubleQuotedString,
css: "string"
}, {
regex: t.multiLineSingleQuotedString,
css: "string"
}, {
regex: t.singleLineCComments,
css: "comments"
}, {
regex: t.multiLineCComments,
css: "comments"
}, {
regex: /\s*#.*/gm,
css: "preprocessor"
}, {
regex: new RegExp(this.getKeywords(e), "gm"),
css: "keyword"
} ];
}
e.prototype = new SyntaxHighlighter.Highlighter, e.aliases = [ "js", "jscript", "javascript" ], SyntaxHighlighter.brushes.JScript = e;
})(), function() {
var e = new SyntaxHighlighter.brushes.JScript;
e.init({}), syntaxHighlight = function(t) {
return e.getHtml(t);
};
}();

// Presentor.js

enyo.kind({
name: "Presentor",
kind: null,
showInherited: !1,
showProtected: !1,
getByType: function(e, t) {
var n = [];
for (var r = 0, i; i = e[r]; r++) i.type == t && n.push(i);
return n;
},
presentObject: function(e) {
switch (e.type) {
case "module":
return this.presentObjects(e.objects);
case "kind":
return this.presentKind(e);
case "function":
case "global":
return this.presentProperty(e);
}
},
presentObjects: function(e) {
var t = this.groupFilter(e), n = "", r, i, s = this.getByType(t, "kind");
if (s.length) {
n += "<h3>Kinds</h3>";
for (r = 0; i = s[r]; r++) n += "<kind>" + i.name + "</kind><br/>", n += this.presentComment(i.comment);
}
s = this.getByType(t, "function");
if (s.length) {
n += "<h3>Functions</h3>";
for (r = 0; i = s[r]; r++) n += this.presentComment(i.comment), i.group && (n += "<" + i.group + ">" + i.group + "</" + i.group + ">"), n += "<i>name:</i> <label>" + i.name + "(<arguments>" + i.value[0].arguments.join(", ") + "</arguments>)</label><br/>";
}
s = this.getByType(t, "global");
if (s.length) {
n += "<h3>Variables</h3>";
for (r = 0; i = s[r]; r++) n += this.presentComment(i.comment), i.group && (n += "<" + i.group + ">" + i.group + "</" + i.group + ">"), n += "<label>" + i.name + "</label> = ", n += this.presentExpression(i.value[0]), n += "<br/>";
}
return n;
},
presentComment: function(e) {
return e ? "<comment>" + this.markupToHtml(e) + "</comment>" : "";
},
presentKind: function(e) {
return this.presentKindHeader(e) + this.presentKindSummary(e) + this.presentKindProperties(e);
},
presentKindHeader: function(e) {
var t = "";
return e.module && e.module.label && (t += "<package>" + e.module.label + "</package>"), t += "<kind>" + e.name + "</kind>", e.superkinds.length && (t += '<div style="padding: 4px 0px;">', t += e.name, enyo.forEach(e.superkinds, function(e) {
t += " :: <a href=#" + e + ">" + e + "</a>";
}), t += "</div>"), t;
},
presentKindSummary: function(e) {
var t = "";
return e.comment && (t += "<h3>Summary</h3>" + this.presentComment(e.comment)), t;
},
presentKindProperties: function(e) {
return this.presentProperties(this.showInherited ? e.allProperties : e.properties, e);
},
groupFilter: function(e) {
return enyo.filter(e, function(e) {
return e.name[0] !== "_" && (e.group == "public" || this.showProtected && e.group == "protected");
}, this);
},
presentProperties: function(e, t) {
var n = this.groupFilter(e), r = "";
for (var i = 0, s; s = n[i]; i++) r += this.presentProperty(s, t);
return r;
},
presentProperty: function(e, t) {
var n = "", r = e;
n += '<a name="' + r.name + '"></a>', r.group && (n += "<" + r.group + ">" + r.group + "</" + r.group + ">");
var i = r.name;
return r.object && t && t != r.object && (i = "<prototype>" + r.object.name + "::</prototype>" + i), n += "<label>" + i + "</label>: ", r.value && r.value[0] && r.value[0].token == "function" ? n += "function(<arguments>" + r.value[0].arguments.join(", ") + "</arguments>)<br/>" : n += this.presentValue(r), n += this.presentComment(r.comment), n += "<hr/>", n;
},
presentValue: function(e) {
var t, n = e.value;
return !n || !n[0] ? t = e.token : t = this.presentExpression(n[0]), t += "</br>", t;
},
presentExpression: function(e) {
var t = e;
return t.comment ? this.presentComment(t.comment) : t.type == "block" ? "{<blockquote><br/>" + this.presentBlock(t) + "</blockquote>}" : t.type == "array" ? "[<blockquote>" + this.presentArray(t) + "</blockquote>]" : t.token;
},
presentBlock: function(e) {
return this.presentProperties(e.properties);
},
presentArray: function(e) {
var t = "", n = e.properties;
for (var r = 0, i; i = n[r]; r++) t += "<i>" + r + "</i>: " + this.presentExpression(i);
return t;
},
presentColumns: function(e, t, n) {
var r = this.groupFilter(e), i = "";
t && (i = t.name + "::");
var s = n || 4, o = [], u = "";
for (var a = 0, f = 0, l = 0; p = r[a]; a++) u += '<a href="#' + i + p.name + '">' + p.name + "</a><br/>", ++l == s && (o.push(u), u = "", l = 0);
return u && o.push(u), u = o.length ? "<column>" + o.join("</column><column>") + "</column>" : "", u;
},
markupToHtml: function(e) {
var t = Presentor.showdown.makeHtml(e || "");
return t = t.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gm, function(e, t) {
return "<pre>" + syntaxHighlight(t) + "</pre>";
}), t;
},
inlineProperties: function(e, t) {
var n = [], r = function(e) {
e.parentHash = s.name;
};
for (var i = 0, s; s = e[i]; i++) t[s.name] ? s.value && s.value[0] && s.value[0].properties && (enyo.forEach(s.value[0].properties, r), n = n.concat(s.value[0].properties)) : n.push(s);
return n;
},
statics: {
showdown: new Showdown.converter
}
});

// PackagesEditor.js

enyo.kind({
name: "PackagesEditor",
kind: "Popup",
classes: "packages-editor",
events: {
onSave: ""
},
components: [ {
kind: "Repeater",
onSetupItem: "setupItem",
components: [ {
components: [ {
name: "name",
kind: "Input"
}, {
name: "path",
kind: "Input"
}, {
kind: "Button",
content: "Delete",
ontap: "deletePkg"
} ]
} ]
}, {
kind: "Button",
content: "New...",
ontap: "newPkg"
}, {
tag: "hr"
}, {
kind: "Button",
content: "Cancel",
ontap: "hide"
}, {
kind: "Button",
content: "Save",
ontap: "save"
} ],
openWithPackages: function(e) {
this.show(), this.pkgs = e, this.load();
},
load: function() {
this.$.repeater.setCount(this.pkgs.length);
},
setupItem: function(e, t) {
var n = this.pkgs[t.index];
return t.item.$.name.setValue(n.name), t.item.$.path.setValue(n.path), !0;
},
newPkg: function() {
this.pkgs.push({
name: "",
path: ""
}), this.load();
},
deletePkg: function(e, t) {
this.pkgs.splice(t.index, 1), this.load();
},
save: function() {
var e = [];
for (var t = 0, n; n = this.$.repeater.getClientControls()[t]; t++) {
var r = n.$.name.getValue(), i = n.$.path.getValue();
r && i && e.push({
name: r,
path: i
});
}
this.doSave({
pkgs: e
}), this.hide();
}
});

// PackageList.js

enyo.kind({
name: "PackageList",
components: [ {
kind: "Repeater",
components: [ {
components: [ {
kind: "Checkbox",
onchange: "cbChange"
} ]
} ]
}, {
name: "version",
style: "padding-top: 20px"
}, {
kind: "PackagesEditor",
modal: !0,
centered: !0,
floating: !0,
onSave: "savePackages"
} ],
published: {
version: ""
},
events: {
onPackagesChange: "",
onLoaded: ""
},
handlers: {
onSetupItem: "setupItem"
},
create: function() {
this.inherited(arguments), this.versionChanged();
},
versionChanged: function() {
this.$.version.setContent("Content Version: " + this.version);
},
fetchPackageData: function() {
(new enyo.Ajax({
url: "assets/manifest.json"
})).response(this, function(e, t) {
this.setVersion(t.version), this.gotPackageData(t.packages);
}).go();
},
gotPackageData: function(e) {
this.pkgs = e, this.$.repeater.setCount(this.pkgs.length), this.doLoaded({
packages: this.pkgs,
version: this.version
});
},
loadPackageData: function() {
this.pkgs ? this.gotPackageData(this.pkgs) : this.fetchPackageData();
},
savePackageData: function() {},
setupItem: function(e, t) {
var n = this.pkgs[t.index], r = t.item.$.checkbox;
r.setContent(n.name), r.setChecked(!n.disabled);
},
cbChange: function(e, t) {
var n = t.index, r = this.pkgs[n];
r && (r.disabled = !e.getChecked(), this.savePackageData()), this.doPackagesChange({
pkg: r
});
}
});

// TabPanels.js

enyo.kind({
name: "TabPanels",
kind: "FittableRows",
components: [ {
name: "tabs",
kind: "Group",
defaultKind: "Button",
controlClasses: "tab"
}, {
name: "client",
style: "position: relative;",
fit: !0
} ],
create: function() {
this.inherited(arguments), this.selectTab(0);
},
addControl: function(e) {
e.isChrome || (e.addClass("enyo-fit"), e.showing = !1, this.$.tabs.createComponent({
content: e.tabName || e.name,
ontap: "tabTap",
owner: this
})), this.inherited(arguments);
},
selectTab: function(e) {
this.$.tabs.getControls()[e].setActive(!0);
for (var t = 0, n = this.getClientControls(), r; r = n[t]; t++) r.setShowing(t == e);
},
tabTap: function(e) {
this.selectTab(e.indexInContainer());
}
});

// SearchBar.js

enyo.kind({
name: "SearchBar",
events: {
onSearch: ""
},
handlers: {
onkeyup: "search",
onchange: "search"
},
components: [ {
xkind: "InputDecorator",
classes: "enyo-tool-decorator input-decorator",
style: "display: block;",
components: [ {
kind: "Input",
style: "width: 90%;"
}, {
kind: "Image",
src: "assets/search-input-search.png"
} ]
} ],
getValue: function() {
if (this.$.input.hasNode()) return this.$.input.node.value;
},
search: function() {
this.doSearch({
searchString: this.getValue()
});
}
});

// App.js

enyo.kind({
name: "App",
fit: !0,
kind: "FittableColumns",
components: [ {
kind: "Analyzer",
onIndexReady: "indexReady"
}, {
name: "left",
kind: "TabPanels",
classes: "enyo-unselectable",
components: [ {
kind: "Scroller",
tabName: "Kinds",
components: [ {
name: "kinds",
allowHtml: !0
} ]
}, {
kind: "Scroller",
tabName: "Modules",
components: [ {
name: "modules",
allowHtml: !0
} ]
}, {
kind: "Scroller",
tabName: "Index",
components: [ {
kind: "SearchBar",
onSearch: "search"
}, {
name: "index",
allowHtml: !0
} ]
}, {
name: "packages",
tabName: "Packages",
kind: "PackageList",
onPackagesChange: "loadPackages",
onLoaded: "packagesLoaded"
} ]
}, {
name: "doc",
kind: "FittableRows",
fit: !0,
components: [ {
name: "scope",
components: [ {
name: "inheritedCb",
kind: "Checkbox",
content: "show inherited",
onchange: "scopeChange"
}, {
name: "accessCb",
kind: "Checkbox",
content: "show protected",
style: "margin-left: 20px;",
onchange: "accessChange"
} ]
}, {
name: "header",
allowHtml: !0
}, {
name: "tocFrame",
kind: "Scroller",
components: [ {
name: "toc",
allowHtml: !0
} ]
}, {
name: "bodyFrame",
kind: "Scroller",
fit: !0,
classes: "enyo-selectable",
components: [ {
name: "indexBusy",
kind: "Image",
src: "assets/busy.gif",
style: "padding-left: 8px;",
showing: !1
}, {
name: "body",
allowHtml: !0
} ]
} ]
} ],
create: function() {
this.inherited(arguments), window.onhashchange = enyo.bind(this, "hashChange"), this.presentor = new Presentor, this.loadPackages();
},
loadPackages: function() {
this.index = this.$.analyzer.index = new Indexer, this.$.packages.loadPackageData();
},
packagesLoaded: function(e, t) {
document.title = "Enyo API Viewer (" + t.version + ")";
var n = [];
return enyo.forEach(t.packages, function(e) {
e.disabled || n.push({
path: e.path,
label: e.name
});
}), this.walk(n), !0;
},
walk: function(e) {
this.walking = !0, this.$.indexBusy.show(), this.$.analyzer.walk(e);
},
indexReady: function() {
this.presentKinds(), this.presentModules(), this.presentIndex(), this.$.indexBusy.hide(), this.walking = !1, this.hashChange();
},
indexalize: function(e, t, n) {
var r = e ? enyo.filter(this.index.objects, e, this) : this.index.objects;
r = this.nameFilter(r);
var i = "", s;
for (var o = 0, u; u = r[o]; o++) {
var a = n(u).divider;
a && s != a && (s = a, i += "<divider>" + a + "</divider>"), i += enyo.macroize(t, n(u));
}
return i;
},
nameFilter: function(e) {
return enyo.filter(e, function(e) {
return e.name && e.name[0] !== "_";
});
},
presentFilteredIndex: function(e) {
var t = '<a href="#{$link}"><prototype>{$object}</prototype><topic>{$topic}</topic>{$module}</a><br/>', n = function(e) {
return {
link: e.topic || e.name,
topic: e.name,
divider: e.name[0].toUpperCase(),
object: e.object && e.object.name ? e.object.name + "::" : "",
module: !e.object && e.module && e.module.name ? " [" + e.module.name + "]" : ""
};
};
this.$.index.setContent(this.indexalize(e, t, n));
},
presentIndex: function() {
var e = function(e) {
return e.name !== "published" && (e.group == "public" || e.group == "published");
};
this.presentFilteredIndex(e);
},
presentModules: function() {
var e = function(e) {
return e.type == "module";
}, t = '<a href="#{$link}"><topic>{$topic}</topic></a><br/>', n = function(e) {
return {
link: e.topic || e.name,
topic: e.name,
divider: e.name[0].toUpperCase()
};
};
this.$.modules.setContent(this.indexalize(e, t, n));
},
presentKinds: function() {
var e = function(e) {
return e.type == "kind" && e.group == "public";
}, t = '<a href="#{$link}"><topic>{$topic}</topic></a><br/>', n = function(e) {
return {
link: e.topic || e.name,
topic: e.name,
divider: e.name.split(".")[0]
};
};
this.$.kinds.setContent(this.indexalize(e, t, n));
},
presentObject: function(e) {
if (!e || !e.type) return;
if (e.type === "kind") {
this.$.header.show(), this.presentKind(e);
return;
}
e.type === "module" ? (this.$.header.show(), this.$.header.setContent("<moduleName>" + e.name + "</moduleName>")) : (this.$.header.hide(), this.$.header.setContent("")), this.$.toc.setContent(""), this.$.doc.reflow();
var t = "";
e && (t = this.presentor.presentObject(e)), this.$.body.setContent(t);
},
presentKind: function(e) {
this.$.header.setContent(this.presentor.presentKindHeader(e));
var t = this.presentor.showInherited ? e.allProperties : e.properties;
t = this.presentor.inlineProperties(t, {
published: 1,
statics: 1,
events: 1
}), t.sort(Indexer.nameCompare);
var n = this.presentor.presentColumns(t, e);
this.$.toc.setContent(n);
var r = this.presentor.presentKindSummary(e), i = this.presentor.presentKindProperties(e);
i && (r += "<h3>Properties</h3>" + i), this.$.body.setContent(r), this.$.doc.reflow();
},
presentModule: function(e) {
this.presentObject(e);
},
moduleTap: function(e) {
this.presentModule(e.object);
},
objectTap: function(e) {
this.presentObject(e.object);
},
hashChange: function(e) {
this.selectTopic(this.getHashTopic());
},
getHashTopic: function() {
return window.location.hash.slice(1);
},
selectTopic: function(e) {
this.topic = e;
var t = e.split("::"), n = t.shift(), r = t.shift(), i = this.index.findByName(n) || this.index.findByName("enyo." + n);
this.topicObject != i && (this.presentObject(i), this.topicObject = i, this.$.body.container.setScrollTop(0));
if (r) {
var s = document.getElementsByName(r)[0];
s && s.scrollIntoView(!0);
}
},
scopeChange: function() {
this.presentor.showInherited = this.$.inheritedCb.getValue(), this.topicObject = null, this.selectTopic(this.topic);
},
accessChange: function() {
this.presentor.showProtected = this.$.accessCb.getValue(), this.topicObject = null, this.selectTopic(this.topic);
},
search: function(e, t) {
this.setSearchString(t.searchString.toLowerCase());
},
setSearchString: function(e) {
var t = function(t) {
return t.name !== "published" && (t.group == "public" || t.group == "published") && t.name.toLowerCase().indexOf(e) >= 0;
};
this.presentFilteredIndex(t);
}
});
