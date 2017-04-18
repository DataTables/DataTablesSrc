
describe( 'unique()', function() {
	var table;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'basic' );

	it( 'Create basic DataTable', function () {
		table = $('#example').DataTable();
		expect( true ).toBe( true );
	} );

	it( 'Get data from office column', function () {
		var data = table.column( 2 ).data();
		expect( data.count() ).toBe( 57 );
	} );

	it( 'Get unique data from office column', function () {
		var data = table.column( 2 ).data().unique();
		expect( data.count() ).toBe( 7 );
	} );

	it( 'Confirm unique data', function () {
		var data = table.column( 2 ).data().unique().sort();

		expect( data[0] ).toBe( 'Edinburgh' );
		expect( data[1] ).toBe( 'London' );
		expect( data[2] ).toBe( 'New York' );
		expect( data[3] ).toBe( 'San Francisco' );
		expect( data[4] ).toBe( 'Sidney' );
		expect( data[5] ).toBe( 'Singapore' );
		expect( data[6] ).toBe( 'Tokyo' );
	} );

	it( 'Get unique data from age column', function () {
		var data = table.column( 3 ).data().unique();
		expect( data.count() ).toBe( 33 );
	} );
} );
