describe('stateLoadCallback Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Should be a function', function() {
			expect(typeof $.fn.dataTable.defaults.fnStateLoadCallback).toBe('function');
		});

		dt.html('basic');
		it('Correct arguments passed to callback function', function() {
			let cbSettings = false;
			let table = $('#example').DataTable({
				stateSave: true,
				stateLoadCallback: function(settings, callback) {
					expect(arguments.length).toBe(2);
					expect(settings.hasOwnProperty('nTable')).toBe(true);
					expect(typeof callback).toBe('function');
					cbSettings = settings;
					return {};
				}
			});
			expect(cbSettings).toBe(table.settings()[0]);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Can load state using a custom function - sync', function() {
			var table = $('#example').DataTable({
				stateSave: true,
				stateLoadCallback: function(settings) {
					return {
						time: +new Date() + 100,
						start: 15,
						length: 5
					};
				}
			});

			expect(table.page()).toBe(3);
			expect(table.page.len()).toBe(5);
			expect($('#example tbody td:eq(0)').html()).toBe('Finn Camacho');
		});

		dt.html('basic');
		it('State not loaded if time not given', function() {
			var table = $('#example').DataTable({
				stateSave: true,
				stateLoadCallback: function(settings) {
					return {
						start: 15,
						length: 5
					};
				}
			});

			expect(table.page()).toBe(0);
			expect(table.page.len()).toBe(10);
			expect($('#example tbody td:eq(0)').html()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('State is not loaded if time is a long time in the past', function() {
			var table = $('#example').DataTable({
				stateSave: true,
				stateLoadCallback: function(settings) {
					return {
						time: 10000,
						start: 15,
						length: 5
					};
				}
			});

			expect(table.page()).toBe(0);
			expect(table.page.len()).toBe(10);
			expect($('#example tbody td:eq(0)').html()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Can load state using a custom function with callback - sync', function() {
			var table = $('#example').DataTable({
				stateSave: true,
				stateLoadCallback: function(settings, callback) {
					callback({
						time: +new Date() + 100,
						search: {
							search: 'Fiona'
						}
					});
				}
			});

			expect(table.search()).toBe('Fiona');
			expect($('#example tbody td:eq(0)').html()).toBe('Fiona Green');
		});

		dt.html('basic');
		it('Loading using an async function', function(done) {
			var table = $('#example').DataTable({
				stateSave: true,
				stateLoadCallback: function(settings, callback) {
					setTimeout(function() {
						callback({
							time: +new Date() + 100,
							start: 14,
							length: 7
						});

						expect(table.page()).toBe(2);
						expect(table.page.len()).toBe(7);
						expect($('#example tbody td:eq(0)').html()).toBe('Doris Wilder');
						done();
					}, 200);
				}
			});
		});
	});

	describe('Reload from stateSaveCallback to ensure the same', function() {
		dt.html('basic');

		let savedState = undefined;

		dt.html('basic');
		it('Do stuff to create a complex state', function() {
			let search = 0;
			let table = $('#example').DataTable({
				stateSave: true,
				stateSaveCallback: function(settings, data) {
					savedState = data;
				}
			});
			table.search('Angela', true, false, true);
			table.columns([1, 2]).order('desc');
			table.page.len(15);
			table.columns([3, 5]).visible(false);
			table.columns([1, 4]).search('Cox', true, false, true);
			table.draw();
		});

		dt.html('basic');
		it('Ensure all fields can be loaded', function() {
			// NOTE: doing this in one hit, stateSaveCallback was heavily tested so being more sparse here on the individual properties
			var table = $('#example').DataTable({
				stateSave: true,
				stateLoadCallback: function(settings, callback) {
					callback(savedState);
				}
			});

			expect(table.search()).toBe('Angela');
			expect(JSON.stringify(table.order())).toBe('[[1,"desc"],[2,"desc"]]');
			expect(table.page.len()).toBe(15);
			expect(
				JSON.stringify(
					table
						.columns()
						.visible()
						.toArray()
				)
			).toBe('[true,true,true,false,true,false]');
			expect(
				JSON.stringify(
					table
						.columns()
						.search()
						.toArray()
				)
			).toBe('["","Cox","","","Cox",""]');
		});
	});

	// https://datatables.net/forums/discussion/comment/130261
	describe('Two table interaction', function() {
		dt.html('two_tables');

		it('One table can load async state data while initialising the other', function(done) {
			$('#example_one').DataTable({
				stateSave: true,
				stateLoadCallback: function(settings, callback) {;
					setTimeout( function () {
						callback();
						done();
					}, 2000 );
				}
			});

			$('#example_two').DataTable({
				stateSave: true,
				stateLoadCallback: function(settings, callback) {
					return {};
				}
			});
		});
	});

	// https://datatables.net/forums/discussion/78851
	describe('Initialisation order', function() {
		var table;
		var order = [];
		var stateLoadNames = [];
		var initNames = [];

		dt.html('basic');

		it('Initialise DataTable', function (done) {
			$('thead th').eq(0).attr('data-data', 'name');
			$('thead th').eq(1).attr('data-data', 'position');
			$('thead th').eq(2).attr('data-data', 'office');
			$('thead th').eq(3).attr('data-data', 'age');
			$('thead th').eq(4).attr('data-data', 'startDate');
			$('thead th').eq(5).attr('data-data', 'salary');

			table = $('#example').DataTable({
				stateSave: true,
				initComplete: function(settings, json) {
					var api = new DataTable.Api(settings);

					api.columns().eq(0).each(function(index) {
						var dataSrc = api.column(index).dataSrc();
						initNames.push(index + ' => ' + dataSrc);
					});

					order.push('initComplete');

					expect(1).toBe(1);
				  	done();
				},
				stateLoadCallback: function(settings) {
					var state = DataTable.defaults.fnStateLoadCallback(settings);
					var api = new DataTable.Api(settings);

					api.columns().eq(0).each(function(index) {
						var dataSrc = api.column(index).dataSrc();
						stateLoadNames.push(index + ' => ' + dataSrc);
					});

					order.push('stateLoadCallback');
					return state;
				}
			});
		});

		it('Callbacks are called in order', function () {
			expect(order.length).toBe(2);
			expect(order[0]).toBe('stateLoadCallback');
			expect(order[1]).toBe('initComplete');
		});

		it('Data src is assigned by stateLoadCallback', function () {
			expect(stateLoadNames.length).toBe(6);
			expect(stateLoadNames[0]).toBe('0 => name');
			expect(stateLoadNames[1]).toBe('1 => position');
			expect(stateLoadNames[2]).toBe('2 => office');
			expect(stateLoadNames[3]).toBe('3 => age');
			expect(stateLoadNames[4]).toBe('4 => startDate');
			expect(stateLoadNames[5]).toBe('5 => salary');
		});

		it('And is correct in initComplete', function () {
			expect(initNames.length).toBe(6);
			expect(initNames[0]).toBe('0 => name');
			expect(initNames[1]).toBe('1 => position');
			expect(initNames[2]).toBe('2 => office');
			expect(initNames[3]).toBe('3 => age');
			expect(initNames[4]).toBe('4 => startDate');
			expect(initNames[5]).toBe('5 => salary');
		});
	});
});
