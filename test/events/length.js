describe('core - events - length', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let params;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Called before the draw', function() {
			let lastCell;

			table = $('#example').DataTable();
			table.on('length.dt', function() {
				params = arguments;
				lastCell = $('tbody tr:last td:eq(0)').text();
			});

			table.page.len(25).draw(false);

			expect(lastCell).toBe('Cedric Kelly');
			expect($('tbody tr:last td:eq(0)').text()).toBe('Hope Fuentes');
		});
		it('Called with expected parameters', function() {
			expect(params.length).toBe(3);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1]).toBe(table.settings()[0]);
			expect(typeof params[2]).toBe('number');
		});
	});

	describe('Functional tests', function() {
		let count = 0;
		let length;
		dt.html('basic');
		it('Not called on initial draw', function() {
			table = $('#example')
				.on('length.dt', function() {
					count++;
					length = arguments[2];
				})
				.DataTable();
			expect(count).toBe(0);
		});
		it('Not called when API changes page', function() {
			table.page(2).draw(false);
			expect(count).toBe(0);
		});
		it('Called when API changes page length', function() {
			table.page.len(25).draw(false);
			expect(count).toBe(1);
			expect(length).toBe(25);
		});
		it('Not called when user changes page', function() {
			$('span a.paginate_button:eq(1)').click();
			expect(count).toBe(1);
		});
		it('Called when user changes page length', function() {
			$('div.dataTables_length select')
				.val(10)
				.change();
			expect(count).toBe(2);
			expect(length).toBe(10);
		});
	});
});
