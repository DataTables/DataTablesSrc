

const features = {};

// Third parameter is internal only!
export default function register ( name, cb, legacy='' ) {
	features[ name ] = cb;

	if (legacy) {
		_ext.features.push({
			cFeature: legacy,
			fnInit: cb
		});
	}
};
