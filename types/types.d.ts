// Type definitions for DataTables
//
// Project: https://datatables.net
// Definitions by:
//   SpryMedia
//   Kiarash Ghiaseddin <https://github.com/Silver-Connection>
//   Omid Rad <https://github.com/omidkrad>
//   Armin Sander <https://github.com/pragmatrix>
//   Craig Boland <https://github.com/CNBoland>

/// <reference types="jquery" />

import { AjaxData, Api, CellMetaSettings, DataTablesStatic, FunctionColumnData, InstSelector, ObjectColumnData, ObjectColumnRender, OrderFixed } from '../js/api/interface';
import { Layout } from '../js/model/interface';
import { SearchOptions as ConfigSearch } from '../js/model/search';
import Context, { Order, OrderArray, OrderCombined, OrderIdx, OrderName } from '../js/model/settings';
import { State, StateLoad } from '../js/model/state';

export * from '../js/api/interface';
export { Order, OrderArray, OrderCombined, OrderIdx, OrderName, State, StateLoad };


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Main interfaces
 */

/**
 * DataTables class
 */
declare interface DataTables<T> extends DataTablesStatic {
    /**
     * Create a new DataTable
     * @param selector Selector to pick one or more `<table>` elements
     * @param opts Configuration settings
     */
    new <T=any>(
        selector: InstSelector,
        opts?: Config
    ): Api<T>

    /**
     * CommonJS factory. This only applies to CommonJS environments,
     * in all others it would throw an error.
     */
    (win?: Window, jQuery?: JQuery): DataTables<T>;
}

declare const DataTables: DataTables<any>;
export default DataTables;

// The `$().dataTable()` method adds a `.api()` method to the object
// to allow access to the DataTables API
interface JQueryDataTables extends JQuery {
    /**
     * Returns DataTables API instance
     * Usage:
     * $( selector ).dataTable().api();
     */
    api(): Api<any>;
}

