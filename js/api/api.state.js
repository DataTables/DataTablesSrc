/*
 * State API methods
 */

_api_register( 'state()', function ( set, ignoreTime ) {
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

		_fnImplementState( settings, setMutate, function(){} );
	} );
} );


_api_register( 'state.clear()', function () {
	return this.iterator( 'table', function ( settings ) {
		// Save an empty object
		settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
	} );
} );


_api_register( 'state.loaded()', function () {
	return this.context.length ?
		this.context[0].oLoadedState :
		null;
} );


_api_register( 'state.save()', function () {
	return this.iterator( 'table', function ( settings ) {
		_fnSaveState( settings );
	} );
} );
