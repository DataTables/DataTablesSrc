/**
 * Template object for the way in which DataTables holds information about
 * each individual row. This is the object format used for the settings
 * aoData array.
 */
export default class Row {
	/**
	 * TR element for the row
	 */
	public nTr = null;

	/**
	 * Array of TD elements for each row. This is null until the row has been
	 * created.
	 */
	public anCells: HTMLTableCellElement[];

	/**
	 * Data object from the original data source for the row. This is either
	 * an array if using the traditional form of DataTables, or an object if
	 * using mData options. The exact type will depend on the passed in
	 * data from the data source, or will be an array if using DOM a data
	 * source.
	 */
	public _aData = [];

	/**
	 * Sorting data cache - this array is ostensibly the same length as the
	 * number of columns (although each index is generated only as it is
	 * needed), and holds the data that is used for sorting each column in the
	 * row. We do this cache generation at the start of the sort in order that
	 * the formatting of the sort data need be done only once for each cell
	 * per sort. This array should not be read from or written to by anything
	 * other than the master sorting methods.
	 */
	public _aSortData = null;

	/**
	 * Per cell filtering data cache. As per the sort data cache, used to
	 * increase the performance of the filtering in DataTables
	 */
	public _aFilterData = null;

	/**
	 * Filtering data cache. This is the same as the cell filtering cache, but
	 * in this case a string rather than an array. This is easily computed with
	 * a join on `_aFilterData`, but is provided as a cache so the join isn't
	 * needed on every search (memory traded for performance)
	 */
	public _sFilterRow = null;

	/**
	 * Denote if the original data source was from the DOM, or the data source
	 * object. This is used for invalidating data, so DataTables can
	 * automatically read data from the original source, unless uninstructed
	 * otherwise.
	 */
	public src = null;

	/**
	 * Index in the aoData array. This saves an indexOf lookup when we have the
	 * object, but want to know the index
	 */
	public idx = -1;

	/**
	 * Cached display value
	 */
	public displayData = null;
}
