// todo tests
// - Check it exists and is a function
// - Parameter 1:
//   - Can request a custom value that is defined in the initialisation (top level - e.g. i18n.custom)
//   - Can request a custom value that is defined in the initialisation (nested level - e.g. i18n.custom.hi)
//   - Can request a DataTables standard value
// - Parameter 2:
//   - Default is returned if the token wasn't defined in the init options
//   - Default is not returned if the token was defined
// - Parameter 3:
//   - With no plural object defined %d will be replaced by the number given
//   - With a plural object defined the correct string will be used for:
//     - 0
//     - 1
//     - 2
//     - 3
//     - other numbers
describe( "core- i18n()", function() {
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
