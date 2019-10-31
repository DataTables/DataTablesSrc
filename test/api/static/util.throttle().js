describe('Static method - util.throttle()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let search;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $.fn.dataTable.util.throttle).toBe('function');
		});
		it('Return value is correct', function() {
			expect(typeof $.fn.dataTable.util.throttle()).toBe('function');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('No regexes', function() {
			table = $('#example').DataTable();
			search = $.fn.dataTable.util.throttle(function(val) {
				table.search(val).draw();
			}, 1000);

			search('cox');
			search('bradley');
		});
		it('Check first search', function() {
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('Confirm second search applied after delay', async function() {
			await dt.sleep(1100);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Bradley Greer');
		});
	});
});
