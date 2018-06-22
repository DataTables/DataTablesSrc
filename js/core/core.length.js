
function _fnLengthChange ( settings, val )
{
	var len = parseInt( val, 10 );
	settings._iDisplayLength = len;

	_fnLengthOverflow( settings );

	// Fire length change event
	_fnCallbackFire( settings, null, 'length', [settings, len] );
}
