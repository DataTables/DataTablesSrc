import { Dom } from '../dom';
import Settings from '../model/settings';

const features: any = {};
const legacy: any[] = [];

export { features, legacy };

type RegisterCallback<T> = (
	settings: Settings,
	options: T
) => HTMLElement | Dom | null;

// Third parameter is internal only!
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
