var pageButtonArgs;
var pageButtonCounter = 0;

var pageContainerArgs;
var pageContainerCounter = 0;

var headerArgs;
var headerCounter = 0;

// Create a simple renderer that we can use for our testing - it just
// creates `button` tags for each button type
var pagingButtons = function(settings, button, content, active, disabled) {
	var api = new $.fn.dataTable.Api(settings);
	pageButtonArgs = arguments; // Store so we can test the arguments
	pageButtonCounter++;

	var btn = $('<button class="test">').html(content);

	return {
		display: btn,
		clicker: btn
	};
};

var pagingContainer = function (settings, buttons) {
	pageContainerArgs = arguments; // Store so we can test the arguments
	pageContainerCounter++;

	return $('<div class="paging-buttons">').append(buttons);
};

var header = function(settings, cell, column, classes) {
	headerCounter++;
	headerArgs = arguments;

	$(cell).attr('counter', headerCounter);
};

function resetCounters() {
	headerCounter = 0;
	pageButtonCounter = 0;
	pageContainerCounter = 0;
}

function checkHeaders(first, last) {
	expect($('thead tr th:eq(0)').attr('counter')).toBe(first);
	expect($('thead tr th:eq(5)').attr('counter')).toBe(last);
}

function checkButtons(rendered) {
	expect($('div.dt-paging button').length).toBe(10); // paging
	expect($('div.dt-paging span').length).toBe(0); // paging
	expect($('thead th:eq(0)').children().length).toBe(1); // header
	expect($('thead th:eq(0) div').children().length).toBe(2); // header

	if (rendered) {
		$('div.dt-paging button:eq(5)').click();
		expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Jennifer Chang');
	}
}

function checkCounters(header, pageButtons, pageContainer) {
	expect(headerCounter).toBe(header);
	expect(pageButtonCounter).toBe(pageButtons);
	expect(pageContainerCounter).toBe(pageContainer);
}

async function checkOrdering() {
	await dt.clickHeader(2);
	expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
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
	it('Uses default when not explicitly set', async function() {
		$('#example').DataTable();

		checkCounters(0, 0, 0);
		checkHeaders(undefined, undefined);
		checkButtons(false);
		await checkOrdering();
	});

	dt.html('basic');
	it('Set the renderer - as a string', async function() {
		$.fn.dataTable.ext.renderer.pagingButton.test = pagingButtons;
		$.fn.dataTable.ext.renderer.pagingContainer.test = pagingContainer;

		resetCounters();
		table = $('#example').DataTable({
			renderer: 'test'
		});

		checkCounters(0, 10, 1);
		checkHeaders(undefined, undefined);
		checkButtons(true);
		await checkOrdering();
	});

	dt.html('basic');
	it('Set the renderer - as object with only the `pageButton` rendering type defined', async function() {
		resetCounters();
		table = $('#example').DataTable({
			renderer: {
				pagingButton: 'test',
				pagingContainer: 'test',
			}
		});

		checkCounters(0, 10, 1);
		checkHeaders(undefined, undefined);
		checkButtons(true);
		await checkOrdering();
	});

	dt.html('basic');
	it('Set the renderer - as object with only the `header` rendering type defined', async function() {
		resetCounters();
		$('#example').DataTable({
			renderer: {
				header: 'test'
			}
		});

		checkCounters(0, 0, 0);
		checkHeaders(undefined, undefined);
		checkButtons(false);
		await checkOrdering();
	});
});

