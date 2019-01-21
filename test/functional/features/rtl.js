describe( 'Right to left layout', function() {
	var table;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'basic' );

	it ( 'Scrollbar position ltr - scroll header padding on right' , function () {
		table = $('#example').DataTable( {
			scrollY: 200,
			paging: false
		} );

		var header = $('div.dataTables_scrollHeadInner');
		var paddingLeft = parseInt( header.css('paddingLeft'), 10 );
		var paddingRight = parseInt( header.css('paddingRight'), 10 );

		// Need to allow the two to be equal for systems which use hidden scrollbars
		expect( paddingLeft === paddingRight || paddingLeft < paddingRight ).toBe( true );
	} );

	dt.html( 'basic' );

	it ( 'Scrollbar position rtl - scroll header padding on left' , function () {
		$('body').css( 'direction', 'rtl' );
		table = $('#example').DataTable( {
			scrollY: 200,
			paging: false
		} );

		var header = $('div.dataTables_scrollHeadInner');
		var paddingLeft = parseInt( header.css('paddingLeft'), 10 );
		var paddingRight = parseInt( header.css('paddingRight'), 10 );

		// Need to allow the two to be equal for systems which use hidden scrollbars
		expect( paddingLeft === paddingRight || paddingLeft > paddingRight ).toBe( true );
	} );

	dt.html( 'basic' );

	// DataTables/DataTables #866
	it ( 'Scroll left does not alter the scrollbar position detection (ltr)' , function () {
		$('body').css( 'direction', 'ltr' );
		var force = $('<div style="width:2000px; height: 2px;"/>').appendTo('body');
		$('body').scrollLeft(50);

		table = $('#example').DataTable( {
			scrollY: 200,
			paging: false
		} );

		var header = $('div.dataTables_scrollHeadInner');
		var paddingLeft = parseInt( header.css('paddingLeft'), 10 );
		var paddingRight = parseInt( header.css('paddingRight'), 10 );

		// Need to allow the two to be equal for systems which use hidden scrollbars
		expect( paddingLeft === paddingRight || paddingLeft < paddingRight ).toBe( true );

		force.remove();
	} );

	dt.html( 'basic' );

	it ( 'Scroll left does not alter the scrollbar position detection (rtl)' , function () {
		$('body').css( 'direction', 'rtl' );
		var force = $('<div style="width:2000px; height: 2px;"/>').appendTo('body');
		$('body').scrollLeft(50);

		table = $('#example').DataTable( {
			scrollY: 200,
			paging: false
		} );

		var header = $('div.dataTables_scrollHeadInner');
		var paddingLeft = parseInt( header.css('paddingLeft'), 10 );
		var paddingRight = parseInt( header.css('paddingRight'), 10 );

		// Need to allow the two to be equal for systems which use hidden scrollbars
		expect( paddingLeft === paddingRight || paddingLeft > paddingRight ).toBe( true );


		$('body').css( 'direction', 'ltr' );

		force.remove();
	} );
} );
