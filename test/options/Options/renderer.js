var pageArgs;
var pageCounter = 0;

var headerArgs;
var headerCounter = 0;

// Create a simple renderer that we can use for our testing - it just
// creates `a` tags for each button type
var pageButtons = function(settings, host, idx, buttons, page, pages) {
	var api = new $.fn.dataTable.Api(settings);
	pageArgs = arguments; // Store so we can set the arguments
	pageCounter++;

	// Flatten buttons array
	var flattened = $.map(buttons, function(val, i) {
		return val;
	});

	$(host).empty();

	$.each(flattened, function(i, val) {
		$(host).append(
			$('<a/>')
				.text(val)
				.on('click', function() {
					api.page(val).draw(false);
				})
		);
	});
};

var header = function(settings, cell, column, classes) {
	headerCounter++;
	headerArgs = arguments;

	$(cell).attr('counter', headerCounter);
};

function resetCounters() {
	pageCounter = 0;
	headerCounter = 0;
}

function checkHeaders(first, last) {
	expect($('thead tr th:eq(0)').attr('counter')).toBe(first);
	expect($('thead tr th:eq(5)').attr('counter')).toBe(last);
}

function checkButtons(rendered) {
	expect($('div.dataTables_paginate a').length).toBe(8); // paging
	expect($('div.dataTables_paginate span').length).toBe(rendered? 0 : 1); // paging
	expect($('thead th:eq(0)').children().length).toBe(0); // header

	if (rendered) {
		$('div.dataTables_paginate a:eq(4)').click();
		expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Jennifer Chang');
	}
}

function checkCounters(header, page) {
	expect(headerCounter).toBe(header);
	expect(pageCounter).toBe(page);
}

function checkOrdering() {
	$('thead tr th:eq(2)').click();
	expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Cedric Kelly');
}

describe('renderer option initialisation types for page button', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	it('Default is null', function() {
		expect($.fn.dataTable.defaults.renderer).toBe(null);
	});

	dt.html('basic');
	it('Uses default when not explicitly set', function() {
		$('#example').DataTable();

		checkCounters(0, 0);
		checkHeaders(undefined, undefined);
		checkButtons(false);
		checkOrdering();
	});

	dt.html('basic');
	it('Set the renderer - as a string', function() {
		$.fn.dataTable.ext.renderer.pageButton.test = pageButtons;

		resetCounters();
		table = $('#example').DataTable({
			renderer: 'test'
		});

		checkCounters(0, 1);
		checkHeaders(undefined, undefined);
		checkButtons(true);
		checkOrdering();
	});

	dt.html('basic');
	it('Set the renderer - as object with only the `pageButton` rendering type defined', function() {
		resetCounters();
		table = $('#example').DataTable({
			renderer: {
				pageButton: 'test'
			}
		});

		checkCounters(0, 1);
		checkHeaders(undefined, undefined);
		checkButtons(true);
		checkOrdering();
	});

	dt.html('basic');
	it('Set the renderer - as object with only the `header` rendering type defined', function() {
		resetCounters();
		$('#example').DataTable({
			renderer: {
				header: 'test'
			}
		});

		checkCounters(0, 0);
		checkHeaders(undefined, undefined);
		checkButtons(false);
		checkOrdering();
	});
});

describe('renderer option initialisation types for header', function() {
	dt.html('basic');
	it('Set the renderer - as a string', function() {
		delete $.fn.dataTable.ext.renderer.pageButton.test; // remove
		$.fn.dataTable.ext.renderer.header.test = header;

		resetCounters();
		$('#example').DataTable({
			renderer: 'test'
		});

		checkCounters(6, 0);
		checkHeaders('1', '6');
		checkButtons(false);
		checkOrdering();
	});

	dt.html('basic');
	it('Set the renderer - as object with only the `pageButton` rendering type defined', function() {
		resetCounters();
		$('#example').DataTable({
			renderer: {
				pageButton: 'test'
			}
		});

		checkCounters(0, 0);
		checkHeaders(undefined, undefined);
		checkButtons(false);
		checkOrdering();
	});

	dt.html('basic');
	it('Set the renderer - as object with only the `header` rendering type defined', function() {
		resetCounters();
		$('#example').DataTable({
			renderer: {
				header: 'test'
			}
		});

		checkCounters(6, 0);
		checkHeaders('1', '6');
		checkButtons(false);
		checkOrdering();
	});
});

