describe('columns.title option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Columns names are read from DOM by default', function() {
			$('#example').dataTable({});

			var nNodes = $('#example thead tr:eq(0) th');
			expect(nNodes[0].innerHTML).toBe('Name');
			expect(nNodes[1].innerHTML).toBe('Position');
			expect(nNodes[2].innerHTML).toBe('Office');
			expect(nNodes[3].innerHTML).toBe('Age');
			expect(nNodes[4].innerHTML).toBe('Start date');
			expect(nNodes[5].innerHTML).toBe('Salary');
		});

		dt.html('basic');
		it('Can set a single column title - others are read from DOM', function() {
			$('#example').dataTable({
				columns: [null, { title: 'unit test' }, null, null, null, null]
			});
			var nNodes = $('#example thead tr:eq(0) th');
			expect(nNodes[0].innerHTML).toBe('Name');
			expect(nNodes[1].innerHTML).toBe('unit test');
			expect(nNodes[2].innerHTML).toBe('Office');
			expect(nNodes[3].innerHTML).toBe('Age');
			expect(nNodes[4].innerHTML).toBe('Start date');
			expect(nNodes[5].innerHTML).toBe('Salary');
		});

		dt.html('basic');
		it('Can set multiple column titles', function() {
			$('#example').dataTable({
				columns: [null, { title: 'unit test' }, { title: 'unit test 2' }, null, null, null]
			});
			var nNodes = $('#example thead tr:eq(0) th');
			expect(nNodes[0].innerHTML).toBe('Name');
			expect(nNodes[1].innerHTML).toBe('unit test');
			expect(nNodes[2].innerHTML).toBe('unit test 2');
			expect(nNodes[3].innerHTML).toBe('Age');
			expect(nNodes[4].innerHTML).toBe('Start date');
			expect(nNodes[5].innerHTML).toBe('Salary');
		});

		dt.html('basic');
		it('Can set multiple column titles in columnDefs', function() {
			$('#example').dataTable({
				columnDefs: [{ title: 'unit test 1', targets: [0, 5] }, { title: 'unit test 2', targets: [1, 4] }]
			});
			var nNodes = $('#example thead tr:eq(0) th');
			expect(nNodes[0].innerHTML).toBe('unit test 1');
			expect(nNodes[1].innerHTML).toBe('unit test 2');
			expect(nNodes[2].innerHTML).toBe('Office');
			expect(nNodes[3].innerHTML).toBe('Age');
			expect(nNodes[4].innerHTML).toBe('unit test 2');
			expect(nNodes[5].innerHTML).toBe('unit test 1');
		});
	});
});
