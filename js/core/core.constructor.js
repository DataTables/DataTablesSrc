/*global oInit,_that,emptyInit*/
var i=0, iLen, j, jLen, k, kLen;
var sId = this.getAttribute( 'id' );
var bInitHandedOff = false;
var defaults = DataTable.defaults;


/* Sanity check */
if ( this.nodeName.toLowerCase() != 'table' )
{
	_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
	return;
}

/* Backwards compatibility for the defaults */
_fnCompatOpts( defaults );
_fnCompatCols( defaults.column );

/* Convert the camel-case defaults to Hungarian */
_fnCamelToHungarian( defaults, defaults, true );
_fnCamelToHungarian( defaults.column, defaults.column, true );

/* Setting up the initialisation object */
_fnCamelToHungarian( defaults, oInit );

/* Check to see if we are re-initialising a table */
var allSettings = DataTable.settings;
for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
{
	/* Base check on table node */
	if ( allSettings[i].nTable == this )
	{
		var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
		var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;

		if ( emptyInit || bRetrieve )
		{
			return allSettings[i].oInstance;
		}
		else if ( bDestroy )
		{
			allSettings[i].oInstance.fnDestroy();
			break;
		}
		else
		{
			_fnLog( allSettings[i], 0, 'Cannot reinitialise DataTable', 3 );
			return;
		}
	}

	/* If the element we are initialising has the same ID as a table which was previously
	 * initialised, but the table nodes don't match (from before) then we destroy the old
	 * instance by simply deleting it. This is under the assumption that the table has been
	 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
	 */
	if ( allSettings[i].sTableId == this.id )
	{
		allSettings.splice( i, 1 );
		break;
	}
}

/* Ensure the table has an ID - required for accessibility */
if ( sId === null || sId === "" )
{
	sId = "DataTables_Table_"+(DataTable.ext._unique++);
	this.id = sId;
}

/* Create the settings object for this table and set some of the default parameters */
var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
	"nTable":        this,
	"oApi":          _that.internal,
	"oInit":         oInit,
	"sDestroyWidth": $(this)[0].style.width,
	"sInstance":     sId,
	"sTableId":      sId
} );
allSettings.push( oSettings );

// Need to add the instance after the instance after the settings object has been added
// to the settings array, so we can self reference the table instance if more than one
oSettings.oInstance = (_that.length===1) ? _that : $(this).dataTable();

// Backwards compatibility, before we apply all the defaults
_fnCompatOpts( oInit );

if ( oInit.oLanguage )
{
	_fnLanguageCompat( oInit.oLanguage );
}

// If the length menu is given, but the init display length is not, use the length menu
if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
{
	oInit.iDisplayLength = $.isArray( oInit.aLengthMenu[0] ) ?
		oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
}

// Apply the defaults and init options to make a single init object will all
// options defined from defaults and instance options.
oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );


// Map the initialisation options onto the settings object
_fnMap( oSettings.oFeatures, oInit, [
	"bPaginate",
	"bLengthChange",
	"bFilter",
	"bSort",
	"bSortMulti",
	"bInfo",
	"bProcessing",
	"bAutoWidth",
	"bSortClasses",
	"bServerSide",
	"bDeferRender"
] );
_fnMap( oSettings, oInit, [
	"asStripeClasses",
	"ajax",
	"fnServerData",
	"fnFormatNumber",
	"sServerMethod",
	"aaSorting",
	"aaSortingFixed",
	"aLengthMenu",
	"sPaginationType",
	"sAjaxSource",
	"sAjaxDataProp",
	"iStateDuration",
	"sDom",
	"bSortCellsTop",
	"iTabIndex",
	"fnStateLoadCallback",
	"fnStateSaveCallback",
	"renderer",
	"searchDelay",
	[ "iCookieDuration", "iStateDuration" ], // backwards compat
	[ "oSearch", "oPreviousSearch" ],
	[ "aoSearchCols", "aoPreSearchCols" ],
	[ "iDisplayLength", "_iDisplayLength" ],
	[ "bJQueryUI", "bJUI" ]
] );
_fnMap( oSettings.oScroll, oInit, [
	[ "sScrollX", "sX" ],
	[ "sScrollXInner", "sXInner" ],
	[ "sScrollY", "sY" ],
	[ "bScrollCollapse", "bCollapse" ]
] );
_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );

