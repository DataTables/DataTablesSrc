
describe( 'get()', function() {
	var table;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'basic' );

	it( 'Create DataTable', function () {
		table = $('#example').DataTable();
		expect( true ).toBe( true );
	} );

	it( 'get() method exists', function () {
		expect( typeof table.get ).toBe( 'function' );
	} );

	it( 'get() can select the first item from a result set', function () {
		var d = table.column(0, {order:'applied'}).data().get(0);
		expect( d ).toBe( 'Airi Satou' );
	} );

	it( 'get() can select the second item from a result set', function () {
		var d = table.column(0, {order:'applied'}).data().get(1);
		expect( d ).toBe( 'Angelica Ramos' );
	} );

	it( 'get() returns undefined for an undefined index', function () {
		var d = table.column(0, {order:'applied'}).data().get(100);
		expect( d ).toBe( undefined );
	} );

	it( 'get() returns undefined for a negative index', function () {
		var d = table.column(0, {order:'applied'}).data().get(-1);
		expect( d ).toBe( undefined );
	} );
} );
