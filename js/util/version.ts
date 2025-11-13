import external from './external';

/**
 * Provide a common method for plug-ins to check the version of DataTables being
 * used, in order to ensure compatibility.
 *
 * @param version Version string to check for, in the format "X.Y.Z". Note that
 *   the formats "X" and "X.Y" are also acceptable.
 * @param version2 As above, but optional. If not given the current DataTables
 *   version will be used.
 * @returns true if this version of DataTables is greater or equal to the
 *   required version, or false if this version of DataTales is not suitable
 */
export function check(version: string, version2: string) {
	let dt = external('datatable');
	var aThis = version2 ? version2.split('.') : dt.ext.version.split('.');
	var aThat = version.split('.');
	var iThis, iThat;

	for (var i = 0, iLen = aThat.length; i < iLen; i++) {
		iThis = parseInt(aThis[i], 10) || 0;
		iThat = parseInt(aThat[i], 10) || 0;

		// Parts are the same, keep comparing
		if (iThis === iThat) {
			continue;
		}

		// Parts are different, return immediately
		return iThis > iThat;
	}

	return true;
}
