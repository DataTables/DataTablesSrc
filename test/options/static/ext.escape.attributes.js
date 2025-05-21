describe('static - .ext.escape.attributes', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Functional tests', function() {
		it('Default is disabled', function () {
			expect(DataTable.ext.escape.attributes).toBe(false);
		});

		dt.html('empty');

		it('Default will not escape entities', function() {
			$('#example').attr('data-caption', '<b>Strong</b>');

			table = $('#example').DataTable();

			expect($('#example caption').text()).toBe('Strong');
			expect($('#example caption b').length).toBe(1);
		});

		dt.html('empty');

		it('Can escape entities', function() {
			DataTable.ext.escape.attributes = true;

			$('#example').attr('data-caption', '<b>Strong</b>');

			table = $('#example').DataTable();

			expect($('#example caption').text()).toBe('<b>Strong</b>');
			expect($('#example caption b').length).toBe(0);

			// Reset
			DataTable.ext.escape.attributes = false;
		});
	});
});
