describe('columns.footer option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Columns names are read from DOM by default', function() {
			$('#example').dataTable({});

			var nNodes = $('#example tfoot tr:eq(0) th');
			expect(nNodes[0].textContent).toBe('Name');
			expect(nNodes[1].textContent).toBe('Position');
			expect(nNodes[2].textContent).toBe('Office');
			expect(nNodes[3].textContent).toBe('Age');
			expect(nNodes[4].textContent).toBe('Start date');
			expect(nNodes[5].textContent).toBe('Salary');
		});

		it('Has span elements wrapping the contents', function () {
			var nNodes = $('#example tfoot tr:eq(0) th span');
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
				columns: [null, { footer: 'unit test' }, null, null, null, null]
			});
			var nNodes = $('#example tfoot tr:eq(0) th');
			expect(nNodes[0].textContent).toBe('Name');
			expect(nNodes[1].textContent).toBe('unit test');
			expect(nNodes[2].textContent).toBe('Office');
			expect(nNodes[3].textContent).toBe('Age');
			expect(nNodes[4].textContent).toBe('Start date');
			expect(nNodes[5].textContent).toBe('Salary');
		});

		it('Does not write to the server', function() {
			var nNodes = $('#example thead tr:eq(0) th');
			expect(nNodes[0].textContent).toBe('Name');
			expect(nNodes[1].textContent).toBe('Position');
			expect(nNodes[2].textContent).toBe('Office');
			expect(nNodes[3].textContent).toBe('Age');
			expect(nNodes[4].textContent).toBe('Start date');
			expect(nNodes[5].textContent).toBe('Salary');
		});

		dt.html('no_footer');
		it('Can create cells', function() {
			$('#example').dataTable({
				columns: [
					{ footer: '1' },
					{ footer: '2' },
					{ footer: '3' },
					{ footer: '4' },
					{ footer: '5' },
					{ footer: '6' },	
				]
			});
		
			var nNodes = $('#example tfoot tr:eq(0) th');
			expect(nNodes[0].textContent).toBe('1');
			expect(nNodes[1].textContent).toBe('2');
			expect(nNodes[2].textContent).toBe('3');
			expect(nNodes[3].textContent).toBe('4');
			expect(nNodes[4].textContent).toBe('5');
			expect(nNodes[5].textContent).toBe('6');
		});

		dt.html('no_footer');
		it('Does not create cells if no present and no footer option given', function() {
			$('#example').dataTable();
		
			var nNodes = $('#example tfoot tr:eq(0) th');
			expect(nNodes.length).toBe(0);
		});
	});
});
