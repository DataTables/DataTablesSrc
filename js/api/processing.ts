
import Api from "./base";
import { processingDisplay } from "../core/processing";

Api.register( 'processing()', function ( show ) {
	return this.iterator( 'table', function ( ctx ) {
		processingDisplay( ctx, show );
	} );
} );
