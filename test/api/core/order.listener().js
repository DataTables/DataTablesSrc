describe('core- order.listener()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		let table;
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.order.listener).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.order([]) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		let table;
		let count = 0;
		it('Does column ordering without need for a draw()', function() {
			table = $('#example').DataTable();
			table.order.listener('.dataTables_filter input', 2, function callback() {
				count++;
			});
			$('.dataTables_filter input').click();
			expect($('#example tbody td:eq(0)').html()).toBe('Cedric Kelly');
		});
		it('Callback is executed', function() {
			expect(count).toBe(1);
		});
		it('Can still sort on the table control', function() {
			$('#example thead th:eq(2)').click();
			expect($('#example tbody td:eq(0)').html()).toBe('Airi Satou');
		});
		it('Callback is not executed', function() {
			expect(count).toBe(1);
		});
		it('Responds to shift being pressed', function() {
			$('#example thead th:eq(1)').click();
			var clickEvent = $.Event('click');
			clickEvent.shiftKey = true;
			$('.dataTables_filter input').trigger(clickEvent);
			expect($('#example tbody tr:eq(9) td:eq(0)').html()).toBe('Suki Burks');
		});
		it('Callback is not executed', function() {
			expect(count).toBe(2);
		});
		it('Callback is not executed on API order', function() {
			table.order([5, 'asc']).draw();
			expect($('#example tbody td:eq(0)').html()).toBe('Jennifer Acosta');
			expect(count).toBe(2);
		});
	});
});
