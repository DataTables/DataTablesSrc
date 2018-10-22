describe('core - destroy()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().destroy).toBe('function');
		});

		it('Returns an API instance', function() {
			expect(
				$('#example')
					.DataTable()
					.destroy() instanceof $.fn.dataTable.Api
			).toBe(true);
		});
	});

	describe('Functional tests', function() {
		function testElementsPresent(present) {
			let elements = [
				'div.dataTables_length',
				'div.dataTables_info',
				'div.dataTables_paginate',
				// Jira DD-71: '.sorting_asc',
				'.sorting'
			];
			elements.forEach(function(element) {
				expect($(element).length > 0).toBe(present);
			});
		}

		dt.html('basic');
		it('Check extra HTML elements are removed', function() {
			let table = $('#example').DataTable();
			testElementsPresent(true);
			table.destroy();
			expect($('#example').length).toBe(1);
			testElementsPresent(false);
		});

		dt.html('basic');
		it('Check default is false', function() {
			let table = $('#example').DataTable();
			table.destroy(false);
			expect($('#example').length).toBe(1);
			testElementsPresent(false);
		});

		dt.html('basic');
		it('Check undefined', function() {
			let table = $('#example').DataTable();
			table.destroy(undefined);
			expect($('#example').length).toBe(1);
			testElementsPresent(false);
		});

		dt.html('basic');
		it('Check if optional arg is true, entire table is removed', function() {
			let table = $('#example').DataTable();
			table.destroy(true);
			expect($('#example').length).toBe(0);
			testElementsPresent(false);
		});

		dt.html('basic');
		it('Check events remain if optional arg is true', function() {
			let count = 0;
			$('#example').click(function() {
				count++;
			});

			let table = $('#example').DataTable();
			table.destroy();
			expect(jQuery._data(document.getElementById('example'), 'events').click.length).toBe(1);

			$('#example thead th:eq(2)').click();
			expect(count).toBe(1);
		});
	});

	describe('Integration style tests', function() {
		dt.html('two_tables');
		it('When multiple tables all OK', function() {
			let table1 = $('#example_one').DataTable();
			let table2 = $('#example_two').DataTable();

			table1.destroy(true);

			expect($('#example_one').length).toBe(0);
			expect($('#example_two').length).toBe(1);
		});
	});
});
