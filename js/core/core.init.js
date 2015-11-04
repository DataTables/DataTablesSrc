

/**
 * Draw the table for the first time, adding all required features
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnInitialise ( settings )
{
	var i, iLen, iAjaxStart=settings.iInitDisplayStart;
	var columns = settings.aoColumns, column;
	var features = settings.oFeatures;
	var deferLoading = settings.bDeferLoading; // value modified by the draw

	/* Ensure that the table data is fully initialised */
	if ( ! settings.bInitialised ) {
		setTimeout( function(){ _fnInitialise( settings ); }, 200 );
		return;
	}

	/* Show the display HTML options */
	_fnAddOptionsHtml( settings );

	/* Build and draw the header / footer for the table */
	_fnBuildHead( settings );
	_fnDrawHead( settings, settings.aoHeader );
	_fnDrawHead( settings, settings.aoFooter );

	/* Okay to show that something is going on now */
	_fnProcessingDisplay( settings, true );

	/* Calculate sizes for columns */
	if ( features.bAutoWidth ) {
		_fnCalculateColumnWidths( settings );
	}

	for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
		column = columns[i];

		if ( column.sWidth ) {
			column.nTh.style.width = _fnStringToCss( column.sWidth );
		}
	}

	_fnCallbackFire( settings, null, 'preInit', [settings] );

	// If there is default sorting required - let's do it. The sort function
	// will do the drawing for us. Otherwise we draw the table regardless of the
	// Ajax source - this allows the table to look initialised for Ajax sourcing
	// data (show 'loading' message possibly)
	_fnReDraw( settings );

	// Server-side processing init complete is done by _fnAjaxUpdateDraw
	var dataSrc = _fnDataSource( settings );
	if ( dataSrc != 'ssp' || deferLoading ) {
		// if there is an ajax source load the data
		if ( dataSrc == 'ajax' ) {
			_fnBuildAjax( settings, [], function(json) {
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
				_fnInitComplete( settings, json );
			}, settings );
		}
		else {
			_fnProcessingDisplay( settings, false );
			_fnInitComplete( settings );
		}
	}
}


/**
 * Draw the table for the first time, adding all required features
 *  @param {object} oSettings dataTables settings object
 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
 *    with client-side processing (optional)
 *  @memberof DataTable#oApi
 */
function _fnInitComplete ( settings, json )
{
	settings._bInitComplete = true;

	// When data was added after the initialisation (data or Ajax) we need to
	// calculate the column sizing
	if ( json || settings.oInit.aaData ) {
		_fnAdjustColumnSizing( settings );
	}

	_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
	_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
}

