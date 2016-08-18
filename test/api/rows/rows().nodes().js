// todo tests
// 1- Select first row, make sure the correct <tr> element has been returned
// 2- Add a class to select few rows then use rows().nodes() to select rows, then remove the class and check to see that no rows have the class anymore.
// 3- Test this using a single row, mulitple rows, rows on different pages


describe( "rows- rows().nodes()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default should be null", function () {
				});

	});

});
