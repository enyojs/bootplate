enyo.kind({
	name: 'enyo.sample.FittableDescription',
	classes: 'fittable-sample-box enyo-fit',
	style: 'padding:10px;',
	kind: 'Scroller',
	components: [
		{tag: 'p', allowHtml: true, content: 'FittableColumns, no margin on boxes (all divs have some padding). By default, boxes "stretch" to fit the container (which must have a height).'},
		{kind: 'FittableColumns', classes: 'fittable-sample-height fittable-sample-box fittable-sample-o fittable-sample-mlr fittable-sample-mtb', components: [
			{content: 'BoxA', classes: 'fittable-sample-box'},
			{content: 'Fitting BoxB', fit: true, classes: 'fittable-sample-box'},
			{content: 'BoxC', classes: 'fittable-sample-box'}
		]},
		{tag: 'p', allowHtml: true, content: 'Boxes with left/right margins. Note: top/bottom margin on column boxes is NOT supported.'},
		{kind: 'FittableColumns', classes: 'fittable-sample-height fittable-sample-box fittable-sample-o fittable-sample-mlr fittable-sample-mtb', components: [
			{content: 'BoxA', classes: 'fittable-sample-box fittable-sample-mlr'},
			{content: 'Fitting BoxB', fit: true, classes: 'fittable-sample-box fittable-sample-mlr'},
			{content: 'BoxC', classes: 'fittable-sample-box fittable-sample-mlr'}
		]},
		{tag: 'p', allowHtml: true, content: 'With <code>noStretch: true</code>, boxes have natural height.'},
		{kind: 'FittableColumns', noStretch: true, classes: 'fittable-sample-height fittable-sample-box fittable-sample-o fittable-sample-mlr fittable-sample-mtb', components: [
			{content: 'BoxA', classes: 'fittable-sample-box fittable-sample-mlr'},
			{content: 'Fitting BoxB<br><br>with natural height', fit: true, allowHtml: true, classes: 'fittable-sample-box fittable-sample-mlr'},
			{content: 'BoxC', classes: 'fittable-sample-box fittable-sample-mlr'}
		]},
		{tag: 'p', allowHtml: true, content: 'FittableRows, no margin on boxes (all divs have some padding).'},
		{kind: 'FittableRows', classes: 'fittable-sample-height fittable-sample-box fittable-sample-o fittable-sample-mlr fittable-sample-mtb', components: [
			{content: 'BoxA', classes: 'fittable-sample-box'},
			{content: 'Fitting BoxB', fit: true, classes: 'fittable-sample-box'},
			{content: 'BoxC', classes: 'fittable-sample-box'}
		]},
		{tag: 'p', allowHtml: true, content: 'Row boxes may have margin in any dimension.<br><br> NOTE: Row boxes will collapse vertical margins according to css rules. If margin collapse is not desired, then "enyo-margin-expand" may be applied. Only in this case, left/right margin on row boxes is NOT supported.'},
		{kind: 'FittableRows', classes: 'fittable-sample-height fittable-sample-box fittable-sample-o fittable-sample-mlr fittable-sample-mtb', components: [
			{content: 'BoxA', classes: 'fittable-sample-box fittable-sample-mlr fittable-sample-mtb'},
			{content: 'Fitting BoxB', fit: true, classes: 'fittable-sample-box fittable-sample-mlr fittable-sample-mtb'},
			{content: 'BoxC', classes: 'fittable-sample-box fittable-sample-mlr fittable-sample-mtb'}
		]},
		{tag: 'p', allowHtml: true, content: 'With <code>noStretch: true</code>, boxes have natural width.<br><br> NOTE: margins will not collapse in this case.'},
		{kind: 'FittableRows', noStretch: true, classes: 'fittable-sample-height fittable-sample-box fittable-sample-o fittable-sample-mtb', components: [
			{content: 'BoxA', classes: 'fittable-sample-box fittable-sample-mlr fittable-sample-mtb'},
			{content: 'Fitting BoxB', fit: true, classes: 'fittable-sample-box fittable-sample-mlr fittable-sample-mtb'},
			{content: 'BoxC', classes: 'fittable-sample-box fittable-sample-mlr fittable-sample-mtb'}
		]}
	]
});