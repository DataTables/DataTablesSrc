// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API instance
// - Select a column - ensure that the API instance contains the nodes for that column and returned API instance is the right length
// - Select two columns - check length / nodes
// - Select all columns - check length / nodes
// - Test using Ajax sourced table with deferRender

describe( "columns- columns().nodes()", function() {
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
