describe('search feature', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		dt.html('basic');

		it('The search feature is present by default', function () {
			table = $('#example').DataTable();

			expect($('div.dt-search').length).toBe(1);
		});

		it('And will perform a search', function () {
			$('div.dt-search input').val('Bruno').trigger('keyup');

			expect($('tbody td').eq(0).text()).toBe('Bruno Nash');
		});

		it('API will read that value', function () {
			expect(table.search()).toBe('Bruno');
		});

		it('API can set the value', function () {
			table.search('Caesar').draw();

			expect($('div.dt-search input').val()).toBe('Caesar');
			expect($('tbody td').eq(0).text()).toBe('Caesar Vance');
		});
	});

	describe('Disable', function () {
		dt.html('basic');

		it('Can remove using the layout', function () {
			table = $('#example').DataTable({
				layout: {
					topEnd: null
				}
			});

			expect($('div.dt-search').length).toBe(0);
		});

		it('API still works', function () {
			table.search('Caesar').draw();

			expect($('tbody td').eq(0).text()).toBe('Caesar Vance');
		});
	});

	describe('Multiple instances', function () {
		dt.html('basic');

		it('Assign instances above and below the table', function () {
			table = $('#example').DataTable({
				layout: {
					topEnd: 'search',
					bottomEnd: 'search'
				}
			});

			expect($('div.dt-search').length).toBe(2);
		});

		it('Perform a search with the first', function () {
			$('div.dt-search').eq(0).find('input').val('Bruno').trigger('keyup');

			expect($('tbody td').eq(0).text()).toBe('Bruno Nash');
		});

		it('Updated the value in the second instance', function () {
			expect($('div.dt-search').eq(1).find('input').val()).toBe('Bruno');
		});

		it('Perform a search with the second', function () {
			$('div.dt-search').eq(1).find('input').val('Cedric').trigger('keyup');

			expect($('tbody td').eq(0).text()).toBe('Cedric Kelly');
		});

		it('Updated the value in the first instance', function () {
			expect($('div.dt-search').eq(0).find('input').val()).toBe('Cedric');
		});

		it('API can set the value for both', function () {
			table.search('Caesar').draw();

			expect($('tbody td').eq(0).text()).toBe('Caesar Vance');
			expect($('div.dt-search').eq(0).find('input').val()).toBe('Caesar');
			expect($('div.dt-search').eq(1).find('input').val()).toBe('Caesar');
		});
	});
});
