
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

		dt.html('basic');
		it('Selector - class name', function() {
			$('#example thead th').eq(0).addClass('test');
			$('#example').DataTable({
				columnDefs: [
					{ target: '.test', orderable: false },
				]
			});

			var cells = $('#example thead th');
			expect(cells.eq(0).hasClass('dt-orderable-asc')).toBe(false);
			expect(cells.eq(1).hasClass('dt-orderable-asc')).toBe(true);
			expect(cells.eq(2).hasClass('dt-orderable-asc')).toBe(true);
			expect(cells.eq(3).hasClass('dt-orderable-asc')).toBe(true);
			expect(cells.eq(4).hasClass('dt-orderable-asc')).toBe(true);
			expect(cells.eq(5).hasClass('dt-orderable-asc')).toBe(true);
		});

		dt.html('basic');
		it('Selector - gt', function() {
			$('#example').DataTable({
				columnDefs: [
					{ target: 'th:gt(2)', orderable: false },
				]
			});

			var cells = $('#example thead th');
			expect(cells.eq(0).hasClass('dt-orderable-asc')).toBe(true);
			expect(cells.eq(1).hasClass('dt-orderable-asc')).toBe(true);
			expect(cells.eq(2).hasClass('dt-orderable-asc')).toBe(true);
			expect(cells.eq(3).hasClass('dt-orderable-asc')).toBe(false);
			expect(cells.eq(4).hasClass('dt-orderable-asc')).toBe(false);
			expect(cells.eq(5).hasClass('dt-orderable-asc')).toBe(false);
		});

		dt.html('basic');
		it('Selector - multiple classes', function() {
			$('#example thead th').eq(0).addClass('test1');
			$('#example thead th').eq(2).addClass('test2');
			$('#example').DataTable({
				columnDefs: [
					{ target: '.test1,.test2', orderable: false },
				]
			});

			var cells = $('#example thead th');
			expect(cells.eq(0).hasClass('dt-orderable-asc')).toBe(false);
			expect(cells.eq(1).hasClass('dt-orderable-asc')).toBe(true);
			expect(cells.eq(2).hasClass('dt-orderable-asc')).toBe(false);
			expect(cells.eq(3).hasClass('dt-orderable-asc')).toBe(true);
			expect(cells.eq(4).hasClass('dt-orderable-asc')).toBe(true);
			expect(cells.eq(5).hasClass('dt-orderable-asc')).toBe(true);
		});

		dt.html('basic');
		it('Name selector', function() {
			let table = $('#example').DataTable({
				columns: [
					null,
					{ name: 'action' },
					null,
					null,
					null,
					null
				],
				columnDefs: [
					{ target: 'action:name' },
				]
			});

			let data = table.column('action:name', {order: 'applied'}).data();

			expect(data.length).toBe(57);
			expect(data[0]).toBe('Accountant');
		});
	});

	describe('Empty table', function() {
		var counter = 0;

		dt.html('empty_no_header');
		
		it('Init the DataTable', function() {
			$('#example').DataTable({
				columns: [
					{
						title: 'Test'
					}
				],
				columnDefs: [
					{
						targets: '_all',
						createdCell: function (td, cellData) {
							counter++;
							$(td).addClass('test-' + cellData);
						},
						className: 'test-all'
					}
				],
				data: [ [0], [1], [2] ]
			});

			expect($('tbody tr').length).toBe(3);
		});

		it('createdCell ran for each cell', function() {
			expect(counter).toBe(3);
		});

		it('And applied its operation to the cell', function() {
			expect($('tbody td').eq(0).hasClass('test-0')).toBe(true);
			expect($('tbody td').eq(1).hasClass('test-1')).toBe(true);
			expect($('tbody td').eq(2).hasClass('test-2')).toBe(true);
		});

		it('Applied static class', function() {
			expect($('tbody td').eq(0).hasClass('test-all')).toBe(true);
			expect($('tbody td').eq(1).hasClass('test-all')).toBe(true);
			expect($('tbody td').eq(2).hasClass('test-all')).toBe(true);
		});
	});
});
