// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API instance
// - Select a column - ensure that the API instance contains the nodes for that column and returned API instance is the right length (obviously don't check every single node!)
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
