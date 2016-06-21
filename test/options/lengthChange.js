describe( "autoWidth option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );


	dt.html( 'basic' );

  describe("Check the default", function () {
    it("Length Div exis by default", function () {
      $('#example').dataTable();
      expect(document.getElementById('example_length')).toBeTruthy();
    });

  });
} );
