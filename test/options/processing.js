describe( "Processing option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

  describe("Check Default ", function () {
		dt.html( 'basic' );
    it("Processing is off by default", function () {
      expect($('#example').DataTable().settings()[0].oFeatures.bProcessing).toEqual(false);
    });
    it("Processing div is not in DOM", function () {
      expect(document.getElementById('example_processing')).toBeNull();
    });
    it("Processing div cannot be shown", function () {
      $('#example_process').show();
      expect(document.getElementById('example_processing')).toBeNull();
    });
    it("Processing div cannot be hidden", function () {
      $('#example_process').hide();
      expect(document.getElementById('example_processing')).toBeNull();
    });
  });

	describe("Check can disable", function () {
		dt.html( 'basic' );
    it("Processing can be enabled", function () {
      $('#example').on('processing.dt', function(e){
        expect(document.getElementById('example_processing')).not.toBeNull();
      });
      $('#example').dataTable( {
        "processing": true
      });
      $('#example').off('processing.dt', function(e){});
    });
    it("Processing div is in the DOM", function () {
      expect(document.getElementById('example_processing')).toBeTruthy();
    });
    it("Processing div is hidden by default", function () {
      expect(document.getElementById('example_processing').style.visibility = "hidden").toBeTruthy();
    });
    it("Processing div can be shown", function () {
      $('#example_process').show();
      expect(document.getElementById('example_processing').style.visibility = "visible").toBeTruthy();
    });
    it("Processing div can be hidden", function () {
      $('#example_process').hide();
      expect(document.getElementById('example_processing').style.visibility = "hidden").toBeTruthy();
    });
	});

	describe("Enable makes no difference", function () {
		dt.html( 'basic' );
    it("Processing disabled override", function () {
      $('#example').dataTable( {
        "processing": false
      });
      expect($('#example').DataTable().settings()[0].oFeatures.bProcessing).toEqual(false);
    });
    it("Processing div is not in the DOM", function () {
      expect(document.getElementById('example_processing') === null).toBeTruthy();
    });

	});
} );
