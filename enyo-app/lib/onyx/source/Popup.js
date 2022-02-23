(function (enyo, scope) {

	/**
	* {@link onyx.Popup} is an {@link enyo.Popup} with Onyx styling applied.
	*
	* For more information, see the documentation on
	* [Popups]{@linkplain $dev-guide/building-apps/controls/popups.html} in the
	* Enyo Developer Guide.
	*
	* @class  onyx.Popup
	* @extends enyo.Popup
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.Popup.prototype */ {
		name: 'onyx.Popup',
		kind: 'enyo.Popup',
		classes: 'onyx-popup'
	});

})(enyo, this);