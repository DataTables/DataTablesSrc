
describe( 'Static method - types', function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	it( 'Exists', function () {
		expect( typeof DataTable.types ).toBe( 'function' );
	} );

	it( 'Returns an array', function () {
		expect( Array.isArray(DataTable.types()) ).toBe( true );
	} );

	it( 'Default types are present', function () {
		expect( DataTable.types() ).toEqual( [
			"num", "num-fmt", "html-num", "html-num-fmt", "date", "html-utf8", "html", "string-utf8", "string"
		] );
	} );

	it( 'A new type added is reflected in the array', function () {
		DataTable.type('test', {
			detect: function () { return true; }
		});

		expect( DataTable.types() ).toEqual( [
			"test", "num", "num-fmt", "html-num", "html-num-fmt", "date", "html-utf8", "html", "string-utf8", "string"
		] );
	} );
} );