describe('renderer option initialisation types for header', function() {
	dt.html('basic');
	it('Set the renderer - as a string', async function() {
		delete $.fn.dataTable.ext.renderer.pagingButton.test; // remove
		delete $.fn.dataTable.ext.renderer.pagingContainer.test; // remove
		$.fn.dataTable.ext.renderer.header.test = header;

		resetCounters();
		$('#example').DataTable({
			renderer: 'test'
		});

		checkCounters(6, 0, 0);
		checkHeaders('1', '6');
		checkButtons(false);
		await checkOrdering();
	});

	dt.html('basic');
	it('Set the renderer - as object with only the paging rendering type defined', async function() {
		resetCounters();
		$('#example').DataTable({
			renderer: {
				pagingButton: 'test',
				pagingContainer: 'test'
			}
		});

		checkCounters(0, 0, 0);
		checkHeaders(undefined, undefined);
		checkButtons(false);
		await checkOrdering();
	});

	dt.html('basic');
	it('Set the renderer - as object with only the `header` rendering type defined', async function() {
		resetCounters();
		$('#example').DataTable({
			renderer: {
				header: 'test'
			}
		});

		checkCounters(6, 0, 0);
		checkHeaders('1', '6');
		checkButtons(false);
		await checkOrdering();
	});
});

describe('renderer option initialisation types for both paging and header', function() {
	dt.html('basic');
	it('Set the renderer - as a string', async function() {
		$.fn.dataTable.ext.renderer.pagingButton.test = pagingButtons;
		$.fn.dataTable.ext.renderer.pagingContainer.test = pagingContainer;
		$.fn.dataTable.ext.renderer.header.test = header;

		resetCounters();
		$('#example').DataTable({
			renderer: 'test'
		});

		checkCounters(6, 10, 1);
		checkHeaders('1', '6');
		checkButtons(true);
		await checkOrdering();
	});

	dt.html('basic');
	it('Set the renderer - as object with only the paging rendering type defined', async function() {
		resetCounters();
		$('#example').DataTable({
			renderer: {
				pagingButton: 'test',
				pagingContainer: 'test',
			}
		});

		checkCounters(0, 10, 1);
		checkHeaders(undefined, undefined);
		checkButtons(true);
		await checkOrdering();
	});

	dt.html('basic');
	it('Set the renderer - as object with only the `header` rendering type defined', async function() {
		resetCounters();
		$('#example').DataTable({
			renderer: {
				header: 'test'
			}
		});

		checkCounters(6, 0, 0);
		checkHeaders('1', '6');
		checkButtons(false);
		await checkOrdering();
	});

	dt.html('basic');
	it('Set the renderer - `header` and `pageButton` defined', async function() {
		resetCounters();
		$('#example').DataTable({
			renderer: {
				header: 'test',
				pagingButton: 'test',
				pagingContainer: 'test',
			}
		});

		checkCounters(6, 10, 1);
		checkHeaders('1', '6');
		checkButtons(true);
		await checkOrdering();
	});
});

describe('renderer option page button functions - pagingButton', function() {
	dt.html('basic');
	it('Create the DataTable', function() {
		table = $('#example').DataTable({
			renderer: 'test'
		});
	});

	it('Six arguments are passed in', function() {
		expect(pageButtonArgs.length).toBe(5);
	});

	it('Arg 0 is the settings object', function() {
		expect(pageButtonArgs[0]).toBe(
			$('#example')
				.DataTable()
				.settings()[0]
		);
	});

	it('Arg 1 is the button type', function() {
		expect(pageButtonArgs[1]).toBe('last');
	});

	it('Arg 2 is the content', function() {
		expect(pageButtonArgs[2]).toBe('»');
	});

	it('Arg 3 is active state', function() {
		expect(pageButtonArgs[3]).toBe(false);
	});

	it('Arg 4 is the disabled state', function() {
		expect(pageButtonArgs[4]).toBe(false);
	});

	it('Last page Arg 4 is the disabled state', function() {
		table.page('last').draw(false);
		expect(pageButtonArgs[4]).toBe(true);
	});

	dt.html('basic');

	it('Create the DataTable with two paging controls', function() {
		table = $('#example').DataTable({
			renderer: 'test',
			layout: {
				topStart: 'paging'
			}
		});
	});

	it('Arg 2 is the content', function() {
		expect(pageButtonArgs[1]).toBe('last');
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
		expect(headerArgs.length).toBe(3);
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

	it('Arg 3 is the classes object', function() {
		expect(headerArgs[2].thead.cell).toBeDefined();
	});

	it('Renderer is called on each header cell', function() {
		expect($('th[counter]').length).toBe(6);
	});
});
