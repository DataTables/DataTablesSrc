
function _fnLengthChange ( settings, val )
{
	// val: is coming directily from the dom 
	var len = parseInt(val, 10),
	    //Add a way to prevent end user from changing the lengthMenu value in the dom
	    menu = settings.aLengthMenu,
	    d2 = Array.isArray(menu[0]),
	    originalLengths = d2 ? menu[0] : menu;
	// if the value is not in the original values when initiating the data table then choose the min value
	// this will be of use when using ssp whith large tables where you want to make sure that there is a LIMIT restriction
	settings._iDisplayLength = originalLengths.includes(len) ? len : Math.min(...originalLengths);

	_fnLengthOverflow( settings );

	// Fire length change event
	_fnCallbackFire( settings, null, 'length', [settings, len] );
}
