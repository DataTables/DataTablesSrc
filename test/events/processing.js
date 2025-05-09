describe('core - events - processing', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let count;
	let params;
	let results;

	function reset() {
		count = 0;
		params = undefined;
		results = [];
	}

	describe('Check the defaults', function() {
		var bubbled = false;

		dt.html('basic');
		it('Called before data loaded', function() {
			$('body').on('processing.dt', function () {
				bubbled = true;
			});

			reset();
			table = $('#example')
				.on('processing.dt', function() {
					count++;
					params = arguments;
					results.push(arguments[2]);
				})
				.DataTable();

			expect(count).toBe(2);
		});
		it('Called with expected parameters', function() {
			expect(params.length).toBe(3);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1]).toBe(table.settings()[0]);
			expect(typeof params[2]).toBe('boolean');
			expect(results).toEqual([true, false]);
		});
		it('Has a DT API instance on the event object', function () {
			expect(params[0].dt instanceof DataTable.Api).toBe(true);
		});
		it('Does not bubble', function () {
			expect(bubbled).toBe(false);
		});
	});

	describe('Functional tests - client-side', function() {
		// client-side is odd - async stuff, allan tried to explain it to me but I got muddled.
		// so these tests are a good way to document when the behaviour should be.
		dt.html('basic');
		it('Called when processing disabled', function() {
			reset();
			table = $('#example')
				.on('processing.dt', function() {
					count++;
					params = arguments;
					results.push(arguments[2]);
				})
				.DataTable({
					processing: false
				});
			expect(count).toBe(2);
		});
		it('... Not called when changing page through API', function() {
			reset();
			table.page(2).draw(false);
			expect(count).toBe(0);
		});
		it('... Not called when changing page through UI', function() {
			reset();
			$('span .dt-paging-button:eq(2)').click();
			expect(count).toBe(0);
		});
		it('... Not called when changing order through API', function() {
			reset();
			table.order([2, 'asc']).draw();
			expect(count).toBe(0);
		});
		it('... Called when changing order through UI', async function() {
			reset();
			await dt.clickHeader(1);
			expect(count).toBe(2);
		});
		it('... Not called when search through API', function() {
			reset();
			table.search('cox').draw();
			expect(count).toBe(0);
		});
		it('... Not called when changing page through UI', function() {
			table.search('').draw();
			reset();
			$('div.dt-search input')
				.val('green')
				.keyup();
			expect(count).toBe(0);
		});

		dt.html('basic');
		it('Called when processing enabled', function() {
			reset();
			table = $('#example')
				.on('processing.dt', function() {
					count++;
					params = arguments;
					results.push(arguments[2]);
				})
				.DataTable({
					processing: true
				});
			expect(count).toBe(2);
		});
		it('... Not called when changing page through API', function() {
			reset();
			table.page(2).draw();
			expect(count).toBe(0);
		});
		it('... Not called when changing page through UI', function() {
			reset();
			$('span .dt-paging-button:eq(2)').click();
			expect(count).toBe(0);
		});
		it('... Not called when changing order through API', function() {
			reset();
			table.order([2, 'asc']).draw();
			expect(count).toBe(0);
		});
		it('... IS called when changing order through UI', async function() {
			reset();
			await dt.clickHeader(1);
			expect(count).toBe(2);
		});
		it('... Not called when search through API', function() {
			reset();
			table.search('cox').draw();
			expect(count).toBe(0);
		});
		it('... Not called when changing page through UI', function() {
			table.search('').draw();
			reset();
			$('div.dt-search input')
				.val('green')
				.keyup();
			expect(count).toBe(0);
		});
	});

	describe('Functional tests - client-side with ajax', function() {
		dt.html('empty');
		it('Load ajax data into an empty table - processing false', function(done) {
			reset();
			table = $('#example')
				.on('processing.dt', function() {
					count++;
					params = arguments;
					results.push(arguments[2]);
				})
				.DataTable({
					columns: dt.getTestColumns(),
					ajax: '/base/test/data/data.txt',
					processing: false,
					initComplete: function(settings, json) {
						expect(count).toBe(2);
						expect(results).toEqual([true, false]);
						done();
					}
				});
		});
		it('... Call ajax reload', function(done) {
			reset();
			table.ajax.reload(function callback() {
				done();
			});
		});
		it('... Called on ajax reload', function() {
			expect(count).toBe(2);
			expect(results).toEqual([true, false]);
		});
		it('... Not called when changing page through API', function() {
			reset();
			table.page(2).draw();
			expect(count).toBe(0);
		});
		it('... Not called when changing page through UI', function() {
			reset();
			$('span .dt-paging-button:eq(2)').click();
			expect(count).toBe(0);
		});
		it('... Not called when changing order through API', function() {
			reset();
			table.order([2, 'asc']).draw();
			expect(count).toBe(0);
		});
		it('... Is called when changing order through UI', async function() {
			reset();
			await dt.clickHeader(1);
			expect(count).toBe(2);
		});
		it('... Not called when search through API', function() {
			reset();
			table.search('cox').draw();
			expect(count).toBe(0);
		});
		it('... Not called when changing page through UI', function() {
			table.search('').draw();
			reset();
			$('div.dt-search input')
				.val('green')
				.keyup();
			expect(count).toBe(0);
		});

		dt.html('empty');
		it('Load ajax data into an empty table - processing true', function(done) {
			reset();
			table = $('#example')
				.on('processing.dt', function() {
					count++;
					params = arguments;
					results.push(arguments[2]);
				})
				.DataTable({
					columns: dt.getTestColumns(),
					ajax: '/base/test/data/data.txt',
					processing: true,
					initComplete: function(settings, json) {
						expect(count).toBe(2);
						expect(results).toEqual([true, false]);
						done();
					}
				});
		});
		it('... Call ajax reload', function(done) {
			reset();
			table.ajax.reload(function callback() {
				done();
			});
		});
		it('... Called on ajax reload', function() {
			expect(count).toBe(2);
			expect(results).toEqual([true, false]);
		});
		it('... Not called when changing page through API', function() {
			reset();
			table.page(2).draw();
			expect(count).toBe(0);
		});
		it('... Not called when changing page through UI', function() {
			reset();
			$('span .dt-paging-button:eq(2)').click();
			expect(count).toBe(0);
		});
		it('... Not called when changing order through API', function() {
			reset();
			table.order([2, 'asc']).draw();
			expect(count).toBe(0);
		});
		it('... IS called when changing order through UI', async function() {
			reset();
			await dt.clickHeader(1);
			expect(count).toBe(2);
		});
		it('... Not called when search through API', function() {
			reset();
			table.search('cox').draw();
			expect(count).toBe(0);
		});
		it('... Not called when changing page through UI', function() {
			table.search('').draw();
			reset();
			$('div.dt-search input')
				.val('green')
				.keyup();
			expect(count).toBe(0);
		});
	});

	describe('Functional tests - serverSide', function() {
		// Note: processing has no effect - called regardless
		dt.html('basic');
		it('Load table - processing false', function(done) {
			reset();
			table = $('#example')
				.on('processing.dt', function() {
					count++;
					params = arguments;
					results.push(arguments[2]);
				})
				.DataTable({
					ajax: dt.serverSide,
					serverSide: true,
					processing: false,
					initComplete: function(settings, json) {
						done();
					}
				});
		});
		it('... check results', function() {
			expect(count).toBe(3);
			expect(results).toEqual([true, true, false]);
		});
		it('... Called when changing page through API', function() {
			reset();
			table.page(2).draw();
			expect(count).toBe(1);
		});
		it('... Called when changing page through UI', function() {
			reset();
			$('.dt-paging-button:eq(3)').click();
			expect(count).toBe(1);
		});
		it('... Called when changing order through API', function() {
			reset();
			table.order([2, 'asc']).draw();
			expect(count).toBe(1);
		});
		it('... Called when changing order through UI', async function() {
			reset();
			await dt.clickHeader(1);
			expect(count).toBe(2);
		});
		it('... Called when search through API', async function() {
			reset();
			table.search('cox').draw();

			await dt.sleep(500);

			// Wait for debounce from SSP search - count is two - once
			// for the processing display one for the clear
			expect(count).toBe(2);
		});
		it('... Called when changing page through UI', async function() {
			reset();
			$('div.dt-search input')
				.val('green')
				.keyup();
			
			await dt.sleep(500);
			expect(count).toBe(2);
		});

		dt.html('basic');
		it('Load table - processing true', function(done) {
			reset();
			table = $('#example')
				.on('processing.dt', function() {
					count++;
					params = arguments;
					results.push(arguments[2]);
				})
				.DataTable({
					ajax: dt.serverSide,
					serverSide: true,
					processing: true,
					initComplete: function(settings, json) {
						done();
					}
				});
		});
		it('... check results', function() {
			expect(count).toBe(3);
			expect(results).toEqual([true, true, false]);
		});
		it('... Called when changing page through API', function() {
			reset();
			table.page(2).draw();
			expect(count).toBe(1);
		});
		it('... Called when changing page through UI', function() {
			reset();
			$('.dt-paging-button:eq(3)').click();
			expect(count).toBe(1);
		});
		it('... Called when changing order through API', function() {
			reset();
			table.order([2, 'asc']).draw();
			expect(count).toBe(1);
		});
		it('... Called when changing order through UI', async function() {
			reset();
			await dt.clickHeader(1);
			expect(count).toBe(2);
		});
		it('... Called when search through API', async function() {
			reset();
			table.search('cox').draw();

			await dt.sleep(500);
			expect(count).toBe(2);
		});
		it('... Called when changing page through UI', async function() {
			reset();
			$('div.dt-search input')
				.val('green')
				.keyup();

			await dt.sleep(500);
			expect(count).toBe(2);
		});
	});
});
