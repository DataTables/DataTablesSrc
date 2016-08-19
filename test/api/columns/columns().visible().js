// todo tests
// - Confirm it exists and is a function
// - Always returns an API instance
// - Getter
//   - Will contain a boolean value for each of the selected columns. Consider:
//   - Column hidden by `columns.visible` at init returns false
//   - Column not hidden by `columns.visible` at init returns true
//   - Column hidden by API returns false
//   - Column hidden at init and then made visible returns true
// - Setter
//   - `false` will hide selected columns (check header, body and footer nodes)
//   - `true` will make selected columns visible (check header, body and footer nodes)
//   - Repeat the above with:
//     - `deferRender` and an Ajax sourced table
//     - A table with no footer
//     - A scrolling table with header and footer
//     - A scrolling table with no footer

describe( "columns- columns().visible()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default should be null", function () {
				});

	});

});
