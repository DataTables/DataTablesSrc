describe('columns.defaultContent option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default is null', function() {
			$('#example').dataTable();
			expect($.fn.DataTable.defaults.column.sDefaultContent).toBe(null);
		});

		dt.html('basic');
		it('Use default content to add static value to column- using columns', function() {
			$('#example').dataTable({
				columns: [
					{
						data: null,
						defaultContent: '<button>Not set</button>'
					},
					null,
					null,
					null,
					null,
					null
				]
			});
			expect($('#example tbody tr:eq(0) td:eq(0) button').text()).toBe('Not set');
		});

		dt.html('basic');
		it('use defaultContent to add button to column- using columnDefs', function() {
			$('#example').dataTable({
				columnDefs: [
					{
						data: null,
						targets: 0,
						defaultContent: '<button>Not set</button>'
					}
				]
			});
			expect($('#example tbody tr:eq(0) td:eq(0) button').text()).toBe('Not set');
		});

		function makeData(wantNull) {
			var a = [];
			var name;
			for (var i = 0; i < 10; i++) {
				name = i % 2 ? (wantNull ? null : undefined) : i;
				e = { name: name, position: i, office: i, age: i, start_date: i, salary: i };
				a.push(e);
			}
			return a;
		}

		dt.html('basic');
		it('ensure nulls are replaced by the defaultContent', function() {
			var table = $('#example').DataTable({
				ajax: function(data, callback, settings) {
					var out = makeData(true);
					callback({
						draw: data.draw,
						data: out,
						recordsTotal: 10,
						recordsFiltered: 10
					});
				},
				columns: [
					{ data: 'name', title: 'Name', defaultContent: 'Fred' },
					{ data: 'position', title: 'Position' },
					{ data: 'office', title: 'Office' },
					{ data: 'age', title: 'Age' },
					{ data: 'start_date', visible: false },
					{ data: 'salary', visible: false }
				]
			});

			expect(
				table
					.cells(null, 0)
					.render('display')
					.unique()
					.count()
			).toBe(6);
		});

		dt.html('basic');
		it('ensure undefined are replaced by the defaultContent', function() {
			var table = $('#example').DataTable({
				ajax: function(data, callback, settings) {
					var out = makeData(false);
					callback({
						draw: data.draw,
						data: out,
						recordsTotal: 10,
						recordsFiltered: 10
					});
				},
				columns: [
					{ data: 'name', title: 'Name', defaultContent: 'Fred' },
					{ data: 'position', title: 'Position' },
					{ data: 'office', title: 'Office' },
					{ data: 'age', title: 'Age' },
					{ data: 'start_date', visible: false },
					{ data: 'salary', visible: false }
				]
			});

			expect(
				table
					.cells(null, 0)
					.render('display')
					.unique()
					.count()
			).toBe(6);
		});
	});
});
