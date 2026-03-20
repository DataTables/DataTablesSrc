describe('search.columns feature', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		dt.html('basic');

		it('Search is done on all columns', function () {
			table = $('#example').DataTable();

			$('div.dt-search input').val('a ch lo 4 9').trigger('keyup');

			expect($('tbody td').eq(0).text()).toBe('Angelica Ramos');
		});
	});

	describe('Specific columns', function () {
		dt.html('basic');

		it('Can search first column', function () {
			table = $('#example').DataTable({
				layout: {
					topEnd: {
						search: {
							columns: [0, 1]
						}
					}
				}
			});

			$('div.dt-search input').val('Bruno').trigger('keyup');

			expect($('tbody td').eq(0).text()).toBe('Bruno Nash');
		});

		it('And second column', function () {
			$('div.dt-search input').val('Software').trigger('keyup');

			expect($('tbody td').eq(0).text()).toBe('Bradley Greer');
		});

		it('But not 3rd column', function () {
			$('div.dt-search input').val('Edinburgh').trigger('keyup');

			expect($('tbody td').eq(0).text()).toBe('No matching records found');
		});

		it('But not 4th column', function () {
			$('div.dt-search input').val('33').trigger('keyup');

			expect($('tbody td').eq(0).text()).toBe('No matching records found');
		});

		it('But not 5th column', function () {
			$('div.dt-search input').val('2012-03-29').trigger('keyup');

			expect($('tbody td').eq(0).text()).toBe('No matching records found');
		});

		it('But not 6th column', function () {
			$('div.dt-search input').val('372,000').trigger('keyup');

			expect($('tbody td').eq(0).text()).toBe('No matching records found');
		});

		it('Interacts with the API - read', function () {
			expect(table.columns([0, 1]).search()).toBe('372,000');
		});

		it('Interacts with the API - write', function () {
			table.columns([0, 1]).search('test');

			expect($('div.dt-search input').val()).toBe('test');
		});
	});
});
