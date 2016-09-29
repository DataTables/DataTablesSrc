describe( 'columns.data option', function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'empty' );
	it( 'Data can be loaded using an escaped dot', function () {
		$.fn.dataTable.ext.errMode = 'throw';

		table = $('#example').DataTable( {
			data: [ {
				'1.0': 1,
				'1.1': 2,
				'1.2': 3,
				'1.3': 4,
				'1.4': 5,
				'1.5': 6
			} ],
			columns: [
				{ data: '1\\.0' },
				{ data: '1\\.1' },
				{ data: '1\\.2' },
				{ data: '1\\.3' },
				{ data: '1\\.4' },
				{ data: '1\\.5' }
			]
		} );

		expect( table.cell( 0, 0 ).data() ).toBe( 1 );
	} );

	// DataTables/DataTables #869
	dt.html( 'empty' );
	it( 'An escaped backslash can be used with an escaped dot as a data accessor', function () {
		table = $('#example').DataTable( {
			data: [ {
				'1\\x.0': 7,
				'1\\x.1': 8,
				'1\\x.2': 9,
				'1\\x.3': 10,
				'1\\x.4': 11,
				'1\\x.5': 12
			} ],
			columns: [
				{ data: '1\\x\\.0' },
				{ data: '1\\x\\.1' },
				{ data: '1\\x\\.2' },
				{ data: '1\\x\\.3' },
				{ data: '1\\x\\.4' },
				{ data: '1\\x\\.5' }
			]
		} );

		expect( table.cell( 0, 0 ).data() ).toBe( 7 );
	} );
} );
