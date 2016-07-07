describe( "columns.title option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Columns names are read from DOM by default", function () {
			$('#example').dataTable( {

			});

			var nNodes = $('#example thead tr:eq(0) th');
			var bReturn;
			expect(bReturn = nNodes[0].innerHTML == "Name" && nNodes[1].innerHTML == "Position" && nNodes[2].innerHTML == "Office" && nNodes[3].innerHTML == "Age" && nNodes[4].innerHTML == "Start date" && nNodes[5].innerHTML == "Salary").toBe(true);
		});
		dt.html( 'basic' );
		it("Can se a single column title- and other are read from DOM", function () {
			$('#example').dataTable( {
				"columns": [
					null,
					{ "title": "unit test" },
					null,
					null,
					null,
					null
				]
			});
			var nNodes = $('#example thead tr:eq(0) th');
			var bReturn;
			expect(bReturn = nNodes[0].innerHTML == "Name" && nNodes[1].innerHTML == "unit test" && nNodes[2].innerHTML == "Office" && nNodes[3].innerHTML == "Age" && nNodes[4].innerHTML == "Start date" && nNodes[5].innerHTML == "Salary").toBe(true);
		});
		dt.html( 'basic' );
		it("Can set multiple column titles", function () {
			$('#example').dataTable( {
				"columns": [
					null,
					{ "title": "unit test" },
					{ "title": "unit test 2" },
					null,
					null,
					null
				]
			});
			var nNodes = $('#example thead tr:eq(0) th');
			var bReturn;
			expect(bReturn = nNodes[0].innerHTML == "Name" && nNodes[1].innerHTML == "unit test" && nNodes[2].innerHTML == "unit test 2" && nNodes[3].innerHTML == "Age" && nNodes[4].innerHTML == "Start date" && nNodes[5].innerHTML == "Salary").toBe(true);

		});
	});

});
