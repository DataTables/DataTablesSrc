// todo tests
// 1- Make sure returned value is an integer 

describe( "rows- row().index()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.row().index).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns Integer instance", function () {
			var table = $('#example').DataTable();
			console.log(table.row(0).index());
			expect(Number.isInteger(table.row(0).index())).toBe(true);
		});

	});

});
