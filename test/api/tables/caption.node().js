
describe( 'api - caption.node()', function() {
	var table;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'basic' );

	it( 'Without a caption, returns null', function () {
		table = $('#example').DataTable();

		expect( table.caption.node() ).toBe( null );
	} );
	
	it( 'Will return a node when one has been added by the API', function () {
		table.caption( 'My life has been a tapestry' );

		expect( table.caption.node() ).toBe( $('#example caption')[0] );
	} );
	
	it( 'Will still return the cached node after removing the caption with jQuery', function () {
		$( table.caption.node() ).remove();

		expect( table.caption.node() ).not.toBe( null );
	} );
} );