/* Callback functions which are array driven */
_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );

var oClasses = oSettings.oClasses;

// @todo Remove in 1.11
if ( oInit.bJQueryUI )
{
	/* Use the JUI classes object for display. You could clone the oStdClasses object if
	 * you want to have multiple tables with multiple independent classes
	 */
	$.extend( oClasses, DataTable.ext.oJUIClasses, oInit.oClasses );

	if ( oInit.sDom === defaults.sDom && defaults.sDom === "lfrtip" )
	{
		/* Set the DOM to use a layout suitable for jQuery UI's theming */
		oSettings.sDom = '<"H"lfr>t<"F"ip>';
	}

	if ( ! oSettings.renderer ) {
		oSettings.renderer = 'jqueryui';
	}
	else if ( $.isPlainObject( oSettings.renderer ) && ! oSettings.renderer.header ) {
		oSettings.renderer.header = 'jqueryui';
	}
}
else
{
	$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
}
$(this).addClass( oClasses.sTable );

/* Calculate the scroll bar width and cache it for use later on */
if ( oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "" )
{
	oSettings.oScroll.iBarWidth = _fnScrollBarWidth();
}
if ( oSettings.oScroll.sX === true ) { // Easy initialisation of x-scrolling
	oSettings.oScroll.sX = '100%';
}

if ( oSettings.iInitDisplayStart === undefined )
{
	/* Display start point, taking into account the save saving */
	oSettings.iInitDisplayStart = oInit.iDisplayStart;
	oSettings._iDisplayStart = oInit.iDisplayStart;
}

if ( oInit.iDeferLoading !== null )
{
	oSettings.bDeferLoading = true;
	var tmp = $.isArray( oInit.iDeferLoading );
	oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
	oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
}

/* Language definitions */
if ( oInit.oLanguage.sUrl !== "" )
{
	/* Get the language definitions from a file - because this Ajax call makes the language
	 * get async to the remainder of this function we use bInitHandedOff to indicate that
	 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
	 */
	oSettings.oLanguage.sUrl = oInit.oLanguage.sUrl;
	$.getJSON( oSettings.oLanguage.sUrl, null, function( json ) {
		_fnLanguageCompat( json );
		_fnCamelToHungarian( defaults.oLanguage, json );
		$.extend( true, oSettings.oLanguage, oInit.oLanguage, json );
		_fnInitialise( oSettings );
	} );
	bInitHandedOff = true;
}
else
{
	$.extend( true, oSettings.oLanguage, oInit.oLanguage );
}


/*
 * Stripes
 */
if ( oInit.asStripeClasses === null )
{
	oSettings.asStripeClasses =[
		oClasses.sStripeOdd,
		oClasses.sStripeEven
	];
}

/* Remove row stripe classes if they are already on the table row */
var stripeClasses = oSettings.asStripeClasses;
var rowOne = $('tbody tr:eq(0)', this);
if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
	return rowOne.hasClass(el);
} ) ) !== -1 ) {
	$('tbody tr', this).removeClass( stripeClasses.join(' ') );
	oSettings.asDestroyStripes = stripeClasses.slice();
}

/*
 * Columns
 * See if we should load columns automatically or use defined ones
 */
var anThs = [];
var aoColumnsInit;
var nThead = this.getElementsByTagName('thead');
if ( nThead.length !== 0 )
{
	_fnDetectHeader( oSettings.aoHeader, nThead[0] );
	anThs = _fnGetUniqueThs( oSettings );
}

/* If not given a column array, generate one with nulls */
if ( oInit.aoColumns === null )
{
	aoColumnsInit = [];
	for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
	{
		aoColumnsInit.push( null );
	}
}
else
{
	aoColumnsInit = oInit.aoColumns;
}

/* Add the columns */
for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
{
	_fnAddColumn( oSettings, anThs ? anThs[i] : null );
}

