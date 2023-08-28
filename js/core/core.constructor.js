/*global oInit,_that,emptyInit*/
var i=0, iLen, j, jLen, k, kLen;
var sId = this.getAttribute( 'id' );
var bInitHandedOff = false;
var defaults = DataTable.defaults;
var $this = $(this);


/* Sanity check */
if ( this.nodeName.toLowerCase() != 'table' )
{
	_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
	return;
}

$(this).trigger( 'options.dt', oInit );

/* Backwards compatibility for the defaults */
_fnCompatOpts( defaults );
_fnCompatCols( defaults.column );

/* Convert the camel-case defaults to Hungarian */
_fnCamelToHungarian( defaults, defaults, true );
_fnCamelToHungarian( defaults.column, defaults.column, true );

/* Setting up the initialisation object */
_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ), true );



/* Check to see if we are re-initialising a table */
var allSettings = DataTable.settings;
for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
{
	var s = allSettings[i];

	/* Base check on table node */
	if (
		s.nTable == this ||
		(s.nTHead && s.nTHead.parentNode == this) ||
		(s.nTFoot && s.nTFoot.parentNode == this)
	) {
		var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
		var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;

		if ( emptyInit || bRetrieve )
		{
			return s.oInstance;
		}
		else if ( bDestroy )
		{
			new DataTable.Api(s).destroy();
			break;
		}
		else
		{
			_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
			return;
		}
	}

	/* If the element we are initialising has the same ID as a table which was previously
	 * initialised, but the table nodes don't match (from before) then we destroy the old
	 * instance by simply deleting it. This is under the assumption that the table has been
	 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
	 */
	if ( s.sTableId == this.id )
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
	"sDestroyWidth": $this[0].style.width,
	"sInstance":     sId,
	"sTableId":      sId
} );
oSettings.nTable = this;
oSettings.oApi   = _that.internal;
oSettings.oInit  = oInit;

allSettings.push( oSettings );

// Make a single API instance available for internal handling
oSettings.api = new _Api( oSettings );

// Need to add the instance after the instance after the settings object has been added
// to the settings array, so we can self reference the table instance if more than one
oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();

// Backwards compatibility, before we apply all the defaults
_fnCompatOpts( oInit );
_fnLanguageCompat( oInit.oLanguage );

// If the length menu is given, but the init display length is not, use the length menu
if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
{
	oInit.iDisplayLength = Array.isArray(oInit.aLengthMenu[0])
		? oInit.aLengthMenu[0][0]
		: $.isPlainObject( oInit.aLengthMenu[0] )
			? oInit.aLengthMenu[0].value
			: oInit.aLengthMenu[0];
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
	"ajax",
	"fnFormatNumber",
	"sServerMethod",
	"aaSorting",
	"aaSortingFixed",
	"aLengthMenu",
	"sPaginationType",
	"iStateDuration",
	"sDom",
	"bSortCellsTop",
	"iTabIndex",
	"fnStateLoadCallback",
	"fnStateSaveCallback",
	"renderer",
	"searchDelay",
	"rowId",
	"caption",
	"layout",
	[ "iCookieDuration", "iStateDuration" ], // backwards compat
	[ "oSearch", "oPreviousSearch" ],
	[ "aoSearchCols", "aoPreSearchCols" ],
	[ "iDisplayLength", "_iDisplayLength" ]
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
_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );

oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );

/* Browser support detection */
_fnBrowserDetect( oSettings );

var oClasses = oSettings.oClasses;

$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
$this.addClass( oClasses.sTable );

if (! oSettings.oFeatures.bPaginate) {
	oInit.iDisplayStart = 0;
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
	var tmp = Array.isArray( oInit.iDeferLoading );
	oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
	oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
}

/* Language definitions */
var oLanguage = oSettings.oLanguage;
$.extend( true, oLanguage, oInit.oLanguage );

if ( oLanguage.sUrl )
{
	/* Get the language definitions from a file - because this Ajax call makes the language
	 * get async to the remainder of this function we use bInitHandedOff to indicate that
	 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
	 */
	$.ajax( {
		dataType: 'json',
		url: oLanguage.sUrl,
		success: function ( json ) {
			_fnCamelToHungarian( defaults.oLanguage, json );
			_fnLanguageCompat( json );
			$.extend( true, oLanguage, json, oSettings.oInit.oLanguage );

			_fnCallbackFire( oSettings, null, 'i18n', [oSettings]);
			_fnInitialise( oSettings );
		},
		error: function () {
			// Error occurred loading language file
			_fnLog( oSettings, 0, 'i18n file loading error', 21 );

			// continue on as best we can
			_fnInitialise( oSettings );
		}
	} );
	bInitHandedOff = true;
}
else {
	_fnCallbackFire( oSettings, null, 'i18n', [oSettings]);
}

