describe('rowId option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Object-based data', function() {
		dt.html('empty');
		it('No ID if no rowId specified', function(done) {
			var table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				initComplete: function(settings, json) {
					expect(table.row(0).id()).toBe('undefined');
					expect($('#example tbody tr:eq(2)')[0].id).toBe('');
					done();
				}
			});
		});

		dt.html('empty');
		it('No ID if no rowId specified', function(done) {
			var table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				rowId: 'name',
				initComplete: function(settings, json) {
					expect(table.row(0).id()).toBe('Tiger Nixon');
					expect($('#example tbody tr:eq(2)')[0].id).toBe('Ashton Cox');
					done();
				}
			});
		});
	});

	describe('Non Object-based data', function() {
		dt.html('basic');
		it('When not set, no ID', function() {
			table = $('#example').DataTable();
			
			expect(table.row(0).id()).toBe('undefined');
			expect($('#example tbody tr:eq(2)')[0].id).toBe('');
		});		

		dt.html('basic');
		it('Adding when table initialised', function() {
			table = $('#example').DataTable({
				rowId: 0,
			});

			expect(table.row(0).id()).toBe('Tiger Nixon');
			expect($('#example tbody tr:eq(2)')[0].id).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Adding a row', function() {
			table = $('#example').DataTable({
				rowId: 0,
			});

			table.row.add(['Bruce Wayne', 'Superhero', 'Gotham', '34', '2018/04/04', '$1,000,000']).draw();

			expect(table.row(57).id()).toBe('Bruce Wayne');
			expect($('#example tbody tr:eq(6)')[0].id).toBe('Bruce Wayne');
		});
		
		dt.html('basic');
		it('Id removed when row deleted', function() {
			table = $('#example').DataTable({
				rowId: 3,
			});

			table.row(2).remove().draw();

			expect($('#example tbody tr:eq(2)')[0].id).toBe('41');
			expect($('#66').length).toBe(0);
		});	
	});
});
