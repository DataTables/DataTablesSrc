describe('columns.visible option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('All columns are visible by default', function() {
			$('#example').dataTable();
			expect($('#example tbody tr:eq(0) td').length).toBe(6);
		});

		dt.html('basic');
		it('Can hide one column and it removes td column from DOM', function() {
			$('#example').dataTable({
				columns: [null, { visible: false }, null, null, null, null]
			});
			expect($('#example tbody tr:eq(0) td').length).toBe(5);
		});
		it('Can hide one column and it removes thead th column from DOM', function() {
			expect($('#example thead tr:eq(0) th').length).toBe(5);
		});
		it('Can hide one column and it removes tfoot th column from DOM', function() {
			expect($('#example tfoot tr:eq(0) th').length).toBe(5);
		});
		it('The correct tbody column has been hidden', function() {
			let rowArray = $('#example tbody tr:eq(0) td');
			expect(rowArray[0].innerHTML).toBe('Airi Satou');
			expect(rowArray[1].innerHTML).toBe('Tokyo');
			expect(rowArray[2].innerHTML).toBe('33');
			expect(rowArray[3].innerHTML).toBe('2008/11/28');
			expect(rowArray[4].innerHTML).toBe('$162,700');
		});

		dt.html('basic');
		it('Can hide multiple columns and it removes td column from DOM', function() {
			$('#example').dataTable({
				columns: [null, { visible: false }, { visible: false }, { visible: false }, null, null]
			});
			expect($('#example tbody tr:eq(0) td').length).toBe(3);
		});
		it('Multiple hide- removes thead th column from DOM', function() {
			expect($('#example thead tr:eq(0) th').length).toBe(3);
		});
		it('Multiple hide- removes tfoot th column from DOM', function() {
			expect($('#example tfoot tr:eq(0) th').length).toBe(3);
		});
		it('Multiple hide- the correct thead columns have been hidden', function() {
			let headArray = $('#example thead tr:eq(0) th');
			expect(headArray[0].innerHTML).toBe('Name');
			expect(headArray[1].innerHTML).toBe('Start date');
			expect(headArray[2].innerHTML).toBe('Salary');
		});
		it('Multiple hide- the correct tbody columns have been hidden', function() {
			let bodyArray = $('#example tbody tr:eq(0) td');
			expect(bodyArray[0].innerHTML).toBe('Airi Satou');
			expect(bodyArray[1].innerHTML).toBe('2008/11/28');
			expect(bodyArray[2].innerHTML).toBe('$162,700');
		});

		dt.html('basic');
		it('Can hide multiple columns with columnDefs and it removes td column from DOM', function() {
			$('#example').dataTable({
				columnDefs: [{ visible: false, targets: [1, 2, 3] }]
			});
			expect($('#example tbody tr:eq(0) td').length).toBe(3);
		});
		it('Multiple hide- removes thead th column from DOM', function() {
			expect($('#example thead tr:eq(0) th').length).toBe(3);
		});
		it('Multiple hide- removes tfoot th column from DOM', function() {
			expect($('#example tfoot tr:eq(0) th').length).toBe(3);
		});
		it('Multiple hide- the correct thead columns have been hidden', function() {
			let headArray = $('#example thead tr:eq(0) th');
			expect(headArray[0].innerHTML).toBe('Name');
			expect(headArray[1].innerHTML).toBe('Start date');
			expect(headArray[2].innerHTML).toBe('Salary');
		});
		it('Multiple hide- the correct tbody columns have been hidden', function() {
			let bodyArray = $('#example tbody tr:eq(0) td');
			expect(bodyArray[0].innerHTML).toBe('Airi Satou');
			expect(bodyArray[1].innerHTML).toBe('2008/11/28');
			expect(bodyArray[2].innerHTML).toBe('$162,700');
		});
	});
});
