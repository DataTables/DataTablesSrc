import { Api } from '../api/interface';
import { Dom } from '../dom';
import { IFeatureDivOptions } from '../features/div';
import { IFeatureInfoOptions } from '../features/info';
import { IFeaturePagingOptions } from '../features/page';
import { IFeaturePageLengthOptions } from '../features/pageLength';
import { IFeatureSearchOptions } from '../features/search';
import { Context } from './settings';
import { State } from './state';

/**
 * Execution scope for the callbacks
 */
export interface DataTableDom extends Dom<HTMLTableElement> {
    /**
     * Get a DataTable API instance for the table
     */
    api(): Api
}

export interface Feature {
	/** A simple `<div>` that can contain your own content */
	div?: Partial<IFeatureDivOptions>;

	/** Table information display */
	info?: Partial<IFeatureInfoOptions>;

	/** Paging length control */
	pageLength?: Partial<IFeaturePageLengthOptions>;

	/** Pagination buttons */
	paging?: Partial<IFeaturePagingOptions>;

	/** Global search input */
	search?: Partial<IFeatureSearchOptions>;
}

type LayoutNumber = '' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type LayoutSide = 'top' | 'bottom';

type LayoutEdge = 'Start' | 'End';

type LayoutKeys =
	| `${LayoutSide}${LayoutNumber}${LayoutEdge}`
	| `${LayoutSide}${LayoutNumber}`;

export type LayoutFeatures =
	| keyof Feature
	| Feature
	| Array<keyof Feature>
	| Feature[];

export type LayoutElement = {
	/** Class to apply to the CELL in the layout grid */
	className?: string;

	/** ID to apply to the CELL in the layout grid */
	id?: string;

	/** Class to apply to the ROW in the layout grid */
	rowClass?: string;

	/** ID to apply to the ROW in the layout grid */
	rowId?: string;

	/** List of features to show in this cell */
	features: LayoutFeatures;
};

export type LayoutComponent =
	| LayoutElement
	| LayoutFeatures
	| (() => HTMLElement)
	| HTMLElement
	| JQuery<HTMLElement>
	| Dom
	| null;

export type Layout = Partial<Record<LayoutKeys, LayoutComponent>>;

export type FunctionColumnRender = (
	this: DataTableDom,
	data: any,
	type: any,
	row: any,
	meta: CellMetaSettings
) => any;

export type FunctionColumnCreatedCell = (
	this: DataTableDom,
	cell: HTMLTableCellElement,
	cellData: any,
	rowData: any,
	row: number,
	col: number
) => void;

export interface CellMetaSettings {
	row: number;
	col: number;
	settings: Context;
}

export interface OrderFixed {
	/**
	 * Two-element array:
	 *
	 * * 0: Column index to order upon.
	 * * 1: Direction so order to apply ("asc" for ascending order or "desc" for
	 *   descending order).
	 */
	pre?: any[];

	/**
	 * Two-element array:
	 *
	 * * 0: Column index to order upon.
	 * * 1: Direction so order to apply ("asc" for ascending order or "desc" for
	 *   descending order).
	 */
	post?: any[];
}


export interface FunctionColumnData {
	(row: any, type: 'set', s: any, meta: CellMetaSettings): void;
	(
		row: any,
		type: 'display' | 'sort' | 'filter' | 'type',
		s: undefined,
		meta: CellMetaSettings
	): any;
}

export interface ObjectColumnData {
	_: string | number | FunctionColumnData;
	filter?: string | number | FunctionColumnData;
	display?: string | number | FunctionColumnData;
	type?: string | number | FunctionColumnData;
	sort?: string | number | FunctionColumnData;
}

export interface ObjectColumnRender {
	_?: string | number | FunctionColumnRender;
	filter?: string | number | FunctionColumnRender;
	display?: string | number | FunctionColumnRender;
	type?: string | number | FunctionColumnRender;
	sort?: string | number | FunctionColumnRender;
}

export type AjaxDataSrc = string | ((data: any) => any[]);

