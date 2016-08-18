// todo tests
// 
//This test should make sure '$()' returns a jQuery object, unsure how to test for a type
//   AJJ - Use `instanceof $` to check that is it a jQuery object
//I can do a test to make sure it works by just calling $('#example').DataTable() after init.
//   AJJ - This needs to test that the method converts a DataTables API instance (i.e. a collection) to a jQuery instance (again a collection). It is only really useful the API instance contains nodes - e.g. rows().nodes()
//
// - Check it exists and is a function
// - Use with rows().nodes() and it gives a jQuery object that contains all row nodes
// - Use with rows().nodes() and a selector that will result in only a single row being included
// - Use with rows().nodes() and a selector that will result in no nodes
describe( "core- $()", function() {
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
