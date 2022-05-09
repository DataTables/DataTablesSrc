describe('language.thousands option ', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('numerical');
	it('Can set global preference', function(done) {
		$.extend(true, $.fn.dataTable.defaults, {
			language: {
				thousands: ','
			}
		});
		$('#example').dataTable({
			ajax: '/base/test/data/numerical.txt',
			columns: [{ data: 'city' }, { data: 'Score' }, { data: 'Salary' }],
			initComplete: function(settings, json) {
				$('#example thead th:eq(2)').click();
				expect($('#example tbody tr td:eq(2)').text()).toBe('$20,090.00');
				done();
			}
		});
	});

	dt.html('numerical');
	it('Can we correctly set a thousands separator and have it display in example_info', function(done) {
		$('#example').dataTable({
			ajax: '/base/test/data/numerical.txt',
			columns: [{ data: 'city' }, { data: 'Score' }, { data: 'Salary' }],
			language: {
				thousands: '-'
			},
			lengthMenu: [10, 100, 1000, 2000],
			initComplete: function(settings, json) {
				expect($('div.dataTables_info').text()).toBe('Showing 1 to 10 of 10-000 entries');
				done();
			}
		});
	});

	dt.html('numerical');
	it('Use an empty string to show no seperator', function(done) {
		$('#example').dataTable({
			ajax: '/base/test/data/numerical.txt',
			columns: [{ data: 'city' }, { data: 'Score' }, { data: 'Salary' }],
			language: {
				thousands: ''
			},
			lengthMenu: [10, 100, 1000, 2000],
			initComplete: function(settings, json) {
				expect($('div.dataTables_info').text()).toBe('Showing 1 to 10 of 10000 entries');
				done();
			}
		});
	});
});
