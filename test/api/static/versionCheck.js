
describe( 'Static method - versionCheck', function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	it( 'Exists', function () {
		expect( typeof $.fn.dataTable.versionCheck ).toBe( 'function' );
	} );

	it( 'Check against current version of DataTables - low', function () {
		expect( $.fn.dataTable.versionCheck( '1.9.0' ) ).toBe( true );
	} );

	it( 'Check against current version of DataTables - current', function () {
		expect( $.fn.dataTable.versionCheck( $.fn.dataTable.version ) ).toBe( true );
	} );

	it( 'Check against current version of DataTables - high', function () {
		expect( $.fn.dataTable.versionCheck( '3.0.0' ) ).toBe( false );
	} );

	it( 'Check custom version - low', function () {
		expect( $.fn.dataTable.versionCheck( '1.5.0', '1.4.3' ) ).toBe( false );
	} );

	it( 'Check custom version - match', function () {
		expect( $.fn.dataTable.versionCheck( '1.5.0', '1.5.0' ) ).toBe( true );
	} );

	it( 'Check custom version - high - minor', function () {
		expect( $.fn.dataTable.versionCheck( '1.5.0', '1.5.1' ) ).toBe( true );
	} );

	it( 'Check custom version - high - major', function () {
		expect( $.fn.dataTable.versionCheck( '1.5.0', '1.6.0' ) ).toBe( true );
	} );

	it( 'Check custom version - high - meta', function () {
		expect( $.fn.dataTable.versionCheck( '1.5.0', '2.5.0' ) ).toBe( true );
	} );
} );
