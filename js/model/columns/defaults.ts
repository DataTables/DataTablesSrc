import {
	FunctionColumnCreatedCell,
	FunctionColumnData,
	FunctionColumnRender,
	ObjectColumnData,
	ObjectColumnRender
} from '../interface';

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

export interface Defaults {
	/**
	 * Set the column's aria-label title. Since: 1.10.25
	 */
	ariaTitle: string;

	/**
	 * Cell type to be created for a column. th/td
	 */
	cellType: string;

	/**
	 * Class to assign to each cell in the column.
	 */
	className: string;

	/**
	 * Add padding to the text content used when calculating the optimal with
	 * for a table.
	 */
	contentPadding: string;

	/**
	 * Cell created callback to allow DOM manipulation.
	 */
	createdCell: FunctionColumnCreatedCell | null;

	/**
	 * Class to assign to each cell in the column.
	 */
	data: number | string | ObjectColumnData | FunctionColumnData | null;

	/**
	 * Set default, static, content for a column.
	 */
	defaultContent: string | null;

	/**
	 * Text to display in the table's footer for this column.
	 */
	footer: string | null;

	/**
	 * Set a descriptive name for a column.
	 */
	name: string;

	/**
	 * Enable or disable ordering on this column.
	 */
	orderable: boolean;

	/**
	 * Define multiple column ordering as the default order for a column.
	 */
	orderData: number | number[] | null;

	/**
	 * Live DOM sorting type assignment.
	 */
	orderDataType: string;

	/**
	 * Order direction application sequence.
	 */
	orderSequence: Array<'asc' | 'desc' | ''>;

	/**
	 * Render (process) the data for use in the table.
	 */
	render:
		| number
		| string
		| ObjectColumnData
		| FunctionColumnRender
		| ObjectColumnRender
		| null;

	/**
	 * Enable or disable filtering on the data in this column.
	 */
	searchable: boolean;

	/**
	 * Set the column title.
	 */
	title: string | null;

	/**
	 * Set the column type - used for filtering and sorting string processing.
	 */
	type: string | null;

	/**
	 * Enable or disable the display of this column.
	 */
	visible: boolean;

	/**
	 * Column width assignment.
	 */
	width: string | null;
}

/**
 * Column options that can be given to DataTables at initialisation time.
 */
const defaults: Defaults = {
	ariaTitle: '',
	cellType: 'td',
	className: '',
	contentPadding: '',
	createdCell: null,
	data: null,
	defaultContent: null,
	footer: null,
	name: '',
	orderable: true,
	orderData: null,
	orderDataType: 'std',
	orderSequence: ['asc', 'desc', ''],
	render: null,
	searchable: true,
	title: null,
	type: null,
	visible: true,
	width: null
};

export default defaults;

export type Options = Partial<Defaults>;
