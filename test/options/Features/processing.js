describe('Processing option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});
	describe('Check Default ', function() {
		dt.html('basic');
		it('Processing is off by default', function() {
			expect($.fn.dataTable.defaults.bProcessing).toEqual(false);
		});
	});
	describe('Check can enable', function() {
		dt.html('basic');
		it('Processing can be enabled', function() {
			$('#example').on('processing.dt', function(e) {
				expect($('div.dataTables_processing').length).toBe(1);
			});
			$('#example').dataTable({
				processing: true
			});
			$('#example').off('processing.dt', function(e) {});
		});
		it('Processing div is in the DOM', function() {
			expect($('div.dataTables_processing').length).toBe(1);
		});
	});

	describe('disable makes no difference', function() {
		dt.html('basic');
		it('Processing disabled override', function() {
			$('#example').dataTable({
				processing: false
			});
			$('#example').on('processing.dt', function(e) {
				expect($('div.dataTables_processing').length).toBe(0);
			});

			$('#example').off('processing.dt', function(e) {});
		});
		it('Processing div is not in the DOM', function() {
			expect($('div.dataTables_processing').length).toBe(0);
		});
	});
});
