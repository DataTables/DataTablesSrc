

/**
 * Redraw the tables in the current context.
 */
_api_register( 'draw()', function ( paging ) {
	return this.iterator( 'table', function ( settings ) {
		if ( paging === 'page' ) {
			_fnDraw( settings );
		}
		// To update the data without re-sorting, re-filtering, or changing the page, the hold-order option was added.
		// This sets the ignoreSortAndFilter falg on _fnReDraw.
		else if (paging === 'hold-order') {
					_fnReDraw(settings, true, true);
		}
		else {
			if ( typeof paging === 'string' ) {
				paging = paging === 'full-hold' ?
					false :
					true;
			}

			_fnReDraw( settings, paging===false );
		}
	} );
} );

