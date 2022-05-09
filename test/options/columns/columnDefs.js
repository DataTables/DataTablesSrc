describe('columnDefs option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default should be null', function() {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.aoColumnDefs).toBe(null);
		});

		dt.html('basic');
		it(" '_all' targets all columns. ", function() {
			$('#example').dataTable({
				columnDefs: [{ targets: '_all', visible: false }]
			});
			expect($('#example thead').find('th').length).toBe(0);
		});

		dt.html('basic');
		it('_all with other targets first', function() {
			$('#example').dataTable({
				columnDefs: [{ targets: [0], visible: true }, { targets: '_all', visible: false }]
			});
			expect($('#example thead').find('th').length).toBe(1);
		});

		dt.html('basic');
		it('_all with other targets after', function() {
			$('#example').dataTable({
				columnDefs: [{ targets: '_all', visible: false }, { targets: [0], visible: true }]
			});
			expect($('#example thead').find('th').length).toBe(0);
		});

		dt.html('basic');
		it('Select 1 column not in an array', function() {
			$('#example').dataTable({
				columnDefs: [{ targets: 0, visible: false }]
			});
			expect($('#example thead').find('th').length).toBe(5);
			expect($('#example thead th:eq(0)').text()).toBe('Position');
		});

		dt.html('basic');
		it('Select 1 column using array', function() {
			$('#example').dataTable({
				columnDefs: [{ targets: [0], visible: false }]
			});
			expect($('#example thead').find('th').length).toBe(5);
			expect($('#example thead th:eq(0)').text()).toBe('Position');
		});

		dt.html('basic');
		it('Select 2 columns using array', function() {
			$('#example').dataTable({
				columnDefs: [{ targets: [0, 1], visible: false }]
			});
			expect($('#example thead').find('th').length).toBe(4);
			expect($('#example thead th:eq(0)').text()).toBe('Office');
		});

		dt.html('basic');
		it('Use negative int to select last column', function() {
			$('#example').dataTable({
				columnDefs: [{ targets: [-1], visible: false }]
			});
			expect($('#example thead').find('th').length).toBe(5);
			expect($('#example thead th:eq(-1)').text()).toBe('Start date');
		});

		dt.html('basic');
		it('Use negative int to select multiple columns', function() {
			$('#example').dataTable({
				columnDefs: [{ targets: [-1, -2], visible: false }]
			});
			expect($('#example thead').find('th').length).toBe(4);
			expect($('#example thead th:eq(-1)').text()).toBe('Age');
		});

		dt.html('basic');
		it('Mixed negative and positive ints to select columns - remove first and last columns', function() {
			$('#example').dataTable({
				columnDefs: [{ targets: [0, -1], visible: false }]
			});
			expect($('#example thead').find('th').length).toBe(4);
			expect($('#example thead th:eq(0)').text()).toBe('Position');
			expect($('#example thead th:eq(-1)').text()).toBe('Start date');
		});

		dt.html('basic');
		it('Specify class', function() {
			$('#example thead th:eq(0)').addClass('test1');
			$('#example').dataTable({
				columnDefs: [{ targets: 'test1', visible: false }]
			});
			expect($('#example thead').find('th').length).toBe(5);
			expect($('#example thead th:eq(0)').text()).toBe('Position');
		});

		dt.html('basic');
		it('Specify multiple classes', function() {
			$('#example thead th:eq(0)').addClass('test1');
			$('#example thead th:eq(5)').addClass('test2');
			$('#example').dataTable({
				columnDefs: [{ targets: ['test1', 'test2'], visible: false }]
			});
			expect($('#example thead').find('th').length).toBe(4);
			expect($('#example thead th:eq(0)').text()).toBe('Position');
			expect($('#example thead th:eq(-1)').text()).toBe('Start date');
		});

		dt.html('basic');
		it('Mix class and integer', function() {
			$('#example thead th:eq(0)').addClass('test1');
			$('#example').dataTable({
				columnDefs: [{ targets: [-1, 'test1'], visible: false }]
			});
			expect($('#example thead').find('th').length).toBe(4);
			expect($('#example thead th:eq(0)').text()).toBe('Position');
			expect($('#example thead th:eq(-1)').text()).toBe('Start date');
		});
	});

	describe('Other tests', function() {
		dt.html('basic');
		it('Same column referenced twice', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ targets: 0, title: 'fred' }, { targets: 0, data: null, defaultContent: 'stan' }]
			});
			expect($('#example thead th:eq(0)').text()).toBe('fred');
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('stan');
		});

		dt.html('basic');
		it('Same column referenced twice with conflict', function() {
			let table = $('#example').DataTable({
				columnDefs: [
					{ targets: 0, title: 'fred' },
					{ targets: 0, title: 'stan' },
					{ targets: 0, data: null, defaultContent: 'stan' }
				]
			});
			expect($('#example thead th:eq(0)').text()).toBe('fred');
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('stan');
		});

		dt.html('basic');
		it('Same column referenced twice with conflict with other columns', function() {
			let table = $('#example').DataTable({
				columnDefs: [
					{ targets: 0, title: 'fred' },
					{ targets: [0, 1], title: 'stan' },
					{ targets: 0, data: null, defaultContent: 'stan' }
				]
			});
			expect($('#example thead th:eq(0)').text()).toBe('fred');
			expect($('#example thead th:eq(1)').text()).toBe('stan');
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('stan');
		});

		dt.html('basic');
		it('Single column with "target"', function() {
			let table = $('#example').DataTable({
				columnDefs: [
					{ target: 0, title: 'fred' },
				]
			});
			expect($('#example thead th:eq(0)').text()).toBe('fred');
		});
	});
});
