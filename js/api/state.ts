
import { implementState, saveState } from "../core/state";
import { StateLoad } from "../model/state";
import * as object from '../util/object';
import Api from "./Api";

declare module './Api' {
	interface Api {
		state: any;
	}
}

/*
 * State API methods
 */

Api.register( 'state()', function ( set: StateLoad, ignoreTime ) {
	// getter
	if ( ! set ) {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	}

	var setMutate = object.assignDeep<StateLoad>( {}, set );

	// setter
	return this.iterator( 'table', function ( settings ) {
		if ( ignoreTime !== false ) {
			setMutate.time = +new Date() + 100;
		}

		implementState( settings, setMutate, function(){} );
	} );
} );


Api.register( 'state.clear()', function () {
	return this.iterator( 'table', function ( settings ) {
		// Save an empty object
		settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
	} );
} );


Api.register( 'state.loaded()', function () {
	return this.context.length ?
		this.context[0].oLoadedState :
		null;
} );


Api.register( 'state.save()', function () {
	return this.iterator( 'table', function ( settings ) {
		saveState( settings );
	} );
} );
