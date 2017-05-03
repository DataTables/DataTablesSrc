
describe( 'eq()', function() {
	var table;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'three_tables' );

	it( 'Create three tables in a single instance DataTable', function () {
		table = $('table.display').DataTable();
		expect( true ).toBe( true );
	} );

	it( 'eq() method exists', function () {
		expect( typeof table.eq ).toBe( 'function' );
	} );

	it( 'rows().data() will get the data from all tables', function () {
		expect( table.rows().data().length ).toBe( 6 );
	} );

	it( 'Result from eq() is an API instance', function () {
		var t = table.eq(0);
		expect( t instanceof $.fn.DataTable.Api ).toBe( true );
	} );

	it( 'Select just the first table with eq()', function () {
		var t = table.eq(0);
		expect( t.rows().data().length ).toBe( 3 );
	} );

	it( 'Select the second table with eq()', function () {
		var t = table.eq(1);
		expect( t.rows().data().length ).toBe( 2 );
	} );

	it( 'Select the third table with eq()', function () {
		var t = table.eq(2);
		expect( t.rows().data().length ).toBe( 1 );
	} );

	it( 'Select an undefined table with eq()', function () {
		var t = table.eq(3);
		expect( t.rows().data().length ).toBe( 0 );
	} );
} );
