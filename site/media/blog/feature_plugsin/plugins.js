
(function($, window, document) {


$.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
{
  return {
    "iStart":         oSettings._iDisplayStart,
    "iEnd":           oSettings.fnDisplayEnd(),
    "iLength":        oSettings._iDisplayLength,
    "iTotal":         oSettings.fnRecordsTotal(),
    "iFilteredTotal": oSettings.fnRecordsDisplay(),
    "iPage":          Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
    "iTotalPages":    Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
  };
}

var DT_PagingControl = function ( oDTSettings )
{
  	oDTSettings.aoDrawCallback.push( {
			"fn": function () {
			  var bShow = oDTSettings.oInstance.fnPagingInfo().iTotalPages > 1;
			  for ( var i=0, iLen=oDTSettings.aanFeatures.p.length ; i<iLen ; i++ ) {
			    oDTSettings.aanFeatures.p[i].style.display = bShow ? "block" : "none";
		    }
			},
			"sName": "PagingControl"
		} );
}

if ( typeof $.fn.dataTable == "function" &&
     typeof $.fn.dataTableExt.fnVersionCheck == "function" &&
     $.fn.dataTableExt.fnVersionCheck('1.8.0') )
{
	$.fn.dataTableExt.aoFeatures.push( {
		"fnInit": function( oDTSettings ) {
		  new DT_PagingControl( oDTSettings );
		},
		"cFeature": "P",
		"sFeature": "PagingControl"
	} );
}
else
{
	alert( "Warning: PagingControl requires DataTables 1.8.0 or greater - www.datatables.net/download");
}


})(jQuery, window, document);


$(document).ready(function() {
	$('#featuresplugin').dataTable( {
	  "sDom": "lfrtipP"
	} );
} );