// todo tests - write the tests...

describe( 'rows: row()', function() {
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
	
	it( 'Child row node can be used as a row selector', function () {
		table.search( '' ).draw();
		table.row(':eq(1)').child( 'test', 'childClass' ).show();

		var d = table.row( $('tr.childClass')[0] ).data();
		expect( d[0] ).toBe( 'Angelica Ramos' );
	} );
		
	it( 'Child row in jQuery object can be used as a row selector', function () {
		var d = table.row( $('tr.childClass') ).data();
		expect( d[0] ).toBe( 'Angelica Ramos' );
	} );
} );
