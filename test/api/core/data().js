// todo tests

// - Contains data for each row from the table in the result set
// - Should make sure data is in raw format ie- this doesn't change the data from the original format (arrays or objects)
// - Data is in index order
// - The data objects / arrays are the original objects / arrays that were given to the table (test by using `row.add(...)` with a known object and then check that the row object returned in this collection matches
describe('core - data()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');		
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().data).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(
				$('#example')
					.DataTable()
					.data() instanceof $.fn.dataTable.Api
			).toBe(true);
		});
	});

	describe('Functional tests (DOM)', function() {
		dt.html('basic');
		let table, data;
		it('Contains data for each row', function() {
			table = $('#example').DataTable();
			data = table.data();
			expect(data.toArray().length).toBe(57);
		});
		it('In the order of the index', function() {
			expect(data[0][0]).toBe('Tiger Nixon');
			expect(data[56][0]).toBe('Donna Snider');
		});
	});

	// function readFile() {
	// 	// var fs = require("fs");
	// 	// var text = fs.readFileSync('/base/test/data/array.txt');
	// 	// console.log(text)
	// }

	// describe('Functional tests (Array)', function() {
	// 	dt.html('empty');
	// 	let table, data;
	// 	it('Contains data for each row', function() {
	// 		// let array;
	// 		// jQuery.get('/base/test/data/array.txt', function(d) {
	// 		// 	console.log('XX: ' + d);
	// 		// 	var source = text.s
	// 		// 	table = $('#example').DataTable({
	// 		// 		data: d,
	// 		// 		initComplete: function() {
	// 		// 			data = table.data();
	// 		// 			expect(data.toArray().length).toBe(57);
	// 		// 			done();
	// 		// 		}
	// 		// 	});
	// 		// });
	// 		readFile();
	// 	});
	// });
});
