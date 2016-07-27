describe( "currency option ", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {

		dt.html( 'currency' );
		it("Set thousands seperator", function () {
			// Change this list to the valid characters you want
			var validChars = "$£€c" + "0123456789" + ".-,()'";
			// Init the regex just once for speed - it is "closure locked"
			var
			str = jQuery.fn.dataTableExt.oApi._fnEscapeRegex( validChars ),
			re = new RegExp('[^'+str+']');
			$.fn.dataTableExt.aTypes.unshift(
				function ( data )
				{
					if ( typeof data !== 'string' || re.test(data) ) {
						return null;
					}
					return 'currency';
				}
			);
			$.fn.dataTable.ext.type.order['currency-pre'] = function ( data ) {
					console.log("test");
				var expression = /((\(\$))|(\$\()/g;
				//Check if its in the proper format
				if(data.match(expression)){
					//It matched - strip out parentheses & any characters we dont want and append - at front
					data = '-' + data.replace(/[\$\(\),]/g,'');
				}else{
					data = data.replace(/[\$\,]/g,'');
				}

				return parseInt( data, 10 );
			};



			$('#example').DataTable({
				ajax: '/base/test/data/currency.txt',
				columns: [
					{ data: "name" },
					{ data: "salary" }
				]

			});


		});
	});
});
