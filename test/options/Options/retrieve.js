describe( "retrieve Option //todo", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
	describe("Default tests", function () {
		dt.html( 'basic' );
		it("Return table object & is oftype object", function () {
			function initTable () {
				return $('#example').dataTable( {
				"scrollY": "200px",
				"paginate": false,
				"retrieve": true
				} );
			}
			var table = initTable();
			expect(typeof table == 'object').toBe(true);
		});
	});
});
