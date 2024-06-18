

/**
 * Draw the table for the first time, adding all required features
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnInitialise ( settings )
{
	var i, iAjaxStart=settings.iInitDisplayStart;
	var init = settings.oInit;
	var deferLoading = settings.deferLoading;
	var dataSrc = _fnDataSource( settings );

	// Ensure that the table data is fully initialised
	if ( ! settings.bInitialised ) {
		setTimeout( function(){ _fnInitialise( settings ); }, 200 );
		return;
	}

	/* Build and draw the header / footer for the table */
	_fnBuildHead( settings, 'header' );
	_fnBuildHead( settings, 'footer' );
	_fnDrawHead( settings, settings.aoHeader );
	_fnDrawHead( settings, settings.aoFooter );

	// Load the table's state (if needed) and then render around it and draw draw
	_fnLoadState( settings, init, function () {
		// Local data load
		// Check if there is data passing into the constructor
		if ( init.aaData ) {
			for ( i=0 ; i<init.aaData.length ; i++ ) {
				_fnAddData( settings, init.aaData[ i ] );
			}
		}
		else if ( deferLoading || dataSrc == 'dom' ) {
			// Grab the data from the page
			_fnAddTr( settings, $(settings.nTBody).children('tr') );
		}

		// Enable features
		_fnAddOptionsHtml( settings );
		_fnSortInit( settings );

		_colGroup( settings );

		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );

		_fnCallbackFire( settings, null, 'preInit', [settings], true );

		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );

		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, {}, function(json) {
					var aData = _fnAjaxDataSrc( settings, json );

					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}

					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;

					_fnReDraw( settings );
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings );
				}, settings );
			}
			else {
				_fnInitComplete( settings );
				_fnProcessingDisplay( settings, false );
			}
		}
	} );
}


/**
 * Draw the table for the first time, adding all required features
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnInitComplete ( settings )
{
	if (settings._bInitComplete) {
		return;
	}

	var args = [settings, settings.json];

	settings._bInitComplete = true;

	// Table is fully set up and we have data, so calculate the
	// column widths
	_fnAdjustColumnSizing( settings );

	_fnCallbackFire( settings, null, 'plugin-init', args, true );
	_fnCallbackFire( settings, 'aoInitComplete', 'init', args, true );
}
