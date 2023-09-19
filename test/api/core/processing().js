describe('processing()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	var table;

	dt.html('basic');

	it('Exists', function() {
		table = $('#example').DataTable();

		expect(typeof table.processing).toBe('function');
	});

	it('Does nothing if processing not enabled', function() {
		table.processing(true);

		expect($('div.dt-processing').length).toBe(0);
	});

	it('And for disable processing', function() {
		table.processing(false);

		expect($('div.dt-processing').length).toBe(0);
	});

	dt.html('basic');

	it('Can be shown with processing enabled', function() {
		table = $('#example').DataTable({
			processing: true
		});

		table.processing(true);
		expect($('div.dt-processing').is(':visible')).toBe(true);
	});

	it('Can be hidden', function() {
		table.processing(false);
		expect($('div.dt-processing').is(':visible')).toBe(false);
	});
});
