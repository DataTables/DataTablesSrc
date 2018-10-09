//Needs more tests for this, dont fully understand what it does
describe('column.orderDataType option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default should be null', function() {
			$('#example').dataTable({
				columnDefs: [
					{
						targets: 0,
						cellType: 'th'
					}
				]
			});
			expect($.fn.dataTable.defaults.column.sSortDataType).toBe('std');
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
