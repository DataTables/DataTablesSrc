// todo tests
// 1- cells([modifier]) has exactly one paremeter and is of type ('selector-modifier')
// 2- Test using no parameters, selector-modifier
// 3- select different ammount of cells
// 4- cells( cellSelector, [modifier]) Test for two paramets and of correct type
// 5- cell( rowSelector)-  test all parameters then do tests using different values for each of the parameters

describe( "cells- cells()", function() {
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
