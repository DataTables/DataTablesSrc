
import Api from "./base";
import { draw, reDraw } from "../core/draw";

/**
 * Redraw the tables in the current context.
 */
Api.register( 'draw()', function ( paging ) {
	return this.iterator( 'table', function ( settings ) {
		if ( paging === 'page' ) {
			draw( settings );
		}
		else {
			if ( typeof paging === 'string' ) {
				paging = paging === 'full-hold' ?
					false :
					true;
			}

			reDraw( settings, paging===false );
		}
	} );
} );

