// todo tests
// 1- Delete row, check deleted in DOM, memory and from Datatables chache


describe( "rows - row().remove()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().row().remove).toBe('function');
		});

		it('Returns API instance', function() {
			let table = $('#example').DataTable();
			expect(
				table.row().remove(['Fred Johnson', 'Accountant', 'Edinburgh', 24, '2009/11/28', '$65,000']) instanceof
					$.fn.dataTable.Api
			).toBe(true);
		});
	});

});
