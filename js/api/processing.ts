import { processingDisplay } from '../core/processing';
import { register } from './Api';
import { Api } from './interface';

register<Api['processing']>('processing()', function (show) {
	return this.iterator('table', ctx => processingDisplay(ctx, show));
});
