describe('Caption tag', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Remains in place when initialised without scrolling - top', function() {
		$('#example').prepend('<caption>Caption</caption>');
		var table = $('#example').DataTable();

		expect($('caption')[0].parentNode).toBe(table.table().node());
		expect($('caption').css('caption-side')).toBe('top');
	});

	it('Node order is correct', function() {
		let nodes = $('#example').children();

		expect(nodes[0].nodeName.toLowerCase()).toBe('caption');
		expect(nodes[1].nodeName.toLowerCase()).toBe('colgroup');
		expect(nodes[2].nodeName.toLowerCase()).toBe('thead');
		expect(nodes[3].nodeName.toLowerCase()).toBe('tfoot');
		expect(nodes[4].nodeName.toLowerCase()).toBe('tbody');
	});

	dt.html('basic');

	it('Remains in place when initialised without scrolling - bottom', function() {
		$('#example').prepend('<caption style="caption-side: bottom;">Caption</caption>');
		var table = $('#example').DataTable();

		expect($('caption')[0].parentNode).toBe(table.table().node());
		expect($('caption').css('caption-side')).toBe('bottom');
	});

	dt.html('basic');

	it('When set to appear above the table, it does when scrolling', function() {
		$('#example').prepend('<caption>Caption</caption>');
		var table = $('#example').DataTable({
			scrollY: 200
		});

		expect($('caption')[0].parentNode).toBe(table.table().header().parentNode);
		expect($('caption').css('caption-side')).toBe('top');
	});

	dt.html('basic');

	it('When set to appear below the table, it does when scrolling', function() {
		$('#example').prepend('<caption style="caption-side: bottom;">Caption</caption>');
		var table = $('#example').DataTable({
			scrollY: 200
		});

		expect( $('caption')[0].parentNode ).toBe( table.table().footer().parentNode );
		expect( $('caption').css('caption-side') ).toBe( 'bottom' );
	} );

	// Setting a caption
	dt.html( 'basic' );

	it( 'Default is null', function () {
		expect( $.fn.dataTable.defaults.caption ).toBe( null );
	} );

	it( 'Can be set as an init option', function () {
		var table = $('#example').DataTable( {
			caption: 'My life as been a tapestry'
		} );

		expect( $('caption').html() ).toBe( 'My life as been a tapestry' );
	} );

	it('Node order is correct', function() {
		let nodes = $('#example').children();

		expect(nodes[0].nodeName.toLowerCase()).toBe('caption');
		expect(nodes[1].nodeName.toLowerCase()).toBe('colgroup');
		expect(nodes[2].nodeName.toLowerCase()).toBe('thead');
		expect(nodes[3].nodeName.toLowerCase()).toBe('tfoot');
		expect(nodes[4].nodeName.toLowerCase()).toBe('tbody');
	});

	dt.html( 'basic' );

	it( 'Will overwrite an existing caption', function () {
		$('#example').prepend('<caption>Caption</caption>' );

		var table = $('#example').DataTable( {
			caption: 'Of rich and royal hue'
		} );

		expect( $('caption').html() ).toBe( 'Of rich and royal hue' );
	} );

	it( 'Uses the existing caption rather than adding a new one', function () {
		expect( $('caption').length ).toBe( 1 );
	} );

	it('Node order is correct', function() {
		let nodes = $('#example').children();

		expect(nodes[0].nodeName.toLowerCase()).toBe('caption');
		expect(nodes[1].nodeName.toLowerCase()).toBe('colgroup');
		expect(nodes[2].nodeName.toLowerCase()).toBe('thead');
		expect(nodes[3].nodeName.toLowerCase()).toBe('tfoot');
		expect(nodes[4].nodeName.toLowerCase()).toBe('tbody');
	});
} );
