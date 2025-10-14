
import { implementState, saveState } from "../core/state";
import Api from "./base";

/*
 * State API methods
 */

Api.register( 'state()', function ( set, ignoreTime ) {
	// getter
	if ( ! set ) {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	}

	var setMutate = $.extend( true, {}, set );

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
