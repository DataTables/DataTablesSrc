describe('column.orderDataType option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default value', function() {
			expect($.fn.dataTable.defaults.column.sSortDataType).toBe('std');
		});
		it('Change name to search by last name', function() {
			$.fn.dataTable.ext.order['unit-test'] = function(settings, col) {
				return this.api()
					.column(col, { order: 'index' })
					.nodes()
					.map(function(td, i) {
						var string = $(td)
							.text()
							.split(' ');
						return string[1] + ' ' + string[0];
					});
			};
			$('#example').DataTable({
				columnDefs: [{ targets: 0, orderDataType: 'unit-test' }]
			});
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Jennifer Acosta');
		});
		it('... and reverse', function() {
			$('thead th:eq(0)').click();
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Sakura Yamamoto');
		});

		dt.html('liveOrder');
		it('live data sort type with columnDefs', function() {
			/* Create an array with the values of all the input boxes in a column */
			$.fn.dataTable.ext.order['dom-text'] = function(settings, col) {
				return this.api()
					.column(col, { order: 'index' })
					.nodes()
					.map(function(td, i) {
						return $('input', td).val();
					});
			};
			/* Create an array with the values of all the input boxes in a column, parsed as numbers */
			$.fn.dataTable.ext.order['dom-text-numeric'] = function(settings, col) {
				return this.api()
					.column(col, { order: 'index' })
					.nodes()
					.map(function(td, i) {
						return $('input', td).val() * 1;
					});
			};
			/* Create an array with the values of all the select options in a column */
			$.fn.dataTable.ext.order['dom-select'] = function(settings, col) {
				return this.api()
					.column(col, { order: 'index' })
					.nodes()
					.map(function(td, i) {
						return $('select', td).val();
					});
			};
			/* Create an array with the values of all the checkboxes in a column */
			$.fn.dataTable.ext.order['dom-checkbox'] = function(settings, col) {
				return this.api()
					.column(col, { order: 'index' })
					.nodes()
					.map(function(td, i) {
						return $('input', td).prop('checked') ? '1' : '0';
					});
			};
			/* Initialise the table with the required column ordering data types */
			$('#example').DataTable({
				columns: [
					null,
					{ orderDataType: 'dom-text-numeric' },
					{ orderDataType: 'dom-text', type: 'string' },
					{ orderDataType: 'dom-select' }
				]
			});
			$('#example tbody tr:eq(0) td:eq(2) input').val('Accountant1');
			$('#example th:eq(2)').click();
			expect($('#example tbody tr:eq(1) td:eq(2) input').val() === 'Accountant1').toBe(true);
		});
	});
});
