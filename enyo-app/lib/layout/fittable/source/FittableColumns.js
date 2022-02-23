(function (enyo, scope) {

	/**
	* {@link enyo.FittableColumns} provides a container in which items are laid out in a
	* set of vertical columns, with most items having natural size, but one
	* expanding to fill the remaining space. The one that expands is labeled with
	* the attribute `fit: true`.
	*
	* For more information, see the documentation on
	* [Fittables]{@linkplain $dev-guide/building-apps/layout/fittables.html} in the
	* Enyo Developer Guide.
	*
	* @ui
	* @class  enyo.FittableColumns
	* @extends enyo.Control
	* @public
	*/

	enyo.kind(/** @lends  enyo.FittableColumns.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.FittableColumns',

		/**
		* A {@glossary kind} used to manage the size and placement of child
		* [components]{@link enyo.Component}.
		*
		* @type {String}
		* @default ''
		* @private
		*/
		layoutKind: 'FittableColumnsLayout',

		/**
		* By default, items in columns stretch to fit vertically; set to `true` to
		* avoid this behavior.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		noStretch: false
	});

})(enyo, this);