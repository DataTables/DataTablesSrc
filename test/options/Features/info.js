describe('info option- Feature', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check Default', function() {
		dt.html('basic');
		it('Info div set to true by default', function() {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.bInfo).toBe(true);
		});

		dt.html('basic');
		it('Info can be disabled', function() {
			$('#example').dataTable({
				info: false
			});
			expect($('div.dataTables_info').length).toBe(0);
		});

		dt.html('basic');
		it('Info enable override', function() {
			$('#example').dataTable({
				info: true
			});
			expect($('div.dataTables_info').length).toBe(1);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Info correctly displays text', function() {
			$('#example').dataTable({
				info: true
			});
			expect($('div.dataTables_info').html()).toBe('Showing 1 to 10 of 57 entries');
		});

		it('example_info is in correct position in DOM', function() {
			expect(
				$('div.dataTables_info')
					.prev()
					.attr('id')
			).toBe('example');
		});

		dt.html('two_tables');
		it('When multiple tables all OK', function() {
			$('#example_one').DataTable({
				info: true
			});
			$('#example_two').DataTable({
				info: false
			});
			expect($('#example_one_wrapper div.dataTables_info').length).toBe(1);
			expect($('#example_two_wrapper div.dataTables_info').length).toBe(0);
		});

		dt.html('basic');
		it('Default can be set to disabled', function() {
			$.fn.dataTable.defaults.bInfo = false;
			$('#example').DataTable();
			expect($('div.dataTables_info').length).toBe(0);
		});
	});
});
