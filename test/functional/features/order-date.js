describe( "Date ordering with empty dates", function() {
	var table;
	var data = [
		[ 'Alice', '1920-05-10' ],
		[ 'Bob', '1969-12-30' ],
		[ 'Charlie', '1970-01-02' ],
		[ 'Dan', '' ],
		[ 'Eve', '2012-12-12' ],
		[ 'Frank', '' ]
	];

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'two-column-empty' );

	it( 'Load DataTable with local data', function () {
		table = $('#example').DataTable( {
			data: data
		} );

		expect( $('tbody tr:eq(0) td:eq(0)').text() ).toBe( 'Alice' );
		expect( $('tbody tr:eq(1) td:eq(0)').text() ).toBe( 'Bob' );
		expect( $('tbody tr:eq(2) td:eq(0)').text() ).toBe( 'Charlie' );
	} );

	it( 'Order by date column (asc)', function () {
		table.order( [[ 1, 'asc' ]] ).draw();

		expect( $('tbody tr:eq(0) td:eq(1)').text() ).toBe( '' );
		expect( $('tbody tr:eq(1) td:eq(1)').text() ).toBe( '' );
		expect( $('tbody tr:eq(2) td:eq(1)').text() ).toBe( '1920-05-10' );
		expect( $('tbody tr:eq(3) td:eq(1)').text() ).toBe( '1969-12-30' );
		expect( $('tbody tr:eq(4) td:eq(1)').text() ).toBe( '1970-01-02' );
		expect( $('tbody tr:eq(5) td:eq(1)').text() ).toBe( '2012-12-12' );
	} );

	it( 'Order by date column (desc)', function () {
		table.order( [[ 1, 'desc' ]] ).draw();

		expect( $('tbody tr:eq(5) td:eq(1)').text() ).toBe( '' );
		expect( $('tbody tr:eq(4) td:eq(1)').text() ).toBe( '' );
		expect( $('tbody tr:eq(3) td:eq(1)').text() ).toBe( '1920-05-10' );
		expect( $('tbody tr:eq(2) td:eq(1)').text() ).toBe( '1969-12-30' );
		expect( $('tbody tr:eq(1) td:eq(1)').text() ).toBe( '1970-01-02' );
		expect( $('tbody tr:eq(0) td:eq(1)').text() ).toBe( '2012-12-12' );
	} );


	// TODO - Complete tests....
} );
