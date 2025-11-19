import { processingDisplay } from '../core/processing';
import Api from './Api';

Api.register('processing()', function (show) {
	return this.iterator('table', function (ctx) {
		processingDisplay(ctx, show);
	});
});
