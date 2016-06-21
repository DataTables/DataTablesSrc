describe( "autoWidth option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

  describe("Check Default", function () {
    dt.html( 'basic' );
    it("Info div exists by default", function () {
			$('#example').dataTable();
      expect(document.getElementById('example_info')).toBeTruthy();
    });
    it("Four default options", function () {
      expect($("select[name=example_length] option").length == 4).toBeTruthy();
    });
  });

	describe("Check can disable", function () {
    dt.html( 'basic' );
		it("Change length can be disabled", function () {
			$('#example').dataTable({
				"lengthChange": false
			});
      expect(document.getElementById('example_length') === null).toBeTruthy();
		});
    it("Information takes length disabled into account", function () {
      expect(document.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entries").toBeTruthy();
    });
	});

  describe("Enable makes no difference", function () {
    dt.html( 'basic' );
    it("Length change enabled override", function () {
      $('#example').dataTable({
        "lengthChange": true
      });
      expect(document.getElementById('example_length')).not.toBeNull();
    });
  });

} );
