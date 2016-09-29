
describe( 'Static method - isDataTable', function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	var table;

	it( 'Exists', function () {
		expect( typeof $.fn.dataTable.isDataTable ).toBe( 'function' );
	} );

	it( 'Accepts a DataTable table node', function () {
		table = $('#example').DataTable();

		expect( $.fn.dataTable.isDataTable( $('#example').get(0) ) ).toBe( true );
	} );

	it( 'Other nodes return false', function () {
		table = $('#example').DataTable();

		expect( $.fn.dataTable.isDataTable( $('th').get(0) ) ).toBe( false );
		expect( $.fn.dataTable.isDataTable( $('td').get(0) ) ).toBe( false );
		expect( $.fn.dataTable.isDataTable( $('div').get(0) ) ).toBe( false );
	} );

	it( 'Can accept in a jQuery selector', function () {
		expect( $.fn.dataTable.isDataTable( 'table.dataTable' ) ).toBe( true );
		expect( $.fn.dataTable.isDataTable( 'div' ) ).toBe( false );
	} );

	it( 'Can accept a DataTable API instance', function () {
		expect( $.fn.dataTable.isDataTable( table ) ).toBe( true );
		expect( $.fn.dataTable.isDataTable( 1 ) ).toBe( false );
	} );


	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	it( 'Returns true for the header in a scrolling table', function () {
		table = $('#example').DataTable( {
			scrollY: 200
		} );

		var scrollingTable = $(table.table().header()).closest('table')
		expect( $.fn.dataTable.isDataTable( scrollingTable ) ).toBe( true );
	} );

	it( 'Returns true for the body in a scrolling table', function () {
		var scrollingTable = $(table.table().body()).closest('table')
		expect( $.fn.dataTable.isDataTable( scrollingTable ) ).toBe( true );
	} );

	it( 'Returns true for the footer in a scrolling table', function () {
		var scrollingTable = $(table.table().footer()).closest('table')
		expect( $.fn.dataTable.isDataTable( scrollingTable ) ).toBe( true );
	} );
} );