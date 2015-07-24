

/**
 * Redraw the tables in the current context.
 */
_api_register( 'draw()', function ( paging ) {
	return this.iterator( 'table', function ( settings ) {
		if ( paging === 'page' ) {
			_fnDraw( settings );
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

