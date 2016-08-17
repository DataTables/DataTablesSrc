// todo tests
// - Check it exists and is a function
// - Check it returns an API instance
// - Check that the returned API instance contains the settings object for the table in question
// - Check with multiple tables as well - should contain a settings object for each table

describe( "core- settings()", function() {
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
