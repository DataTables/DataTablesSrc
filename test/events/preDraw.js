describe('core - events - preDraw', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let params;
	let firstCell;
	let count = 0;

	function checkResults(cnt, name) {
		expect(cnt).toBe(count);
		expect(name).toBe(firstCell);
		count = 0;
		firstCell = '';
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Called after the draw', function() {
			table = $('#example').DataTable();
			table.on('preDraw.dt', function() {
				params = arguments;
				firstCell = $('tbody tr:eq(0) td:eq(0)').text();
			});

			table.page(1).draw(false);

			expect(firstCell).toBe('Airi Satou');
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Charde Marshall');
		});
		it('Called with expected parameters', function() {
			expect(params.length).toBe(2);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1]).toBe(table.settings()[0]);
		});
		it('Has a DT API instance on the event object', function () {
			expect(params[0].dt instanceof DataTable.Api).toBe(true);
		});
		it('Does not bubble', function () {
			var bubbled = false;

			$('body').on('preDraw.dt', function () {
				bubbled = true;
			});

			table.draw(false);

			expect(bubbled).toBe(false);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Called on initial draw', function() {
			table = $('#example')
				.on('preDraw.dt', function() {
					count++;
					firstCell = $('tbody tr:eq(0) td:eq(0)').text();
				})
				.DataTable();
			checkResults(1, 'Tiger Nixon');
		});
		it('Called when API changes page', function() {
			table.page(2).draw(false);
			checkResults(1, 'Airi Satou');
		});
		it('Called when API changes page length', function() {
			table.page.len(25).draw(false);
			checkResults(1, 'Gloria Little');
		});
		it('Called when API does a search', function() {
			table.search('cox').draw(false);
			checkResults(1, 'Airi Satou');
		});
		it('Called when API clears search', function() {
			table.search('').draw(false);
			checkResults(1, 'Ashton Cox');
		});
		it('Called when API does an order', function() {
			table.order([1, 'asc']).draw(false);
			checkResults(1, 'Airi Satou');
		});
		it('Called when user changes page', function() {
			$('.dt-paging-button:eq(3)').click();
			checkResults(1, 'Garrett Winters');
		});
		it('Called when user changes page length', function() {
			$('div.dt-length select')
				.val(25)
				.change();
			checkResults(1, 'Howard Hatfield');
		});
		it('Called when user searches', function() {
			$('div.dt-search input')
				.val('cox')
				.keyup();
			checkResults(1, 'Howard Hatfield');
		});
		it('Called when user clears search', function() {
			$('div.dt-search input')
				.val('')
				.keyup();
			checkResults(1, 'Ashton Cox');
		});
		it('Called when user changes order', async function() {
			await dt.clickHeader(2);
			checkResults(1, 'Garrett Winters');
		});

		dt.html('empty');
		it('Load ajax data into an empty table', function(done) {
			count = 0;
			table = $('#example')
				.on('preDraw.dt', function() {
					count++;
					firstCell = $('tbody tr:eq(0) td:eq(0)').text();
				})
				.DataTable({
					columns: dt.getTestColumns(),
					ajax: '/base/test/data/data.txt',
					initComplete: function(settings, json) {
						checkResults(2, 'Loading...');
						done();
					}
				});
		});
		it('Called on ajax reload', function(done) {
			table.ajax.reload(function callback() {
				checkResults(1, 'Airi Satou');
				done();
			});
		});
	});
});
