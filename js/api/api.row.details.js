

var __details_add = function ( ctx, row, data, klass )
{
	// Convert to array of TR elements
	var rows = [];
	var addRow = function ( r, k ) {
		// If we get a TR element, then just add it directly - up to the dev
		// to add the correct number of columns etc
		if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
			rows.push( r );
		}
		else {
			// Otherwise create a row with a wrapper
			var created = $('<tr><td/></tr>');
			$('td', created)
				.addClass( k )
				.html( r )
				[0].colSpan = _fnVisbleColumns( ctx );

			rows.push( created[0] );
		}
	};

	if ( $.isArray( data ) || data instanceof $ ) {
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			addRow( data[i], klass );
		}
	}
	else {
		addRow( data, klass );
	}

	if ( row._details ) {
		row._details.remove();
	}

	row._details = $(rows);

	// If the children were already shown, that state should be retained
	if ( row._detailsShow ) {
		row._details.insertAfter( row.nTr );
	}
};


var __details_display = function ( show ) {
	var ctx = this.context;

	if ( ctx.length && this.length ) {
		var row = ctx[0].aoData[ this[0] ];

		if ( row._details ) {
			row._detailsShow = show;
			if ( show ) {
				row._details.insertAfter( row.nTr );
			}
			else {
				row._details.remove();
			}

			__details_events( ctx[0] );
		}
	}

	return this;
};


var __details_events = function ( settings )
{
	var api = new _Api( settings );
	var namespace = '.dt.DT_details';
	var drawEvent = 'draw'+namespace;
	var colvisEvent = 'column-visibility'+namespace;

	api.off( drawEvent +' '+ colvisEvent );

	if ( _pluck( settings.aoData, '_details' ).length > 0 ) {
		// On each draw, insert the required elements into the document
		api.on( drawEvent, function () {
			api.rows( {page:'current'} ).eq(0).each( function (idx) {
				// Internal data grab
				var row = settings.aoData[ idx ];

				if ( row._detailsShow ) {
					row._details.insertAfter( row.nTr );
				}
			} );
		} );

		// Column visibility change - update the colspan
		api.on( colvisEvent, function ( e, settings, idx, vis ) {
			// Update the colspan for the details rows (note, only if it already has
			// a colspan)
			var row, visible = _fnVisbleColumns( settings );

			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				row = settings.aoData[i];

				if ( row._details ) {
					row._details.children('td[colspan]').attr('colspan', visible );
				}
			}
		} );
	}
};

// data can be:
//  tr
//  string
//  jQuery or array of any of the above
_api_register( 'row().child()', function ( data, klass ) {
	var ctx = this.context;

	if ( data === undefined ) {
		// get
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ]._details :
			undefined;
	}
	else if ( ctx.length && this.length ) {
		// set
		__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
	}

	return this;
} );

_api_register( [
	'row().child.show()',
	'row().child().show()'
], function () {
	__details_display.call( this, true );
} );

_api_register( [
	'row().child.hide()',
	'row().child().hide()'
], function () {
	__details_display.call( this, false );
} );

_api_register( 'row().child.isShown()', function () {
	var ctx = this.context;

	if ( ctx.length && this.length ) {
		// _detailsShown as false or undefined will fall through to return false
		return ctx[0].aoData[ this[0] ]._detailsShow || false;
	}
	return false;
} );

