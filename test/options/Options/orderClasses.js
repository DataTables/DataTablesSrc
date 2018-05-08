describe('orderClasses option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Enabled by default', function() {
			$('#example').dataTable();
			expect($('#example tbody tr:eq(0) td:eq(0)').hasClass('sorting_1'));
		});

		dt.html('basic');
		it('Applied to single column', function() {
			$('#example').dataTable({
				order: [[0, 'desc']]
			});

			expect($('#example tbody tr:eq(0) td:eq(0)').attr('class')).toBe('sorting_1');

			expect($('#example tbody tr:eq(0) td:eq(1)').attr('class')).toBe(undefined);
			expect($('#example tbody tr:eq(0) td:eq(2)').attr('class')).toBe(undefined);
			expect($('#example tbody tr:eq(0) td:eq(3)').attr('class')).toBe(undefined);
			expect($('#example tbody tr:eq(0) td:eq(4)').attr('class')).toBe(undefined);
			expect($('#example tbody tr:eq(0) td:eq(5)').attr('class')).toBe(undefined);
		});

		dt.html('basic');
		it('Applied to multiple columns', function() {
			$('#example').dataTable({
				order: [[0, 'desc'], [1, 'desc']]
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').hasClass('sorting_1')).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(1)').hasClass('sorting_2')).toBe(true);
		});

		dt.html('basic');
		it('Applied to a third column', function() {
			$('#example').dataTable({
				order: [[0, 'desc'], [1, 'desc'], [2, 'asc']]
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').hasClass('sorting_1')).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(1)').hasClass('sorting_2')).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(2)').hasClass('sorting_3')).toBe(true);
		});

		dt.html('basic');
		it('Applied to a 4th column', function() {
			$('#example').dataTable({
				order: [[0, 'desc'], [1, 'desc'], [2, 'asc'], [3, 'desc']]
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').hasClass('sorting_1')).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(1)').hasClass('sorting_2')).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(2)').hasClass('sorting_3')).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(3)').hasClass('sorting_3')).toBe(true);
		});
	});

	describe('Can be disabled', function() {
		dt.html('basic');
		it('Can be turned off', function() {
			$('#example').dataTable({
				orderClasses: false,
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').hasClass('sorting_1')).toBe(false);
		});

		it('Add column 2- no effect', function() {
			var clickEvent = $.Event('click');
			clickEvent.shiftKey = true;
			$('#example thead th:eq(1)').trigger(clickEvent);
			expect($('#example tbody tr:eq(0) td:eq(0)').hasClass('sorting_1')).toBe(false);
			expect($('#example tbody tr:eq(0) td:eq(1)').hasClass('sorting_1')).toBe(false);
		});

		it('Add column 3- no effect', function() {
			var clickEvent = $.Event('click');
			clickEvent.shiftKey = true;
			$('#example thead th:eq(2)').trigger(clickEvent);
			expect($('#example tbody tr:eq(0) td:eq(0)').hasClass('sorting_1')).toBe(false);
			expect($('#example tbody tr:eq(0) td:eq(1)').hasClass('sorting_1')).toBe(false);
			expect($('#example tbody tr:eq(0) td:eq(2)').hasClass('sorting_1')).toBe(false);
		});
	});

	describe('Functional tests', function() {
		dt.html('two_tables');
		it('When multiple tables all OK', function() {
			$('#example_one').DataTable({
				orderClasses: false,
			});
			$('#example_two').DataTable({
				orderClasses: true,
			});

			expect($('#example_one tbody tr:eq(0) td:eq(0)').attr('class')).toBe(undefined);
			expect($('#example_two tbody tr:eq(0) td:eq(0)').attr('class')).toBe('sorting_1');			
		});
	});
});
