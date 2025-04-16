
import DataTable, {
	Api,
	ApiCellsMethods,
	ApiColumnMethods,
	ApiRowMethods,
	ApiTableMethods,
	ConfigColumns,
	DataType,
	HeaderStructure,
	SearchInput,
	SearchInputColumn,
	InternalSettings,
	ExtTypeSettingsDetect
} from "../types/types";
import {expectType} from 'tsd';

interface IRow {
	firstName: string;
	lastName: string;
	age: number;
}

let table = new DataTable('#myTable', {
	ajax: {
		url: '/api/test',
		dataSrc: {
			data: 'data',
			draw: 'draw',
			recordsFiltered: 'filtered',
			recordsTotal: 'total'
		}
	},
	caption: 'Table caption',
	columnDefs: [
		{
			footer: 'footer text',
			target: 1,
			orderSequence: ['asc', 'desc', '']
		}
	],
	language: {
		entries: {
			_: 'entries',
			1: 'entry'
		}
	},
	layout: {
		topStart: 'info',
		top: 'search',
		top1Start: {
			info: {},
			paging: {}
		},
		top1End: {
			info: {
				text: '_START_ to _END_'
			}
		},
		bottomEnd: [ 'pageLength', 'paging' ],
		bottom1End: [
			{
				paging: {
					buttons: 7,
					numbers: true,
					firstLast: true,
					previousNext: true,
					boundaryNumbers: false
				}
			}
		],
		bottomStart: null,
		bottom2Start: {
			paging: {
				buttons: 4,
				type: 'numbers',
				boundaryNumbers: false
			}
		},
		bottom3Start: {
			search: {
				placeholder: 'Search',
				processing: true,
				text: 'Search: '
			}
		},
		bottom4: {
			id: 'testId',
			className: 'testClass',
			features: ['search']
		},
		bottom5: {
			id: 'testId',
			className: 'testClass',
			features: [ 'search', 'paging' ]
		},
		bottom6: {
			rowId: 'testId',
			rowClass: 'testClass',
			features: {
                div: {
                    text: 'top2 row'
                }
            }
		},
		bottom7: {
			div: {
				id: 'testId',
				className: 'testClass'
			}
		},
		bottom8Start: () => {
			return document.createElement('div');
		},
		bottom9Start: document.createElement('div'),
		top2Start: $('#test')
	},
	on: {
		draw: () => {

		}
	},
	order: [
		{idx: 1, dir: 'asc'},
		{name: 'test', dir: 'asc'},
		[1, 'desc']
	],
	orderDescReverse: false,
	ordering: {
		indicators: true,
		handler: true
	},
	deferLoading: [ 1, 10 ],
});

const tableRowType = new DataTable<IRow>('#example');

expectType<Api<any>>(table);

expectType<string>(table.caption());
expectType<Api<any>>(table.caption('New caption'));
expectType<Api<any>>(table.caption('Other caption', 'bottom'));

expectType<Api<any>>(table.error('Error message'));

expectType<Api<any>>(table.trigger('name', []));
expectType<Api<any>>(table.trigger('name', [], true));

expectType<boolean>(table.ready());
expectType<Api<any>>(table.ready(function () {
	expectType<Api<any>>(this);
	expectType<Api<any>>(this.draw());
}));

expectType<Api<any>>(table.order(
	{idx: 1, dir: 'asc'},
	{name: 'test', dir: 'asc'},
	[1, 'desc']
));
expectType<Api<any>>(table.order([
	{idx: 1, dir: 'asc'},
	{name: 'test', dir: 'asc'},
	[1, 'desc']
]));


/*
 * Cells
 */
expectType<ApiCellsMethods<any>>(table.cells('th', {order: 'current'}));
expectType<ApiCellsMethods<any>>(table.cells(1, 0, {order: 'current'}));
expectType<ApiCellsMethods<any>>(table.cells('*', 0, {order: 'current'}));

/*
 * Columns
 */
expectType<Api<any>>(table.column(0).draw());