describe('renderer option initialisation types for both paging and header', function() {
	dt.html('basic');
	it('Set the renderer - as a string', function() {
		$.fn.dataTable.ext.renderer.pageButton.test = pageButtons;
		$.fn.dataTable.ext.renderer.header.test = header;

		resetCounters();
		$('#example').DataTable({
			renderer: 'test'
		});

		checkCounters(6, 1);
		checkHeaders('1', '6');
		checkButtons(true);
		checkOrdering();
	});

	dt.html('basic');
	it('Set the renderer - as object with only the `pageButton` rendering type defined', function() {
		resetCounters();
		$('#example').DataTable({
			renderer: {
				pageButton: 'test'
			}
		});

		checkCounters(0, 1);
		checkHeaders(undefined, undefined);
		checkButtons(true);
		checkOrdering();
	});

	dt.html('basic');
	it('Set the renderer - as object with only the `header` rendering type defined', function() {
		resetCounters();
		$('#example').DataTable({
			renderer: {
				header: 'test'
			}
		});

		checkCounters(6, 0);
		checkHeaders('1', '6');
		checkButtons(false);
		checkOrdering();
	});

	dt.html('basic');
	it('Set the renderer - `header` and `pageButton` defined', function() {
		resetCounters();
		$('#example').DataTable({
			renderer: {
				header: 'test',
				pageButton: 'test'
			}
		});

		checkCounters(6, 1);
		checkHeaders('1', '6');
		checkButtons(true);
		checkOrdering();
	});
});

describe('renderer option page button functions', function() {
	dt.html('basic');
	it('Create the DataTable', function() {
		table = $('#example').DataTable({
			renderer: 'test'
		});
	});

	it('Six arguments are passed in', function() {
		expect(pageArgs.length).toBe(6);
	});

	it('Arg 0 is the settings object', function() {
		expect(pageArgs[0]).toBe(
			$('#example')
				.DataTable()
				.settings()[0]
		);
	});

	it('Arg 1 is the container element', function() {
		expect(pageArgs[1]).toBe($('div.dataTables_paginate')[0]);
	});

	it('Arg 2 is the paging control index', function() {
		expect(pageArgs[2]).toBe(0);
	});

	it('Arg 3 is an array of the buttons to be shown', function() {
		expect(pageArgs[3][0]).toBe('previous');
		expect(Array.isArray(pageArgs[3][1])).toBe(true);
		expect(pageArgs[3][1][0]).toBe(0);
		expect(pageArgs[3][1][1]).toBe(1);
		expect(pageArgs[3][1].length).toBe(6);
		expect(pageArgs[3][1].DT_el).toBe('span');
		expect(pageArgs[3][2]).toBe('next');
	});

	it('Arg 4 is the current page', function() {
		expect(pageArgs[4]).toBe(0);
	});

	it('Arg 5 is the page count', function() {
		expect(pageArgs[5]).toBe(6);
	});

	it('Next page Arg 4 is the current page', function() {
		table.page('next').draw(false);
		expect(pageArgs[4]).toBe(1);
	});

	dt.html('basic');

	it('Create the DataTable with two paging controls', function() {
		table = $('#example').DataTable({
			renderer: 'test',
			dom: 'ptp'
		});
	});

	it('Arg 2 is the paging control index', function() {
		expect(pageArgs[2]).toBe(1); // latest, since called twice
	});
});

describe('renderer option header functions', function() {
	dt.html('basic');

	it('Create the DataTable', function() {
		table = $('#example').DataTable({
			renderer: 'test'
		});
	});

	it('Four arguments are passed in', function() {
		expect(headerArgs.length).toBe(4);
	});

	it('Arg 0 is the settings object', function() {
		expect(headerArgs[0]).toBe(
			$('#example')
				.DataTable()
				.settings()[0]
		);
	});

	it('Arg 1 is the header cell as a jQuery object', function() {
		expect(headerArgs[1] instanceof $).toBe(true);
		expect(headerArgs[1].get(0)).toBe($('thead th:last-child')[0]); // last one as called in a loop
	});

	it('Arg 2 is the column object - this is NOT public! This needs to be improved...', function() {
		var settings = $('#example')
			.DataTable()
			.settings()[0];
		var columns = settings.aoColumns;
		expect(headerArgs[2]).toBe(columns[columns.length - 1]); // last one as called in a loop
	});

	it('Arg 2 is the classes object - this is NOT public! This needs to be improved...', function() {
		expect(headerArgs[3].sHeaderTH).toBeDefined();
	});

	it('Renderer is called on each header cell', function() {
		expect($('th[counter]').length).toBe(6);
	});
});
