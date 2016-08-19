// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API instance
// - Select a column - ensure that the API instane contains the nodes for that column
// - Test using Ajax sourced table with deferRender

describe( "columns- column().nodes()", function() {
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
