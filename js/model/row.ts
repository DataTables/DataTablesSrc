import { Dom } from '../dom';
import util from '../util';

/**
 * Structure used to store information about each individual row in DataTables
 */
export interface Row {
	/**  TR element for the row */
	nTr: TableRowElement | null;

	/** Array of cells for each row */
	anCells: Array<TableCellElement>;

	/**
	 * Data object from the original data source for the row. This is either
	 * an array if using the traditional form of DataTables, or an object if
	 * using mData options. The exact type will depend on the passed in
	 * data from the data source, or will be an array if using DOM a data
	 * source.
	 */
	_aData: any;

	/**
	 * Sorting data cache - this array is ostensibly the same length as the
	 * number of columns (although each index is generated only as it is
	 * needed), and holds the data that is used for sorting each column in the
	 * row. We do this cache generation at the start of the sort in order that
	 * the formatting of the sort data need be done only once for each cell per
	 * sort. This array should not be read from or written to by anything other
	 * than the master sorting methods.
	 */
	_aSortData: unknown[] | null;

	/**
	 * Per cell filtering data cache. As per the sort data cache, used to
	 * increase the performance of the filtering in DataTables
	 */
	_aFilterData: string[] | null;

	/**
	 * Filtering data cache. This is the same as the cell filtering cache, but
	 * in this case a string rather than an array. This is easily computed with
	 * a join on `_aFilterData`, but is provided as a cache so the join isn't
	 * needed on every search (memory traded for performance)
	 */
	_sFilterRow: string | null;

	/**
	 * Denote if the original data source was from the DOM, or the data source
	 * object. This is used for invalidating data, so DataTables can
	 * automatically read data from the original source, unless uninstructed
	 * otherwise.
	 */
	src: 'dom' | 'data';

	/**
	 * Index in the aoData array. This saves an indexOf lookup when we have the
	 * object, but want to know the index
	 */
	idx: number;

	/** Cached display value */
	displayData: Array<any> | null;

	/** List of classes for removal */
	__rowc: string[];

	/** Details rows (a single Dom instance with `tr` elements) */
	_details: undefined | Dom;

	/** Indicate if the row details should be shown */
	_detailsShow: undefined | boolean;
}

/**
 * `td` / `th` element, extended with a DataTables' specific properties
 */
export interface TableCellElement extends HTMLTableCellElement {
	/**
	 * Reverse lookup to cell data index
	 */
	_DT_CellIndex?: {
		column: number;
		row: number;
	};
}

/**
 * `tr` element, extended with a DataTables' specific properties
 */
export interface TableRowElement extends HTMLTableRowElement {
	/**
	 * Reverse lookup to data index
	 */
	_DT_RowIndex?: number;
}

export const defaults = {
	nTr: null,
	anCells: [],
	_aData: [],
	_aSortData: null,
	_aFilterData: null,
	_sFilterRow: null,
	src: 'dom',
	idx: -1,
	displayData: null,
	__rowc: [],
	_details: undefined,
	_detailsShow: undefined
} as Row;

/**
 * Create a new object that is a row model
 *
 * @param parts Values to assign, otherwise the defaults will be used
 * @returns New object
 */
export default function create(parts: Partial<Row>): Row {
	return util.object.assignDeep({}, defaults, parts);
}
