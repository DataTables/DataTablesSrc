describe('on', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');

		it('There is no default', function() {
			expect(DataTable.defaults.on).toBe(null);
		});
	});

	describe('Operation', function() {
		var drawCounter = 0;
		var table;

		dt.html('basic');

		it('Can get a draw event', function() {
			table = $('table').DataTable({
				on: {
					draw: () => {
						drawCounter++;
					}
				}
			});

			expect(drawCounter).toBe(1);
		});

		it('Persists', function () {
			table.page(2).draw(false);
			expect(drawCounter).toBe(2);
		});

		dt.html('basic');

		it('Can add multiple listeners for a single event via an array', function() {
			var drawCounter1 = 0;
			var drawCounter2 = 0;

			table = $('table').DataTable({
				on: {
					draw: [
						() => {
							drawCounter1++;
						},
						() => {
							drawCounter2++;
						}
					]
				}
			});

			expect(drawCounter1).toBe(1);
			expect(drawCounter2).toBe(1);
		});

		dt.html('basic');

		it('Can add multiple events', function() {
			var drawCounter = 0;
			var orderCounter = 0;
			var searchCounter = 0;
			var table = $('table').DataTable({
				on: {
					draw: () => {
						drawCounter++;
					},
					order: () => {
						orderCounter++;
					},
					search: () => {
						searchCounter++;
					}
				}
			});

			expect(drawCounter).toBe(1);
			expect(orderCounter).toBe(1);
			expect(searchCounter).toBe(1);
		});

		dt.html('basic');

		it('Event arguments are as expected', function() {
			var args;
			var table = $('table').DataTable({
				on: {
					length: function () {
						args = arguments;
					}
				}
			});

			table.page.len(25).draw();

			expect(args.length).toBe(3);
			expect(args[0].type).toBe('length');
			expect(args[1]).toBe(table.settings()[0]);
			expect(args[2]).toBe(25);
		});
	});
});
