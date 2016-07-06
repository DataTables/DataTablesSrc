describe( "columns.visible option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("All columns are visible by default", function () {
			$('#example').dataTable();
			expect($('#example tbody tr:eq(0) td').length == 6).toBe(true);
		});
		dt.html( 'basic' );
		it("Can hide one column and it removes td column from DOM", function () {
			$('#example').dataTable( {
				"columns": [
					null,
					{ "visible": false },
					null,
					null,
					null,
					null
				]
			});
			expect($('#example tbody tr:eq(0) td').length == 5).toBe(true);
		});
		it("Can hide one column and it removes thead th column from DOM", function () {
			expect($('#example thead tr:eq(0) th').length == 5).toBe(true);
		});
		it("Can hide one column and it removes tfoot th column from DOM", function () {
			expect($('#example tfoot tr:eq(0) th').length == 5).toBe(true);
		});
		it("The correct tbody column has been hidden", function () {
			var rowArray = $('#example tbody tr:eq(0) td');
			expect(rowArray[0].innerHTML == "Airi Satou" && rowArray[1].innerHTML == "Tokyo" && rowArray[2].innerHTML == "33" && rowArray[3].innerHTML == "2008/11/28" && rowArray[4].innerHTML == "$162,700").toBe(true);
		});
		dt.html( 'basic' );
		it("Can hide multiple columns and it removes td column from DOM", function () {
			$('#example').dataTable( {
				"columns": [
					null,
					{ "visible": false },
					{ "visible": false },
					{ "visible": false },
					null,
					null
				]
			});
			expect($('#example tbody tr:eq(0) td').length == 3).toBe(true);
		});
		it("Multiple hide- removes thead th column from DOM", function () {
			expect($('#example thead tr:eq(0) th').length == 3).toBe(true);
		});
		it("Multiple hide- removes tfoot th column from DOM", function () {
			expect($('#example tfoot tr:eq(0) th').length == 3).toBe(true);
		});
		it("Multiple hide- the correct thead columns have been hidden", function () {
			var headArray = $('#example thead tr:eq(0) th');
			expect(headArray[0].innerHTML == "Name" && headArray[1].innerHTML == "Start date" && headArray[2].innerHTML == "Salary").toBe(true);
		});
		it("Multiple hide- the correct tobdy columns have been hidden", function () {
			var headArray = $('#example tbody tr:eq(0) td');
			expect(headArray[0].innerHTML == "Airi Satou" && headArray[1].innerHTML == "2008/11/28" && headArray[2].innerHTML == "$162,700").toBe(true);
		});
	});

});
