enyo.kind({
	name: 'enyo.sample.FittableTests',
	classes: 'fittable-sample-box enyo-fit',
	kind: 'Scroller',
	components: [
		{classes: 'fittable-sample-section', content: 'Rows/Columns using a combination of css units and highlighting margin collapse'},
		{kind: 'FittableRows', classes: 'fittable-sample-box fittable-sample-test', style: 'height: 400px;', components: [
			{content: 'FOO<br>margin-bottom: 1em', allowHtml: true, classes: 'fittable-sample-box fittable-sample-mlr fittable-sample-mtb', style: 'margin-bottom: 1em;'},
			{content: 'margin-top: 1em (collapsed since sibling shows greater of previous bottom and this top)<br>FOO', allowHtml: true, classes: 'fittable-sample-box fittable-sample-mlr fittable-sample-mtb', style: 'margin-top: 1em;'},
			{content: 'FOO<br>FOO', allowHtml: true, classes: 'fittable-sample-box fittable-sample-mlr fittable-sample-mtb'},
			{kind: 'FittableColumns', fit: true, classes: 'fittable-sample-box fittable-sample-mtb fittable-sample-mlr fittable-sample-o', components: [
				{content: '111111111111111', classes: 'fittable-sample-box fittable-sample-mlr'},
				{content: '111111111111111', classes: 'fittable-sample-box fittable-sample-mlr'},
				{content: '2', fit: true, classes: 'fittable-sample-box fittable-sample-mlr fittable-sample-o'},
				{content: '3333333', classes: 'fittable-sample-box fittable-sample-mlr'}
			]},
			{kind: 'FittableColumns', content: 'Bat', classes: 'fittable-sample-box fittable-sample-mtb enyo-center', components: [
				{content: 'add enyo-center to FittableColumns', classes: 'fittable-sample-box fittable-sample-mlr'},
				{content: '1', classes: 'fittable-sample-box fittable-sample-mlr'},
				{content: '2', classes: 'fittable-sample-box fittable-sample-mlr'},
				{content: '3', classes: 'fittable-sample-box fittable-sample-mlr'},
				{content: '4', classes: 'fittable-sample-box fittable-sample-mlr'},
				{content: '5', classes: 'fittable-sample-box fittable-sample-mlr'}
			]}
		]},
		{classes: 'fittable-sample-section', content: 'Rows with enyo-margin-expand to avoid margin-collapse'},
		{kind: 'FittableRows', classes: 'fittable-sample-box fittable-sample-test enyo-margin-expand', style: 'height: 250px;', components: [
			{content: 'FOO<br>margin-bottom: 1em', allowHtml: true, classes: 'fittable-sample-box fittable-sample-mtb', style: 'margin-bottom: 1em;'},
			{content: 'margin-top: 3em (not collapsed due to enyo-margin-expand on box)<br>FOO', allowHtml: true, classes: 'fittable-sample-box fittable-sample-mtb', style: 'margin-top: 3em;'},
			{content: 'FOO<br>FOO', allowHtml: true, fit: true, classes: 'fittable-sample-box fittable-sample-mtb'}
		]},
		{classes: 'fittable-sample-section', content: 'Tests to ensure fit region can be first, middle, or last'},
		{kind: 'FittableRows', classes: 'fittable-sample-boxable fittable-sample-small-test', components: [
			{content: 'A', fit: true},
			{content: 'B'},
			{content: 'C'}
		]},
		{kind: 'FittableRows', classes: 'fittable-sample-boxable fittable-sample-small-test', components: [
			{content: 'A'},
			{content: 'B', fit: true},
			{content: 'C'}
		]},
		{kind: 'FittableRows', classes: 'fittable-sample-boxable fittable-sample-small-test', components: [
			{content: 'A'},
			{content: 'B'},
			{content: 'C', fit: true}
		]},
		{kind: 'FittableColumns', classes: 'fittable-sample-boxable fittable-sample-small-test', components: [
			{content: 'A', fit: true},
			{content: 'B'},
			{content: 'C'}
		]},
		{kind: 'FittableColumns', classes: 'fittable-sample-boxable fittable-sample-small-test', components: [
			{content: 'A'},
			{content: 'B', fit: true},
			{content: 'C'}
		]},
		{style: 'height: 200px;', kind: 'FittableColumns', classes: 'fittable-sample-boxable fittable-sample-small-test', components: [
			{content: 'A'},
			{content: 'B'},
			{content: 'C', fit: true}
		]},
		{classes: 'fittable-sample-section', content: 'Tests for noStretch: true'},
		{kind: 'FittableRows', classes: 'fittable-sample-box fittable-sample-test', style: 'height: 400px;', noStretch: true, components: [
			{content: 'FOO<br>margin-bottom: 1em', allowHtml: true, classes: 'fittable-sample-box fittable-sample-mlr fittable-sample-mtb', style: 'margin-bottom: 1em;'},
			{content: 'margin-top: 2em (not collapsed; stretch false does not collapse due to use of float)<br>FOO', allowHtml: true, classes: 'fittable-sample-box fittable-sample-mlr fittable-sample-mtb', style: 'margin-top: 1em;'},
			{content: 'FOO<br>FOO', allowHtml: true, classes: 'fittable-sample-box fittable-sample-mlr fittable-sample-mtb'},
			{kind: 'FittableColumns', fit: true, noStretch: true, classes: 'fittable-sample-box fittable-sample-mtb fittable-sample-mlr fittable-sample-o', components: [
				{content: '111111111111111', classes: 'fittable-sample-box fittable-sample-mlr'},
				{content: '111111111111111', classes: 'fittable-sample-box fittable-sample-mlr'},
				{content: '2<br>2', allowHtml: true, fit: true, classes: 'fittable-sample-box fittable-sample-mlr fittable-sample-o'},
				{content: '3333333', classes: 'fittable-sample-box fittable-sample-mlr'}
			]},
			{kind: 'FittableColumns', content: 'Bat', noStretch: true, classes: 'fittable-sample-box fittable-sample-mtb enyo-center', components: [
				{content: 'add enyo-center to FittableColumns', classes: 'fittable-sample-box fittable-sample-mlr'},
				{content: '1', classes: 'fittable-sample-box fittable-sample-mlr'},
				{content: '2', classes: 'fittable-sample-box fittable-sample-mlr'},
				{content: '3', classes: 'fittable-sample-box fittable-sample-mlr'},
				{content: '4', classes: 'fittable-sample-box fittable-sample-mlr'},
				{content: '5', classes: 'fittable-sample-box fittable-sample-mlr'}
			]}
		]}
	]
});