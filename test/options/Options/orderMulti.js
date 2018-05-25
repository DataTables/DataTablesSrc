describe('orderMulti option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Enabled by default', function() {
			expect($.fn.dataTable.defaults.bSortMulti).toBe(true);
		});

		it('Verify enabled by default', function() {
			$('#example').dataTable();
			$('#example thead th:eq(2)').click();
			var clickEvent = $.Event('click');
			clickEvent.shiftKey = true;
			$('#example thead th:eq(3)').trigger(clickEvent);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Cedric Kelly');
		});

		dt.html('basic');
		it('Setting true is the same as the default', function() {
			$('#example').dataTable({
				orderMulti: true
			});
			$('#example thead th:eq(2)').click();
			var clickEvent = $.Event('click');
			clickEvent.shiftKey = true;
			$('#example thead th:eq(3)').trigger(clickEvent);
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Cedric Kelly');
		});

		dt.html('basic');
		it('Can be disabled', function() {
			$('#example').dataTable({
				orderMulti: false
			});
			$('#example thead th:eq(2)').click();
			var clickEvent = $.Event('click');
			clickEvent.shiftKey = true;
			$('#example thead th:eq(3)').trigger(clickEvent);
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Tatyana Fitzpatrick');
		});

		dt.html('basic');
		it('Setting true is the same as the default', function() {
			$('#example').dataTable({
				orderMulti: true
			});
			$('#example thead th:eq(2)').click();
			var clickEvent = $.Event('click');
			clickEvent.shiftKey = true;
			$('#example thead th:eq(3)').trigger(clickEvent);
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Cedric Kelly');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Can set multiple ordering at initialisation', function() {
			$('#example').dataTable({
				order: [[2, 'asc'], [1, 'asc']],
				orderMulti: false
			});
			expect($('#example tbody td:eq(0)').text()).toBe('Gavin Joyce');
		});

		dt.html('basic');
		it('Can set multiple ordering programmitically', function() {
			var table = $('#example').DataTable({
				orderMulti: false
			});

			table.order([[2, 'asc'], [1, 'asc']]).draw(false);
			expect($('#example tbody td:eq(0)').text()).toBe('Gavin Joyce');
		});

		dt.html('two_tables');
		it('When multiple tables all OK', function() {
			$('#example_one').DataTable({
				orderMulti: true
			});
			$('#example_two').DataTable({
				orderMulti: false
			});
			var clickEvent = $.Event('click');
			clickEvent.shiftKey = true;
			$('#example_one thead th:eq(1)').trigger(clickEvent);
			$('#example_two thead th:eq(1)').trigger(clickEvent);

			expect($('#example_one tbody td:eq(0)').text()).toBe('Airi Satou');
			expect($('#example_two tbody td:eq(0)').text()).toBe('Sydney');
		});
	});
});
