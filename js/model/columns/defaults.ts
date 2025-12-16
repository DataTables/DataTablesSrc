import { hungarianMap } from '../../core/compat';
import {
	FunctionColumnCreatedCell,
	FunctionColumnData,
	FunctionColumnRender,
	ObjectColumnData,
	ObjectColumnRender,
	OrderFixed
} from '../interface';

export interface ConfigColumns {
	/**
	 * Set the column's aria-label title. Since: 1.10.25
	 */
	ariaTitle?: string;

	/**
	 * Cell type to be created for a column. th/td
	 */
	cellType?: string;

	/**
	 * Class to assign to each cell in the column.
	 */
	className?: string;

	/**
	 * Add padding to the text content used when calculating the optimal with
	 * for a table.
	 */
	contentPadding?: string;

	/**
	 * Cell created callback to allow DOM manipulation.
	 */
	createdCell?: FunctionColumnCreatedCell;

	/**
	 * Class to assign to each cell in the column.
	 */
	data?: number | string | ObjectColumnData | FunctionColumnData | null;

	/**
	 * Set default, static, content for a column.
	 */
	defaultContent?: string;

	/**
	 * Text to display in the table's footer for this column.
	 */
	footer?: string;

	/**
	 * Set a descriptive name for a column.
	 */
	name?: string;

	/**
	 * Enable or disable ordering on this column.
	 */
	orderable?: boolean;

	/**
	 * Define multiple column ordering as the default order for a column.
	 */
	orderData?: number | number[];

	/**
	 * Live DOM sorting type assignment.
	 */
	orderDataType?: string;

	/**
	 * Ordering to always be applied to the table. Since 1.10
	 *
	 * Array type is prefix ordering only and is a two-element array: 0: Column
	 * index to order upon. 1: Direction so order to apply ("asc" for ascending
	 * order or "desc" for descending order).
	 */
	orderFixed?: any[] | OrderFixed;

	/**
	 * Order direction application sequence.
	 */
	orderSequence?: Array<'asc' | 'desc' | ''>;

	/**
	 * Render (process) the data for use in the table.
	 */
	render?:
		| number
		| string
		| ObjectColumnData
		| FunctionColumnRender
		| ObjectColumnRender;

	/**
	 * Enable or disable filtering on the data in this column.
	 */
	searchable?: boolean;

	/**
	 * Set the column title.
	 */
	title?: string;

	/**
	 * Set the column type - used for filtering and sorting string processing.
	 */
	type?: string;

	/**
	 * Enable or disable the display of this column.
	 */
	visible?: boolean;

	/**
	 * Column width assignment.
	 */
	width?: string;
}

/**
 * Column options that can be given to DataTables at initialisation time.
 */
const defaults = {
	/**
	 * Define which column(s) an order will occur on for this column. This
	 * allows a column's ordering to take multiple columns into account when
	 * doing a sort or use the data from a different column. For example first
	 * name / last name columns make sense to do a multi-column sort over the
	 * two columns.
	 */
	orderData: null,

	ariaTitle: '',

	/**
	 * You can control the default ordering direction, and even alter the
	 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
	 * using this parameter.
	 */
	orderSequence: ['asc', 'desc', ''],

	/**
	 * Enable or disable filtering on the data in this column.
	 */
	searchable: true,

	/**
	 * Enable or disable ordering on this column.
	 */
	orderable: true,

	/**
	 * Enable or disable the display of this column.
	 */
	visible: true,

	/**
	 * Developer definable function that is called whenever a cell is created
	 * (Ajax source, etc) or processed for input (DOM source). This can be used
	 * as a compliment to `render` allowing you to modify the DOM element (add
	 * background colour for example) when the element is available.
	 */
	createdCell: null,

	/**
	 * This property can be used to read data from any data source property,
	 * including deeply nested objects / properties.
	 */
	data: null,

	/**
	 * This property is the rendering partner to `data` and it is suggested that
	 * when you want to manipulate data for display (including filtering,
	 * sorting etc) without altering the underlying data for the table, use this
	 * property.
	 */
	render: null,

	/**
	 * Change the cell type created for the column - either TD cells or TH
	 * cells. This can be useful as TH cells have semantic meaning in the table
	 * body, allowing them to act as a header for a row (you may wish to add
	 * scope='row' to the TH elements).
	 */
	cellType: 'td',

	/**
	 * Class to give to each cell in this column.
	 */
	className: '',

	/**
	 * When DataTables calculates the column widths to assign to each column, it
	 * finds the longest string in each column and then constructs a temporary
	 * table and reads the widths from that. The problem with this is that "mmm"
	 * is much wider then "iiii", but the latter is a longer string - thus the
	 * calculation can go wrong (doing it properly and putting it into an DOM
	 * object and measuring that is horribly(!) slow). Thus as a "work around"
	 * we provide this option. It will append its value to the text that is
	 * found to be the longest string for the column - i.e. padding. Generally
	 * you shouldn't need this!
	 */
	contentPadding: '',

	/**
	 * Allows a default value to be given for a column's data, and will be used
	 * whenever a null data source is encountered (this can be because `data` is
	 * set to null, or because the data source itself is null).
	 */
	defaultContent: null,

	/**
	 * This parameter is only used in DataTables' server-side processing. It can
	 * be exceptionally useful to know what columns are being displayed on the
	 * client side, and to map these to database fields. When defined, the names
	 * also allow DataTables to reorder information from the server if it comes
	 * back in an unexpected order (i.e. if you switch your columns around on
	 * the client-side, your server-side code does not also need updating).
	 */
	name: '',

	/**
	 * Defines a data source type for the ordering which can be used to read
	 * real-time information from the table (updating the internally cached
	 * version) prior to ordering. This allows ordering to occur on user
	 * editable elements such as form inputs.
	 */
	orderDataType: 'std',

	/**
	 * The title of this column.
	 */
	title: null,

	/**
	 * The type allows you to specify how the data for this column will be
	 * ordered. Four types (string, numeric, date and html (which will strip
	 * HTML tags before ordering)) are currently available. Note that only date
	 * formats understood by JavaScript's Date() object will be accepted as type
	 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
	 * 'numeric', 'date' or 'html' (by default). Further types can be adding
	 * through plug-ins.
	 */
	type: null,

	/**
	 * Defining the width of the column, this parameter may take any CSS value
	 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have
	 * not been given a specific width through this interface ensuring that the
	 * table remains readable.
	 */
	width: null
};

hungarianMap(defaults);

export default defaults;

type Options = Partial<typeof defaults>;

export interface ConfigColumnDefs extends Options {
	/**
	 * Target column(s). Either this or `target` must be specified.
	 */
	targets?: string | number | Array<number | string>;

	/**
	 * Single column target. Either this or `targets` must be specified.
	 */
	target?: string | number;
}
