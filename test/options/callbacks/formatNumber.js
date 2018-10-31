describe('formatNumber Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the arguments', function() {
		let args;
		let table;

		dt.html('basic');
		it('Default should not be true', function() {
			table = $('#example').DataTable();
			expect($.fn.dataTable.defaults.fnFormatNumber).not.toBe(true);
		});

		dt.html('basic');
		it('Count arguments', function() {
			table = $('#example').DataTable({
				formatNumber: function() {
					args = arguments;
					return true;
				}
			});
			expect(args.length).toBe(1);
		});
		it('First arg is the settings', function() {
			expect(typeof args[0]).toBe('number');
		});
	});

	describe('Functional tests', function() {
		let table;

		dt.html('basic');
		it('Ensure returned string is used in the info', function() {
			table = $('#example').DataTable({
				formatNumber: function(toFormat) {
					return toFormat.toString() + ' XXX';
				}
			});
			expect($('div.dataTables_info').text()).toBe('Showing 1 XXX to 10 XXX of 57 XXX entries');
		});
		it('Ensure returned string is used in the page length', function() {
			expect($('div.dataTables_length select option:eq(0)').text()).toBe('10 XXX');
		});
	});
});
