describe('DataTable.ext.classes.thead.row', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Default', function() {
		expect(DataTable.ext.classes.tfoot.row).toEqual('');
	});

	it('No class is added by default', function() {
		new DataTable('#example');

		expect($('tfoot tr')[0].className).toEqual('');
	});

	dt.html('basic');

	it('Can set a value and it is applied', function() {
		DataTable.ext.classes.tfoot.row = 'testRow';
		new DataTable('#example');

		expect($('tfoot tr.testRow').length).toEqual(1);
	});

	dt.html('empty_no_header');

	it('Can set a value and it is applied', function() {
		DataTable.ext.classes.tfoot.row = 'emptyTest';
		new DataTable('#example', {
			columns: [
				{
					title: 'First - header',
					footer: 'First - footer'
				}
			],
			data: [ [1], [2], [3] ]
		});

		expect($('tfoot tr.emptyTest').length).toEqual(1);
	});
});
