describe( "currency option ", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {

		dt.html( 'currency' );
		it("Set the thousands separator", function () {
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
				//Check if its in the proper format
				if(data.match(/[\()]/g)){
					if( data.match(/[\-]/g) !== true){
						//It matched - strip out parentheses & any characters we dont want and append - at front
						data = '-' + data.replace(/[\$£€c\(\),]/g,'');
					}else{
						//Already has a '-' so just strip out non-numeric characters excluding '-'
						data = data.replace(/[^\d\-\.]/g,'');
					}
				}else{
					data = data.replace(/[\$£€\,]/g,'');
				}
				return parseInt( data, 10 );
			};
		});
	});
});