export interface AjaxSettings extends JQueryAjaxSettings {
	/**
	 * Add or modify data submitted to the server upon an Ajax request.
	 */
	data?: object | FunctionAjaxData;

	/**
	 * Data property or manipulation method for table data.
	 */
	dataSrc?:
		| AjaxDataSrc
		| {
				/** Mapping for `data` property */
				data: AjaxDataSrc;

				/** Mapping for `draw` property */
				draw: AjaxDataSrc;

				/** Mapping for `recordsTotal` property */
				recordsTotal: AjaxDataSrc;

				/** Mapping for `recordsFiltered` property */
				recordsFiltered: AjaxDataSrc;
		  };

	/** Format to submit the data parameters as in the Ajax request */
	submitAs?: 'http' | 'json';
}

export interface AjaxData {
	draw?: number;
	start?: number;
	length?: number;
	order?: AjaxDataOrder[];
	columns?: AjaxDataColumn[];
	search?: AjaxDataSearch;
}

export interface AjaxDataSearch {
	value: string;
	regex: boolean;
	fixed: {name: string, term: string}[];
}

export interface AjaxDataOrder {
	column: number;
	dir: string;
}

export interface AjaxDataColumn {
	data: string | number;
	name: string | null;
	searchable: boolean;
	orderable: boolean;
	search: AjaxDataSearch;
}

export interface AjaxResponse {
	draw?: number;
	recordsTotal?: number;
	recordsFiltered?: number;
	data: any;
	error?: string;
}

export type FunctionAjax = (
	this: DataTableDom,
	data: object,
	callback: (data: any) => void,
	settings: Context
) => void;

export type FunctionAjaxData = (
	this: DataTableDom,
	data: AjaxData,
	settings: Context
) => string | object;

export interface OrderIdx {
	idx: number;
	dir: 'asc' | 'desc';
}

export interface OrderName {
	name: string;
	dir: 'asc' | 'desc';
}

export type OrderArray = [number, 'asc' | 'desc' | ''];

export type OrderCombined = OrderIdx | OrderName | OrderArray;

export type Order = OrderCombined | OrderCombined[];

export type OrderColumn = [number, string, number?];
export interface OrderState extends OrderColumn {
	_idx?: number;
}

export interface ConfigRenderer {
	header?: string;
	pageButton?: string;
}

export type FunctionCreateRow = (
	this: DataTableDom,
	row: HTMLTableRowElement,
	data: any[] | object,
	dataIndex: number,
	cells: HTMLTableCellElement[]
) => void;

export type FunctionDrawCallback = (settings: Context) => void;

export type FunctionFooterCallback = (
	this: DataTableDom,
	tr: HTMLTableRowElement,
	data: any[],
	start: number,
	end: number,
	display: any[]
) => void;

export type FunctionFormatNumber = (
	formatNumber: number,
	ctx: Context
) => string;

export type FunctionHeaderCallback = (
	this: DataTableDom,
	tr: HTMLTableRowElement,
	data: any[],
	start: number,
	end: number,
	display: any[]
) => void;

export type FunctionInfoCallback = (
	this: DataTableDom,
	settings: Context,
	start: number,
	end: number,
	max: number,
	total: number,
	pre: string
) => void;

export type FunctionInitComplete = (
	this: DataTableDom,
	settings: Context,
	json: object
) => void;

export type FunctionPreDrawCallback = (
	this: DataTableDom,
	settings: Context
) => void;

export type FunctionRowCallback = (
	this: DataTableDom,
	row: HTMLTableRowElement,
	data: any[] | object,
	index: number
) => void;

export type FunctionStateLoadCallback = (
	this: DataTableDom,
	settings: Context,
	callback: (state: State) => void
) => undefined | null | object;

export type FunctionStateLoaded = (
	this: DataTableDom,
	settings: Context,
	data: object
) => void;

export type FunctionStateLoadParams = (
	this: DataTableDom,
	settings: Context,
	data: object
) => void;

export type FunctionStateSaveCallback = (
	this: DataTableDom,
	settings: Context,
	data: object
) => void;

export type FunctionStateSaveParams = (
	this: DataTableDom,
	settings: Context,
	data: object
) => void;
