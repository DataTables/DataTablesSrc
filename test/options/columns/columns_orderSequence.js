describe('column.orderSequence option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default should be null', function() {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.column.asSorting.length).toBe(3);
			expect($.fn.dataTable.defaults.column.asSorting[0]).toBe('asc');
			expect($.fn.dataTable.defaults.column.asSorting[1]).toBe('desc');
			expect($.fn.dataTable.defaults.column.asSorting[2]).toBe('');
		});

		dt.html('basic');
		it('Default behaviour', async function() {
			$('#example').dataTable();
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('33');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('61');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
		});

		dt.html('basic');
		it('Default order sequence', async function() {
			$('#example').dataTable({
				columnDefs: [{ orderSequence: ['asc', 'desc'], targets: 3 }]
			});
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('33');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
		});

		dt.html('basic');
		it('Default order reversed sequence', async function() {
			$('#example').dataTable({
				columnDefs: [{ orderSequence: ['desc', 'asc'], targets: 3 }]
			});
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('33');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
		});

		dt.html('basic');
		it('Default order with additional empty sequence', async function() {
			$('#example').dataTable({
				columnDefs: [{ orderSequence: ['asc', 'desc', ''], targets: 3 }]
			});
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('33');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('61');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
		});

		dt.html('basic');
		it('Default order with additional sequence', async function() {
			$('#example').dataTable({
				columnDefs: [{ orderSequence: ['asc', 'desc', 'asc'], targets: 3 }]
			});
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('33');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
		});

		dt.html('basic');
		it('Use orderSequence to define applied order sequence using columns', async function() {
			$('#example').dataTable({
				columns: [null, null, null, { orderSequence: ['desc', 'asc'] }, null, null]
			});
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('33');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
		});
	});
});
