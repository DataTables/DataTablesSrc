
const features: any = {};
const legacy: any[] = [];

export {
	features,
	legacy
}

// Third parameter is internal only!
export default function register ( name: string, cb: Function, legacyChar='' ) {
	features[ name ] = cb;

	if (legacyChar) {
		legacy.push({
			cFeature: legacyChar,
			fnInit: cb
		});
	}
};
