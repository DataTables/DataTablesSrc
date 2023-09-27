
DataTable.feature = {};

DataTable.feature.register = function ( name, cb ) {
	DataTable.ext.features[ name ] = cb;
};
