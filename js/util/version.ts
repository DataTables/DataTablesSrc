import external from './external';

/**
 * Provide a common method for plug-ins to check the version of DataTables being
 * used, in order to ensure compatibility.
 *
 * @param version1 Version string to check for, in the format "X.Y.Z". Note that
 *   the formats "X" and "X.Y" are also acceptable.
 * @param version2 As above, but optional. If not given the current DataTables
 *   version will be used.
 * @returns true if this version of DataTables is greater or equal to the
 *   required version, or false if this version of DataTales is not suitable
 */
export function check(version1: string, version2: string) {
	let dt = external('datatable');
	var parts1 = version2 ? version2.split('.') : dt.ext.version.split('.');
	var parts2 = version1.split('.');
	var int1, int2;

	for (var i = 0, iLen = parts2.length; i < iLen; i++) {
		int1 = parseInt(parts1[i], 10) || 0;
		int2 = parseInt(parts2[i], 10) || 0;

		// Parts are the same, keep comparing
		if (int1 === int2) {
			continue;
		}

		// Parts are different, return immediately
		return int1 > int2;
	}

	return true;
}
