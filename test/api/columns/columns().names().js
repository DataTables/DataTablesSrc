
describe( 'columns().names()', function() {
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
		expect(typeof table.columns(0).names).toBe('function');
	} );

	it( 'Can be used to get a single column name', function () {
		expect(table.columns(0).names()[0]).toBe('one');
	} );

	it( 'Can be used to get two columns names', function () {
		var tmp = table.columns([0,1]).names();
		expect(tmp[0]).toBe('one');
		expect(tmp[1]).toBe('two');
	} );

	it( 'Can be used to get columns names which weren\'t defined', function () {
		var tmp = table.columns([0,1,2]).names();
		expect(tmp[0]).toBe('one');
		expect(tmp[1]).toBe('two');
		expect(tmp[2]).toBe('');
	} );

	it( 'Returns an API instance', function () {
		var tmp = table.columns().names();
		expect(tmp instanceof $.fn.dataTable.Api).toBe(true);
	} );
} );
