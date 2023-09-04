/*! DataTables Tailwind CSS integration
 */

/*
 * This is a tech preview of Tailwind CSS integration with DataTables.
 */

// Set the defaults for DataTables initialisation
$.extend( true, DataTable.defaults, {
	dom:
		"<'grid grid-cols-1 md:grid-cols-2'" +
			"<'self-center'l>" +
			"<'self-center place-self-end'f>" +
			"<'my-2 col-span-2 border border-gray-200 rounded min-w-full bg-white dark:bg-gray-800 dark:border-gray-700'tr>" +
			"<'self-center'i>" +
			"<'self-center place-self-end'p>" +
		">",
	renderer: 'tailwindcss'
} );


// Default class modification
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper dt-tailwindcss",
	sFilterInput:  "border placeholder-gray-500 ml-2 px-3 py-2 rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:focus:border-blue-500 dark:placeholder-gray-400",
	sLengthSelect: "border px-3 py-2 rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:focus:border-blue-500",
	sProcessing:   "dt-processing uk-panel",
	tailwindcss: {
		paging: {
			active: 'font-semibold bg-gray-100 dark:bg-gray-700/75',
			notActive: 'bg-white dark:bg-gray-800',
			button: 'relative inline-flex justify-center items-center space-x-2 border px-4 py-2 -mr-px leading-6 hover:z-10 focus:z-10 active:z-10 border-gray-200 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:active:border-gray-700',
			first: 'rounded-l-lg',
			last: 'rounded-r-lg',
			enabled: 'text-gray-800 hover:text-gray-900 hover:border-gray-300 hover:shadow-sm focus:ring focus:ring-gray-300 focus:ring-opacity-25 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-opacity-40',
			notEnabled: 'text-gray-300 dark:text-gray-600'
		},
		table: 'dataTable min-w-full text-sm align-middle whitespace-nowrap',
		thead: {
			row: 'border-b border-gray-100 dark:border-gray-700/50',
			cell: 'px-3 py-4 text-gray-900 bg-gray-100/75 font-semibold text-left dark:text-gray-50 dark:bg-gray-700/25'
		},
		tbody: {
			row: 'even:bg-gray-50 dark:even:bg-gray-900/50',
			cell: 'p-3'
		},
		tfoot: {
			row: 'even:bg-gray-50 dark:even:bg-gray-900/50',
			cell: 'p-3 text-left'
		},
	}
} );

// Abstract out DataTable's awful class property names were we can,
// others are handled below
DataTable.ext.classes.sTable = DataTable.ext.classes.tailwindcss.table;
DataTable.ext.classes.sStripeOdd = DataTable.ext.classes.tailwindcss.tbody.row;
DataTable.ext.classes.sStripeEven = DataTable.ext.classes.tailwindcss.tbody.row;
DataTable.ext.classes.sHeaderTH = DataTable.ext.classes.tailwindcss.thead.cell;
DataTable.ext.classes.sFooterTH = DataTable.ext.classes.tailwindcss.tfoot.cell;
DataTable.defaults.column.sClass = DataTable.ext.classes.tailwindcss.tbody.cell;

// Eventually the classes and styles to apply from above will be merged into
// DataTables core, but for now we add them in a Tailwind CSS specific file
// since this is the only one that uses them this way at the moment.
$(document).on('init.dt', function (e, settings) {
	let thead = settings.nTHead;
	let classes = DataTable.ext.classes.tailwindcss;

	$(thead).addClass(classes.thead.row);
});

DataTable.ext.renderer.pagingButton.tailwindcss = function (settings, buttonType, content, active, disabled) {
	var classes = settings.oClasses.tailwindcss.paging;
	var btnClasses = [classes.button];

	btnClasses.push(active ? classes.active : classes.notActive);
	btnClasses.push(disabled ? classes.notEnabled : classes.enabled);

	var a = $('<a>', {
		'href': disabled ? null : '#',
		'class': btnClasses.join(' ')
	})
		.html(content);

	return {
		display: a,
		clicker: a
	};
};

DataTable.ext.renderer.pagingContainer.tailwindcss = function (settings, buttonEls) {
	var classes = settings.oClasses.tailwindcss.paging;

	buttonEls[0].addClass(classes.first);
	buttonEls[buttonEls.length -1].addClass(classes.last);

	return $('<ul/>').addClass('pagination').append(buttonEls);
};
