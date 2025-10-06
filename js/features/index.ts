

const features = {};
const legacy: any[] = [];

export {
	features,
	legacy
}

// Third parameter is internal only!
export default function register ( name, cb, legacyChar='' ) {
	features[ name ] = cb;

	if (legacyChar) {
		legacy.push({
			cFeature: legacyChar,
			fnInit: cb
		});
	}
};
