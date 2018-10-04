describe('columns.name option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Names are stored in the columns object', function() {
			let table = $('#example').DataTable({
				columns: [null, { name: 'unit test' }, null, null, null, null]
			});
			expect($('#example').DataTable.settings[0].aoColumns[1].name).toBe('unit test');
		});

		dt.html('basic');
		it('set names using columns.name and return data of position column', function() {
			let table = $('#example').DataTable({
				columns: [
					{ name: 'name' },
					{ name: 'position' },
					{ name: 'office' },
					{ name: 'age' },
					{ name: 'startdate' },
					{ name: 'salary' }
				]
			});
			expect(table.column('position:name').data()[0]).toBe('Accountant');
		});

		dt.html('basic');
		it('can have many columns with the same name', function() {
			let table = $('#example').DataTable({
				columns: [
					{ name: 'personal' },
					{ name: 'position' },
					{ name: 'office' },
					{ name: 'personal' },
					{ name: 'startdate' },
					{ name: 'salary' }
				]
			});
			let personalColumns = table.columns('personal:name')[0];
			expect(personalColumns.length).toBe(2);
			expect(personalColumns[0]).toBe(0);
			expect(personalColumns[1]).toBe(3);
		});

		dt.html('basic');
		it('can set with columnDefs', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ name: 'personal', targets: [0, 3] }]
			});
			let personalColumns = table.columns('personal:name')[0];
			expect(personalColumns.length).toBe(2);
			expect(personalColumns[0]).toBe(0);
			expect(personalColumns[1]).toBe(3);
		});
	});
});
