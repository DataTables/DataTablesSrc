describe('order Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check defaults', function() {
		dt.html('basic');
		it('Check disabled by default', function() {
			table = $('#example').DataTable();
			expect(table.settings()[0].oFeatures.aaSorting).toBe(undefined);
		});

		it('First column should be sorted- asc by default', function() {
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
		});
	});

	describe('Check can be enabled', function() {
		dt.html('basic');
		it('Single Column Sort - Asc', function() {
			$('#example').dataTable({
				order: [1, 'asc']
			});
			expect($('#example tbody tr:eq(0) td:eq(1)').html()).toBe('Accountant');
		});

		it('Single column sort - Desc', function() {
			$('#example').dataTable({
				order: [1, 'desc'],
				destroy: true
			});
			expect($('#example tbody tr:eq(0) td:eq(1)').html()).toBe('Technical Author');
		});
		it('Two Column Sort- Both Asc', function() {
			$('#example').dataTable({
				order: [[0, 'asc'], [1, 'asc']],
				destroy: true
			});
			expect($('#example tbody tr:eq(0) td:eq(1)').html()).toBe('Accountant');
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
		});
		it('Two Column Sort- Both Desc', function() {
			$('#example').dataTable({
				order: [[0, 'desc'], [1, 'desc']],
				destroy: true
			});
			expect($('#example tbody tr:eq(0) td:eq(1)').html()).toBe('Software Engineer');
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Zorita Serrano');
		});
		it('Two Column Sort- One Desc, One Asc', function() {
			$('#example').dataTable({
				order: [[2, 'asc'], [1, 'desc']],
				destroy: true
			});
			expect($('#example tbody tr:eq(0) td:eq(1)').html()).toBe('System Architect');
			expect($('#example tbody tr:eq(0) td:eq(2)').html()).toBe('Edinburgh');
		});
	});

	describe('Integration style tests', function() {
		dt.html('basic');
		it('Server-side processing', function(done) {
			let table = $('#example').DataTable({
				order: [[3, 'asc']],
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				ajax: '/base/test/data/data.txt',
				initComplete: function(setting, json) {
					expect($('#example tbody tr:eq(0) td:eq(3)').html()).toBe('19');
					done();
				}
			});
		});

		dt.html('two_tables');
		it('Can set just one on multiple tables', function() {
			$('#example_one').DataTable();
			$('#example_two').DataTable({
				order: [[1, 'desc']],
			});
			expect($('#example_one tbody tr:eq(0) td:eq(3)').html()).toBe('33');
			expect($('#example_two tbody tr:eq(0) td:eq(1)').html()).toBe('534');
		});		

		dt.html('two_tables');
		it('Multiple tables can be set differently', function() {
			$('#example_one').DataTable({
				order: [[3, 'asc']],
			});
			$('#example_two').DataTable({
				order: [[1, 'desc']],
			});
			expect($('#example_one tbody tr:eq(0) td:eq(3)').html()).toBe('19');
			expect($('#example_two tbody tr:eq(0) td:eq(1)').html()).toBe('534');
		});
	});

	describe('Functional tests - index object', function() {
		dt.html('basic');

		it('Single', function() {
			$('#example').DataTable({
				order: {idx: 1, dir: 'asc'}
			});

			expect($('#example tbody tr:first-child td:first-child').text()).toBe('Garrett Winters');
		});

		dt.html('basic');

		it('Single - desc', function() {
			$('#example').DataTable({
				order: {idx: 5, dir: 'desc'}
			});

			expect($('#example tbody tr:first-child td:first-child').text()).toBe('Angelica Ramos');
		});

		dt.html('basic');

		it('Multi', function() {
			$('#example').DataTable({
				order: [
					{ idx: 3, dir: 'asc'},
					{ idx: 2, dir: 'asc'},
				]
			});

			expect($('#example tbody tr:nth-child(3) td:first-child').text()).toBe('Lael Greer');
		});

		dt.html('basic');

		it('Multi reverse', function() {
			$('#example').DataTable({
				order: [
					{ idx: 3, dir: 'asc'},
					{ idx: 2, dir: 'desc'},
				]
			});

			expect($('#example tbody tr:nth-child(3) td:first-child').text()).toBe('Caesar Vance');
		});
	});

	describe('Functional tests - name object', function() {
		dt.html('basic');

		it('Single', function() {
			$('#example').DataTable({
				columns: [
					{ name: 'name' },
					{ name: 'position' },
					{ name: 'office' },
					{ name: 'age' },
					{ name: 'start' },
					{ name: 'salary' }
				],
				order: {name: 'position', dir: 'asc'}
			});

			expect($('#example tbody tr:first-child td:first-child').text()).toBe('Garrett Winters');
		});

		dt.html('basic');

		it('Single - desc', function() {
			$('#example').DataTable({
				columns: [
					{ name: 'name' },
					{ name: 'position' },
					{ name: 'office' },
					{ name: 'age' },
					{ name: 'start' },
					{ name: 'salary' }
				],
				order: {name: 'salary', dir: 'desc'}
			});

			expect($('#example tbody tr:first-child td:first-child').text()).toBe('Angelica Ramos');
		});

		dt.html('basic');

		it('Multi', function() {
			$('#example').DataTable({
				columns: [
					{ name: 'name' },
					{ name: 'position' },
					{ name: 'office' },
					{ name: 'age' },
					{ name: 'start' },
					{ name: 'salary' }
				],
				order: [
					{ name: 'age', dir: 'asc'},
					{ name: 'office', dir: 'asc'},
				]
			});

			expect($('#example tbody tr:nth-child(3) td:first-child').text()).toBe('Lael Greer');
		});

		dt.html('basic');

		it('Multi reverse', function() {
			$('#example').DataTable({
				columns: [
					{ name: 'name' },
					{ name: 'position' },
					{ name: 'office' },
					{ name: 'age' },
					{ name: 'start' },
					{ name: 'salary' }
				],
				order: [
					{ name: 'age', dir: 'asc'},
					{ name: 'office', dir: 'desc'},
				]
			});

			expect($('#example tbody tr:nth-child(3) td:first-child').text()).toBe('Caesar Vance');
		});
	});

	describe('Wide table', function() {
		dt.html('basic_wide');

		it('Inits okay', function() {
			$('#example').DataTable({
				order: [10, 'asc']
			});

			expect(true).toBe(true);
		});

		it('No sort icon on first column header', function() {
			expect($('#example thead th:first-child').hasClass('dt-ordering-asc')).toBe(false);
		});

		it('But last header has one', function() {
			expect($('#example thead th:last-child').hasClass('dt-ordering-asc')).toBe(true);
		});
	});
});
