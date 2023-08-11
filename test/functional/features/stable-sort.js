describe( "Stable and reset sort", function() {
	var table;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'stable-sort' );

	it( 'Load DataTable', function () {
		table = $('#example').DataTable();

		expect( $('tbody tr:eq(0) td:eq(0)').text() ).toBe( '2020-10-28' );
		expect( $('tbody tr:eq(0) td:eq(1)').text() ).toBe( '5. James' );
		expect( $('tbody tr:eq(1) td:eq(0)').text() ).toBe( '2020-10-28' );
		expect( $('tbody tr:eq(1) td:eq(1)').text() ).toBe( '6. James' );
	} );

	it( 'Sort on last column to mix first column\'s sort', async function () {
		await dt.clickHeader(2);

		expect( $('tbody tr:eq(0) td:eq(0)').text() ).toBe( '2023-11-12' );
		expect( $('tbody tr:eq(0) td:eq(1)').text() ).toBe( '2. James' );
		expect( $('tbody tr:eq(1) td:eq(0)').text() ).toBe( '2023-02-17' );
		expect( $('tbody tr:eq(1) td:eq(1)').text() ).toBe( '4. James' );
	} );

	it( 'Return to first column sorting', async function () {
		await dt.clickHeader(0);

		expect( $('tbody tr:eq(0) td:eq(0)').text() ).toBe( '2020-10-28' );
		expect( $('tbody tr:eq(0) td:eq(1)').text() ).toBe( '5. James' );
		expect( $('tbody tr:eq(1) td:eq(0)').text() ).toBe( '2020-10-28' );
		expect( $('tbody tr:eq(1) td:eq(1)').text() ).toBe( '6. James' );
	} );
} );
