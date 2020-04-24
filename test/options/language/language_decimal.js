describe('language.decimal option ', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('numerical');
	it('Can set global preference', function(done) {
		$.extend(true, $.fn.dataTable.defaults, {
			language: {
				decimal: '.'
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
	it('Set thousands seperator', function(done) {
		$('#example').dataTable({
			ajax: '/base/test/data/numerical.txt',
			columns: [{ data: 'city' }, { data: 'Score' }, { data: 'Salary' }],
			language: {
				decimal: '.'
			},
			initComplete: function(settings, json) {
				$('div.dataTables_filter input')
					.val('915.00')
					.keyup();
				expect($('div.dataTables_info').text()).toBe('Showing 1 to 7 of 7 entries (filtered from 10,000 total entries)');
				done();
			}
		});
	});

	it("Sorting still works with a '.' as a decimal", function() {
		$('#example thead th:eq(1)').click();
		expect($('#example > tbody > tr:nth-child(1) > td.sorting_1').text()).toBe('5.46');
	});

	dt.html('numerical');
	it('Multi-column sort works', function(done) {
		$('#example').dataTable({
			ajax: '/base/test/data/numerical.txt',
			columns: [{ data: 'city' }, { data: 'Score' }, { data: 'Salary' }],
			language: {
				decimal: '.'
			},
			initComplete: function(settings, json) {
				var clickEvent = $.Event('click');
				clickEvent.shiftKey = true;
				$('#example thead th:eq(1)').trigger(clickEvent);
				expect($('#example tbody tr td:eq(1)').text()).toBe('16.38');
				done();
			}
		});
	});
});
