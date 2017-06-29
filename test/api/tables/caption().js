
describe( 'api - caption()', function() {
	var table;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'basic' );

	it( 'Without a caption, as a getter returns null', function () {
		table = $('#example').DataTable();

		expect( table.caption() ).toBe( null );
	} );
	
	it( 'Can use the API to set the tables caption', function () {
		table.caption( 'My life has been a tapestry' );

		expect( $('#example caption').html() ).toBe( 'My life has been a tapestry' );
	} );

	it( 'Can be used as a getter', function () {
		expect( table.caption() ).toBe( 'My life has been a tapestry' );
	} );

	it( 'Can set the side to bottom', function () {
		table.caption( 'Of rich and royal hue', 'bottom' );

		expect( $('#example caption').html() ).toBe( 'Of rich and royal hue' );
		expect( $('#example caption').css('caption-side') ).toBe( 'bottom' );
	} );

	it( 'Will not add multiple caption elements', function () {
		expect( $('#example caption').length ).toBe( 1 );
	} );

	it( 'Can set the side to top', function () {
		table.caption( 'An ever lasting vision', 'top' );

		expect( $('#example caption').html() ).toBe( 'An ever lasting vision' );
		expect( $('#example caption').css('caption-side') ).toBe( 'top' );
	} );

	it( 'Can be set to be an empty string', function () {
		table.caption( '' );

		expect( $('#example caption').html() ).toBe( '' );
	} );
} );
