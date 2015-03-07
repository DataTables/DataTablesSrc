

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
			var created = $('<tr><td/></tr>').addClass( k );
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


var __details_remove = function ( api, idx )
{
	var ctx = api.context;

	if ( ctx.length ) {
		var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];

		if ( row._details ) {
			row._details.remove();

			row._detailsShow = undefined;
			row._details = undefined;
		}
	}
};


var __details_display = function ( api, show ) {
	var ctx = api.context;

	if ( ctx.length && api.length ) {
		var row = ctx[0].aoData[ api[0] ];

		if ( row._details ) {
			row._detailsShow = show;

			if ( show ) {
				row._details.insertAfter( row.nTr );
			}
			else {
				row._details.detach();
			}

			__details_events( ctx[0] );
		}
	}
};


var __details_events = function ( settings )
{
	var api = new _Api( settings );
	var namespace = '.dt.DT_details';
	var drawEvent = 'draw'+namespace;
	var colvisEvent = 'column-visibility'+namespace;
	var destroyEvent = 'destroy'+namespace;
	var data = settings.aoData;

	api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );

	if ( _pluck( data, '_details' ).length > 0 ) {
		// On each draw, insert the required elements into the document
		api.on( drawEvent, function ( e, ctx ) {
			if ( settings !== ctx ) {
				return;
			}

			api.rows( {page:'current'} ).eq(0).each( function (idx) {
				// Internal data grab
				var row = data[ idx ];

				if ( row._detailsShow ) {
					row._details.insertAfter( row.nTr );
				}
			} );
		} );

		// Column visibility change - update the colspan
		api.on( colvisEvent, function ( e, ctx, idx, vis ) {
			if ( settings !== ctx ) {
				return;
			}

			// Update the colspan for the details rows (note, only if it already has
			// a colspan)
			var row, visible = _fnVisbleColumns( ctx );

			for ( var i=0, ien=data.length ; i<ien ; i++ ) {
				row = data[i];

				if ( row._details ) {
					row._details.children('td[colspan]').attr('colspan', visible );
				}
			}
		} );

		// Table destroyed - nuke any child rows
		api.on( destroyEvent, function ( e, ctx ) {
			if ( settings !== ctx ) {
				return;
			}

			for ( var i=0, ien=data.length ; i<ien ; i++ ) {
				if ( data[i]._details ) {
					__details_remove( api, i );
				}
			}
		} );
	}
};

// Strings for the method names to help minification
var _emp = '';
var _child_obj = _emp+'row().child';
var _child_mth = _child_obj+'()';

// data can be:
//  tr
//  string
//  jQuery or array of any of the above
_api_register( _child_mth, function ( data, klass ) {
	var ctx = this.context;

	if ( data === undefined ) {
		// get
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ]._details :
			undefined;
	}
	else if ( data === true ) {
		// show
		this.child.show();
	}
	else if ( data === false ) {
		// remove
		__details_remove( this );
	}
	else if ( ctx.length && this.length ) {
		// set
		__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
	}

	return this;
} );


_api_register( [
	_child_obj+'.show()',
	_child_mth+'.show()' // only when `child()` was called with parameters (without
], function ( show ) {   // it returns an object and this method is not executed)
	__details_display( this, true );
	return this;
} );


_api_register( [
	_child_obj+'.hide()',
	_child_mth+'.hide()' // only when `child()` was called with parameters (without
], function () {         // it returns an object and this method is not executed)
	__details_display( this, false );
	return this;
} );


_api_register( [
	_child_obj+'.remove()',
	_child_mth+'.remove()' // only when `child()` was called with parameters (without
], function () {           // it returns an object and this method is not executed)
	__details_remove( this );
	return this;
} );


_api_register( _child_obj+'.isShown()', function () {
	var ctx = this.context;

	if ( ctx.length && this.length ) {
		// _detailsShown as false or undefined will fall through to return false
		return ctx[0].aoData[ this[0] ]._detailsShow || false;
	}
	return false;
} );

