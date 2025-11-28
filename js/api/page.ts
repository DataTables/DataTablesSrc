import { lengthChange } from '../core/length';
import { pageChange } from '../core/page';
import Api from './Api';
import { ApiPage } from './interface';
import { dataSource } from './support';

Api.register('page()', function (action) {
	if (action === undefined) {
		return this.page.info().page; // not an expensive call
	}

	// else, have an action to take on all tables
	return this.iterator('table', function (settings) {
		pageChange(settings, action);
	});
});

Api.register<ApiPage['info']>('page.info()', function () {
	var settings = this.context[0],
		start = settings._iDisplayStart,
		len = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
		visRecords = settings.fnRecordsDisplay(),
		all = len === -1;

	return {
		page: all ? 0 : Math.floor(start / len),
		pages: all ? 1 : Math.ceil(visRecords / len),
		start: start,
		end: settings.fnDisplayEnd(),
		length: len,
		recordsTotal: settings.fnRecordsTotal(),
		recordsDisplay: visRecords,
		serverSide: dataSource(settings) === 'ssp'
	};
});

Api.register<ApiPage['len']>('page.len()', function (len?) {
	// Note that we can't call this function 'length()' because `length`
	// is a JavaScript property of functions which defines how many arguments
	// the function expects.
	if (len === undefined) {
		return this.context.length !== 0
			? this.context[0]._iDisplayLength
			: undefined;
	}

	// else, set the page length
	return this.iterator('table', function (settings) {
		lengthChange(settings, len);
	});
});
