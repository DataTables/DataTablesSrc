describe('infoCallback Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the arguments', function() {
		let args;
		let table;

		dt.html('basic');
		it('Count the arguments', function() {
			table = $('#example').DataTable({
				infoCallback: function() {
					args = arguments;
					return 'unit test';
				}
			});
			expect(args.length).toBe(6);
		});
		it('First arg is settings', function() {
			expect(args[0]).toBe(table.settings()[0]);
		});
		it('Second arg is start position', function() {
			expect(typeof args[1]).toBe('number');
		});
		it('Third arg is end position', function() {
			expect(typeof args[2]).toBe('number');
		});
		it('Fourth arg is max', function() {
			expect(typeof args[3]).toBe('number');
		});
		it('Fifth arg is total', function() {
			expect(typeof args[4]).toBe('number');
		});
		it('Sixth arg is pre', function() {
			expect(typeof args[5]).toBe('string');
		});
		it('Return values is used', function() {
			expect($('div.dataTables_info').text()).toBe('unit test');
		});
	});

	describe('Functional tests', function() {
		function check(start, end, max, total, pre) {
			expect(args[1]).toBe(start);
			expect(args[2]).toBe(end);
			expect(args[3]).toBe(max);
			expect(args[4]).toBe(total);
			expect(args[5]).toBe(pre);
		}

		let args;
		let table;
		let testString = 'unit test';

		dt.html('basic');
		it('At initialisation', function() {
			table = $('#example').DataTable({
				infoCallback: function() {
					args = arguments;
					return testString;
				}
			});

			check(1, 10, 57, 57, 'Showing 1 to 10 of 57 entries');
		});
		it('At page change', function() {
			table.page(1).draw('page');
			check(11, 20, 57, 57, 'Showing 11 to 20 of 57 entries');
		});
		it('Searching', function() {
			table.search('Cox').draw();
			check(1, 1, 57, 1, 'Showing 1 to 1 of 1 entries (filtered from 57 total entries)');
		});

		dt.html('basic');
		it('info option disabled', function() {
			args = null;
			table = $('#example').DataTable({
				info: false,
				infoCallback: function() {
					args = arguments;
					return testString;
				}
			});
			expect(args).toBe(null);
		});

		dt.html('basic');
		it('info option disabled in DOM', function() {
			args = null;
			table = $('#example').DataTable({
				dom: 'lfrtp',
				infoCallback: function() {
					args = arguments;
					return testString;
				}
			});
			expect(args).toBe(null);
		});
	});
});
