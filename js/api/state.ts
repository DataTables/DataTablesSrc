import { implementState, saveState } from '../core/state';
import { State, StateLoad } from '../model/state';
import * as object from '../util/object';
import { register } from './Api';
import { Api, ApiState } from './interface';

type ApiStateOverload = (
	this: Api,
	set?: State,
	ignoreTime?: boolean
) => State | null | Api;

register<ApiStateOverload>('state()', function (set?: StateLoad, ignoreTime?) {
	// getter
	if (!set) {
		return this.context.length ? this.context[0].oSavedState : null;
	}

	let setMutate = object.assignDeep<StateLoad>({}, set);

	// setter
	return this.iterator('table', function (settings) {
		if (ignoreTime !== false) {
			setMutate.time = +new Date() + 100;
		}

		implementState(settings, setMutate, function () {});
	});
});

register<ApiState<any>['clear']>('state.clear()', function () {
	return this.iterator('table', function (settings) {
		// Save an empty object
		settings.fnStateSaveCallback.call(settings.oInstance, settings, {});
	});
});

register<ApiState<any>['loaded']>('state.loaded()', function () {
	return this.context.length ? this.context[0].oLoadedState : null;
});

register<ApiState<any>['save']>('state.save()', function () {
	return this.iterator('table', function (settings) {
		saveState(settings);
	});
});
