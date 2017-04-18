
describe( 'slice()', function() {
	var table;
	var data, dataSliced;

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
		data = table.column( 2 ).data().unique().sort();
		expect( data.count() ).toBe( 7 );
	} );

	it( 'Create copy of instance', function () {
		dataSliced =  data.slice();
		expect( dataSliced.count() ).toBe( 7 );
	} );

	it( 'Push to sliced copy', function () {
		dataSliced.push( 'Dunfermline' );
		expect( dataSliced.count() ).toBe( 8 );
	} );

	it ( 'Does not effect the original', function () {
		expect( data.count() ).toBe( 7 );
	} );

	it ( 'Does have data in the new one', function () {
		expect( dataSliced[0] ).toBe( 'Edinburgh' );
		expect( dataSliced[1] ).toBe( 'London' );
		expect( dataSliced[2] ).toBe( 'New York' );
		expect( dataSliced[3] ).toBe( 'San Francisco' );
		expect( dataSliced[4] ).toBe( 'Sidney' );
		expect( dataSliced[5] ).toBe( 'Singapore' );
		expect( dataSliced[6] ).toBe( 'Tokyo' );
		expect( dataSliced[7] ).toBe( 'Dunfermline' );
	} );
} );
