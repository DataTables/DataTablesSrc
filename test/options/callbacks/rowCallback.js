describe('rowCallback Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default should not be true', function() {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.fnRowCallback).not.toBe(true);
		});

		dt.html('basic');
		it('Four arguments passed', function() {
			test = -1;
			$('#example').dataTable({
				rowCallback: function() {
					test = arguments.length;
				}
			});
			expect(test == 4).toBe(true);
		});

		dt.html('basic');
		it('4 arguments passed', function() {
			test = -1;
			$('#example').dataTable({
				rowCallback: function() {
					test = arguments.length;
				}
			});
			expect(test == 4).toBe(true);
		});

		dt.html('basic');
		it('rowCallback called once for each drawn row', function() {
			test = 0;
			$('#example').dataTable({
				rowCallback: function(row, data, index) {
					test++;
				}
			});
			expect(test == 10).toBe(true);
		});

		dt.html('basic');
		it('rowCallback allows us to alter row information', function() {
			test = -1;
			$('#example').dataTable({
				rowCallback: function(row, data, index) {
					$(row).addClass('unit_test');
				}
			});
			expect($('#example tbody tr:eq(1)').hasClass('unit_test')).toBe(true);
		});

		dt.html('basic');
		it('Data array has length matching columns', function() {
			test = true;
			$('#example').dataTable({
				fnRowCallback: function(row, data, index) {
					if (data.length != 6) test = false;
				}
			});
			expect(test === true).toBe(true);
		});

		dt.html('basic');
		it('Data array has length matching rows', function() {
			test = true;
			count = 0;
			$('#example').dataTable({
				rowCallback: function(row, data, index) {
					if (count != index) {
						test = false;
					}
					count++;
				}
			});
			expect(test === true).toBe(true);
		});
	});
});
