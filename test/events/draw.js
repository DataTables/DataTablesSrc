describe('core - events - draw', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let params;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Called after the draw', function() {
			let firstCell;

			table = $('#example').DataTable();
			table.on('draw.dt', function() {
				params = arguments;
				firstCell = $('tbody tr:eq(0) td:eq(0)').text();
			});

			table.page(1).draw(false);

			expect(firstCell).toBe('Charde Marshall');
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Charde Marshall');
		});
		it('Called with expected parameters', function() {
			expect(params.length).toBe(2);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1]).toBe(table.settings()[0]);
		});
	});

	describe('Functional tests', function() {
		let count = 0;
		dt.html('basic');
		it('Called on initial draw', function() {
			table = $('#example')
				.on('draw.dt', function() {
					count++;
				})
				.DataTable();
			expect(count).toBe(1);
		});
		it('Called when API changes page', function() {
			table.page(2).draw(false);
			expect(count).toBe(2);
		});
		it('Called when API changes page length', function() {
			table.page.len(25).draw(false);
			expect(count).toBe(3);
		});
		it('Called when API does a search', function() {
			table.search('cox').draw(false);
			expect(count).toBe(4);
		});
		it('Called when API clears search', function() {
			table.search('').draw(false);
			expect(count).toBe(5);
		});
		it('Called when API does an order', function() {
			table.order([1, 'asc']).draw(false);
			expect(count).toBe(6);
		});
		it('Called when user changes page', function() {
			$('span a.paginate_button:eq(1)').click();
			expect(count).toBe(7);
		});
		it('Called when user changes page length', function() {
			$('div.dataTables_length select')
				.val(25)
				.change();
			expect(count).toBe(8);
		});
		it('Called when user searches', function() {
			$('div.dataTables_filter label input')
				.val('cox')
				.keyup();
			expect(count).toBe(9);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('Called when user clears search', function() {
			$('div.dataTables_filter label input')
				.val('')
				.keyup();
			expect(count).toBe(10);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
		it('Called when user changes order', function() {
			$('thead tr th:eq(2)').click();
			expect(count).toBe(11);
		});

		dt.html('empty');
		let table;
		it('Load ajax data into an empty table', function(done) {
			count = 0;
			table = $('#example')
				.on('draw.dt', function() {
					count++;
				})
				.DataTable({
					columns: dt.getTestColumns(),
					ajax: '/base/test/data/data.txt',
					initComplete: function(settings, json) {
						expect(count).toBe(2);
						done();
					}
				});
		});
		it('Called on ajax reload', function(done) {
			// table.on('draw.dt', function() {
			// 	count++;
			// });
			table.ajax.reload(function callback() {
				expect(count).toBe(3);
				done();
			});
		});
	});
});
