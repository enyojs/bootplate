
// minifier: path aliases

enyo.path.addPaths({layout: "/home/enyojs/git/api-tool/enyo/tools/../../lib/layout/"});

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
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
clientClasses: "",
clientStyle: "",
rowOffset: 0
},
events: {
onSetupItem: "",
onRenderRow: ""
},
bottomUp: !1,
components: [ {
kind: "Selection",
onSelect: "selectDeselect",
onDeselect: "selectDeselect"
}, {
name: "client"
} ],
create: function() {
this.inherited(arguments), this.noSelectChanged(), this.multiSelectChanged(), this.clientClassesChanged(), this.clientStyleChanged();
},
noSelectChanged: function() {
this.noSelect && this.$.selection.clear();
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
for (var t = 0, n = 0; t < this.count; t++) n = this.rowOffset + (this.bottomUp ? this.count - t - 1 : t), this.setupItem(n), this.$.client.setAttribute("data-enyo-index", n), e += this.inherited(arguments), this.$.client.teardownRender();
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
if (this.noSelect || t.index === -1) return;
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
if (e < this.rowOffset || e >= this.count + this.rowOffset) return;
this.setupItem(e);
var t = this.fetchRowNode(e);
t && (enyo.dom.setInnerHtml(t, this.$.client.generateChildHtml()), this.$.client.teardownChildren(), this.doRenderRow({
rowIndex: e
}));
},
fetchRowNode: function(e) {
if (this.hasNode()) return this.node.querySelector('[data-enyo-index="' + e + '"]');
},
rowForEvent: function(e) {
if (!this.hasNode()) return -1;
var t = e.target;
while (t && t !== this.node) {
var n = t.getAttribute && t.getAttribute("data-enyo-index");
if (n !== null) return Number(n);
t = t.parentNode;
}
return -1;
},
prepareRow: function(e) {
if (e < 0 || e >= this.count) return;
this.setupItem(e);
var t = this.fetchRowNode(e);
enyo.FlyweightRepeater.claimNode(this.$.client, t);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(e, t, n) {
if (e < 0 || e >= this.count) return;
t && (this.prepareRow(e), enyo.call(n || null, t), this.lockRow());
},
statics: {
claimNode: function(e, t) {
var n;
t && (t.id !== e.id ? n = t.querySelector("#" + e.id) : n = t), e.generated = Boolean(n || !e.tag), e.node = n, e.node && e.rendered();
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
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
fixedHeight: !1,
reorderable: !1,
centerReorderContainer: !0,
reorderComponents: [],
pinnedReorderComponents: [],
swipeableComponents: [],
enableSwipe: !1,
persistSwipeableItem: !1
},
events: {
onSetupItem: "",
onSetupReorderComponents: "",
onSetupPinnedReorderComponents: "",
onReorder: "",
onSetupSwipeItem: "",
onSwipeDrag: "",
onSwipe: "",
onSwipeComplete: ""
},
handlers: {
onAnimateFinish: "animateFinish",
onRenderRow: "rowRendered",
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
onup: "up",
onholdpulse: "holdpulse"
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
name: "holdingarea",
allowHtml: !0,
classes: "enyo-list-holdingarea"
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "placeholder"
}, {
name: "swipeableComponents",
style: "position:absolute; display:block; top:-1000px; left:0;"
} ]
} ],
reorderHoldTimeMS: 600,
draggingRowIndex: -1,
draggingRowNode: null,
placeholderRowIndex: -1,
dragToScrollThreshold: .1,
prevScrollTop: 0,
autoScrollTimeoutMS: 20,
autoScrollTimeout: null,
autoscrollPageY: 0,
pinnedReorderMode: !1,
initialPinPosition: -1,
itemMoved: !1,
currentPageNumber: -1,
completeReorderTimeout: null,
swipeIndex: null,
swipeDirection: null,
persistentItemVisible: !1,
persistentItemOrigin: null,
swipeComplete: !1,
completeSwipeTimeout: null,
completeSwipeDelayMS: 500,
normalSwipeSpeedMS: 200,
fastSwipeSpeedMS: 100,
percentageDraggedThreshold: .2,
importProps: function(e) {
e && e.reorderable && (this.touch = !0), this.inherited(arguments);
},
create: function() {
this.pageHeights = [], this.inherited(arguments), this.getStrategy().translateOptimized = !0, this.bottomUpChanged(), this.noSelectChanged(), this.multiSelectChanged(), this.toggleSelectedChanged(), this.$.generator.setRowOffset(0), this.$.generator.setCount(this.count);
},
initComponents: function() {
this.createReorderTools(), this.inherited(arguments), this.createSwipeableComponents();
},
createReorderTools: function() {
this.createComponent({
name: "reorderContainer",
classes: "enyo-list-reorder-container",
ondown: "sendToStrategy",
ondrag: "sendToStrategy",
ondragstart: "sendToStrategy",
ondragfinish: "sendToStrategy",
onflick: "sendToStrategy"
});
},
createStrategy: function() {
this.controlParentName = "strategy", this.inherited(arguments), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
},
createSwipeableComponents: function() {
for (var e = 0; e < this.swipeableComponents.length; e++) this.$.swipeableComponents.createComponent(this.swipeableComponents[e], {
owner: this.owner
});
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
noSelectChanged: function() {
this.$.generator.setNoSelect(this.noSelect);
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
sendToStrategy: function(e, t) {
this.$.strategy.dispatchEvent("on" + t.type, t, e);
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.portSize = 0;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
holdpulse: function(e, t) {
if (!this.getReorderable() || this.isReordering()) return;
if (t.holdTime >= this.reorderHoldTimeMS && this.shouldStartReordering(e, t)) return t.preventDefault(), this.startReordering(t), !1;
},
dragstart: function(e, t) {
if (this.isReordering()) return !0;
if (this.isSwipeable()) return this.swipeDragStart(e, t);
},
drag: function(e, t) {
if (this.shouldDoReorderDrag(t)) return t.preventDefault(), this.reorderDrag(t), !0;
if (this.isSwipeable()) return t.preventDefault(), this.swipeDrag(e, t), !0;
},
dragfinish: function(e, t) {
this.isReordering() ? this.finishReordering(e, t) : this.isSwipeable() && this.swipeDragFinish(e, t);
},
up: function(e, t) {
this.isReordering() && this.finishReordering(e, t);
},
generatePage: function(e, t) {
this.page = e;
var n = this.rowsPerPage * this.page;
this.$.generator.setRowOffset(n);
var r = Math.min(this.count - n, this.rowsPerPage);
this.$.generator.setCount(r);
var i = this.$.generator.generateChildHtml();
t.setContent(i), this.getReorderable() && this.draggingRowIndex > -1 && this.hideReorderingRow();
var s = t.getBounds().height;
!this.rowHeight && s > 0 && (this.rowHeight = Math.floor(s / r), this.updateMetrics());
if (!this.fixedHeight) {
var o = this.getPageHeight(e);
this.pageHeights[e] = s, this.portSize += s - o;
}
},
pageForRow: function(e) {
return Math.floor(e / this.rowsPerPage);
},
preserveDraggingRowNode: function(e) {
this.draggingRowNode && this.pageForRow(this.draggingRowIndex) === e && (this.$.holdingarea.hasNode().appendChild(this.draggingRowNode), this.draggingRowNode = null, this.removedInitialPage = !0);
},
update: function(e) {
var t = !1, n = this.positionToPageInfo(e), r = n.pos + this.scrollerHeight / 2, i = Math.floor(r / Math.max(n.height, this.scrollerHeight) + .5) + n.no, s = i % 2 === 0 ? i : i - 1;
this.p0 != s && this.isPageInRange(s) && (this.preserveDraggingRowNode(this.p0), this.generatePage(s, this.$.page0), this.positionPage(s, this.$.page0), this.p0 = s, t = !0, this.p0RowBounds = this.getPageRowHeights(this.$.page0)), s = i % 2 === 0 ? Math.max(1, i - 1) : i, this.p1 != s && this.isPageInRange(s) && (this.preserveDraggingRowNode(this.p1), this.generatePage(s, this.$.page1), this.positionPage(s, this.$.page1), this.p1 = s, t = !0, this.p1RowBounds = this.getPageRowHeights(this.$.page1)), t && (this.$.generator.setRowOffset(0), this.$.generator.setCount(this.count), this.fixedHeight || (this.adjustBottomPage(), this.adjustPortSize()));
},
getPageRowHeights: function(e) {
var t = {}, n = e.hasNode().querySelectorAll("div[data-enyo-index]");
for (var r = 0, i, s; r < n.length; r++) i = n[r].getAttribute("data-enyo-index"), i !== null && (s = enyo.dom.getBounds(n[r]), t[parseInt(i, 10)] = {
height: s.height,
width: s.width
});
return t;
},
updateRowBounds: function(e) {
this.p0RowBounds[e] ? this.updateRowBoundsAtIndex(e, this.p0RowBounds, this.$.page0) : this.p1RowBounds[e] && this.updateRowBoundsAtIndex(e, this.p1RowBounds, this.$.page1);
},
updateRowBoundsAtIndex: function(e, t, n) {
var r = n.hasNode().querySelector('div[data-enyo-index="' + e + '"]'), i = enyo.dom.getBounds(r);
t[e].height = i.height, t[e].width = i.width;
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
return t = Math.max(t, 0), {
no: t,
height: r,
pos: n + r,
startRow: t * this.rowsPerPage,
endRow: Math.min((t + 1) * this.rowsPerPage - 1, this.count - 1)
};
},
isPageInRange: function(e) {
return e == Math.max(0, Math.min(this.pageCount - 1, e));
},
getPageHeight: function(e) {
var t = this.pageHeights[e];
if (!t) {
var n = this.rowsPerPage * e, r = Math.min(this.count - n, this.rowsPerPage);
t = this.defaultPageHeight * (r / this.rowsPerPage);
}
return Math.max(1, t);
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.p0RowBounds = {}, this.p1RowBounds = {}, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(e, t) {
var n = this.inherited(arguments), r = this.getScrollTop();
return this.lastPos === r ? n : (this.lastPos = r, this.update(r), this.pinnedReorderMode && this.reorderScroll(e, t), n);
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
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
scrollToRow: function(e) {
var t = this.pageForRow(e), n = e % this.rowsPerPage, r = this.pageToPosition(t);
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
deselect: function(e) {
return this.getSelection().deselect(e);
},
isSelected: function(e) {
return this.$.generator.isSelected(e);
},
renderRow: function(e) {
this.$.generator.renderRow(e);
},
rowRendered: function(e, t) {
this.updateRowBounds(t.rowIndex);
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
},
pageForPageNumber: function(e, t) {
return e % 2 === 0 ? !t || e === this.p0 ? this.$.page0 : null : !t || e === this.p1 ? this.$.page1 : null;
},
shouldStartReordering: function(e, t) {
return !!this.getReorderable() && t.rowIndex >= 0 && !this.pinnedReorderMode && e === this.$.strategy && t.index >= 0 ? !0 : !1;
},
startReordering: function(e) {
this.$.strategy.listReordering = !0, this.buildReorderContainer(), this.doSetupReorderComponents(e), this.styleReorderContainer(e), this.draggingRowIndex = this.placeholderRowIndex = e.rowIndex, this.draggingRowNode = e.target, this.removedInitialPage = !1, this.itemMoved = !1, this.initialPageNumber = this.currentPageNumber = this.pageForRow(e.rowIndex), this.prevScrollTop = this.getScrollTop(), this.replaceNodeWithPlaceholder(e.rowIndex);
},
buildReorderContainer: function() {
this.$.reorderContainer.destroyClientControls();
for (var e = 0; e < this.reorderComponents.length; e++) this.$.reorderContainer.createComponent(this.reorderComponents[e], {
owner: this.owner
});
this.$.reorderContainer.render();
},
styleReorderContainer: function(e) {
this.setItemPosition(this.$.reorderContainer, e.rowIndex), this.setItemBounds(this.$.reorderContainer, e.rowIndex), this.$.reorderContainer.setShowing(!0), this.centerReorderContainer && this.centerReorderContainerOnPointer(e);
},
appendNodeToReorderContainer: function(e) {
this.$.reorderContainer.createComponent({
allowHtml: !0,
content: e.innerHTML
}).render();
},
centerReorderContainerOnPointer: function(e) {
var t = enyo.dom.calcNodePosition(this.hasNode()), n = e.pageX - t.left - parseInt(this.$.reorderContainer.domStyles.width, 10) / 2, r = e.pageY - t.top + this.getScrollTop() - parseInt(this.$.reorderContainer.domStyles.height, 10) / 2;
this.getStrategyKind() != "ScrollStrategy" && (n -= this.getScrollLeft(), r -= this.getScrollTop()), this.positionReorderContainer(n, r);
},
positionReorderContainer: function(e, t) {
this.$.reorderContainer.addClass("enyo-animatedTopAndLeft"), this.$.reorderContainer.addStyles("left:" + e + "px;top:" + t + "px;"), this.setPositionReorderContainerTimeout();
},
setPositionReorderContainerTimeout: function() {
this.clearPositionReorderContainerTimeout(), this.positionReorderContainerTimeout = setTimeout(enyo.bind(this, function() {
this.$.reorderContainer.removeClass("enyo-animatedTopAndLeft"), this.clearPositionReorderContainerTimeout();
}), 100);
},
clearPositionReorderContainerTimeout: function() {
this.positionReorderContainerTimeout && (clearTimeout(this.positionReorderContainerTimeout), this.positionReorderContainerTimeout = null);
},
shouldDoReorderDrag: function() {
return !this.getReorderable() || this.draggingRowIndex < 0 || this.pinnedReorderMode ? !1 : !0;
},
reorderDrag: function(e) {
this.positionReorderNode(e), this.checkForAutoScroll(e), this.updatePlaceholderPosition(e.pageY);
},
updatePlaceholderPosition: function(e) {
var t = this.getRowIndexFromCoordinate(e);
t !== -1 && (t >= this.placeholderRowIndex ? this.movePlaceholderToIndex(Math.min(this.count, t + 1)) : this.movePlaceholderToIndex(t));
},
positionReorderNode: function(e) {
var t = this.$.reorderContainer.getBounds(), n = t.left + e.ddx, r = t.top + e.ddy;
r = this.getStrategyKind() == "ScrollStrategy" ? r + (this.getScrollTop() - this.prevScrollTop) : r, this.$.reorderContainer.addStyles("top: " + r + "px ; left: " + n + "px"), this.prevScrollTop = this.getScrollTop();
},
checkForAutoScroll: function(e) {
var t = enyo.dom.calcNodePosition(this.hasNode()), n = this.getBounds(), r;
this.autoscrollPageY = e.pageY, e.pageY - t.top < n.height * this.dragToScrollThreshold ? (r = 100 * (1 - (e.pageY - t.top) / (n.height * this.dragToScrollThreshold)), this.scrollDistance = -1 * r) : e.pageY - t.top > n.height * (1 - this.dragToScrollThreshold) ? (r = 100 * ((e.pageY - t.top - n.height * (1 - this.dragToScrollThreshold)) / (n.height - n.height * (1 - this.dragToScrollThreshold))), this.scrollDistance = 1 * r) : this.scrollDistance = 0, this.scrollDistance === 0 ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling();
},
stopAutoScrolling: function() {
this.autoScrollTimeout && (clearTimeout(this.autoScrollTimeout), this.autoScrollTimeout = null);
},
startAutoScrolling: function() {
this.autoScrollTimeout = setInterval(enyo.bind(this, this.autoScroll), this.autoScrollTimeoutMS);
},
autoScroll: function() {
this.scrollDistance === 0 ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling(), this.setScrollPosition(this.getScrollPosition() + this.scrollDistance), this.positionReorderNode({
ddx: 0,
ddy: 0
}), this.updatePlaceholderPosition(this.autoscrollPageY);
},
movePlaceholderToIndex: function(e) {
var t, n;
if (e < 0) return;
e >= this.count ? (t = null, n = this.pageForPageNumber(this.pageForRow(this.count - 1)).hasNode()) : (t = this.$.generator.fetchRowNode(e), n = t.parentNode);
var r = this.pageForRow(e);
r >= this.pageCount && (r = this.currentPageNumber), n.insertBefore(this.placeholderNode, t), this.currentPageNumber !== r && (this.updatePageHeight(this.currentPageNumber), this.updatePageHeight(r), this.updatePagePositions(r)), this.placeholderRowIndex = e, this.currentPageNumber = r, this.itemMoved = !0;
},
finishReordering: function(e, t) {
if (!this.isReordering() || this.pinnedReorderMode || this.completeReorderTimeout) return;
return this.stopAutoScrolling(), this.$.strategy.listReordering = !1, this.moveReorderedContainerToDroppedPosition(t), this.completeReorderTimeout = setTimeout(enyo.bind(this, this.completeFinishReordering, t), 100), t.preventDefault(), !0;
},
moveReorderedContainerToDroppedPosition: function() {
var e = this.getRelativeOffset(this.placeholderNode, this.hasNode()), t = this.getStrategyKind() == "ScrollStrategy" ? e.top : e.top - this.getScrollTop(), n = e.left - this.getScrollLeft();
this.positionReorderContainer(n, t);
},
completeFinishReordering: function(e) {
this.completeReorderTimeout = null, this.placeholderRowIndex > this.draggingRowIndex && (this.placeholderRowIndex = Math.max(0, this.placeholderRowIndex - 1));
if (this.draggingRowIndex == this.placeholderRowIndex && this.pinnedReorderComponents.length && !this.pinnedReorderMode && !this.itemMoved) {
this.beginPinnedReorder(e);
return;
}
this.removeDraggingRowNode(), this.removePlaceholderNode(), this.emptyAndHideReorderContainer(), this.pinnedReorderMode = !1, this.reorderRows(e), this.draggingRowIndex = this.placeholderRowIndex = -1, this.refresh();
},
beginPinnedReorder: function(e) {
this.buildPinnedReorderContainer(), this.doSetupPinnedReorderComponents(enyo.mixin(e, {
index: this.draggingRowIndex
})), this.pinnedReorderMode = !0, this.initialPinPosition = e.pageY;
},
emptyAndHideReorderContainer: function() {
this.$.reorderContainer.destroyComponents(), this.$.reorderContainer.setShowing(!1);
},
buildPinnedReorderContainer: function() {
this.$.reorderContainer.destroyClientControls();
for (var e = 0; e < this.pinnedReorderComponents.length; e++) this.$.reorderContainer.createComponent(this.pinnedReorderComponents[e], {
owner: this.owner
});
this.$.reorderContainer.render();
},
reorderRows: function(e) {
this.doReorder(this.makeReorderEvent(e)), this.positionReorderedNode(), this.updateListIndices();
},
makeReorderEvent: function(e) {
return e.reorderFrom = this.draggingRowIndex, e.reorderTo = this.placeholderRowIndex, e;
},
positionReorderedNode: function() {
if (!this.removedInitialPage) {
var e = this.$.generator.fetchRowNode(this.placeholderRowIndex);
e && (e.parentNode.insertBefore(this.hiddenNode, e), this.showNode(this.hiddenNode)), this.hiddenNode = null;
if (this.currentPageNumber != this.initialPageNumber) {
var t, n, r = this.pageForPageNumber(this.currentPageNumber), i = this.pageForPageNumber(this.currentPageNumber + 1);
this.initialPageNumber < this.currentPageNumber ? (t = r.hasNode().firstChild, i.hasNode().appendChild(t)) : (t = r.hasNode().lastChild, n = i.hasNode().firstChild, i.hasNode().insertBefore(t, n)), this.correctPageHeights(), this.updatePagePositions(this.initialPageNumber);
}
}
},
updateListIndices: function() {
if (this.shouldDoRefresh()) {
this.refresh(), this.correctPageHeights();
return;
}
var e = Math.min(this.draggingRowIndex, this.placeholderRowIndex), t = Math.max(this.draggingRowIndex, this.placeholderRowIndex), n = this.draggingRowIndex - this.placeholderRowIndex > 0 ? 1 : -1, r, i, s, o;
if (n === 1) {
r = this.$.generator.fetchRowNode(this.draggingRowIndex), r && r.setAttribute("data-enyo-index", "reordered");
for (i = t - 1, s = t; i >= e; i--) {
r = this.$.generator.fetchRowNode(i);
if (!r) continue;
o = parseInt(r.getAttribute("data-enyo-index"), 10), s = o + 1, r.setAttribute("data-enyo-index", s);
}
r = this.hasNode().querySelector('[data-enyo-index="reordered"]'), r.setAttribute("data-enyo-index", this.placeholderRowIndex);
} else {
r = this.$.generator.fetchRowNode(this.draggingRowIndex), r && r.setAttribute("data-enyo-index", this.placeholderRowIndex);
for (i = e + 1, s = e; i <= t; i++) {
r = this.$.generator.fetchRowNode(i);
if (!r) continue;
o = parseInt(r.getAttribute("data-enyo-index"), 10), s = o - 1, r.setAttribute("data-enyo-index", s);
}
}
},
shouldDoRefresh: function() {
return Math.abs(this.initialPageNumber - this.currentPageNumber) > 1;
},
getNodeStyle: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) return;
var n = this.getRelativeOffset(t, this.hasNode()), r = enyo.dom.getBounds(t);
return {
h: r.height,
w: r.width,
left: n.left,
top: n.top
};
},
getRelativeOffset: function(e, t) {
var n = {
top: 0,
left: 0
};
if (e !== t && e.parentNode) do n.top += e.offsetTop || 0, n.left += e.offsetLeft || 0, e = e.offsetParent; while (e && e !== t);
return n;
},
replaceNodeWithPlaceholder: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) {
enyo.log("No node - " + e);
return;
}
this.placeholderNode = this.createPlaceholderNode(t), this.hiddenNode = this.hideNode(t);
var n = this.pageForPageNumber(this.currentPageNumber);
n.hasNode().insertBefore(this.placeholderNode, this.hiddenNode);
},
createPlaceholderNode: function(e) {
var t = this.$.placeholder.hasNode().cloneNode(!0), n = enyo.dom.getBounds(e);
return t.style.height = n.height + "px", t.style.width = n.width + "px", t;
},
removePlaceholderNode: function() {
this.removeNode(this.placeholderNode), this.placeholderNode = null;
},
removeDraggingRowNode: function() {
this.draggingRowNode = null;
var e = this.$.holdingarea.hasNode();
e.innerHTML = "";
},
removeNode: function(e) {
if (!e || !e.parentNode) return;
e.parentNode.removeChild(e);
},
updatePageHeight: function(e) {
if (e < 0) return;
var t = this.pageForPageNumber(e, !0);
if (t) {
var n = this.pageHeights[e], r = Math.max(1, t.getBounds().height);
this.pageHeights[e] = r, this.portSize += r - n;
}
},
updatePagePositions: function(e) {
this.positionPage(this.currentPageNumber, this.pageForPageNumber(this.currentPageNumber)), this.positionPage(e, this.pageForPageNumber(e));
},
correctPageHeights: function() {
this.updatePageHeight(this.currentPageNumber), this.initialPageNumber != this.currentPageNumber && this.updatePageHeight(this.initialPageNumber);
},
hideNode: function(e) {
return e.style.display = "none", e;
},
showNode: function(e) {
return e.style.display = "block", e;
},
dropPinnedRow: function(e) {
this.moveReorderedContainerToDroppedPosition(e), this.completeReorderTimeout = setTimeout(enyo.bind(this, this.completeFinishReordering, e), 100);
return;
},
cancelPinnedMode: function(e) {
this.placeholderRowIndex = this.draggingRowIndex, this.dropPinnedRow(e);
},
getRowIndexFromCoordinate: function(e) {
var t = this.getScrollTop() + e - enyo.dom.calcNodePosition(this.hasNode()).top;
if (t < 0) return -1;
var n = this.positionToPageInfo(t), r = n.no == this.p0 ? this.p0RowBounds : this.p1RowBounds;
if (!r) return this.count;
var i = n.pos, s = this.placeholderNode ? enyo.dom.getBounds(this.placeholderNode).height : 0, o = 0;
for (var u = n.startRow; u <= n.endRow; ++u) {
if (u === this.placeholderRowIndex) {
o += s;
if (o >= i) return -1;
}
if (u !== this.draggingRowIndex) {
o += r[u].height;
if (o >= i) return u;
}
}
return u;
},
getIndexPosition: function(e) {
return enyo.dom.calcNodePosition(this.$.generator.fetchRowNode(e));
},
setItemPosition: function(e, t) {
var n = this.getNodeStyle(t), r = this.getStrategyKind() == "ScrollStrategy" ? n.top : n.top - this.getScrollTop(), i = "top:" + r + "px; left:" + n.left + "px;";
e.addStyles(i);
},
setItemBounds: function(e, t) {
var n = this.getNodeStyle(t), r = "width:" + n.w + "px; height:" + n.h + "px;";
e.addStyles(r);
},
reorderScroll: function(e, t) {
this.getStrategyKind() == "ScrollStrategy" && this.$.reorderContainer.addStyles("top:" + (this.initialPinPosition + this.getScrollTop() - this.rowHeight) + "px;"), this.updatePlaceholderPosition(this.initialPinPosition);
},
hideReorderingRow: function() {
var e = this.hasNode().querySelector('[data-enyo-index="' + this.draggingRowIndex + '"]');
e && (this.hiddenNode = this.hideNode(e));
},
isReordering: function() {
return this.draggingRowIndex > -1;
},
isSwiping: function() {
return this.swipeIndex != null && !this.swipeComplete && this.swipeDirection != null;
},
swipeDragStart: function(e, t) {
return t.index == null || t.vertical ? !0 : (this.completeSwipeTimeout && this.completeSwipe(t), this.swipeComplete = !1, this.swipeIndex != t.index && (this.clearSwipeables(), this.swipeIndex = t.index), this.swipeDirection = t.xDirection, this.persistentItemVisible || this.startSwipe(t), this.draggedXDistance = 0, this.draggedYDistance = 0, !0);
},
swipeDrag: function(e, t) {
return this.persistentItemVisible ? (this.dragPersistentItem(t), this.preventDragPropagation) : this.isSwiping() ? (this.dragSwipeableComponents(this.calcNewDragPosition(t.ddx)), this.draggedXDistance = t.dx, this.draggedYDistance = t.dy, !0) : !1;
},
swipeDragFinish: function(e, t) {
if (this.persistentItemVisible) this.dragFinishPersistentItem(t); else {
if (!this.isSwiping()) return !1;
var n = this.calcPercentageDragged(this.draggedXDistance);
n > this.percentageDraggedThreshold && t.xDirection === this.swipeDirection ? this.swipe(this.fastSwipeSpeedMS) : this.backOutSwipe(t);
}
return this.preventDragPropagation;
},
isSwipeable: function() {
return this.enableSwipe && this.$.swipeableComponents.controls.length !== 0 && !this.isReordering() && !this.pinnedReorderMode;
},
positionSwipeableContainer: function(e, t) {
var n = this.$.generator.fetchRowNode(e);
if (!n) return;
var r = this.getRelativeOffset(n, this.hasNode()), i = enyo.dom.getBounds(n), s = t == 1 ? -1 * i.width : i.width;
this.$.swipeableComponents.addStyles("top: " + r.top + "px; left: " + s + "px; height: " + i.height + "px; width: " + i.width + "px;");
},
calcNewDragPosition: function(e) {
var t = this.$.swipeableComponents.getBounds(), n = t.left, r = this.$.swipeableComponents.getBounds(), i = this.swipeDirection == 1 ? 0 : -1 * r.width, s = this.swipeDirection == 1 ? n + e > i ? i : n + e : n + e < i ? i : n + e;
return s;
},
dragSwipeableComponents: function(e) {
this.$.swipeableComponents.applyStyle("left", e + "px");
},
startSwipe: function(e) {
e.index = this.swipeIndex, this.positionSwipeableContainer(this.swipeIndex, e.xDirection), this.$.swipeableComponents.setShowing(!0), this.setPersistentItemOrigin(e.xDirection), this.doSetupSwipeItem(e);
},
dragPersistentItem: function(e) {
var t = 0, n = this.persistentItemOrigin == "right" ? Math.max(t, t + e.dx) : Math.min(t, t + e.dx);
this.$.swipeableComponents.applyStyle("left", n + "px");
},
dragFinishPersistentItem: function(e) {
var t = this.calcPercentageDragged(e.dx) > .2, n = e.dx > 0 ? "right" : e.dx < 0 ? "left" : null;
this.persistentItemOrigin == n ? t ? this.slideAwayItem() : this.bounceItem(e) : this.bounceItem(e);
},
setPersistentItemOrigin: function(e) {
this.persistentItemOrigin = e == 1 ? "left" : "right";
},
calcPercentageDragged: function(e) {
return Math.abs(e / this.$.swipeableComponents.getBounds().width);
},
swipe: function(e) {
this.swipeComplete = !0, this.animateSwipe(0, e);
},
backOutSwipe: function(e) {
var t = this.$.swipeableComponents.getBounds(), n = this.swipeDirection == 1 ? -1 * t.width : t.width;
this.animateSwipe(n, this.fastSwipeSpeedMS), this.swipeDirection = null;
},
bounceItem: function(e) {
var t = this.$.swipeableComponents.getBounds();
t.left != t.width && this.animateSwipe(0, this.normalSwipeSpeedMS);
},
slideAwayItem: function() {
var e = this.$.swipeableComponents, t = e.getBounds().width, n = this.persistentItemOrigin == "left" ? -1 * t : t;
this.animateSwipe(n, this.normalSwipeSpeedMS), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
},
clearSwipeables: function() {
this.$.swipeableComponents.setShowing(!1), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
},
completeSwipe: function(e) {
this.completeSwipeTimeout && (clearTimeout(this.completeSwipeTimeout), this.completeSwipeTimeout = null), this.getPersistSwipeableItem() ? this.persistentItemVisible = !0 : (this.$.swipeableComponents.setShowing(!1), this.swipeComplete && this.doSwipeComplete({
index: this.swipeIndex,
xDirection: this.swipeDirection
})), this.swipeIndex = null, this.swipeDirection = null;
},
animateSwipe: function(e, t) {
var n = enyo.now(), r = 0, i = this.$.swipeableComponents, s = parseInt(i.domStyles.left, 10), o = e - s;
this.stopAnimateSwipe();
var u = enyo.bind(this, function() {
var e = enyo.now() - n, r = e / t, a = s + o * Math.min(r, 1);
i.applyStyle("left", a + "px"), this.job = enyo.requestAnimationFrame(u), e / t >= 1 && (this.stopAnimateSwipe(), this.completeSwipeTimeout = setTimeout(enyo.bind(this, function() {
this.completeSwipe();
}), this.completeSwipeDelayMS));
});
this.job = enyo.requestAnimationFrame(u);
},
stopAnimateSwipe: function() {
this.job && (this.job = enyo.cancelRequestAnimationFrame(this.job));
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
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.strategyKind = this.resetStrategyKind(), this.inherited(arguments);
},
resetStrategyKind: function() {
return enyo.platform.android >= 3 ? "TranslateScrollStrategy" : "TouchScrollStrategy";
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
var r = this.getStrategy().$.scrollMath || this.getStrategy(), i = -1 * this.getScrollTop();
return r.isInOverScroll() && i > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + i + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), i > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && i < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel())), n;
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var e = this.getStrategy().$.scrollMath || this.getStrategy();
e.setScrollY(-1 * this.getScrollTop() - this.pullHeight), this.pullRelease();
}
},
completePull: function() {
this.completingPull = !0;
var e = this.getStrategy().$.scrollMath || this.getStrategy();
e.setScrollY(this.pullHeight), e.start();
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

// AroundList.js

enyo.kind({
name: "enyo.AroundList",
kind: "enyo.List",
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "aboveClient"
}, {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "holdingarea",
allowHtml: !0,
classes: "enyo-list-holdingarea"
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "belowClient"
}, {
name: "placeholder"
}, {
name: "swipeableComponents",
style: "position:absolute; display:block; top:-1000px; left:0px;"
} ]
} ],
aboveComponents: null,
initComponents: function() {
this.inherited(arguments), this.aboveComponents && this.$.aboveClient.createComponents(this.aboveComponents, {
owner: this.owner
}), this.belowComponents && this.$.belowClient.createComponents(this.belowComponents, {
owner: this.owner
});
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.aboveHeight = this.$.aboveClient.getBounds().height, this.belowHeight = this.$.belowClient.getBounds().height, this.portSize = this.aboveHeight + this.belowHeight;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e), r = this.bottomUp ? this.belowHeight : this.aboveHeight;
n += r, t.applyStyle(this.pageBound, n + "px");
},
scrollToContentStart: function() {
var e = this.bottomUp ? this.belowHeight : this.aboveHeight;
this.setScrollPosition(e);
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
calcArrangementDifference: function(e, t, n, r) {},
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
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android && enyo.platform.ie !== 10) {
var i = t.left, s = t.top;
i = enyo.isString(i) ? i : i && i + r, s = enyo.isString(s) ? s : s && s + r, enyo.dom.transform(e, {
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
for (var n = 0, r, i, s; r = e[n]; n++) s = n === 0 ? 1 : 0, this.arrangeControl(r, {
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
var i = this.container.fromIndex;
t = this.container.toIndex, this.container.transitionPoints = [ t + "." + i + ".s", t + "." + i + ".f" ];
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
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s, o, u;
n.height -= t.top + t.bottom, n.width -= t.left + t.right;
var a;
for (r = 0, s = 0; u = e[r]; r++) o = enyo.dom.calcMarginExtents(u.hasNode()), u.width = u.getBounds().width, u.marginWidth = o.right + o.left, s += (u.fit ? 0 : u.width) + u.marginWidth, u.fit && (a = u);
if (a) {
var f = n.width - s;
a.width = f >= 0 ? f : a.width;
}
for (r = 0, i = t.left; u = e[r]; r++) u.setBounds({
top: t.top,
bottom: t.bottom,
width: u.fit ? u.width : null
});
},
arrange: function(e, t) {
this.container.wrap ? this.arrangeWrap(e, t) : this.arrangeNoWrap(e, t);
},
arrangeNoWrap: function(e, t) {
var n, r, i, s, o = this.container.getPanels(), u = this.container.clamp(t), a = this.containerBounds.width;
for (n = u, i = 0; s = o[n]; n++) {
i += s.width + s.marginWidth;
if (i > a) break;
}
var f = a - i, l = 0;
if (f > 0) {
var c = u;
for (n = u - 1, r = 0; s = o[n]; n--) {
r += s.width + s.marginWidth;
if (f - r <= 0) {
l = f - r, u = n;
break;
}
}
}
var h, p;
for (n = 0, p = this.containerPadding.left + l; s = o[n]; n++) h = s.width + s.marginWidth, n < u ? this.arrangeControl(s, {
left: -h
}) : (this.arrangeControl(s, {
left: Math.floor(p)
}), p += h);
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
peekWidth: 0,
size: function() {
this.clearLastSize(), this.inherited(arguments);
},
clearLastSize: function() {
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) n._fit && e != t.length - 1 && (n.applyStyle("width", null), n._fit = null);
},
constructor: function() {
this.inherited(arguments), this.peekWidth = this.container.peekWidth != null ? this.container.peekWidth : this.peekWidth;
},
arrange: function(e, t) {
var n = this.container.getPanels();
for (var r = 0, i = this.containerPadding.left, s, o, u = 0; o = n[r]; r++) o.getShowing() ? (this.arrangeControl(o, {
left: i + u * this.peekWidth
}), r >= t && (i += o.width + o.marginWidth - this.peekWidth), u++) : (this.arrangeControl(o, {
left: i
}), r >= t && (i += o.width + o.marginWidth)), r == n.length - 1 && t < 0 && this.arrangeControl(o, {
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

// DockRightArranger.js

enyo.kind({
name: "enyo.DockRightArranger",
kind: "Arranger",
basePanel: !1,
overlap: 0,
layoutWidth: 0,
constructor: function() {
this.inherited(arguments), this.overlap = this.container.overlap != null ? this.container.overlap : this.overlap, this.layoutWidth = this.container.layoutWidth != null ? this.container.layoutWidth : this.layoutWidth;
},
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s;
n.width -= t.left + t.right;
var o = n.width, u = e.length;
this.container.transitionPositions = {};
for (r = 0; s = e[r]; r++) s.width = r === 0 && this.container.basePanel ? o : s.getBounds().width;
for (r = 0; s = e[r]; r++) {
r === 0 && this.container.basePanel && s.setBounds({
width: o
}), s.setBounds({
top: t.top,
bottom: t.bottom
});
for (j = 0; s = e[j]; j++) {
var a;
if (r === 0 && this.container.basePanel) a = 0; else if (j < r) a = o; else {
if (r !== j) break;
var f = o > this.layoutWidth ? this.overlap : 0;
a = o - e[r].width + f;
}
this.container.transitionPositions[r + "." + j] = a;
}
if (j < u) {
var l = !1;
for (k = r + 1; k < u; k++) {
var f = 0;
if (l) f = 0; else if (e[r].width + e[k].width - this.overlap > o) f = 0, l = !0; else {
f = e[r].width - this.overlap;
for (i = r; i < k; i++) {
var c = f + e[i + 1].width - this.overlap;
if (!(c < o)) {
f = o;
break;
}
f = c;
}
f = o - f;
}
this.container.transitionPositions[r + "." + k] = f;
}
}
}
},
arrange: function(e, t) {
var n, r, i = this.container.getPanels(), s = this.container.clamp(t);
for (n = 0; r = i[n]; n++) {
var o = this.container.transitionPositions[n + "." + s];
this.arrangeControl(r, {
left: o
});
}
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels(), s = e < n ? i[n].width : i[e].width;
return s;
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
var n, r, i, s;
if (this.container.getPanels().length == 1) {
s = {}, s[this.axisPosition] = this.margin, this.arrangeControl(this.container.getPanels()[0], s);
return;
}
var o = Math.floor(this.container.getPanels().length / 2), u = this.getOrderedControls(Math.floor(t) - o), a = this.containerBounds[this.axisSize] - this.margin - this.margin, f = this.margin - a * o;
for (n = 0; r = u[n]; n++) s = {}, s[this.axisPosition] = f, this.arrangeControl(r, s), f += a;
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
ondragfinish: "dragfinish",
onscroll: "domScroll"
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
rendered: function() {
this.inherited(arguments), enyo.makeBubble(this, "scroll");
},
domScroll: function(e, t) {
this.hasNode() && this.node.scrollLeft > 0 && (this.node.scrollLeft = 0);
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
destroy: function() {
this.destroying = !0, this.inherited(arguments);
},
removeControl: function(e) {
this.inherited(arguments), this.destroying && this.controls.length > 0 && this.isPanel(e) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
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
var e = this.getPanels(), t = this.index % e.length;
return t < 0 && (t += e.length), e[t];
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
this.lastIndex = e, this.index = this.clamp(this.index), !this.dragging && this.$.animator && (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
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
this.$.animator && this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(), this.fraction = 1, this.stepTransition(), this.finishTransition();
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

// ImageViewPin.js

enyo.kind({
name: "enyo.ImageViewPin",
kind: "enyo.Control",
published: {
highlightAnchorPoint: !1,
anchor: {
top: 0,
left: 0
},
position: {
top: 0,
left: 0
}
},
style: "position:absolute;z-index:1000;width:0px;height:0px;",
handlers: {
onPositionPin: "reAnchor"
},
create: function() {
this.inherited(arguments), this.styleClientControls(), this.positionClientControls(), this.highlightAnchorPointChanged(), this.anchorChanged();
},
styleClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) e[t].applyStyle("position", "absolute");
},
positionClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) for (var n in this.position) e[t].applyStyle(n, this.position[n] + "px");
},
highlightAnchorPointChanged: function() {
this.addRemoveClass("pinDebug", this.highlightAnchorPoint);
},
anchorChanged: function() {
var e = null, t = null;
for (t in this.anchor) {
e = this.anchor[t].toString().match(/^(\d+(?:\.\d+)?)(.*)$/);
if (!e) continue;
this.anchor[t + "Coords"] = {
value: e[1],
units: e[2] || "px"
};
}
},
reAnchor: function(e, t) {
var n = t.scale, r = t.bounds, i = this.anchor.right ? this.anchor.rightCoords.units == "px" ? r.width + r.x - this.anchor.rightCoords.value * n : r.width * (100 - this.anchor.rightCoords.value) / 100 + r.x : this.anchor.leftCoords.units == "px" ? this.anchor.leftCoords.value * n + r.x : r.width * this.anchor.leftCoords.value / 100 + r.x, s = this.anchor.bottom ? this.anchor.bottomCoords.units == "px" ? r.height + r.y - this.anchor.bottomCoords.value * n : r.height * (100 - this.anchor.bottomCoords.value) / 100 + r.y : this.anchor.topCoords.units == "px" ? this.anchor.topCoords.value * n + r.y : r.height * this.anchor.topCoords.value / 100 + r.y;
this.applyStyle("left", i + "px"), this.applyStyle("top", s + "px");
}
});

// ImageView.js

enyo.kind({
name: "enyo.ImageView",
kind: enyo.Scroller,
touchOverscroll: !1,
thumb: !1,
animate: !0,
verticalDragPropagation: !0,
horizontalDragPropagation: !0,
published: {
scale: "auto",
disableZoom: !1,
src: undefined
},
events: {
onZoom: ""
},
touch: !0,
preventDragPropagation: !1,
handlers: {
ondragstart: "dragPropagation"
},
components: [ {
name: "animator",
kind: "Animator",
onStep: "zoomAnimationStep",
onEnd: "zoomAnimationEnd"
}, {
name: "viewport",
style: "overflow:hidden;min-height:100%;min-width:100%;",
classes: "enyo-fit",
ongesturechange: "gestureTransform",
ongestureend: "saveState",
ontap: "singleTap",
ondblclick: "doubleClick",
onmousewheel: "mousewheel",
components: [ {
kind: "Image",
ondown: "down"
} ]
} ],
create: function() {
this.inherited(arguments), this.canTransform = enyo.dom.canTransform(), this.canTransform || this.$.image.applyStyle("position", "relative"), this.canAccelerate = enyo.dom.canAccelerate(), this.bufferImage = new Image, this.bufferImage.onload = enyo.bind(this, "imageLoaded"), this.bufferImage.onerror = enyo.bind(this, "imageError"), this.srcChanged(), this.getStrategy().setDragDuringGesture(!1), this.getStrategy().$.scrollMath && this.getStrategy().$.scrollMath.start();
},
down: function(e, t) {
t.preventDefault();
},
dragPropagation: function(e, t) {
var n = this.getStrategy().getScrollBounds(), r = n.top === 0 && t.dy > 0 || n.top >= n.maxTop - 2 && t.dy < 0, i = n.left === 0 && t.dx > 0 || n.left >= n.maxLeft - 2 && t.dx < 0;
return !(r && this.verticalDragPropagation || i && this.horizontalDragPropagation);
},
mousewheel: function(e, t) {
t.pageX |= t.clientX + t.target.scrollLeft, t.pageY |= t.clientY + t.target.scrollTop;
var n = (this.maxScale - this.minScale) / 10, r = this.scale;
if (t.wheelDelta > 0 || t.detail < 0) this.scale = this.limitScale(this.scale + n); else if (t.wheelDelta < 0 || t.detail > 0) this.scale = this.limitScale(this.scale - n);
return this.eventPt = this.calcEventLocation(t), this.transformImage(this.scale), r != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null, t.preventDefault(), !0;
},
srcChanged: function() {
this.src && this.src.length > 0 && this.bufferImage && this.src != this.bufferImage.src && (this.bufferImage.src = this.src);
},
imageLoaded: function(e) {
this.originalWidth = this.bufferImage.width, this.originalHeight = this.bufferImage.height, this.scaleChanged(), this.$.image.setSrc(this.bufferImage.src), enyo.dom.transformValue(this.getStrategy().$.client, "translate3d", "0px, 0px, 0"), this.positionClientControls(this.scale), this.alignImage();
},
resizeHandler: function() {
this.inherited(arguments), this.$.image.src && this.scaleChanged();
},
scaleChanged: function() {
var e = this.hasNode();
if (e) {
this.containerWidth = e.clientWidth, this.containerHeight = e.clientHeight;
var t = this.containerWidth / this.originalWidth, n = this.containerHeight / this.originalHeight;
this.minScale = Math.min(t, n), this.maxScale = this.minScale * 3 < 1 ? 1 : this.minScale * 3, this.scale == "auto" ? this.scale = this.minScale : this.scale == "width" ? this.scale = t : this.scale == "height" ? this.scale = n : this.scale == "fit" ? (this.fitAlignment = "center", this.scale = Math.max(t, n)) : (this.maxScale = Math.max(this.maxScale, this.scale), this.scale = this.limitScale(this.scale));
}
this.eventPt = this.calcEventLocation(), this.transformImage(this.scale);
},
imageError: function(e) {
enyo.error("Error loading image: " + this.src), this.bubble("onerror", e);
},
alignImage: function() {
if (this.fitAlignment && this.fitAlignment === "center") {
var e = this.getScrollBounds();
this.setScrollLeft(e.maxLeft / 2), this.setScrollTop(e.maxTop / 2);
}
},
gestureTransform: function(e, t) {
this.eventPt = this.calcEventLocation(t), this.transformImage(this.limitScale(this.scale * t.scale));
},
calcEventLocation: function(e) {
var t = {
x: 0,
y: 0
};
if (e && this.hasNode()) {
var n = this.node.getBoundingClientRect();
t.x = Math.round(e.pageX - n.left - this.imageBounds.x), t.x = Math.max(0, Math.min(this.imageBounds.width, t.x)), t.y = Math.round(e.pageY - n.top - this.imageBounds.y), t.y = Math.max(0, Math.min(this.imageBounds.height, t.y));
}
return t;
},
transformImage: function(e) {
this.tapped = !1;
var t = this.imageBounds || this.innerImageBounds(e);
this.imageBounds = this.innerImageBounds(e), this.scale > this.minScale ? this.$.viewport.applyStyle("cursor", "move") : this.$.viewport.applyStyle("cursor", null), this.$.viewport.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px"
}), this.ratioX = this.ratioX || (this.eventPt.x + this.getScrollLeft()) / t.width, this.ratioY = this.ratioY || (this.eventPt.y + this.getScrollTop()) / t.height;
var n, r;
this.$.animator.ratioLock ? (n = this.$.animator.ratioLock.x * this.imageBounds.width - this.containerWidth / 2, r = this.$.animator.ratioLock.y * this.imageBounds.height - this.containerHeight / 2) : (n = this.ratioX * this.imageBounds.width - this.eventPt.x, r = this.ratioY * this.imageBounds.height - this.eventPt.y), n = Math.max(0, Math.min(this.imageBounds.width - this.containerWidth, n)), r = Math.max(0, Math.min(this.imageBounds.height - this.containerHeight, r));
if (this.canTransform) {
var i = {
scale: e
};
this.canAccelerate ? i = enyo.mixin({
translate3d: Math.round(this.imageBounds.left) + "px, " + Math.round(this.imageBounds.top) + "px, 0px"
}, i) : i = enyo.mixin({
translate: this.imageBounds.left + "px, " + this.imageBounds.top + "px"
}, i), enyo.dom.transform(this.$.image, i);
} else this.$.image.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px",
left: this.imageBounds.left + "px",
top: this.imageBounds.top + "px"
});
this.setScrollLeft(n), this.setScrollTop(r), this.positionClientControls(e);
},
limitScale: function(e) {
return this.disableZoom ? e = this.scale : e > this.maxScale ? e = this.maxScale : e < this.minScale && (e = this.minScale), e;
},
innerImageBounds: function(e) {
var t = this.originalWidth * e, n = this.originalHeight * e, r = {
x: 0,
y: 0,
transX: 0,
transY: 0
};
return t < this.containerWidth && (r.x += (this.containerWidth - t) / 2), n < this.containerHeight && (r.y += (this.containerHeight - n) / 2), this.canTransform && (r.transX -= (this.originalWidth - t) / 2, r.transY -= (this.originalHeight - n) / 2), {
left: r.x + r.transX,
top: r.y + r.transY,
width: t,
height: n,
x: r.x,
y: r.y
};
},
saveState: function(e, t) {
var n = this.scale;
this.scale *= t.scale, this.scale = this.limitScale(this.scale), n != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null;
},
doubleClick: function(e, t) {
enyo.platform.ie == 8 && (this.tapped = !0, t.pageX = t.clientX + t.target.scrollLeft, t.pageY = t.clientY + t.target.scrollTop, this.singleTap(e, t), t.preventDefault());
},
singleTap: function(e, t) {
setTimeout(enyo.bind(this, function() {
this.tapped = !1;
}), 300), this.tapped ? (this.tapped = !1, this.smartZoom(e, t)) : this.tapped = !0;
},
smartZoom: function(e, t) {
var n = this.hasNode(), r = this.$.image.hasNode();
if (n && r && this.hasNode() && !this.disableZoom) {
var i = this.scale;
this.scale != this.minScale ? this.scale = this.minScale : this.scale = this.maxScale, this.eventPt = this.calcEventLocation(t);
if (this.animate) {
var s = {
x: (this.eventPt.x + this.getScrollLeft()) / this.imageBounds.width,
y: (this.eventPt.y + this.getScrollTop()) / this.imageBounds.height
};
this.$.animator.play({
duration: 350,
ratioLock: s,
baseScale: i,
deltaScale: this.scale - i
});
} else this.transformImage(this.scale), this.doZoom({
scale: this.scale
});
}
},
zoomAnimationStep: function(e, t) {
var n = this.$.animator.baseScale + this.$.animator.deltaScale * this.$.animator.value;
this.transformImage(n);
},
zoomAnimationEnd: function(e, t) {
this.doZoom({
scale: this.scale
}), this.$.animator.ratioLock = undefined;
},
positionClientControls: function(e) {
this.waterfallDown("onPositionPin", {
scale: e,
bounds: this.imageBounds
});
}
});

// ImageCarousel.js

enyo.kind({
name: "enyo.ImageCarousel",
kind: enyo.Panels,
arrangerKind: "enyo.CarouselArranger",
defaultScale: "auto",
disableZoom: !1,
lowMemory: !1,
published: {
images: []
},
handlers: {
onTransitionStart: "transitionStart",
onTransitionFinish: "transitionFinish"
},
create: function() {
this.inherited(arguments), this.imageCount = this.images.length, this.images.length > 0 && (this.initContainers(), this.loadNearby());
},
initContainers: function() {
for (var e = 0; e < this.images.length; e++) this.$["container" + e] || (this.createComponent({
name: "container" + e,
style: "height:100%; width:100%;"
}), this.$["container" + e].render());
for (e = this.images.length; e < this.imageCount; e++) this.$["image" + e] && this.$["image" + e].destroy(), this.$["container" + e].destroy();
this.imageCount = this.images.length;
},
loadNearby: function() {
var e = this.getBufferRange();
for (var t in e) this.loadImageView(e[t]);
},
getBufferRange: function() {
var e = [];
if (this.layout.containerBounds) {
var t = 1, n = this.layout.containerBounds, r, i, s, o, u, a;
o = this.index - 1, u = 0, a = n.width * t;
while (o >= 0 && u <= a) s = this.$["container" + o], u += s.width + s.marginWidth, e.unshift(o), o--;
o = this.index, u = 0, a = n.width * (t + 1);
while (o < this.images.length && u <= a) s = this.$["container" + o], u += s.width + s.marginWidth, e.push(o), o++;
}
return e;
},
reflow: function() {
this.inherited(arguments), this.loadNearby();
},
loadImageView: function(e) {
return this.wrap && (e = (e % this.images.length + this.images.length) % this.images.length), e >= 0 && e <= this.images.length - 1 && (this.$["image" + e] ? this.$["image" + e].src != this.images[e] && (this.$["image" + e].setSrc(this.images[e]), this.$["image" + e].setScale(this.defaultScale), this.$["image" + e].setDisableZoom(this.disableZoom)) : (this.$["container" + e].createComponent({
name: "image" + e,
kind: "ImageView",
scale: this.defaultScale,
disableZoom: this.disableZoom,
src: this.images[e],
verticalDragPropagation: !1,
style: "height:100%; width:100%;"
}, {
owner: this
}), this.$["image" + e].render())), this.$["image" + e];
},
setImages: function(e) {
this.setPropertyValue("images", e, "imagesChanged");
},
imagesChanged: function() {
this.initContainers(), this.loadNearby();
},
indexChanged: function() {
this.loadNearby(), this.lowMemory && this.cleanupMemory(), this.inherited(arguments);
},
transitionStart: function(e, t) {
if (t.fromIndex == t.toIndex) return !0;
},
transitionFinish: function(e, t) {
this.loadNearby(), this.lowMemory && this.cleanupMemory();
},
getActiveImage: function() {
return this.getImageByIndex(this.index);
},
getImageByIndex: function(e) {
return this.$["image" + e] || this.loadImageView(e);
},
cleanupMemory: function() {
var e = getBufferRange();
for (var t = 0; t < this.images.length; t++) enyo.indexOf(t, e) === -1 && this.$["image" + t] && this.$["image" + t].destroy();
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

// AnalyzerDebug.js

enyo.kind({
name: "AnalyzerDebug",
kind: null,
debug: !1,
_level: 0,
methodName: function(e) {
var t = this.getStackInfo(3 + (e || 0));
return t = t.replace(/ .http:.*$/g, ""), t = t.replace(/^.*.enyo.kind/g, this.kindName), t += "                                                                    ", t.substr(0, 30);
},
getCurrentStackInfo: function(e) {
return " current: " + this.getStackInfo(3 + (e || 0));
},
getPreviousStackInfo: function(e) {
return " previous: " + this.getStackInfo(4 + (e || 0));
},
getStackInfo: function(e) {
try {
throw new Error;
} catch (t) {
var n = t.stack;
if (n) {
var r = n.split("\n");
return r[e];
}
return "(stack trace not available)";
}
},
showLevel: function() {
return "#####################################".substr(0, this._level) + " ";
},
incremLevel: function() {
return this._level++, this.showLevel() + " --> ";
},
decremLevel: function() {
var e = this.showLevel() + " <-- ";
return this._level--, e;
},
showIterator: function(e) {
return e ? "[" + e.ID + "/" + e.i + "] " : "";
},
logMethodEntry: function(e, t) {
t = t || "", enyo.log(this.methodName(1) + this.incremLevel() + this.showIterator(e) + t + this.getPreviousStackInfo(1));
},
logMethodExit: function(e, t) {
t = t || "", enyo.log(this.methodName(1) + this.decremLevel() + this.showIterator(e) + t + this.getCurrentStackInfo(1));
},
logProcessing: function(e, t) {
enyo.log(this.methodName(1) + this.showLevel() + this.showIterator(e) + "PROCESSING kind: " + t.kind + " >>" + t.token + "<< line: " + t.line + this.getCurrentStackInfo(1));
},
logIterMsg: function(e, t) {
enyo.log(this.methodName(1) + this.showLevel() + this.showIterator(e) + t + this.getPreviousStackInfo(1));
},
logMsg: function(e) {
enyo.log(this.methodName(1) + this.showLevel() + e + this.getPreviousStackInfo(1));
},
statics: {
_debugEnabled: !1
}
});

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
walk: function(e, t) {
return this.verbose && this.log("inPath: " + e + " resolver: ", t), this.loader = new enyo.loaderFactory(runtimeMachine, t), this.loader.loadScript = function() {}, this.loader.loadSheet = function() {}, this.loader.verbose = this.verbose, this.loader.report = enyo.bind(this, "walkReport"), this.loader.finish = enyo.bind(this, "walkFinish"), enyo.loader = this.loader, t ? (path = t.rewrite(e), this.verbose && path !== e && this.log("inPathResolver: " + e + " ==> " + path)) : (path = enyo.path.rewrite(e), this.verbose && path !== e && this.log("enyo.path: " + e + " ==> " + path)), enyo.asyncMethod(this.loader, "load", path), this.async = new enyo.Async;
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
this.ID = Iterator._objectCount++, this.stream = e;
},
statics: {
_objectCount: 0
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
kind: "AnalyzerDebug",
constructor: function(e) {
return this.debug = AnalyzerDebug._debugEnabled, this.parse(e);
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
this.debug && this.logMethodEntry(e, "inState " + t + " >>" + JSON.stringify(e.value) + "<<");
var n = [], r;
try {
while (e.next()) {
r = e.value, this.debug && this.logProcessing(e, r);
if (r.kind == "ws") continue;
if (r.kind == "comment") r.kind = "comment"; else if (t == "array") {
if (r.kind == "terminal") continue;
e.prev();
var i = e.value;
r = {
kind: "element",
token: "expr",
children: this.walk(e, "expression")
};
if (e.value && e.value.token == "]" || e.value && e.value === i) return r.children.length && n.push(r), this.debug && this.logMethodExit(e), n;
} else if (r.token == "[") r.kind = "array", r.children = this.walk(e, r.kind), e.value ? r.end = e.value.end : this.debug && this.logIterMsg(e, "No end token for array?"); else {
if (t == "expression" && r.token == "]") return this.debug && this.logMethodExit(e), n;
if (r.token == "var") r.kind = "var", r.children = this.walk(e, "expression"); else {
if (r.kind == "terminal" && (t == "expression" || t == "var")) return this.debug && this.logMethodExit(e), n;
if (r.kind == "terminal") continue;
if (r.token == "{") {
r.kind = "block", this.debug && this.logIterMsg(e, "PROCESS BLOCK - START"), r.children = this.walk(e, r.kind), this.debug && this.logIterMsg(e, "PROCESS BLOCK - END"), e.value ? r.end = e.value.end : this.debug && this.logIterMsg(e, "No end token for block?"), r.commaTerminated = this.isCommaTerminated(e);
if (t == "expression" || t == "function") return n.push(r), this.debug && this.logMethodExit(e), n;
} else {
if (t == "expression" && (r.token == "}" || r.token == ")")) return e.prev(), this.debug && this.logMethodExit(e), n;
if (t == "block" && r.token == "}") return this.debug && this.logMethodExit(e), n;
if (r.token == "=" || r.token == ":" && t != "expression") {
var s = n.pop();
s.kind == "identifier" ? (s.op = r.token, s.kind = "assignment", s.children = this.walk(e, "expression"), e.value && e.value.kind == "terminal" && (s.commaTerminated = e.value.token === ",", e.prev()), r = s) : n.push(s);
} else if (r.token == "(") r.kind = "association", r.children = this.walk(e, r.kind); else {
if (t == "association" && r.token == ")") return this.debug && this.logMethodExit(e), n;
if (r.token == "function") {
r.kind = "function", this.debug && this.logIterMsg(e, "PROCESS FUNCTION - START"), r.children = this.walk(e, r.kind), this.debug && this.logIterMsg(e, "PROCESS FUNCTION - END"), (!e.value || e.value.kind !== "symbol" || e.value.token !== "}") && this.debug && this.logIterMsg(e, "No end token for function?");
if (t !== "expression" && r.children && r.children.length && r.children[0].kind == "identifier") {
this.debug && this.logIterMsg(e, "C-Style function"), r.name = r.children[0].token, r.children.shift();
var o = {
kind: "assignment",
token: r.name,
children: [ r ]
};
r = o;
}
if (t == "expression" || t == "function") return r.commaTerminated = this.isCommaTerminated(e), n.push(r), this.debug && this.logMethodExit(e), n;
}
}
}
}
}
this.debug && this.logIterMsg(e, "PUSH NODE"), n.push(r);
}
} catch (u) {
console.error(u);
}
return this.debug && this.logMethodExit(e), n;
},
isCommaTerminated: function(e) {
commaPresent = !1;
var t = e.next();
return t && (commaPresent = t.kind === "terminal" && t.token === ","), e.prev(), commaPresent;
}
});

// Documentor.js

enyo.kind({
name: "Documentor",
kind: "AnalyzerDebug",
group: "public",
constructor: function(e) {
return this.comment = [], this.debug = AnalyzerDebug._debugEnabled, this.parse(e);
},
parse: function(e) {
var t = new Iterator(e);
return this.walk(t);
},
walk: function(e, t) {
var n = [], r, i;
this.debug && this.logMethodEntry(e, "inState " + t + " >>" + JSON.stringify(e.value) + "<<");
while (e.next()) {
r = e.value, this.debug && this.logProcessing(e, r);
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
return this.debug && this.logMethodExit(e), n;
},
cook_kind: function(e) {
this.debug && this.logMethodEntry(e, ">>" + JSON.stringify(e.value) + "<<");
var t = function(e, t) {
var n = Documentor.indexByName(e, t), r;
return n >= 0 && (r = e[n], e.splice(r, 1)), r && r.value && r.value.length && r.value[0].token;
}, n = this.make("kind", e.value);
e.next();
var r = e.value.children;
return r && r[0] && r[0].kind == "block" && (n.properties = this.cook_block(r[0].children), n.name = Documentor.stripQuotes(t(n.properties, "name") || ""), n.superkind = Documentor.stripQuotes(t(n.properties, "kind") || "enyo.Control"), n.superkind == "null" && (n.superkind = null), n.block = {
start: r[0].start,
end: r[0].end
}), this.debug && this.logMethodExit(e), n;
},
cook_block: function(e) {
this.debug && this.logMethodEntry();
var t = [];
for (var n = 0, r; r = e[n]; n++) {
this.debug && this.logProcessing(null, r);
if (r.kind == "comment") this.cook_comment(r.token); else if (r.kind == "assignment") {
var i = this.make("property", r);
r.children && (i.value = [ this.walkValue(new Iterator(r.children)) ], r.commaTerminated === undefined ? (i.commaTerminated = r.children[0].commaTerminated || !1, r.children[0].commaTerminated === undefined && this.debug && this.logMsg("NO COMMA TERMINATED INFO")) : i.commaTerminated = r.commaTerminated), t.push(i);
}
}
return this.debug && this.logMethodExit(), t;
},
walkValue: function(e, t) {
this.debug && this.logMethodEntry(e, "inState: " + t + " >>" + JSON.stringify(e.value) + "<<");
while (e.next()) {
var n = e.value, r;
this.debug && this.logProcessing(e, n);
if (n.kind != "comment") {
if (n.kind == "block") return r = this.make("block", n), r.properties = this.cook_block(n.children), this.debug && this.logMethodExit(e, "inState: " + t + " >>" + JSON.stringify(e.value) + "<<"), r;
if (n.kind == "array") return r = this.cook_array(e), this.debug && this.logMethodExit(e), r;
if (n.kind == "function") return r = this.cook_function(e), this.debug && this.logMethodExit(e, "inState: " + t + " >>" + JSON.stringify(e.value) + "<<"), r;
r = this.make("expression", n);
var i = n.token;
while (e.next()) i += e.value.token;
return r.token = i, this.debug && this.logMethodExit(e), r;
}
this.cook_comment(n.token);
}
this.debug && this.logMethodExit(e);
},
cook_function: function(e) {
this.debug && this.logMethodEntry(e, ">>" + JSON.stringify(e.value) + "<<");
var t = e.value, n = this.make("expression", t);
return n.commaTerminated = t.commaTerminated, n.arguments = enyo.map(t.children[0].children, function(e) {
return e.token;
}), this.debug && this.logMethodExit(e), n;
},
cook_array: function(e) {
this.debug && this.logMethodEntry(e, ">>" + JSON.stringify(e.value) + "<<");
var t = e.value, n = this.make("array", t), r = t.children;
if (r) {
var i = [];
for (var s = 0, o, u; o = r[s]; s++) o.children && (u = this.walkValue(new Iterator(o.children)), u && i.push(u));
n.properties = i;
}
return this.debug && this.logMethodExit(e), n;
},
cook_assignment: function(e) {
this.debug && this.logMethodEntry(e, ">>" + JSON.stringify(e.value) + "<<");
var t = e.value, n = this.make("global", t);
return t.children && (t.children[0] && t.children[0].token == "function" && (n.type = "function"), n.value = [ this.walkValue(new Iterator(t.children)) ]), this.debug && this.logMethodExit(), n;
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
this.debug && this.logMethodEntry();
var t = e.match(this.commentRx);
if (t) {
t = t[1] ? t[1] : t[2];
var n = this.extractPragmas(t);
this.honorPragmas(n);
}
this.debug && this.logMethodExit();
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
debug: !1,
findByName: function(e) {
return Documentor.findByProperty(this.objects, "name", e);
},
findByTopic: function(e) {
return Documentor.findByProperty(this.objects, "topic", e);
},
search: function(e, t, n) {
var r = enyo.filter(this.objects, e, n);
return enyo.map(r, t, n);
},
addModules: function(e) {
enyo.forEach(e, this.addModule, this), this.objects.sort(Indexer.nameCompare);
},
addModule: function(e) {
this.debug && enyo.log("Indexer.addModule(): + " + e.path), this.indexModule(e), this.mergeModule(e);
},
mergeModule: function(e) {
this.objects.push(e), this.objects = this.objects.concat(e.objects), enyo.forEach(e.objects, this.mergeProperties, this);
},
mergeProperties: function(e) {
e.properties ? this.objects = this.objects.concat(e.properties) : e.value && e.value[0] && e.value[0].properties && (this.objects = this.objects.concat(e.value[0].properties));
},
indexModule: function(e) {
e.type = "module", e.name = e.path ? e.path.replace("lib/", "") : e.label + "/" + e.rawPath, e.objects = new Documentor(new Parser(new Lexer(e.code))), this.indexObjects(e);
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
debug: !1,
events: {
onIndexReady: ""
},
create: function() {
this.index = new Indexer, this.inherited(arguments);
},
analyze: function(e, t) {
this.walk(e, t);
},
walk: function(e, t) {
var n = [], r, i = function(s, o) {
if (o) {
this.debug && enyo.log("Analyzer.walk.next() - inData: ", o);
for (var u = 0; u < o.modules.length; ++u) o.modules[u].label = r;
n = n.concat(o.modules);
}
var a = e.shift(), f = "";
a ? (this.debug && enyo.log("Analyzer.walk.next() - path: " + a), enyo.isString(a) || (r = a.label, a = a.path), (new Walker).walk(a, t).response(this, i)) : this.walkFinished(n);
};
i.call(this);
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

// KindHelper.js

enyo.kind({
name: "Analyzer.KindHelper",
kind: "enyo.Component",
published: {
definition: null
},
checkDefAvail: function() {
if (!this.definition) throw "No definition provided";
},
getEvents: function() {
this.checkDefAvail();
var e = [];
obj = this.definition.properties;
for (i = 0; i < obj.length; i++) if (obj[i].token === "events") {
p = obj[i].value[0].properties;
for (var t = 0; t < p.length; t++) {
var n = p[t].name;
e.push(n);
}
}
return e;
},
getPublished: function() {
this.checkDefAvail();
var e = [];
obj = this.definition.properties;
for (i = 0; i < obj.length; i++) if (obj[i].token === "published") {
p = obj[i].value[0].properties;
for (var t = 0; t < p.length; t++) {
var n = p[t].name;
e.push(n);
}
}
return e;
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
var t = this.groupFilter(e), n = "", r, i, s = !1, o = this.getByType(t, "kind");
if (o.length) {
n += "<h3>Kinds</h3>";
for (r = 0; i = o[r]; r++) n += "<kind>" + i.name + "</kind><br/>", n += this.presentComment(i.comment);
s = !0;
}
o = this.getByType(t, "function");
if (o.length) {
n += "<h3>Functions</h3>";
for (r = 0; i = o[r]; r++) i.group && (n += "<" + i.group + ">" + i.group + "</" + i.group + ">"), n += "<label>" + i.name + "</label>: function(<arguments>" + i.value[0].arguments.join(", ") + "</arguments>)</label><br/>", n += this.presentComment(i.comment);
s = !0;
}
o = this.getByType(t, "global");
if (o.length) {
n += "<h3>Variables</h3>";
for (r = 0; i = o[r]; r++) n += this.presentComment(i.comment), i.group && (n += "<" + i.group + ">" + i.group + "</" + i.group + ">"), n += "<label>" + i.name + "</label> = ", n += this.presentExpression(i.value[0]), n += "<br/>";
s = !0;
}
return s || (n += "<h3>This module has no public properties or functions to display.</h3>"), n;
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
var i = r.name.replace(".prototype", "");
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
e(r[0]) && r.sort(this.moduleCompare), r = this.nameFilter(r);
var i = "", s;
for (var o = 0, u; u = r[o]; o++) {
var a = n(u).divider;
a && s != a && (s = a, i += "<divider>" + a + "</divider>"), i += enyo.macroize(t, n(u));
}
return i;
},
moduleCompare: function(e, t) {
var n, r;
try {
n = e.name.match("[^/]*.js$")[0], r = t.name.match("[^/]*.js$")[0];
} catch (i) {
n = e.name, r = t.name;
}
return n.toUpperCase() < r.toUpperCase() ? -1 : n.toUpperCase() > r.toUpperCase() ? 1 : 0;
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
topic: e.name.replace(".prototype", ""),
divider: e.name[0].toUpperCase(),
object: e.object && e.object.name ? e.object.name + "::" : "",
module: !e.object && e.module && e.module.name ? " [" + e.module.name.match("[^/]*.js$") + "]" : ""
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
topic: e.name.match("[^/]*.js$"),
divider: e.name.match("[^/]*.js$")[0][0].toUpperCase()
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
