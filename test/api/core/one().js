describe('core - one()', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.one).toBe('function');
		});

		dt.html('basic');
		it('Setter returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.one('draw.dt', function() {}) instanceof $.fn.dataTable.Api).toBe(true);
		});

		dt.html('basic');
		it('Correct args sent to the listener', function() {
			let table = $('#example').DataTable();
			table.one('draw.dt', function(e, arg) {
				expect(e instanceof $.Event).toBe(true);
				expect(typeof arg).toBe('object');
			});
			table.page(1).draw(false);
		});
	});

	// TK COLIN: cut&paste pretty much from on(), could tidy up later
	function checkEvents(events, triggerCount, expectedCount) {
		let drawPass = 0;
		let pagePass = 0;
		let table = $('#example').DataTable();
		let lastColumn = table.columns().count();

		table.one(events, function(e) {
			if (e.type == 'draw') {
				drawPass++;
			} else if (e.type == 'page') {
				pagePass++;
			}
		});
		// start at column 1 as that'll trigger the first event, and loop when reach end of columns
		for (let i = 0, col = 1; i < triggerCount; i++, col++) {
			table.page(col).draw(false);
			if (col == lastColumn) col = 0;
		}
		return drawPass + pagePass == expectedCount;
	}

	describe('Check the event listening', function() {
		dt.html('basic');
		it('.dt name space is automatically added when using `on`', function() {
			expect(checkEvents('draw', 1, 1)).toBe(true);
		});

		dt.html('basic');
		it('Name space can be passed in manually', function() {
			expect(checkEvents('draw.dt', 1, 1)).toBe(true);
		});

		dt.html('basic');
		it('Single event wont trigger multiple times', function() {
			expect(checkEvents('draw.dt', 3, 1)).toBe(true);
		});

		dt.html('basic');
		it('Single event does not trigger if not listened to', function() {
			expect(checkEvents('length.dt', 1, 0)).toBe(true);
		});

		dt.html('basic');
		it('Multiple events can be subscribed without manual namespaces', function() {
			expect(checkEvents('draw page', 1, 2)).toBe(true);
		});

		dt.html('basic');
		it('Multiple events can be subscribed with manual namespaces', function() {
			expect(checkEvents('draw.dt page.dt', 1, 2)).toBe(true);
		});

		dt.html('basic');
		it('Multiple events trigger multiple times', function() {
			expect(checkEvents('draw.dt page.dt', 10, 2)).toBe(true);
		});
	});
});
