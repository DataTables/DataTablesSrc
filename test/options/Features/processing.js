describe( "Processing option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
	describe("Check Default ", function () {
		dt.html( 'basic' );
		it("Processing is off by default", function () {
			expect($.fn.dataTable.defaults.bProcessing).toEqual(false);
		});
	});
	describe("Check can enable", function () {
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
	});
	describe("disable makes no difference", function () {
		dt.html( 'basic' );
		it("Processing disabled override", function () {
			$('#example').dataTable( {
				"processing": false
			});
			$('#example').on('processing.dt', function(e){
				expect(document.getElementById('example_processing')).toBeNull();
			});

			$('#example').off('processing.dt', function(e){});
		});
		it("Processing div is not in the DOM", function () {
			expect(document.getElementById('example_processing') === null).toBeTruthy();
		});
	});
} );
