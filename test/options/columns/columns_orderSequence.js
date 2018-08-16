describe('column.orderSequence option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default should be null', function() {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.column.asSorting.length).toBe(2);
			expect($.fn.dataTable.defaults.column.asSorting[0]).toBe('asc');
			expect($.fn.dataTable.defaults.column.asSorting[1]).toBe('desc');
		});

		dt.html('basic');
		it('Default behaviour', function() {
			$('#example').dataTable();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('33');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
		});

		dt.html('basic');
		it('Default order sequence', function() {
			$('#example').dataTable({
				columnDefs: [{ orderSequence: ['asc', 'desc'], targets: 3 }]
			});
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('33');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
		});

		dt.html('basic');
		it('Default order reversed sequence', function() {
			$('#example').dataTable({
				columnDefs: [{ orderSequence: ['desc', 'asc'], targets: 3 }]
			});
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('33');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
		});

		dt.html('basic');
		it('Default order with additional empty sequence', function() {
			$('#example').dataTable({
				columnDefs: [{ orderSequence: ['asc', 'desc', ''], targets: 3 }]
			});
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('33');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
		});

		dt.html('basic');
		it('Default order with additional sequence', function() {
			$('#example').dataTable({
				columnDefs: [{ orderSequence: ['asc', 'desc', 'asc'], targets: 3 }]
			});
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('33');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
		});

		dt.html('basic');
		it('Use orderSequence to define applied order sequence using columns', function() {
			$('#example').dataTable({
				columns: [null, null, null, { orderSequence: ['desc', 'asc'] }, null, null]
			});
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('33');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
		});
	});
});
