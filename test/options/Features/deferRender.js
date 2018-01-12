describe( "deferRender option", function() {
	var table;
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
	it( 'Is disabled by default', function () {
		expect( $.fn.dataTable.defaults.bDeferRender ).toBe( false );
	} );
	dt.html( 'empty' );
	it( 'Load DataTable', function (done) {
		table = $('#example').DataTable( {
			ajax: '/base/test/data/data.txt',
			deferRender: true,
			columns: [
				{ data: "name" },
				{ data: "position" },
				{ data: "office" },
				{ data: "age" },
				{ data: "start_date" },
				{ data: "salary" }
			],
			initComplete: function ( settings, json ) {
				done();
			}
		} );
	} );
	it( 'Only ten rows were created', function () {
		expect( table.rows().nodes().count() ).toBe( 10 );
	} );
	it( 'And only those cells were created', function () {
		expect( table.cells().nodes().count() ).toBe( 60 );
	} );
	it( 'On next page 10 more rows are created', function () {
		table.page( 'next' ).draw( false );
		expect( table.rows().nodes().count() ).toBe( 20 );
		expect( table.cells().nodes().count() ).toBe( 120 );
	} );
	it( 'Jumping back to first page, no more rows are created', function () {
		table.page( 'previous' ).draw( false );
		expect( table.rows().nodes().count() ).toBe( 20 );
		expect( table.cells().nodes().count() ).toBe( 120 );
	} );
	it( 'Jumping to last page will not render all rows', function () {
		table.page( 'last' ).draw( false );
		expect( table.rows().nodes().count() ).toBe( 27 );
		expect( table.cells().nodes().count() ).toBe( 162 );
	} );
	it( 'Jumping back to first page again doesn\'t create more', function () {
		table.page( 'first' ).draw( false );
		expect( table.rows().nodes().count() ).toBe( 27 );
		expect( table.cells().nodes().count() ).toBe( 162 );
	} );
	it( 'Filtering will create only those required', function () {
		table.search( 'm' ).draw();
		expect( table.rows().nodes().count() ).toBe( 31 );
		expect( table.cells().nodes().count() ).toBe( 186 );
	} );
	dt.html( 'basic' );
	it( 'Has no effect on DOM sourced table', function () {
		table = $('#example').DataTable( {
			deferRender: true
		} );
		expect( table.rows().nodes().count() ).toBe( 57 );
		expect( table.cells().nodes().count() ).toBe( 342 );
	} );
} );
