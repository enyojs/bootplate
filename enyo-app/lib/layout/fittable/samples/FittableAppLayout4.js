enyo.kind({
	name: 'enyo.sample.FittableAppLayout4',
	kind: 'FittableColumns',
	classes: 'enyo-fit',
	components: [
		{kind: 'FittableRows', classes: 'fittable-sample-column fittable-sample-shadow4', components: [
			{fit: true},
			{kind: 'onyx.Toolbar', components: [
				{content: 'Toolbar'}
			]}
		]},
		{kind: 'FittableRows', fit: true, components: [
			{fit: true, classes: 'fittable-sample-fitting-color'},
			{kind: 'onyx.Toolbar', components: [
				{kind: 'onyx.Button', content: '2'}
			]}
		]}
	]
});