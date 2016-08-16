// todo tests
//1
// Makes ajax request when called
// 2
// Paremeters are of correct type and do what they are supposed to
//3
//Calling ajax.reload() actually loads the freshest data from the table
// Will have to test by using a different set of data to see if this data is updated properly.
describe( "core- ajax.reload()", function() {
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
