describe( "Complex header ordering", function() {
	var table;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'complex-header-footer' );

	it( 'Load DataTable', function () {
		table = $('#example').DataTable();

		var firstRow = $('thead tr:first-child th');

		expect( firstRow.eq(0).hasClass('dt-ordering-asc') ).toBe(true);
		expect( firstRow.eq(0).hasClass('dt-ordering-desc') ).toBe(false);
		expect( firstRow.eq(1).hasClass('dt-ordering-asc') ).toBe(false);
		expect( firstRow.eq(1).hasClass('dt-ordering-desc') ).toBe(false);
		expect( firstRow.eq(2).hasClass('dt-ordering-asc') ).toBe(false);
		expect( firstRow.eq(2).hasClass('dt-ordering-desc') ).toBe(false);

		expect( $('tbody td').eq(0).text() ).toBe('Airi Satou');
	} );

	it( 'Sort on Contact column', async function () {
		await dt.clickHeader('#example thead tr:first-child th', 2);

		var firstRow = $('thead tr:first-child th');

		expect( firstRow.eq(0).hasClass('dt-ordering-asc') ).toBe(false);
		expect( firstRow.eq(0).hasClass('dt-ordering-desc') ).toBe(false);
		expect( firstRow.eq(1).hasClass('dt-ordering-asc') ).toBe(false);
		expect( firstRow.eq(1).hasClass('dt-ordering-desc') ).toBe(false);
		expect( firstRow.eq(2).hasClass('dt-ordering-asc') ).toBe(true);
		expect( firstRow.eq(2).hasClass('dt-ordering-desc') ).toBe(false);

		expect( $('tbody td').eq(0).text() ).toBe('Tatyana Fitzpatrick');
	} );

	it( 'Reverse sort on Contact column', async function () {
		await dt.clickHeader('#example thead tr:first-child th', 2);

		var firstRow = $('thead tr:first-child th');

		expect( firstRow.eq(0).hasClass('dt-ordering-asc') ).toBe(false);
		expect( firstRow.eq(0).hasClass('dt-ordering-desc') ).toBe(false);
		expect( firstRow.eq(1).hasClass('dt-ordering-asc') ).toBe(false);
		expect( firstRow.eq(1).hasClass('dt-ordering-desc') ).toBe(false);
		expect( firstRow.eq(2).hasClass('dt-ordering-asc') ).toBe(false);
		expect( firstRow.eq(2).hasClass('dt-ordering-desc') ).toBe(true);

		expect( $('tbody td').eq(0).text() ).toBe('Michael Silva');
	} );

	it( 'Null sort on Contact column', async function () {
		await dt.clickHeader('#example thead tr:first-child th', 2);

		var firstRow = $('thead tr:first-child th');

		expect( firstRow.eq(0).hasClass('dt-ordering-asc') ).toBe(false);
		expect( firstRow.eq(0).hasClass('dt-ordering-desc') ).toBe(false);
		expect( firstRow.eq(1).hasClass('dt-ordering-asc') ).toBe(false);
		expect( firstRow.eq(1).hasClass('dt-ordering-desc') ).toBe(false);
		expect( firstRow.eq(2).hasClass('dt-ordering-asc') ).toBe(false);
		expect( firstRow.eq(2).hasClass('dt-ordering-desc') ).toBe(false);

		expect( $('tbody td').eq(0).text() ).toBe('Tiger Nixon');
	} );

	dt.html( 'basic' );

	it( 'Initialisation with single row complex header', async function () {
		$('#example thead tr th').last().remove();
		$('#example thead tr th').last()[0].colSpan = 2;
		
		table = $('#example').DataTable();

		expect( $('tbody td').eq(0).text() ).toBe('Airi Satou');
	} );
} );
