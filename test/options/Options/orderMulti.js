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

		it('Verify enabled by default', async function() {
			$('#example').dataTable();
			await dt.clickHeader(2);
			await dt.clickHeader(3, {shift: true});
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Cedric Kelly');
		});

		dt.html('basic');
		it('Setting true is the same as the default', async function() {
			$('#example').dataTable({
				orderMulti: true
			});
			await dt.clickHeader(2);
			await dt.clickHeader(3, {shift: true});
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Cedric Kelly');
		});

		dt.html('basic');
		it('Can be disabled', async function() {
			$('#example').dataTable({
				orderMulti: false
			});
			await dt.clickHeader(2);
			await dt.clickHeader(3, {shift: true});
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Tatyana Fitzpatrick');
		});

		dt.html('basic');
		it('Setting true is the same as the default', async function() {
			$('#example').dataTable({
				orderMulti: true
			});
			await dt.clickHeader(2);
			await dt.clickHeader(3, {shift: true});
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
		it('Can set multiple ordering programmatically', function() {
			var table = $('#example').DataTable({
				orderMulti: false
			});

			table.order([[2, 'asc'], [1, 'asc']]).draw(false);
			expect($('#example tbody td:eq(0)').text()).toBe('Gavin Joyce');
		});

		dt.html('two_tables');
		it('When multiple tables all OK', async function() {
			$('#example_one').DataTable({
				orderMulti: true
			});
			$('#example_two').DataTable({
				orderMulti: false
			});
			await dt.clickHeader('#example_one thead th', 1, {shift: true});
			await dt.clickHeader('#example_two thead th', 1, {shift: true});

			expect($('#example_one tbody td:eq(0)').text()).toBe('Airi Satou');
			expect($('#example_two tbody td:eq(0)').text()).toBe('Sydney');
		});
	});
});