/* Apply the column definitions */
_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
	_fnColumnOptions( oSettings, iCol, oDef );
} );

/* HTML5 attribute detection - build an mData object automatically if the
 * attributes are found
 */
if ( rowOne.length ) {
	var a = function ( cell, name ) {
		return cell.getAttribute( 'data-'+name ) ? name : null;
	};

	$.each( _fnGetRowElements( oSettings, rowOne[0] ).cells, function (i, cell) {
		var col = oSettings.aoColumns[i];

		if ( col.mData === i ) {
			var sort = a( cell, 'sort' ) || a( cell, 'order' );
			var filter = a( cell, 'filter' ) || a( cell, 'search' );

			if ( sort !== null || filter !== null ) {
				col.mData = {
					_:      i+'.display',
					sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
					type:   sort !== null   ? i+'.@data-'+sort   : undefined,
					filter: filter !== null ? i+'.@data-'+filter : undefined
				};

				_fnColumnOptions( oSettings, i );
			}
		}
	} );
}

var features = oSettings.oFeatures;

/* Must be done after everything which can be overridden by the state saving! */
if ( oInit.bStateSave )
{
	features.bStateSave = true;
	_fnLoadState( oSettings, oInit );
	_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
}


/*
 * Sorting
 * @todo For modularisation (1.11) this needs to do into a sort start up handler
 */

// If aaSorting is not defined, then we use the first indicator in asSorting
// in case that has been altered, so the default sort reflects that option
if ( oInit.aaSorting === undefined )
{
	var sorting = oSettings.aaSorting;
	for ( i=0, iLen=sorting.length ; i<iLen ; i++ )
	{
		sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
	}
}

/* Do a first pass on the sorting classes (allows any size changes to be taken into
 * account, and also will apply sorting disabled classes if disabled
 */
_fnSortingClasses( oSettings );

if ( features.bSort )
{
	_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
		if ( oSettings.bSorted ) {
			var aSort = _fnSortFlatten( oSettings );
			var sortedColumns = {};

			$.each( aSort, function (i, val) {
				sortedColumns[ val.src ] = val.dir;
			} );

			_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
			_fnSortAria( oSettings );
		}
	} );
}

_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
	if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
		_fnSortingClasses( oSettings );
	}
}, 'sc' );


/*
 * Final init
 * Cache the header, body and footer as required, creating them if needed
 */

/* Browser support detection */
_fnBrowserDetect( oSettings );

// Work around for Webkit bug 83867 - store the caption-side before removing from doc
var captions = $(this).children('caption').each( function () {
	this._captionSide = $(this).css('caption-side');
} );

var thead = $(this).children('thead');
if ( thead.length === 0 )
{
	thead = $('<thead/>').appendTo(this);
}
oSettings.nTHead = thead[0];

var tbody = $(this).children('tbody');
if ( tbody.length === 0 )
{
	tbody = $('<tbody/>').appendTo(this);
}
oSettings.nTBody = tbody[0];

var tfoot = $(this).children('tfoot');
if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") )
{
	// If we are a scrolling table, and no footer has been given, then we need to create
	// a tfoot element for the caption element to be appended to
	tfoot = $('<tfoot/>').appendTo(this);
}

if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
	$(this).addClass( oClasses.sNoFooter );
}
else if ( tfoot.length > 0 ) {
	oSettings.nTFoot = tfoot[0];
	_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
}

/* Check if there is data passing into the constructor */
if ( oInit.aaData )
{
	for ( i=0 ; i<oInit.aaData.length ; i++ )
	{
		_fnAddData( oSettings, oInit.aaData[ i ] );
	}
}
else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' )
{
	/* Grab the data from the page - only do this when deferred loading or no Ajax
	 * source since there is no point in reading the DOM data if we are then going
	 * to replace it with Ajax data
	 */
	_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
}

/* Copy the data index array */
oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();

/* Initialisation complete - table can be drawn */
oSettings.bInitialised = true;

/* Check if we need to initialise the table (it might not have been handed off to the
 * language processor)
 */
if ( bInitHandedOff === false )
{
	_fnInitialise( oSettings );
}
