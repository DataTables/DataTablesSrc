describe('rows - rows.add()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().rows.add).toBe('function');
		});

		it('Returns API instance', function() {
			let table = $('#example').DataTable();
			expect(
				table.rows.add([['Fred Johnson', 'Accountant', 'Edinburgh', 24, '2009/11/28', '$65,000']]) instanceof
					$.fn.dataTable.Api
			).toBe(true);
		});
	});

	function areNamesThere(names) {
		let table = $('#example').DataTable();
		let found = true;

		names.forEach(element => {
			table.search(element).draw();

			if (
				$('div.dataTables_info').text() !=
					'Showing 1 to 1 of 1 entries (filtered from ' + (57 + names.length) + ' total entries)' ||
				$('#example tbody tr:eq(0) td:eq(0)').text() != element
			) {
				found = false;
			}
		});

		return found;
	}

	describe('Simple tests', function() {
		dt.html('basic');
		it('No change until the draw', function() {
			let table = $('#example').DataTable();
			table.rows.add([aEva, aFred]);
			expect(table.rows().count()).toBe(59);
			expect($('div.dataTables_info').text()).toBe('Showing 1 to 10 of 57 entries');
		});
	});

	let aEva = ['Eva', 'Accountant', 'Edinburgh', 24, '2009/11/28', '$65,000'];
	let aFred = ['Fred', 'Accountant', 'Edinburgh', 24, '2009/11/28', '$65,000'];
	let aTyler = ['Tyler', 'Accountant', 'Edinburgh', 24, '2009/11/28', '$65,000'];

	describe('Add rows as arrays', function() {
		dt.html('basic');
		it('Single row', function() {
			let table = $('#example').DataTable();
			table.rows.add([aEva]);
			expect(areNamesThere(['Eva'])).toBe(true);
		});

		dt.html('basic');
		it('Two rows', function() {
			let table = $('#example').DataTable();
			table.rows.add([aEva, aFred]);
			expect(areNamesThere(['Eva', 'Fred'])).toBe(true);
		});

		dt.html('basic');
		it('Add single row, then two rows', function() {
			let table = $('#example').DataTable();
			table.row.add(aTyler);
			table.rows.add([aEva, aFred]);
			expect(areNamesThere(['Eva', 'Fred', 'Tyler'])).toBe(true);
		});
	});

	function Person(name) {
		this.name = name;
		this.position = 'Accountant';
		this.office = 'Edinburgh';
		this.age = '24';
		this.start_date = '2011/04/25';
		this.salary = '$3,120';
	}

	let oEva = new Person('Eva');
	let oFred = new Person('Fred');
	let oTyler = new Person('Tyler');

	describe('Add rows as objects', function() {
		dt.html('basic');
		it('Single row', function() {
			let table = $('#example').DataTable({
				columns: dt.getTestColumns()
			});
			table.rows.add([oEva]);
			expect(areNamesThere(['Eva'])).toBe(true);
		});

		dt.html('basic');
		it('Two rows', function() {
			let table = $('#example').DataTable({
				columns: dt.getTestColumns()
			});
			table.rows.add([oEva, oFred]);
			expect(areNamesThere(['Eva', 'Fred'])).toBe(true);
		});

		dt.html('basic');
		it('Add single row, then two rows', function() {
			let table = $('#example').DataTable({
				columns: dt.getTestColumns()
			});
			table.row.add(oTyler);
			table.rows.add([oEva, oFred]);
			expect(areNamesThere(['Eva', 'Fred', 'Tyler'])).toBe(true);
		});
	});

	function cloneNode(name) {
		let table = $('#example').DataTable();
		let clone = table
			.row(1)
			.node()
			.cloneNode(true);
		clone.cells[0].innerText = name;
		return clone;
	}

	describe('Add rows as nodes', function() {
		dt.html('basic');
		it('Single row', function() {
			let table = $('#example').DataTable();
			table.rows.add([cloneNode('Eva')]);
			expect(areNamesThere(['Eva'])).toBe(true);
		});

		dt.html('basic');
		it('Two rows', function() {
			let table = $('#example').DataTable();
			table.rows.add([cloneNode('Eva'), cloneNode('Fred')]);
			expect(areNamesThere(['Eva', 'Fred'])).toBe(true);
		});

		dt.html('basic');
		it('Add single row, then two rows', function() {
			let table = $('#example').DataTable();
			table.row.add(cloneNode('Tyler'));
			table.rows.add([cloneNode('Eva'), cloneNode('Fred')]);
			expect(areNamesThere(['Eva', 'Fred', 'Tyler'])).toBe(true);
		});
	});
});
