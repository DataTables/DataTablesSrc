describe('columns.cellType option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('empty');
		it('Default should be null', function() {
			expect($.fn.DataTable.defaults.column.sCellType).toBe('td');
		});
	});

	describe('Functional tests', function() {
		dt.html('empty');
		it('Default is td', function(done) {
			$('#example').dataTable({
				ajax: '/base/test/data/data.txt',
				columns: dt.getTestColumns(),
				initComplete: function() {
					expect($('#example tbody td:eq(0)').text()).toBe('Airi Satou');
					expect($('#example tbody th:eq(0)').text()).toBe('');
					done();
				}
			});
		});

		dt.html('empty');
		it('Can also specify td', function(done) {
			$('#example').dataTable({
				ajax: '/base/test/data/data.txt',
				columns: dt.getTestColumns(),
				columnDefs: [
					{
						targets: 0,
						cellType: 'td'
					}
				],
				initComplete: function() {
					expect($('#example tbody td:eq(0)').text()).toBe('Airi Satou');
					expect($('#example tbody th:eq(0)').text()).toBe('');
					done();
				}
			});
		});

		dt.html('empty');
		it('Can change to be th', function(done) {
			$('#example').dataTable({
				ajax: '/base/test/data/data.txt',
				columns: dt.getTestColumns(),
				columnDefs: [
					{
						targets: 0,
						cellType: 'th'
					}
				],
				initComplete: function() {
					expect($('#example tbody td:eq(0)').text()).toBe('Accountant');
					expect($('#example tbody th:eq(0)').text()).toBe('Airi Satou');
					done();
				}
			});
		});

		dt.html('empty');
		it('Can have multiple th', function(done) {
			$('#example').dataTable({
				ajax: '/base/test/data/data.txt',
				columns: dt.getTestColumns(),
				columnDefs: [
					{
						targets: [0, 2],
						cellType: 'th'
					}
				],
				initComplete: function() {
					expect($('#example tbody td:eq(0)').text()).toBe('Accountant');
					expect($('#example tbody td:eq(1)').text()).toBe('33');
					expect($('#example tbody th:eq(0)').text()).toBe('Airi Satou');
					expect($('#example tbody th:eq(1)').text()).toBe('Tokyo');
					done();
				}
			});
		});
	});
});
