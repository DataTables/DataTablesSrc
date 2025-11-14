import { features, legacy as featuresLegacy } from '../features/register';
import Settings from '../model/settings';
import { check } from '../util/version';
import classes from './classes';
import pager from './paging';
import * as renderers from './renderer';
import { store } from './types';

export interface ExtOrder {
	[name: string]:
		| ((settings: Settings, colIdx: number, visIdx: number) => unknown[])
		| undefined;
}

/**
 * DataTables extensions
 *
 * This namespace acts as a collection area for plug-ins that can be used to
 * extend DataTables capabilities. Indeed many of the build in methods
 * use this method to provide their own capabilities (sorting methods for
 * example).
 *
 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
 * reasons
 */
const ext = {
	/**
	 * DataTables build type (expanded by the download builder)
	 */
	builder: '-source-',

	/**
	 * Buttons. For use with the Buttons extension for DataTables. This is
	 * defined here so other extensions can define buttons regardless of load
	 * order. It is _not_ used by DataTables core.
	 */
	buttons: {},

	/**
	 * ColumnControl buttons and content
	 */
	ccContent: {},

	/**
	 * Element class names
	 */
	classes,

	/**
	 * Error reporting.
	 *
	 * How should DataTables report an error. Can take the value 'alert',
	 * 'throw', 'none' or a function.
	 */
	errMode: 'alert',

	/** HTML entity escaping */
	escape: {
		/** When reading data-* attributes for initialisation options */
		attributes: false,
	},

	/**
	 * Legacy so v1 plug-ins don't throw js errors on load
	 */
	feature: featuresLegacy,

	/**
	 * Feature plug-ins.
	 *
	 * This is an object of callbacks which provide the features for DataTables
	 * to be initialised via the `layout` option.
	 */
	features: features,

	/**
	 * Row searching.
	 *
	 * This method of searching is complimentary to the default type based
	 * searching, and a lot more comprehensive as it allows you complete control
	 * over the searching logic. Each element in this array is a function
	 * (parameters described below) that is called for every row in the table,
	 * and your logic decides if it should be included in the searching data set
	 * or not.
	 */
	search: [],

	/**
	 * Selector extensions
	 *
	 * The `selector` option can be used to extend the options available for the
	 * selector modifier options (`selector-modifier` object data type) that
	 * each of the three built in selector types offer (row, column and cell +
	 * their plural counterparts). For example the Select extension uses this
	 * mechanism to provide an option to select only rows, columns and cells
	 * that have been marked as selected by the end user (`{selected: true}`),
	 * which can be used in conjunction with the existing built in selector
	 * options.
	 */
	selector: {
		cell: [],
		column: [],
		row: [],
	},

	settings: [] as any[],

	/**
	 * Legacy configuration options. Enable and disable legacy options that
	 * are available in DataTables.
	 *
	 *  @type object
	 */
	legacy: {
		/**
		 * Enable / disable DataTables 1.9 compatible server-side processing
		 * requests
		 */
		ajax: null,
	},

	/**
	 * Pagination plug-in methods.
	 *
	 * Each entry in this object is a function and defines which buttons should
	 * be shown by the pagination rendering method that is used for the table.
	 * The renderer addresses how the buttons are displayed in the document,
	 * while the functions here tell it what buttons to display. This is done by
	 * returning an array of button descriptions (what each button will do).
	 */
	pager: pager,

	renderer: {
		footer: {
			_: renderers.footer,
		},
		header: {
			_: renderers.header,
		},
		layout: {
			_: renderers.layout,
		},
		pagingButton: {
			_: renderers.pagingButton,
		},
		pagingContainer: {
			_: renderers.pagingContainer,
		},
	} as renderers.IRenderers,

	/**
	 * Rendering helper function exposed for use by the styling integrations.
	 */
	rendererDisplayRowCells: renderers.displayRowCells,

	/**
	 * Ordering plug-ins - custom data source
	 *
	 * The extension options for ordering of data available here is
	 * complimentary to the default type based ordering that DataTables
	 * typically uses. It allows much greater control over the data that is
	 * being used to order a column, but is necessarily therefore more complex.
	 */
	order: {} as ExtOrder,

	/**
	 * Type based plug-ins.
	 *
	 * Each column in DataTables has a type assigned to it, either by automatic
	 * detection or by direct assignment using the `type` option for the column.
	 * The type of a column will effect how it is ordering and search (plug-ins
	 * can also make use of the column type if required).
	 */
	type: store,

	/**
	 * Unique DataTables instance counter
	 *
	 * @type int
	 * @private
	 */
	_unique: 0,

	//
	// Depreciated
	// The following properties are retained for backwards compatibility only.
	// The should not be used in new projects and will be removed in a future
	// version
	//

	/**
	 * Version check function.
	 *  @type function
	 *  @depreciated Since 1.10
	 */
	fnVersionCheck: check,

	/**
	 * Index for what 'this' index API functions should use
	 *  @type int
	 *  @deprecated Since v1.10
	 */
	iApiIndex: 0,

	/**
	 * Software version
	 *  @type string
	 */
	version: '3.0.0-dev',
};

//
// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
//
Object.assign(ext, {
	afnFiltering: ext.search,
	aTypes: ext.type.detect,
	ofnSearch: ext.type.search,
	oSort: ext.type.order,
	afnSortData: ext.order,
	aoFeatures: ext.feature,
	oStdClasses: ext.classes,
	oPagination: ext.pager,
	sVersion: ext.version,
});

export default ext;
