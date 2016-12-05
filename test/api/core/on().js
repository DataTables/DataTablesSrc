// todo tests
// - Check it exists and is a function
// - Able to add a single event
// - Able to listen for multiple events with a single call
// - Event handlers are correctly triggered
// - The callback function is passed at least the event object as the first parameter (exact parameters depend upon the event)
// - returns API instance

describe( 'core- on()', function() {
	var table;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'basic' );

	it( '.dt name space is automatically added when using `on`', function () {
		var drawPass = false;

		table = $('#example').DataTable();

		table.on( 'draw', function () {
			drawPass = true;
		} );
		table.draw();

		expect( drawPass ).toBe( true );
	} );

	it( 'Name space can be passed in manually', function () {
		var drawPass = false;

		table.on( 'draw.dt', function () {
			drawPass = true;
		} );
		table.draw();

		expect( drawPass ).toBe( true );
	} );

	it( 'Multiple events can be subscripted with manual namespaces', function () {
		var drawPass = false;
		var pagePass = false;

		table.on( 'draw.dt page.dt', function (e) {
			if ( e.type === 'draw' ) {
				drawPass = true;
			}
			else if ( e.type === 'page' ) {
				pagePass = true;
			}
		} );
		table.page(2).draw(false);

		expect( drawPass ).toBe( true );
		expect( pagePass ).toBe( true );
	} );

	it( 'Multiple events can be subscripted without manual namespaces', function () {
		var drawPass = false;
		var pagePass = false;

		table.on( 'draw page', function (e) {
			if ( e.type === 'draw' ) {
				drawPass = true;
			}
			else if ( e.type === 'page' ) {
				pagePass = true;
			}
		} );
		table.page(3).draw(false);

		expect( drawPass ).toBe( true );
		expect( pagePass ).toBe( true );
	} );
} );
