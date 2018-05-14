describe('orderFixed option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('No fixed sorting by default', function() {
			var table = $('#example').DataTable();
			expect(table.settings()[0].aaSortingFixed.length).toBe(0);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Fixed sorting without object', function() {
			$('#example').dataTable({
				orderFixed: [3, 'asc']
			});
			expect($('#example tbody td:eq(0)').text()).toBe('Tatyana Fitzpatrick');
		});

		dt.html('basic');
		it('Fixed sorting with object: pre', function() {
			$('#example').dataTable({
				orderFixed: {
					pre: [3, 'asc']
				}
			});
			expect($('#example tbody td:eq(0)').text()).toBe('Tatyana Fitzpatrick');
		});

		dt.html('basic');
		it('Fixed sorting with object: post', function() {
			$('#example').dataTable({
				orderFixed: {
					post: [3, 'desc']
				}
			});
			expect($('#example tbody td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Fixed sorting with object: pre and post', function() {
			$('#example').dataTable({
				orderFixed: {
					pre: [2, 'asc'],
					post: [3, 'asc']
				}
			});
			expect($('#example tbody td:eq(0)').text()).toBe('Cedric Kelly');
		});

		dt.html('basic');
		it('Confirming order does not matter', function() {
			$('#example').dataTable({
				orderFixed: {
					post: [3, 'asc'],
					pre: [2, 'asc']
				}
			});
			expect($('#example tbody td:eq(0)').text()).toBe('Cedric Kelly');
		});

		dt.html('basic');
		it('Flipped around', function() {
			$('#example').dataTable({
				orderFixed: {
					pre: [3, 'asc'],
					post: [2, 'asc']
				}
			});
			expect($('#example tbody td:eq(0)').text()).toBe('Tatyana Fitzpatrick');
		});

		dt.html('basic');
		it('Two-dimensional sorting array', function() {
			$('#example').dataTable({
				orderFixed: {
					pre: [[2, 'asc'], [3, 'asc']]
				}
			});
			expect($('#example tbody td:eq(0)').text()).toBe('Cedric Kelly');
		});
	});

	describe('Integration style tests', function() {
		dt.html('basic');
		it('Does nothing if sorting disabled', function() {
			$('#example').dataTable({
				ordering: false,
				orderFixed: [3, 'asc']
			});
			expect($('#example tbody td:eq(0)').text()).toBe('Tiger Nixon');
		});

		dt.html('basic');
		it('Combined with default ordering', function() {
			$('#example').dataTable({
				order: [2, 'asc'],
				orderFixed: [3, 'desc']
			});
			expect($('#example tbody td:eq(0)').text()).toBe('Michael Silva');
		});

		dt.html('basic');
		it('Fixed sorting on second column (pre/asc) with user sorting on third column (asc)', function() {
			$('#example').dataTable({
				orderFixed: [2, 'asc']
			});
			$('#example thead th:eq(3)').click();
			expect($('#example tbody td:eq(0)').text()).toBe('Cedric Kelly');
		});

		dt.html('basic');
		it('Fixed sorting on first column(asc) with user sorting on second column (desc)', function() {
			$('#example').dataTable({
				orderFixed: {
					post: [2, 'asc']
				}
			});
			$('#example thead th:eq(3)').click();
			expect($('#example tbody td:eq(0)').text()).toBe('Tatyana Fitzpatrick');
		});

		dt.html('basic');
		it('Fixed sorting on first column(asc) with user sorting on second column (desc)', function() {
			$('#example').dataTable({
				columnDefs: [{
					targets: 2,
					orderable: false
				}],
				orderFixed: {
					post: [2, 'asc']
				}
			});
			expect($('#example tbody td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('two_tables');
		it('When multiple tables all OK', function() {
			$('#example_one').DataTable({
				orderFixed: [2, 'asc']
			});
			$('#example_two').DataTable({
				orderFixed: [1, 'desc']
			});
			expect($('#example_one tbody td:eq(0)').text()).toBe('Cedric Kelly');
			expect($('#example_two tbody td:eq(0)').text()).toBe('Milan');
		});

		dt.html('basic');
		it('Server-side processing', function(done) {
			let table = $('#example').DataTable({
				orderFixed: [3, 'asc'],
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
					expect($('#example tbody td:eq(0)').text()).toBe('Tatyana Fitzpatrick');
					done();
				}
			});
		});
	});
});
