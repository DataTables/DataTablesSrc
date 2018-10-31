describe('footerCallback Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the arguments', function() {
		let args;

		dt.html('basic');
		it('Default should not be true', function() {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.fnFooterCallback).not.toBe(true);
		});

		dt.html('basic');
		it('Five arguments', function() {
			$('#example').DataTable({
				footerCallback: function() {
					args = arguments;
					$(args[0])
						.find('th')
						.eq(0)
						.html('unit test');
				}
			});
			expect(args.length).toBe(5);
		});
		it('First arg is the tfoot', function() {
			expect(args[0] instanceof HTMLTableRowElement).toBe(true);
		});
		it('Second arg is data', function() {
			expect(args[1] instanceof Array).toBe(true);
		});
		it('Third arg is start position', function() {
			expect(typeof args[2]).toBe('number');
		});
		it('Fourth arg is end position', function() {
			expect(typeof args[3]).toBe('number');
		});
		it('Fifth arg is index array', function() {
			expect(args[4] instanceof Array).toBe(true);
		});
		it('Return value is used', function() {
			expect($('table tfoot tr th:eq(0)').text()).toBe('unit test');
		});
	});

	describe('Functional tests', function() {
		let args;
		let count = 0;
		let table;

		dt.html('basic');
		it('Called only on a draw', function() {
			table = $('#example').DataTable({
				footerCallback: function() {
					count++;
					args = arguments;
				}
			});
			expect(count).toBe(1);
		});
		it('Subsequent draws call the function', function() {
			table.draw();
			expect(count).toBe(2);
		});
		it('Start contains correct page information', function() {
			expect(args[2]).toBe(0);
		});
		it('End contains correct page information', function() {
			expect(args[3]).toBe(10);
		});
		it('Called on paging (ie another draw)', function() {
			$('a.paginate_button.next').click();
			expect(count).toBe(3);
		});
		it('Data array has length matching original data', function() {
			expect(args[1].length).toBe(57);
		});
		it('Start contains correct page information', function() {
			expect(args[2]).toBe(10);
		});
		it('End contains correct page information', function() {
			expect(args[3]).toBe(20);
		});
		it('Display length is full data when not filtered', function() {
			expect(args[4].length).toBe(57);
		});
		it('Display length is 12 when filtering on London', function() {
			table.search('London').draw();
			expect(args[4].length).toBe(12);
		});
	});
});
