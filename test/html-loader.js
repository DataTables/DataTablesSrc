/**
 * @summary     DataTables testing suite, HTML and library loader
 * @version     1.0.0
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * Karma plug-in to export the DataTables library loader
 */

var initHtmlLoader = function(files) {
	files.unshift( {
		pattern: __dirname+'/html-loader-lib.js',
		included: true,
		served: true,
		watched: false
	} );
};

initHtmlLoader.$inject = ['config.files'];

module.exports = {
  'framework:html-loader': ['factory', initHtmlLoader]
};
