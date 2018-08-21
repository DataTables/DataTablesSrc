describe('rows - row().child()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function setupChildRows(hide) {
		$('#example tbody').on('click', 'td', function() {
			var tr = $(this).closest('tr');
			var row = $('#example')
				.DataTable()
				.row(tr);

			if (row.child.isShown()) {
				// This row is already open - close it
				if (hide) {
					row.child.hide();
				} else {
					row.child.remove();
				}
				tr.removeClass('shown');
			} else {
				// Open this row
				row.child('TEST ' + row.data()[0]).show();
				tr.addClass('shown');
			}
		});
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Ensure its a function', function() {
			expect(
				typeof $('#example')
					.DataTable()
					.row().child
			).toBe('function');
		});
	});

	describe('Getter behaviour', function() {
		dt.html('basic');
		let table;
		it('Undefined if no child', function() {
			table = $('#example').DataTable({
				initComplete: setupChildRows(true)
			});
			expect(table.row(2).child()).toBe(undefined);
		});
		it('Returns jQuery object if child row', function() {
			$('#example tbody tr:eq(2) td:eq(0)').click();
			expect(table.row(2).child() instanceof $).toBe(true);
		});
		it('Returns jQuery object for expected row', function() {
			expect(
				table
					.row(2)
					.child()
					.text()
			).toBe('TEST Ashton Cox');
		});
		it('Returns jQuery object for expected row if hidden', function() {
			table.row(2).child.hide();
			expect(
				table
					.row(2)
					.child()
					.text()
			).toBe('TEST Ashton Cox');
		});
		it('Returns undefined if child removed', function() {
			table.row(2).child.remove();
			expect(table.row(2).child()).toBe(undefined);
		});
	});

	describe('showRemove behaviour - show', function() {
		dt.html('basic');
		let table;
		it('Returns API instance', function() {
			table = $('#example').DataTable({
				initComplete: setupChildRows(true)
			});
			expect(table.row(2).child(true) instanceof $.fn.dataTable.Api).toBe(true);
		});
		it('When no created child', function() {
			table.row(2).child(true);
			expect($('#example tbody tr').length).toBe(10);
		});
		it('When created child and already open', function() {
			$('#example tbody tr:eq(2) td:eq(0)').click();
			table.row(2).child(true);
			expect($('#example tbody tr').length).toBe(11);
		});
		it('When created child hidden', function() {
			table.row(2).child.hide();
			table.row(2).child(true);
			expect($('#example tbody tr').length).toBe(11);
		});
	});

	describe('showRemove behaviour - remove', function() {
		dt.html('basic');
		let table;
		it('Returns API instance', function() {
			table = $('#example').DataTable({
				initComplete: setupChildRows(true)
			});
			expect(table.row(2).child(false) instanceof $.fn.dataTable.Api).toBe(true);
		});
		it('When no created child', function() {
			table.row(2).child(false);
			expect($('#example tbody tr').length).toBe(10);
		});
		it('When created child and already open', function() {
			$('#example tbody tr:eq(2) td:eq(0)').click();
			table.row(2).child(false);
			expect($('#example tbody tr').length).toBe(10);
		});
		it('When created child hidden', function() {
			$('#example tbody tr:eq(2) td:eq(0)').click();
			table.row(2).child.hide();
			table.row(2).child(false);
			expect($('#example tbody tr').length).toBe(10);
			expect(table.row(2).child()).toBe(undefined);
		});
	});

	describe('Set child behaviour', function() {
		let table;
		dt.html('basic');
		it('Returns API instance', function() {
			table = $('#example').DataTable();
			expect(table.row(2).child('Fred') instanceof $.fn.dataTable.Api).toBe(true);
		});

		dt.html('basic');
		it('Data is string', function() {
			table = $('#example').DataTable();
			table
				.row(2)
				.child('Fred')
				.child(true);
			expect(
				table
					.row(2)
					.child()
					.text()
			).toBe('Fred');
			expect($('#example tbody tr:eq(3) td:eq(0)').text()).toBe('Fred');
		});

		dt.html('basic');
		it('Data is node', function() {
			table = $('#example').DataTable();
			table
				.row(2)
				.child('<p>Fred</p>')
				.child(true);
			expect(
				table
					.row(2)
					.child()
					.text()
			).toBe('Fred');
			expect($('#example tbody tr:eq(3) p').text()).toBe('Fred');
		});

		dt.html('basic');
		it('Data is jQuery', function() {
			table = $('#example').DataTable();
			table
				.row(2)
				.child($('<p>Fred</p>'))
				.child(true);
			expect(
				table
					.row(2)
					.child()
					.text()
			).toBe('Fred');
			expect($('#example tbody tr:eq(3) p').text()).toBe('Fred');
		});

		dt.html('basic');
		it('Data is array', function() {
			table = $('#example').DataTable();
			table
				.row(2)
				.child(['First', 'Second', 'Third'])
				.child(true);

			let child = table.row(2).child();
			expect(child.length).toBe(3);
			expect($(child[0]).text()).toBe('First');
			expect($(child[1]).text()).toBe('Second');
			expect($(child[2]).text()).toBe('Third');
			expect($('#example tbody tr:eq(3) td:eq(0)').text()).toBe('First');
			expect($('#example tbody tr:eq(4) td:eq(0)').text()).toBe('Second');
			expect($('#example tbody tr:eq(5) td:eq(0)').text()).toBe('Third');
		});

		dt.html('basic');
		it('Data replaces existing child row if not shown', function() {
			table = $('#example').DataTable();
			table.row(2).child('Fred');
			table.row(2).child('Stan');
			expect(
				table
					.row(2)
					.child()
					.text()
			).toBe('Stan');
			table.row(2).child(true);
			expect($('#example tbody tr:eq(3) td:eq(0)').text()).toBe('Stan');
		});

		dt.html('basic');
		it('Data replaces existing child row if shown', function() {
			table = $('#example').DataTable();

			table
				.row(2)
				.child('Fred')
				.child(true);
			table.row(2).child('Stan');
			expect($('#example tbody tr:eq(3) td:eq(0)').text()).toBe('Stan');
		});

		dt.html('basic');
		it('Data can be different on different rows', function() {
			table = $('#example').DataTable();
			table
				.row(2)
				.child('Fred')
				.child(true);
			table
				.row(3)
				.child('Stan')
				.child(true);
			expect($('#example tbody tr:eq(3) td:eq(0)').text()).toBe('Fred');
			expect($('#example tbody tr:eq(11) td:eq(0)').text()).toBe('Stan');
		});

		dt.html('basic');
		it('Can set a class', function() {
			table = $('#example').DataTable();
			table
				.row(2)
				.child('Fred', 'Stan')
				.child(true);
			expect($('#example tbody tr:eq(3)').hasClass('Stan')).toBe(true);
			expect($('#example tbody tr:eq(3) td:eq(0)').hasClass('Stan')).toBe(true);
		});
	});
});
