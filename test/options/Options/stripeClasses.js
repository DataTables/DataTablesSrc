describe('stripeClasses Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Default tests', function() {
		dt.html('basic');
		it('Confirm default odd and even behaviour', function() {
			$('#example').dataTable();
			expect($('#example tbody tr:eq(0)').attr('class')).toBe('odd');
			expect($('#example tbody tr:eq(1)').attr('class')).toBe('even');
			expect($('#example tbody tr:eq(2)').attr('class')).toBe('odd');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Empty stripeClasses', function() {
			$('#example').dataTable({
				stripeClasses: []
			});
			expect($('#example tbody tr:eq(0)').attr('class')).toBe(undefined);
			expect($('#example tbody tr:eq(1)').attr('class')).toBe(undefined);
		});

		dt.html('basic');
		it('Single class', function() {
			$('#example').dataTable({
				stripeClasses: ['wibble']
			});
			expect($('#example tbody tr:eq(0)').attr('class')).toBe('wibble');
			expect($('#example tbody tr:eq(1)').attr('class')).toBe('wibble');
		});

		dt.html('basic');
		it('Two classes', function() {
			$('#example').dataTable({
				stripeClasses: ['first', 'second']
			});
			expect($('#example tbody tr:eq(0)').attr('class')).toBe('first');
			expect($('#example tbody tr:eq(1)').attr('class')).toBe('second');
			expect($('#example tbody tr:eq(2)').attr('class')).toBe('first');
		});

		dt.html('basic');
		it('Three classes', function() {
			$('#example').dataTable({
				stripeClasses: ['first', 'second', 'third']
			});
			expect($('#example tbody tr:eq(0)').attr('class')).toBe('first');
			expect($('#example tbody tr:eq(1)').attr('class')).toBe('second');
			expect($('#example tbody tr:eq(2)').attr('class')).toBe('third');
			expect($('#example tbody tr:eq(6)').attr('class')).toBe('first');
			expect($('#example tbody tr:eq(7)').attr('class')).toBe('second');
			expect($('#example tbody tr:eq(8)').attr('class')).toBe('third');
		});

		dt.html('basic');
		it('Three classes on second page', function() {
			var table = $('#example').DataTable({
				stripeClasses: ['first', 'second', 'third']
			});
			table.page(1).draw(false);
			expect($('#example tbody tr:eq(0)').attr('class')).toBe('first');
			expect($('#example tbody tr:eq(1)').attr('class')).toBe('second');
			expect($('#example tbody tr:eq(2)').attr('class')).toBe('third');
			expect($('#example tbody tr:eq(6)').attr('class')).toBe('first');
			expect($('#example tbody tr:eq(7)').attr('class')).toBe('second');
			expect($('#example tbody tr:eq(8)').attr('class')).toBe('third');
		});		
	});
});
