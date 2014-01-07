
function numberFormat( data ) {
	var s=(data+""), a=s.split(""), out="", iLen=s.length;
	
	for ( var i=0 ; i<iLen ; i++ ) {
		if ( i%3 === 0 && i !== 0 ) {
			out = ','+out;
		}
		out = a[iLen-i-1]+out;
	}
	return out;
}


function dateFormat( d ) {
	var out = "";

	switch( d.getDay() ) {
		case 0: out += "Sunday "; break;
		case 1: out += "Monday "; break;
		case 2: out += "Tuesday "; break;
		case 3: out += "Wednesday "; break;
		case 4: out += "Thursday "; break;
		case 5: out += "Friday "; break;
		case 6: out += "Saturday "; break;
		default: break;
	}

	switch( d.getMonth() ) {
		case 0: out += "January "; break;
		case 1: out += "February "; break;
		case 2: out += "March "; break;
		case 3: out += "April "; break;
		case 4: out += "May "; break;
		case 5: out += "June "; break;
		case 6: out += "July "; break;
		case 7: out += "August "; break;
		case 8: out += "September "; break;
		case 9: out += "October "; break;
		case 10: out += "November "; break;
		case 11: out += "December "; break;
		default: break;
	}

	switch( d.getDate() ) {
		case 1: out += "st "; break;
		case 2: out += "nd "; break;
		case 3: out += "rd "; break;
		default: out += "th "; break;
	}
	
	return out;
}


/* Table initialisation */
$(document).ready(function() {
	$('#example').dataTable( {
		"aoColumnDefs": [
			{
				"aTargets": [ 1 ],
				"mDataProp": function ( data, type, val ) {
					if (type === 'set') {
						// Store the base value which is in the format: 1 Xx Xxx Xxxx-xxxx
						data.phone = val;
				
						// Sorting is done as an integer value - so strip all non-numeric data
						data.phone_int = val.replace( /[^\d\-\.]/g, "" );
				
						// Filtering can occur on the formatted number, or the value alone
						data.phone_filter  = data.phone_int +' '+ val;
						return;
					}
					else if (type === 'filter') {
						return data.phone_filter ;
					}
					else if (type === 'sort' || type === 'type') {
						return data.phone_int;
					}
					// Display type gets the original data
					return data.phone;
				}
			},
			{
				"aTargets": [ 2 ],
				"mDataProp": function ( data, type, val ) {
					if (type === 'set') {
						// Store the base value which is an integer value
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
			},
			{
				"aTargets": [ 3 ],
				"mDataProp": function ( data, type, val ) {
					if (type === 'set') {
						var d = new Date(val);

						// Store the base value which is in the format: YYYY/MM/DD
						data.date = val;
				
						// Sorting is done as an integer value
						data.date_int = d.getTime();
				
						// Use date formatting function to build the date
						data.date_filter  = val +' '+ dateFormat( d );
						return;
					}
					else if (type === 'filter') {
						return data.date_filter ;
					}
					else if (type === 'sort' || type === 'type') {
						return data.date_int;
					}
					// Display type gets the original data
					return data.date;
				}
			}
		]
	} );
} );
