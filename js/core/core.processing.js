
/**
 * Generate the node required for the processing node
 *  @param {object} settings DataTables settings object
 */
function _processingHtml ( settings )
{
	var table = settings.nTable;

	if ( settings.oFeatures.bProcessing ) {
		var n = $('<div/>', {
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( table );
		
		$(table).on( 'processing.dt.DT', function (e, s, show) {
			n.css( 'display', show ? 'block' : 'none' );
		} );
	}
}


/**
 * Display or hide the processing indicator
 *  @param {object} settings DataTables settings object
 *  @param {bool} show Show the processing indicator (true) or not (false)
 */
function _fnProcessingDisplay ( settings, show )
{
	_fnCallbackFire( settings, null, 'processing', [settings, show] );
}
