
describe( 'column().name()', function() {
	var table;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'basic' );

	it( 'Exists and is a function', function () {
		table = $('#example').DataTable( {
			columnDefs: [
				{ targets: 0, name: 'one' },
				{ targets: 1, name: 'two' },
			]	
		} );
		expect(typeof table.column(0).name).toBe('function');
	} );

	it( 'Can be used to get a column name', function () {
		expect(table.column(0).name()).toBe('one');
	} );

	it( 'Gives empty string for columns without a name', function () {
		expect(table.column(2).name()).toBe('');
	} );

	it( 'Can be used as a setter', function () {
		table.column(1).name('TWO');
		expect(table.column(1).name()).toBe('TWO');
	} );

	it( 'Can select using the new name', function () {
		expect(table.column('TWO:name', {order:'applied'}).data()[0]).toBe('Accountant');
	} );

	it( 'Setter returns API instance', function () {
		var tmp = table.column(1).name('two');
		expect(tmp instanceof $.fn.dataTable.Api).toBe(true);
	} );

	it( 'Can be used as a setter on a column which didn\'t have a name defined during init', function () {
		table.column(2).name('three');
		expect(table.column(2).name()).toBe('three');
	} );
} );
