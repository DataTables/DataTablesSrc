describe('language.infoEmpty option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function () {
		dt.html('basic');

		it('Default value', function () {
			expect(DataTable.defaults.language.infoEmpty).toBe(
				'Showing 0 to 0 of 0 _ENTRIES-TOTAL_'
			);
		});

		it('Info empty language default is in the DOM', function () {
			table = $('#example').DataTable();

			expect($('div.dt-info').html()).toBe('Showing 1 to 10 of 57 entries');
		});

		dt.html('basic');

		it('Info empty language can be defined', function () {
			table = $('#example').DataTable({
				language: {
					infoEmpty: 'unit test'
				}
			});
			table.search('asdsad').draw();

			expect($('div.dt-info').html()).toBe(
				'unit test (filtered from 57 total entries)'
			);
		});

		dt.html('basic');

		it("Macro's replaced", function () {
			table = $('#example').DataTable({
				language: {
					infoEmpty: 'unit _START_ _END_ _TOTAL_ test'
				}
			});
			table.search('asdsad').draw();

			expect($('div.dt-info').html()).toBe(
				'unit 1 0 0 test (filtered from 57 total entries)'
			);
		});
	});
});
