
/*
 * This is really a good bit rubbish this method of exposing the internal methods
 * publicly... - To be fixed in 2.0 using methods on the prototype
 */


/**
 * Create a wrapper function for exporting an internal functions to an external API.
 *  @param {string} fn API function name
 *  @returns {function} wrapped function
 *  @memberof DataTable#internal
 */
function _fnExternApiFunc (fn)
{
	return function() {
		var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
			Array.prototype.slice.call(arguments)
		);
		return DataTable.ext.internal[fn].apply( this, args );
	};
}


/**
 * Reference to internal functions for use by plug-in developers. Note that
 * these methods are references to internal functions and are considered to be
 * private. If you use these methods, be aware that they are liable to change
 * between versions.
 *  @namespace
 */
$.extend( DataTable.ext.internal, {
	_fnExternApiFunc: _fnExternApiFunc,
	_fnBuildAjax: _fnBuildAjax,
	_fnAjaxUpdate: _fnAjaxUpdate,
	_fnAjaxParameters: _fnAjaxParameters,
	_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
	_fnAjaxDataSrc: _fnAjaxDataSrc,
	_fnAddColumn: _fnAddColumn,
	_fnColumnOptions: _fnColumnOptions,
	_fnAdjustColumnSizing: _fnAdjustColumnSizing,
	_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
	_fnColumnIndexToVisible: _fnColumnIndexToVisible,
	_fnVisbleColumns: _fnVisbleColumns,
	_fnGetColumns: _fnGetColumns,
	_fnColumnTypes: _fnColumnTypes,
	_fnApplyColumnDefs: _fnApplyColumnDefs,
	_fnHungarianMap: _fnHungarianMap,
	_fnCamelToHungarian: _fnCamelToHungarian,
	_fnLanguageCompat: _fnLanguageCompat,
	_fnBrowserDetect: _fnBrowserDetect,
	_fnAddData: _fnAddData,
	_fnAddTr: _fnAddTr,
	_fnNodeToDataIndex: _fnNodeToDataIndex,
	_fnNodeToColumnIndex: _fnNodeToColumnIndex,
	_fnGetCellData: _fnGetCellData,
	_fnSetCellData: _fnSetCellData,
	_fnSplitObjNotation: _fnSplitObjNotation,
	_fnGetObjectDataFn: _fnGetObjectDataFn,
	_fnSetObjectDataFn: _fnSetObjectDataFn,
	_fnGetDataMaster: _fnGetDataMaster,
	_fnClearTable: _fnClearTable,
	_fnDeleteIndex: _fnDeleteIndex,
	_fnInvalidate: _fnInvalidate,
	_fnGetRowElements: _fnGetRowElements,
	_fnCreateTr: _fnCreateTr,
	_fnBuildHead: _fnBuildHead,
	_fnDrawHead: _fnDrawHead,
	_fnDraw: _fnDraw,
	_fnReDraw: _fnReDraw,
	_fnAddOptionsHtml: _fnAddOptionsHtml,
	_fnDetectHeader: _fnDetectHeader,
	_fnGetUniqueThs: _fnGetUniqueThs,
	_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
	_fnFilterComplete: _fnFilterComplete,
	_fnFilterCustom: _fnFilterCustom,
	_fnFilterColumn: _fnFilterColumn,
	_fnFilter: _fnFilter,
	_fnFilterCreateSearch: _fnFilterCreateSearch,
	_fnEscapeRegex: _fnEscapeRegex,
	_fnFilterData: _fnFilterData,
	_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
	_fnUpdateInfo: _fnUpdateInfo,
	_fnInfoMacros: _fnInfoMacros,
	_fnInitialise: _fnInitialise,
	_fnInitComplete: _fnInitComplete,
	_fnLengthChange: _fnLengthChange,
	_fnFeatureHtmlLength: _fnFeatureHtmlLength,
	_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
	_fnPageChange: _fnPageChange,
	_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
	_fnProcessingDisplay: _fnProcessingDisplay,
	_fnFeatureHtmlTable: _fnFeatureHtmlTable,
	_fnScrollDraw: _fnScrollDraw,
	_fnApplyToChildren: _fnApplyToChildren,
	_fnCalculateColumnWidths: _fnCalculateColumnWidths,
	_fnThrottle: _fnThrottle,
	_fnConvertToWidth: _fnConvertToWidth,
	_fnScrollingWidthAdjust: _fnScrollingWidthAdjust,
	_fnGetWidestNode: _fnGetWidestNode,
	_fnGetMaxLenString: _fnGetMaxLenString,
	_fnStringToCss: _fnStringToCss,
	_fnScrollBarWidth: _fnScrollBarWidth,
	_fnSortFlatten: _fnSortFlatten,
	_fnSort: _fnSort,
	_fnSortAria: _fnSortAria,
	_fnSortListener: _fnSortListener,
	_fnSortAttachListener: _fnSortAttachListener,
	_fnSortingClasses: _fnSortingClasses,
	_fnSortData: _fnSortData,
	_fnSaveState: _fnSaveState,
	_fnLoadState: _fnLoadState,
	_fnSettingsFromNode: _fnSettingsFromNode,
	_fnLog: _fnLog,
	_fnMap: _fnMap,
	_fnBindAction: _fnBindAction,
	_fnCallbackReg: _fnCallbackReg,
	_fnCallbackFire: _fnCallbackFire,
	_fnLengthOverflow: _fnLengthOverflow,
	_fnRenderer: _fnRenderer,
	_fnDataSource: _fnDataSource,
	_fnRowAttributes: _fnRowAttributes,
	_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
	                                // in 1.10, so this dead-end function is
	                                // added to prevent errors
} );

