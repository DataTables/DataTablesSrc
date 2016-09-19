// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API method
// - Select a cell using just a cell selector
//   - no selector (all cells)
//   - string selector (jQuery)
//   - node
//   - function
//   - jQuery instance
//   - object ({row:i, column:j})
//   - Array with combinations of the above
//   - Ensure that if the selector matches multiple cells, only a single cell is actually selected
// - Select cells with only a selector modifier
//   - order
//   - search
//   - page
// - Select cells using a cell selector and a selector modifier
//   - various mixes of the above
// - Select cells using a row and column selector
//   - Various combinations of row and column selectors
//   - Ensure that the selectors are cumulative
// - Select cells using row and column selectors with selector modifier

describe( 'cells: cell()', function() {
	var table;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'basic' );

	it ( '' , function () {
		
	} );
} );
