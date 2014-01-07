
function numberFormat( data ) {
	if ( data < 1000 ) {
		// A small optimisation for what is likely to be the majority of use cases
		return data;
	}

	var s=(data+""), a=s.split(""), out="", iLen=s.length;
	
	for ( var i=0 ; i<iLen ; i++ ) {
		if ( i%3 === 0 && i !== 0 ) {
			out = ','+out;
		}
		out = a[iLen-i-1]+out;
	}
	return out;
}


/* Table initialisation */
$(document).ready(function() {
	$('#example').dataTable( {
		"aoColumnDefs": [ {
			"aTargets": [ -1 ],
			"mDataProp": function ( data, type, val ) {
				if (type === 'set') {
					// Store the base value
					data.price = val;
			
					// Display is formatted with a dollar sign and number formatting
					data.price_display = val==="" ? "" : "$"+numberFormat(val);
			
					// Filtering can occur on the formatted number, or the value alone
					data.price_filter  = val==="" ? "" : data.price_display+" "+val;
					return;
				}
				else if (type === 'display') {
					return data.price_display;
				}
				else if (type === 'filter') {
					return data.price_filter;
				}
				// 'sort', 'type' and undefined all just use the integer
				return data.price;
			}
		} ]
	} );
} );
