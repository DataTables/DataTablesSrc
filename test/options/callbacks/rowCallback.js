describe('rowCallback Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default should not be true', function() {
			$('#example').DataTable();
			expect($.fn.dataTable.defaults.fnRowCallback).not.toBe(true);
			expect($.fn.dataTable.defaults.rowCallback).not.toBe(true);
		});

		dt.html('basic');
		it('Expected arguments passed', function() {
			let called = false;
			$('#example').DataTable({
				rowCallback: function() {
					if (called === false) {
						called = true;
						expect(arguments.length).toBe(5);
						expect(arguments[0] instanceof HTMLElement).toBe(true);
						expect(Array.isArray(arguments[1])).toBe(true);
						expect(typeof arguments[2]).toBe('number');
						expect(typeof arguments[3]).toBe('number');
						expect(typeof arguments[4]).toBe('number');
					}
				}
			});
			expect(called).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('rowCallback called once for each drawn row', function() {
			test = 0;
			$('#example').DataTable({
				pageLength: 15,
				rowCallback: function(row, data, displayNum, displayIndex, dataIndex) {
					test++;
				}
			});
			expect(test).toBe(15);
		});

		dt.html('basic');
		it('rowCallback allows us to alter row information', function() {
			$('#example').DataTable({
				rowCallback: function(row, data, displayNum, displayIndex, dataIndex) {
					$(row).addClass('unit_test');
				}
			});
			expect($('#example tbody tr:eq(1)').hasClass('unit_test')).toBe(true);
			expect($('#example .unit_test').length).toBe(10);
		});

		dt.html('basic');
		it('Data array has length matching columns', function() {
			$('#example').DataTable({
				rowCallback: function(row, data, displayNum, displayIndex, dataIndex) {
					expect(data.length).toBe(6);
				}
			});
		});

		dt.html('basic');
		it('Data has expected value', function() {
			let called = false;
			$('#example').DataTable({
				rowCallback: function(row, data, displayNum, displayIndex, dataIndex) {
					if (!called) {
						expect(data[0]).toBe('Airi Satou');
						called = true;
					}
				}
			});
		});

		dt.html('basic');
		it('Check the displayNum argument', function() {
			let count = 0;
			$('#example').DataTable({
				displayStart: 10,
				rowCallback: function(row, data, displayNum, displayIndex, dataIndex) {
					expect(displayNum).toBe(count++);
				}
			});
		});

		dt.html('basic');
		it('Check the displayIndex argument', function() {
			let count = 10;
			$('#example').DataTable({
				displayStart: 10,
				rowCallback: function(row, data, displayNum, displayIndex, dataIndex) {
					expect(displayIndex).toBe(count++);
				}
			});
		});

		dt.html('basic');
		it('Check the displayIndex argument', function() {
			let called = false;
			let count = 0;
			let expected = [12, 8, 19, 56, 23];
			$('#example').DataTable({
				displayStart: 10,
				pageLength: 5,
				rowCallback: function(row, data, displayNum, displayIndex, dataIndex) {
					if (!called) {
						expect(dataIndex).toBe(expected[count++]);
					}
				}
			});
		});
	});
});
