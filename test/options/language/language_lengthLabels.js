describe('language.lengthLabel option', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Check default', function () {
		expect(DataTable.defaults.oLanguage.lengthLabels).toEqual({'-1': 'All'});
	});

	it('Default is used when an "all" option is included', function () {
		table = $('#example').DataTable({
			lengthMenu: [ 10, 25, 50, -1 ]
		});

		expect($('div.dt-length select option').eq(0).text()).toBe('10');
		expect($('div.dt-length select option').eq(1).text()).toBe('25');
		expect($('div.dt-length select option').eq(2).text()).toBe('50');
		expect($('div.dt-length select option').eq(3).text()).toBe('All');
	});

	dt.html('basic');

	it('Specifying an option', function () {
		table = $('#example').DataTable({
			language: {
				lengthLabels: {
					10: 'Show 10',
					25: 'Make it 25',
					50: 'Test'
				}
			}
		});

		expect($('div.dt-length select option').eq(0).text()).toBe('Show 10');
		expect($('div.dt-length select option').eq(1).text()).toBe('Make it 25');
		expect($('div.dt-length select option').eq(2).text()).toBe('Test');
		expect($('div.dt-length select option').eq(3).text()).toBe('100');
	});
});
