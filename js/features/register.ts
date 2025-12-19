import { Dom } from '../dom';
import { Context } from '../model/settings';

const features: any = {};
const legacy: any[] = [];

export { features, legacy };

type RegisterCallback<T> = (
	settings: Context,
	options: T
) => HTMLElement | Dom | null;

/**
 * Create a new feature that can be used for layout
 *
 * @param name The name of the new feature.
 * @param cb A function that will create the elements and event listeners for
 * the feature being added.
 */
export default function register<T>(
	name: string,
	cb: RegisterCallback<T>,
	legacyChar = ''
) {
	features[name] = cb;

	if (legacyChar) {
		legacy.push({
			cFeature: legacyChar,
			fnInit: cb
		});
	}
}
