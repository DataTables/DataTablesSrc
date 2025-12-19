import { Dom } from '../../dom';
import { GetFunction, SetFunction } from '../../util/types';
import { SearchInput } from '../search';

/**
 * Internal settings object used for individual columns. Instances are held in
 * the setting object's `columns` array and contains all the information that
 * DataTables needs about each individual column.
 *
 * Note that this object is related to the column defaults but this one is the
 * internal data store for DataTables's cache of columns. It should NOT be
 * manipulated outside of DataTables. Any configuration should be done through
 * the initialisation options.
 */
export default class Settings {
	public _isArrayHost: boolean;

	/**
	 * Flag to indicate if HTML5 data attributes should be used as the data
	 * source for filtering or sorting. True is either are.
	 */
	public attrSrc: boolean = false;

	public ariaTitle: string | null = '';

	public autoTitle: boolean;

	public cellType: string;

	/**
	 * The class to apply to all cells in the table's `tbody`` for the column
	 */
	public className: string | null = null;

	public colEl: Dom<HTMLTableColElement>;

	/**
	 * When DataTables calculates the column widths to assign to each column, it
	 * finds the longest string in each column and then constructs a temporary
	 * table and reads the widths from that. The problem with this is that "mmm"
	 * is much wider then "iiii", but the latter is a longer string - thus the
	 * calculation can go wrong (doing it properly and putting it into an DOM
	 * object and measuring that is horribly(!) slow). Thus as a "work around"
	 * we provide this option. It will append its value to the text that is
	 * found to be the longest string for the column - i.e. padding.
	 */
	public contentPadding: string | null = null;

	/**
	 * Developer definable function that is called whenever a cell is created
	 * (Ajax source, etc) or processed for input (DOM source). This can be used
	 * as a compliment to `render` allowing you to modify the DOM element (add
	 * background colour for example) when the element is available.
	 */
	public createdCell: (
		cell: HTMLTableCellElement,
		cellData: any,
		rowData: any,
		rowIndex: number,
		colIdx: number
	) => void;

	/**
	 * Property to read the value for the cells in the column from the data
	 * source array / object. If null, then the default content is used, if a
	 * function is given then the return from the function is used.
	 */
	public data: any = null;

	/**
	 * Function to get data from a cell in a column. You should <b>never</b>
	 * access data directly through `data` internally in DataTables - always use
	 * the method attached to this property. It allows mData to function as
	 * required. This function is automatically assigned by the column
	 * initialisation method
	 */
	public dataGet: (rowData: any, type: string | undefined, meta: any) => any;

	/**
	 * Function to set data for a cell in the column. You should <b>never</b>
	 * set the data directly to `data` internally in DataTables - always use
	 * this method. It allows mData to function as required. This function is
	 * automatically assigned by the column initialisation method
	 */
	public dataSet: (rowData: any, val: any, meta: any) => any;

	/**
	 * Allows a default value to be given for a column's data, and will be used
	 * whenever a null data source is encountered (this can be because mData is
	 * set to null, or because the data source itself is null).
	 */
	public defaultContent: string | null = null;

	public footer: string;

	/**
	 * Column index.
	 */
	public idx = null;

	/**
	 * Name for the column, allowing reference to the column by name as well as
	 * by index (needs a lookup to work by name).
	 */
	public name: string | null = null;

	/**
	 * Sorting enablement flag.
	 */
	public orderable: boolean;

	/**
	 * A list of the columns that sorting should occur on when this column is
	 * sorted. That this property is an array allows multi-column sorting to be
	 * defined for a column (for example first name / last name columns would
	 * benefit from this). The values are integers pointing to the columns to be
	 * sorted on (typically it will be a single integer pointing at itself, but
	 * that doesn't need to be the case).
	 */
	public orderData: number[] = [];

	/**
	 * Custom sorting data type - defines which of the available plug-ins in
	 * afnSortData the custom sorting will use - if any is defined.
	 */
	public orderDataType: string = 'std';

	/**
	 * Class to be applied to the header element when sorting on this column
	 */
	public orderingClass: string | null = null;

	/**
	 * Define the sorting directions that are applied to the column, in sequence
	 * as the column is repeatedly sorted upon - i.e. the first value is used as
	 * the sorting direction when the column if first sorted (clicked on). Sort
	 * it again (click again) and it will move on to the next index. Repeat
	 * until loop.
	 */
	public orderSequence: string[] = [];

	/**
	 * Partner property to mData which is used (only when defined) to get the
	 * data - i.e. it is basically the same as mData, but without the 'set'
	 * option, and also the data fed to it is the result from mData. This is the
	 * rendering method to match the data method of mData.
	 */
	public render: any = null;

	public renderer: GetFunction | null;

	/**
	 * Flag to indicate if the column is searchable, and thus should be included
	 * in the filtering or not.
	 */
	public searchable: boolean;

	/**
	 * Store for named searches
	 */
	public searchFixed: { [name: string]: SearchInput } = {};

	public setter: SetFunction | null;

	/**
	 * Title of the column - what is seen in the TH element (nTh).
	 */
	public title: string | null = null;

	/**
	 * Column sorting and filtering type
	 */
	public type: string | null;

	/**
	 * Store for manual type assignment using the `column.type` option. This
	 * is held in store so we can manipulate the column's `type` property.
	 */
	public typeManual: string | null = null;

	/**
	 * Flag to indicate if the column is currently visible in the table or not
	 */
	public visible: boolean;

	/** Cached longest strings from a column */
	public wideStrings: string[] | null = null;

	/**
	 * Width of the column
	 */
	public width: string | null = null;

	/**
	 * Width of the column when it was first "encountered"
	 */
	public widthOrig: string | null = null;
}
