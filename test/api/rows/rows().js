// todo tests - write the tests...

describe( 'rows: rows()', function() {
	var table;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'basic' );

	it ( 'select all rows - no selector' , function () {
		table = $('#example').DataTable()
		expect( table.rows().count() ).toBe( 57 );
	} );

	it ( 'select all rows - undefined selector' , function () {
		table = $('#example').DataTable()
		expect( table.rows( undefined ).count() ).toBe( 57 );
	} );

	it ( 'select all rows - null selector' , function () {
		table = $('#example').DataTable()
		expect( table.rows( null ).count() ).toBe( 57 );
	} );

	it ( 'select one row - 0 selector' , function () {
		table = $('#example').DataTable()
		expect( table.rows( 0 ).count() ).toBe( 1 );
	} );
} );
