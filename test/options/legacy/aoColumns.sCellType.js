describe('Legacy aoColumns.sCellType option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Set with legacy parameter', function (done) {
		new DataTable('#example', {
			ajax: '/base/test/data/data.txt',
			columns: dt.getTestColumns(),
			aoColumnDefs: [{
				target: 1,
				sCellType: 'th'
			}],
			initComplete: function() {
				expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
				expect($('#example tbody tr:eq(0) th:eq(0)').text()).toBe('Accountant');
				expect($('#example tbody tr:eq(0) td:eq(1)').text()).toBe('Tokyo');
				done();
			}
		});
	});
});
