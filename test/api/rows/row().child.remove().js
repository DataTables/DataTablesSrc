// todo tests
// Question- if we remove them are they destroyed?
// 1- DOM test- child rows displayed, remove them.
// 2- DOM test- child rows hidden, remove them.
// 3- DOM test- no child rows.
// 4- Some test here to check that memory is freed up. (No idea how other than checking objects are destroyed)


describe( "rows- row().child.remove()", function() {
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
