// todo tests - write the tests...

describe( 'rows: cells()', function() {
	var table;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'basic' );

	it ( 'modifier - row index of 1, no data match' , function () {
		table = $('#example').DataTable()

		// This will leave row index 4 in the display
		table.search( 'air' ).draw();

		var d = table.row( 1, { search: 'applied' } ).data();
		expect( d ).toBe( undefined );
	} );

	it ( 'modifier - row index of 0, no data match' , function () {
		var d = table.row( 0, { search: 'applied' } ).data();
		expect( d ).toBe( undefined );
	} );

	it ( 'modifier - row index of 4, data match' , function () {
		var d = table.row( 4, { search: 'applied' } ).data();
		expect( d[0] ).toBe( 'Airi Satou' );
	} );
} );
