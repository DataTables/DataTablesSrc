describe('lengthMenu Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function checkText(options, expected) {
		expect(options.length).toBe(expected.length);

		for (let i = 0; i < options.length; i++) {
			expect(options.eq(i).text()).toBe(expected[i]);
		}
	}

	function checkValue(options, expected) {
		expect(options.length).toBe(expected.length);

		for (let i = 0; i < options.length; i++) {
			expect(options.get(i).value).toBe(expected[i]);
		}
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Check default values', function() {
			$('#example').dataTable();

			let options = $('select option');
			checkText(options, ['10', '25', '50', '100']);
			checkValue(options, ['10', '25', '50', '100']);
		});

		dt.html('basic');
		it('Setting to non-default values', function() {
			$('#example').dataTable({
				lengthMenu: [15, 30, 45, 60]
			});

			let options = $('select option');
			checkText(options, ['15', '30', '45', '60']);
			checkValue(options, ['15', '30', '45', '60']);
		});

		dt.html('basic');
		it('Change length', function() {
			$('#example').dataTable({
				lengthMenu: [1, 10, 15]
			});

			let options = $('select option');
			checkText(options, ['1', '10', '15']);
			checkValue(options, ['1', '10', '15']);
		});

		dt.html('basic');
		it('Use different language strings', function() {
			$('#example').dataTable({
				lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'All']]
			});

			let options = $('select option');
			checkText(options, ['10', '25', '50', 'All']);
			checkValue(options, ['10', '25', '50', '-1']);
		});

		dt.html('basic');
		it('Large numbers are formatted for thousands', function() {
			$('#example').dataTable({
				lengthMenu: [[10, 25, 50, 10000, -1], [10, 25, 50, 10000, 'All']]
			});

			let options = $('select option');
			checkText(options, ['10', '25', '50', '10,000', 'All']);
			checkValue(options, ['10', '25', '50', '10000', '-1']);
		});
	});

	describe('Integration style tests', function() {
		dt.html('basic');
		it('Pagelength set to first size', function() {
			let table = $('#example').DataTable({
				lengthMenu: [15, 30, 45, 60]
			});

			expect(table.page.info().length).toBe(15);
		});

		dt.html('basic');
		it('Pagelength not set to first size if pageLength set', function() {
			let table = $('#example').DataTable({
				lengthMenu: [15, 30, 45, 60],
				pageLength: 12
			});

			expect(table.page.info().length).toBe(12);
		});

		dt.html('basic');
		it('Server-side processing', function(done) {
			let table = $('#example').DataTable({
				processing: true,
				serverSide: true,
				lengthMenu: [15, 30, 45, 60],
				ajax: dt.serverSide,
				initComplete: function(setting, json) {
					expect(table.page.info().length).toBe(15);
					done();
				}
			});
		});
	});
});