table.columns().every(function () {
	expectType<ApiColumnMethods<any>>(this);
	expectType<Api<any[]>>(this.data());
	expectType<number>(this.index());
});

table.columns({
	order: 'index'
});
table.columns({
	search: 'applied'
});
table.columns({
	columnOrder: 'implied'
});
table.columns(1, {
	order: 'current',
	search: 'removed',
	columnOrder: 'index'
});
table.columns([1, '.test']);

expectType<ConfigColumns>(table.column(0).init());
expectType<Api<ConfigColumns>>(table.columns().init());

expectType<string>(table.column(0).title());
expectType<string>(table.column(0).title(1));
expectType<Api<any>>(table.column(0).title('title'));
expectType<Api<any>>(table.column(0).title('title', 1));
expectType<Api<string>>(table.columns().titles());
expectType<Api<string>>(table.columns().titles(1));
expectType<Api<any>>(table.columns().titles('title'));
expectType<Api<any>>(table.columns().titles('title', 1));

expectType<HTMLElement>(table.column(0).header());
expectType<HTMLElement>(table.column(0).header(1));
expectType<Api<HTMLElement>>(table.columns().header());
expectType<Api<HTMLElement>>(table.columns().header(1));

expectType<boolean>(table.column(0).orderable());
expectType<Api<any>>(table.column(0).orderable(true));
expectType<Api<boolean>>(table.columns().orderable());
expectType<Api<any>>(table.columns().orderable(true));

expectType<Api<any>>(table.column(0).render());
expectType<Api<any>>(table.column(0).render('display'));
expectType<Api<any>>(table.columns().render());
expectType<Api<any>>(table.columns().render('display'));

expectType<Api<any>>(table.column(0).search(''));
expectType<Api<any>>(table.column(0).search('test', {
	boundary: true,
	regex: false,
	smart: true,
	caseInsensitive: true,
	exact: false
}));
expectType<Api<any>>(table.column(0).search(/regex/));
expectType<Api<any>>(table.column(0).search((d) => true));
expectType<Api<any>>(table.columns().search(''));
expectType<Api<any>>(table.columns().search('test', {
	boundary: true,
	regex: false,
	smart: true,
	caseInsensitive: true,
	exact: false
}));
expectType<Api<any>>(table.columns().search(/regex/));
expectType<Api<any>>(table.columns().search((d) => true));

expectType<Api<string>>(table.column(0).search.fixed());
expectType<SearchInputColumn<any> | undefined>(table.column(0).search.fixed('test'));
expectType<Api<any>>(table.column(0).search.fixed('test', null));
expectType<Api<any>>(table.column(0).search.fixed('test', 'search'));
expectType<Api<any>>(table.column(0).search.fixed('test', /regex/));
expectType<Api<any>>(table.column(0).search.fixed('test', (d) => true));
expectType<Api<Array<string>>>(table.columns().search.fixed());
expectType<Api<SearchInputColumn<any> | undefined>>(table.columns().search.fixed('test'));
expectType<Api<any>>(table.columns().search.fixed('test', null));
expectType<Api<any>>(table.columns().search.fixed('test', 'search'));
expectType<Api<any>>(table.columns().search.fixed('test', /regex/));
expectType<Api<any>>(table.columns().search.fixed('test', (d) => true));

expectType<string>(table.column(0).type());
expectType<Api<string>>(table.columns().types());

expectType<number | null>(table.column(0).width());
expectType<Api<number | null>>(table.columns().widths());

expectType<HeaderStructure>(table.table().header.structure()[0][0]);
expectType<HeaderStructure>(table.table().footer.structure()[0][0]);

/* Tables */
table.tables().every(function (i) {
	expectType<ApiTableMethods<any>>(this);
	expectType<Api<any[]>>(this.draw());
	expectType<Node>(this.header());
	expectType<number>(i);
});
expectType<HTMLTableElement>(table.table().node());
expectType<HTMLTableSectionElement>(table.table().header());
expectType<HTMLTableSectionElement>(table.table().body());
expectType<HTMLTableSectionElement>(table.table().footer());


