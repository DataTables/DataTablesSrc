
$.extend( DataTable.ext.classes, {
	container: 'dataTables_wrapper',
	empty: {
		row: 'dataTables_empty'
	},
	info: {
		container: 'dataTables_info'
	},
	length: {
		container: 'dataTables_length',
		select: 'dt-input'
	},
	order: {
		canAsc: 'dt-orderable-asc',
		canDesc: 'dt-orderable-desc',
		isAsc: 'dt-ordering-asc',
		isDesc: 'dt-ordering-desc',
		none: 'dt-orderable-none',
		position: 'sorting_'
	},
	processing: {
		container: 'dataTables_processing'
	},
	scrolling: {
		body: 'dataTables_scrollBody',
		container: 'dataTables_scroll',
		footer: {
			self: 'dataTables_scrollFoot',
			inner: 'dataTables_scrollFootInner'
		},
		header: {
			self: 'dataTables_scrollHead',
			inner: 'dataTables_scrollHeadInner'
		}
	},
	search: {
		container: 'dataTables_filter',
		input: 'dt-input'
	},
	table: 'dataTable',	
	tbody: {
		cell: '',
		row: ''
	},
	thead: {
		cell: '',
		row: ''
	},
	tfoot: {
		cell: '',
		row: ''
	},
	paging: {
		active: 'current',
		button: 'paginate_button',
		container: 'dataTables_paginate',
		disabled: 'disabled'
	}
} );
