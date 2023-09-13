describe( "Diacritic searching", function() {
	var table;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'basic' );

	it( 'Load DataTable', function () {
		// Set up some strings to test for
		$('tbody tr:nth-child(1) td:nth-child(2)').text('Crème Brulée');
		$('tbody tr:nth-child(2) td:nth-child(2)').text('Amélie');
		$('tbody tr:nth-child(3) td:nth-child(2)').text('āăąēîïĩíĝġńñšŝśûůŷ');
		$('tbody tr:nth-child(4) td:nth-child(2)').text('Kateřina');

		table = $('#example').DataTable();

		expect( table.page.info().recordsTotal ).toBe( 57 );
	} );

	it( 'Search for non-diacritic string - 1', async function () {
		table.search('creme').draw();

		expect( $('tbody tr:first-child td:first-child').text() ).toBe('Tiger Nixon');
		expect( table.rows({page: 'current'}).count() ).toBe( 1 );
	} );

	it( 'Search for non-diacritic string - 2', async function () {
		table.search('amelie').draw();

		expect( $('tbody tr:first-child td:first-child').text() ).toBe('Garrett Winters');
		expect( table.rows({page: 'current'}).count() ).toBe( 1 );
	} );

	it( 'Search for non-diacritic string - 3', async function () {
		table.search('aaaeiiiiggnnsssuuy').draw();

		expect( $('tbody tr:first-child td:first-child').text() ).toBe('Ashton Cox');
		expect( table.rows({page: 'current'}).count() ).toBe( 1 );
	} );

	it( 'Search for non-diacritic string - 4', async function () {
		table.search('Katerina').draw();

		expect( $('tbody tr:first-child td:first-child').text() ).toBe('Cedric Kelly');
		expect( table.rows({page: 'current'}).count() ).toBe( 1 );
	} );


	it( 'Search with diacritic string - 1', async function () {
		table.search('crème').draw();

		expect( $('tbody tr:first-child td:first-child').text() ).toBe('Tiger Nixon');
		expect( table.rows({page: 'current'}).count() ).toBe( 1 );
	} );

	it( 'Search with diacritic string - 2', async function () {
		table.search('amélie').draw();

		expect( $('tbody tr:first-child td:first-child').text() ).toBe('Garrett Winters');
		expect( table.rows({page: 'current'}).count() ).toBe( 1 );
	} );

	it( 'Search with diacritic string - 3', async function () {
		table.search('āăąēîïĩíĝġńñšŝśûůŷ').draw();

		expect( $('tbody tr:first-child td:first-child').text() ).toBe('Ashton Cox');
		expect( table.rows({page: 'current'}).count() ).toBe( 1 );
	} );

	it( 'Search with diacritic string - 4', async function () {
		table.search('kateřina').draw();

		expect( $('tbody tr:first-child td:first-child').text() ).toBe('Cedric Kelly');
		expect( table.rows({page: 'current'}).count() ).toBe( 1 );
	} );
} );