// Extend the jQuery object with DataTables' construction methods
declare global {
    interface JQueryDataTableApi extends DataTablesStatic {
        <T = any>(opts?: Config): Api<T>;
    }

    interface JQueryDataTableJq extends DataTablesStatic {
        (opts?: Config): JQueryDataTables;
    }

    interface JQuery {
        /**
         * Create a new DataTable, returning a DataTables API instance.
         * @param opts Configuration settings
         */
        DataTable: JQueryDataTableApi;

        /**
         * Create a new DataTable, returning a jQuery object, extended
         * with an `api()` method which can be used to access the
         * DataTables API.
         * @param opts Configuration settings
         */
        dataTable: JQueryDataTableJq;
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Options
 */

export interface Config {
    /**
     * Load data for the table's content from an Ajax source.
     */
    ajax?: string | AjaxSettings | FunctionAjax;

    /**
     * Feature control DataTables' smart column width handling.
     */
    autoWidth?: boolean;

    /**
     * Set a `caption` for the table. This can be used to describe the contents
     * of the table to the end user. A caption tag can also be read from HTML.
     */
    caption?: string;

    /**
     * Data to use as the display data for the table.
     */
    columns?: ConfigColumns[];

    /**
     * Assign a column definition to one or more columns.
     */
    columnDefs?: ConfigColumnDefs[];

    /**
     * Data to use as the display data for the table.
     */
    data?: any[];

    /**
     * Delay the loading of server-side data until second draw
     */
    deferLoading?: number | number[];
 
    /**
     * Feature control deferred rendering for additional speed of initialisation.
     */
    deferRender?: boolean;

    /**
     * Destroy any existing table matching the selector and replace with the new options.
     */
    destroy?: boolean;

    /**
     * Initial paging start point.
     */
    displayStart?: number;

    /**
     * Define the table control elements to appear on the page and in what order.
     * 
     * @deprecated Use `layout` instead
     */
    dom?: string;

    /**
     * Feature control table information display field.
     */
    info?: boolean;

    /**
     * Language configuration object
     */
    language?: ConfigLanguage;

    /**
     * 
     */
    layout?: Layout;

    /**
     * Feature control the end user's ability to change the paging display length of the table.
     */
    lengthChange?: boolean;

    /**
     * Change the options in the page length select list.
     */
    lengthMenu?: Array<(number | string)> | Array<Array<(number | string)>>;

    /**
     * Add event listeners during the DataTables startup
     */
    on?: {
        [name: string]: ((this: HTMLElement, e: Event, ...args: any[]) => void);
    };

    /**
     * Control which cell the order event handler will be applied to in a column.
     */
    orderCellsTop?: boolean;

    /**
     * Highlight the columns being ordered in the table's body.
     */
    orderClasses?: boolean;

    /**
     * Reverse the initial data order when `desc` ordering
     */
    orderDescReverse?: boolean;

    /**
     * Initial order (sort) to apply to the table.
     */
    order?: Order | Order[];

    /**
     * Ordering to always be applied to the table.
     */
    orderFixed?: Order | Order[] | {
        pre?: Order | Order[],
        post: Order | Order[]
    };

    /**
     * Feature control ordering (sorting) abilities in DataTables.
     */
    ordering?: boolean | {
        /**
         * Control the showing of the ordering icons in the table header.
         */
        indicators?: boolean;

        /**
         * Control the addition of a click event handler on the table headers to activate
         * ordering.
         */
        handler?: boolean;
    };

    /**
     * Multiple column ordering ability control.
     */
    orderMulti?: boolean;

    /**
     * Change the initial page length (number of rows per page).
     */
    pageLength?: number;

    /**
     * Enable or disable table pagination.
     */
    paging?: boolean;

    /**
     * Pagination button display options. Basic Types: numbers (1.10.8) simple, simple_numbers, full, full_numbers
     */
    pagingType?: string;

    /**
     * Feature control the processing indicator.
     */
    processing?: boolean;

    /**
     * Display component renderer types.
     */
    renderer?: string | ConfigRenderer;

    /**
     * Retrieve an existing DataTables instance.
     */
    retrieve?: boolean;

    /**
     * Data property name that DataTables will use to set <tr> element DOM IDs. Since: 1.10.8
     */
    rowId?: string;

    /**
     * Allow the table to reduce in height when a limited number of rows are shown.
     */
    scrollCollapse?: boolean;

    /**
     * Horizontal scrolling.
     */
    scrollX?: boolean;

    /**
     * Vertical scrolling. Since: 1.10 Exp: "200px"
     */
    scrollY?: string;

    /**
     * Set an initial filter in DataTables and / or filtering options.
     */
    search?: ConfigSearch | boolean;

    /**
     * Define an initial search for individual columns.
     */
    searchCols?: ConfigSearch[];

    /**
     * Set a throttle frequency for searching.
     */
    searchDelay?: number;

    /**
     * Feature control search (filtering) abilities
     */
    searching?: boolean;

    /**
     * Feature control DataTables' server-side processing mode.
     */
    serverSide?: boolean;

    /**
     * Saved state validity duration.
     */
    stateDuration?: number;

    /**
     * State saving - restore table state on page reload.
     */
    stateSave?: boolean;

    /**
     * Set the zebra stripe class names for the rows in the table.
     */
    stripeClasses?: string[];

    /**
     * Tab index control for keyboard navigation.
     */
    tabIndex?: number;

    /**
     * Callback for whenever a TR element is created for the table's body.
     */
    createdRow?: FunctionCreateRow;

    /**
     * Function that is called every time DataTables performs a draw.
     */
    drawCallback?: FunctionDrawCallback;

    /**
     * Footer display callback function.
     */
    footerCallback?: FunctionFooterCallback;

    /**
     * Number formatting callback function.
     */
    formatNumber?: FunctionFormatNumber;

    /**
     * Header display callback function.
     */
    headerCallback?: FunctionHeaderCallback;

    /**
     * Table summary information display callback.
     */
    infoCallback?: FunctionInfoCallback;

    /**
     * Initialisation complete callback.
     */
    initComplete?: FunctionInitComplete;

    /**
     * Pre-draw callback.
     */
    preDrawCallback?: FunctionPreDrawCallback;

    /**
     * Row draw callback..
     */
    rowCallback?: FunctionRowCallback;

    /**
     * Callback that defines where and how a saved state should be loaded.
     */
    stateLoadCallback?: FunctionStateLoadCallback;

    /**
     * State loaded callback.
     */
    stateLoaded?: FunctionStateLoaded;

    /**
     * State loaded - data manipulation callback.
     */
    stateLoadParams?: FunctionStateLoadParams;

    /**
     * Callback that defines how the table state is stored and where.
     */
    stateSaveCallback?: FunctionStateSaveCallback;

    /**
     * State save - data manipulation callback.
     */
    stateSaveParams?: FunctionStateSaveParams;
}


export interface ConfigLanguage {
    emptyTable?: string;
    entries?: string | object;
    info?: string;
    infoEmpty?: string;
    infoFiltered?: string;
    infoPostFix?: string;
    decimal?: string;
    thousands?: string;

    /** Labels for page length entries */
    lengthLabels?: { [key: string | number]: string};
    lengthMenu?: string;
    loadingRecords?: string;
    processing?: string;
    search?: string;
    searchPlaceholder?: string;
    zeroRecords?: string;
    paginate?: {
        first?: string;
        last?: string;
        next?: string;
        previous?: string;
    };
    aria?: {
        orderable?: string;
        orderableReverse?: string;
        orderableRemove?: string;
        paginate?: {
            first?: string;
            last?: string;
            next?: string;
            previous?: string;
            number?: string;
        };
    };
    url?: string;
}


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
     * Add padding to the text content used when calculating the optimal with for a table.
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
     * Array type is prefix ordering only and is a two-element array:
     * 0: Column index to order upon.
     * 1: Direction so order to apply ("asc" for ascending order or "desc" for descending order).
     */
    orderFixed?: any[] | OrderFixed;

    /**
     * Order direction application sequence.
     */
    orderSequence?: Array<'asc' | 'desc' | ''>;

    /**
     * Render (process) the data for use in the table.
     */
    render?: number | string | ObjectColumnData | FunctionColumnRender | ObjectColumnRender;

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

export type ConfigColumnDefs = ConfigColumnDefsMultiple | ConfigColumnDefsSingle;

export interface ConfigColumnDefsMultiple extends ConfigColumns {
    /**
     * Target column(s). Either this or `target` must be specified.
     */
    targets: string | number | Array<(number | string)>;
}

export interface ConfigColumnDefsSingle extends ConfigColumns {
    /**
     * Single column target. Either this or `targets` must be specified. Since: 1.12
     */
    target: string | number;
}

export interface ConfigRenderer {
    header?: string;
    pageButton?: string;
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
    dataSrc?: AjaxDataSrc | {
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

type FunctionAjax = (this: JQueryDataTables, data: object, callback: ((data: any) => void), settings: Context) => void;

type FunctionAjaxData = (this: JQueryDataTables, data: AjaxData, settings: Context) => string | object;

type FunctionColumnRender = (this: JQueryDataTables, data: any, type: any, row: any, meta: CellMetaSettings) => any;

type FunctionColumnCreatedCell = (this: JQueryDataTables, cell: HTMLTableCellElement, cellData: any, rowData: any, row: number, col: number) => void;

type FunctionCreateRow = (this: JQueryDataTables, row: HTMLTableRowElement, data: any[] | object, dataIndex: number, cells: HTMLTableCellElement[]) => void;

type FunctionDrawCallback = (this: JQueryDataTables, settings: Context) => void;

type FunctionFooterCallback = (this: JQueryDataTables, tr: HTMLTableRowElement, data: any[], start: number, end: number, display: any[]) => void;

type FunctionFormatNumber = (this: JQueryDataTables, formatNumber: number) => void;

type FunctionHeaderCallback = (this: JQueryDataTables, tr: HTMLTableRowElement, data: any[], start: number, end: number, display: any[]) => void;

type FunctionInfoCallback = (this: JQueryDataTables, settings: Context, start: number, end: number, max: number, total: number, pre: string) => void;

type FunctionInitComplete = (this: JQueryDataTables, settings: Context, json: object) => void;

type FunctionPreDrawCallback = (this: JQueryDataTables, settings: Context) => void;

type FunctionRowCallback = (this: JQueryDataTables, row: HTMLTableRowElement, data: any[] | object, index: number) => void;

type FunctionStateLoadCallback = (this: JQueryDataTables, settings: Context, callback: ((state: State) => void)) => undefined | null | object;

type FunctionStateLoaded = (this: JQueryDataTables, settings: Context, data: object) => void;

type FunctionStateLoadParams = (this: JQueryDataTables, settings: Context, data: object) => void;

type FunctionStateSaveCallback = (this: JQueryDataTables, settings: Context, data: object) => void;

type FunctionStateSaveParams = (this: JQueryDataTables, settings: Context, data: object) => void;
