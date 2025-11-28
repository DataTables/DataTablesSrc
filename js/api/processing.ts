import { processingDisplay } from '../core/processing';
import Api from './Api';
import { Api as ApiType } from './interface';

Api.register<ApiType<any>['processing']>('processing()', function (show) {
	return this.iterator('table', function (ctx) {
		processingDisplay(ctx, show);
	});
});
