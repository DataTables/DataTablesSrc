
DataTable.feature = {};

// Third parameter is internal only!
DataTable.feature.register = function ( name, cb, legacy ) {
	DataTable.ext.features[ name ] = cb;

	if (legacy) {
		_ext.feature.push({
			cFeature: legacy,
			fnInit: cb
		});
	}
};
