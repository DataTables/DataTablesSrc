describe('core- on()', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.on).toBe('function');
		});

		dt.html('basic');
		it('Setter returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.on('draw.dt', function() {}) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	function checkSingleEvent(event, triggerCount, expectedCount) {
		let drawPass = 0;
		let table = $('#example').DataTable();

		table.on(event, function(e) {
			if (e.type == 'draw') {
				drawPass++;
			}
		});
		for (let i = 0; i < triggerCount; i++) {
			table.page(i + 1).draw();
		}
		return drawPass == expectedCount;
	}

	function checkDoubleEvent(events, triggerCount, expectedCount) {
		let drawPass = 0;
		let pagePass = 0;
		let table = $('#example').DataTable();

		table.on(events, function(e) {
			if (e.type == 'draw') {
				drawPass++;
			} else if (e.type == 'page') {
				pagePass++;
			}
		});
		for (let i = 0; i < triggerCount; i++) {
			table.page(i + 1).draw(false);
		}
		return drawPass + pagePass == 2 * expectedCount;
	}

	describe('Check the event listening', function() {
		dt.html('basic');
		it('.dt name space is automatically added when using `on`', function() {
			expect(checkSingleEvent('draw', 1, 1)).toBe(true);
		});

		dt.html('basic');
		it('Name space can be passed in manually', function() {
			expect(checkSingleEvent('draw.dt', 1, 1)).toBe(true);
		});

		dt.html('basic');
		it('Single event triggers multiple times', function() {
			expect(checkSingleEvent('draw.dt', 3, 3)).toBe(true);
		});

		dt.html('basic');
		it('Single event doesnt trigger if not listened to', function() {
			expect(checkSingleEvent('page.dt', 1, 0)).toBe(true);
		});

		dt.html('basic');
		it('Multiple events can be subscribed without manual namespaces', function() {
			expect(checkDoubleEvent('draw page', 1, 1)).toBe(true);
		});

		dt.html('basic');
		it('Multiple events can be subscribed with manual namespaces', function() {
			expect(checkDoubleEvent('draw.dt page.dt', 1, 1)).toBe(true);
		});

		dt.html('basic');
		it('Multiple events trigger multiple times', function() {
			expect(checkDoubleEvent('draw.dt page.dt', 4, 4)).toBe(true);
		});
	});
});
