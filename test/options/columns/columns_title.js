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
			expect(nNodes[0].textContent).toBe('Name');
			expect(nNodes[1].textContent).toBe('Position');
			expect(nNodes[2].textContent).toBe('Office');
			expect(nNodes[3].textContent).toBe('Age');
			expect(nNodes[4].textContent).toBe('Start date');
			expect(nNodes[5].textContent).toBe('Salary');
		});

		it('Has span elements wrapping the contents', function () {
			var nNodes = $('#example thead tr:eq(0) th span.dt-column-title');
			expect(nNodes[0].textContent).toBe('Name');
			expect(nNodes[1].textContent).toBe('Position');
			expect(nNodes[2].textContent).toBe('Office');
			expect(nNodes[3].textContent).toBe('Age');
			expect(nNodes[4].textContent).toBe('Start date');
			expect(nNodes[5].textContent).toBe('Salary');
		});

		it('Spans have the dt-column-title class', function () {
			var nNodes = $('#example thead tr:eq(0) th span.dt-column-title');
			expect(nNodes.length).toBe(6);
		});

		dt.html('basic');
		it('Can set a single column title - others are read from DOM', function() {
			$('#example').dataTable({
				columns: [null, { title: 'unit test' }, null, null, null, null]
			});
			var nNodes = $('#example thead tr:eq(0) th');
			expect(nNodes[0].textContent).toBe('Name');
			expect(nNodes[1].textContent).toBe('unit test');
			expect(nNodes[2].textContent).toBe('Office');
			expect(nNodes[3].textContent).toBe('Age');
			expect(nNodes[4].textContent).toBe('Start date');
			expect(nNodes[5].textContent).toBe('Salary');
		});

		dt.html('basic');
		it('Can set multiple column titles', function() {
			$('#example').dataTable({
				columns: [null, { title: 'unit test' }, { title: 'unit test 2' }, null, null, null]
			});
			var nNodes = $('#example thead tr:eq(0) th');
			expect(nNodes[0].textContent).toBe('Name');
			expect(nNodes[1].textContent).toBe('unit test');
			expect(nNodes[2].textContent).toBe('unit test 2');
			expect(nNodes[3].textContent).toBe('Age');
			expect(nNodes[4].textContent).toBe('Start date');
			expect(nNodes[5].textContent).toBe('Salary');
		});

		dt.html('basic');
		it('Can set multiple column titles in columnDefs', function() {
			$('#example').dataTable({
				columnDefs: [{ title: 'unit test 1', targets: [0, 5] }, { title: 'unit test 2', targets: [1, 4] }]
			});
			var nNodes = $('#example thead tr:eq(0) th');
			expect(nNodes[0].textContent).toBe('unit test 1');
			expect(nNodes[1].textContent).toBe('unit test 2');
			expect(nNodes[2].textContent).toBe('Office');
			expect(nNodes[3].textContent).toBe('Age');
			expect(nNodes[4].textContent).toBe('unit test 2');
			expect(nNodes[5].textContent).toBe('unit test 1');
		});
	});
});