/* Search */
expectType<Api<string>>(table.search.fixed());
expectType<SearchInput<any> | undefined>(table.search.fixed('test'));
expectType<Api<any>>(table.search.fixed('test', null));
expectType<Api<any>>(table.search.fixed('test', 'search'));
expectType<Api<any>>(table.search.fixed('test', /regex/));
expectType<Api<any>>(table.search.fixed('test', (d) => true));

/*
 * Event listeners
 */
expectType<Api<any>>(table.off('draw'));
expectType<Api<any>>(table.off('draw', function () {}));
expectType<Api<any>>(table.off('click', 'tbody td'));
expectType<Api<any>>(table.off('click', 'tbody td', function () {}));
expectType<Api<any>>(table.on('draw', function () {}));
expectType<Api<any>>(table.on('click', 'tbody td', function () {}));
expectType<Api<any>>(table.one('draw', function () {}));
expectType<Api<any>>(table.one('click', 'tbody td', function () {}));

// Check `this` is an HTMLElement
table.on('draw', function () {
	this.getElementsByTagName('test');
});

table.on('click', 'tbody td', function () {
	this.getElementsByTagName('test');
});

/*
 * Rows
 */
expectType<Node>(table.row.add(['a', 'b', 'c']).node());

expectType<Api<any>>(table.rows({order: 1}).data());
expectType<Api<Node[]>>(table.rows.add([['a', 'b', 'c']]).nodes());

tableRowType.rows().every(function () {
	expectType<ApiRowMethods<any>>(this);
	expectType<IRow>(this.data());
	expectType<number>(this.index());
});

expectType<HTMLTableRowElement>(table.row(1).node());



/*
 * Static
 */
DataTable.feature.register('myFeature', function (dt, opts) {
	return document.createElement('div');
});

expectType<string[]>(DataTable.types());
expectType<DataType>(DataTable.type('num'));
expectType<string | undefined>(DataTable.type('num').className);
expectType<(ExtTypeSettingsDetect | undefined)>(DataTable.type('num').detect);
DataTable.type('num', 'className', 'test');
DataTable.type('num', 'detect', (d: any) => 'test');
DataTable.type('num', 'detect', {
	oneOf: d => true,
	allOf: d => true
});
DataTable.type('num', 'order', {
	pre: d => d,
	asc: (a, b) => a-b,
	desc: (a, b) => a+b,
});
DataTable.type('num', {
	className: 'test'
});
DataTable.type('num', {
	className: 'test',
	detect: (d) => true,
	order: {
		pre: d => d,
		asc: (a, b) => a-b,
		desc: (a, b) => a+b,
	},
	render: d => d,
	search: d => d
});

expectType<void>(DataTable.use('win', window));

expectType<number[]>(DataTable.util.unique([1,2,3,4]));

expectType<string>(DataTable.util.stripHtml('some html'));
expectType<void>(DataTable.util.stripHtml((s) => s));

expectType<string>(DataTable.util.escapeHtml('some text'));
expectType<void>(DataTable.util.escapeHtml((s) => s));

expectType<string>(DataTable.util.diacritics('accented text'));
expectType<string>(DataTable.util.diacritics('accented text', true));
expectType<void>(DataTable.util.diacritics((s, r) => s));


expectType<any>(DataTable.util.get('hello'));
expectType<any>(DataTable.util.set('hello'));


var res = DataTable.Api.register('apiMethod()', function (from, to) {
	expectType<Api<any>>(this);
	expectType<Api<any>>(this.draw());
	expectType<Api<any>>(this.draw(false));
	expectType<number | null>(table.column(0).width());
});

expectType<void>(res);

expectType<string>(DataTable.ext.classes.container);
expectType<string>(DataTable.ext.classes.table);
expectType<string>(DataTable.ext.classes.tbody.row);
expectType<string>(DataTable.ext.classes.tbody.cell);