/*
 * Columns
 * See if we should load columns automatically or use defined ones
 */
var columnsInit = [];
var thead = this.getElementsByTagName('thead');
var initHeaderLayout = _fnDetectHeader( oSettings, thead[0] );

// If we don't have a columns array, then generate one with nulls
if ( oInit.aoColumns ) {
	columnsInit = oInit.aoColumns;
}
else if ( initHeaderLayout.length ) {
	for ( i=0, iLen=initHeaderLayout[0].length ; i<iLen ; i++ ) {
		columnsInit.push( null );
	}
}

// Add the columns
for ( i=0, iLen=columnsInit.length ; i<iLen ; i++ ) {
	_fnAddColumn( oSettings );
}

// Apply the column definitions
_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, columnsInit, initHeaderLayout, function (iCol, oDef) {
	_fnColumnOptions( oSettings, iCol, oDef );
} );

/* HTML5 attribute detection - build an mData object automatically if the
 * attributes are found
 */
var rowOne = $this.children('tbody').find('tr').eq(0);

if ( rowOne.length ) {
	var a = function ( cell, name ) {
		return cell.getAttribute( 'data-'+name ) !== null ? name : null;
	};

	$( rowOne[0] ).children('th, td').each( function (i, cell) {
		var col = oSettings.aoColumns[i];

		if (! col) {
			_fnLog( oSettings, 0, 'Incorrect column count', 18 );
		}

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
				col._isArrayHost = true;

				_fnColumnOptions( oSettings, i );
			}
		}
	} );
}

var features = oSettings.oFeatures;
var loadedInit = function () {
	/*
	 * Sorting
	 * @todo For modularisation (1.11) this needs to do into a sort start up handler
	 */

	// If aaSorting is not defined, then we use the first indicator in asSorting
	// in case that has been altered, so the default sort reflects that option
	if ( oInit.aaSorting === undefined ) {
		var sorting = oSettings.aaSorting;
		for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
			sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
		}
	}

	/* Do a first pass on the sorting classes (allows any size changes to be taken into
	 * account, and also will apply sorting disabled classes if disabled
	 */
	_fnSortingClasses( oSettings );

	_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
		if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
			_fnSortingClasses( oSettings );
		}
	}, 'sc' );


	/*
	 * Final init
	 * Cache the header, body and footer as required, creating them if needed
	 */
	var caption = $this.children('caption');

	if ( oSettings.caption ) {
		if ( caption.length === 0 ) {
			caption = $('<caption/>').appendTo( $this );
		}

		caption.html( oSettings.caption );
	}

	// Store the caption side, so we can remove the element from the document
	// when creating the element
	if (caption.length) {
		caption[0]._captionSide = caption.css('caption-side');
		oSettings.captionNode = caption[0];
	}

	if ( thead.length === 0 ) {
		thead = $('<thead/>').appendTo($this);
	}
	oSettings.nTHead = thead[0];

	var tbody = $this.children('tbody');
	if ( tbody.length === 0 ) {
		tbody = $('<tbody/>').insertAfter(thead);
	}
	oSettings.nTBody = tbody[0];

	var tfoot = $this.children('tfoot');
	if ( tfoot.length === 0 ) {
		// If we are a scrolling table, and no footer has been given, then we need to create
		// a tfoot element for the caption element to be appended to
		tfoot = $('<tfoot/>').appendTo($this);
	}
	oSettings.nTFoot = tfoot[0];

	/* Check if there is data passing into the constructor */
	if ( oInit.aaData ) {
		for ( i=0 ; i<oInit.aaData.length ; i++ ) {
			_fnAddData( oSettings, oInit.aaData[ i ] );
		}
	}
	else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {
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
	if ( bInitHandedOff === false ) {
		_fnInitialise( oSettings );
	}
};

/* Must be done after everything which can be overridden by the state saving! */
_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );

if ( oInit.bStateSave )
{
	features.bStateSave = true;
	_fnLoadState( oSettings, oInit, loadedInit );
}
else {
	loadedInit();
}

