describe('init - ajax', function() {
	var server;
	var table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('empty');

	it('204 from server results in empty table', function(done) {
		server = sinon.fakeServer.create({autoRespond:true});
		server.respondWith([204, {}, '']);

		table = $('#example').DataTable({
			ajax: '/204',
			initComplete: function() {
				expect(table.page.info().recordsTotal).toBe(0);
                
		        server.restore();
				done();
			}
		});
	});

	dt.html('empty');

	it('204 from server results in empty table - with ajax.dataSrc', function(done) {
		server = sinon.fakeServer.create({autoRespond:true});
		server.respondWith([204, {}, '']);

		table = $('#example').DataTable({
			ajax: {
                url: '/204',
                dataSrc: 'test.world'
            },
			initComplete: function() {
				expect(table.page.info().recordsTotal).toBe(0);
                
		        server.restore();
				done();
			}
		});
	});

	dt.html('empty');
    
	it('null from server results in empty table', function(done) {
		server = sinon.fakeServer.create({autoRespond:true});
		server.respondWith([200, {}, 'null']);

		table = $('#example').DataTable({
			ajax: '/null',
			initComplete: function() {
				expect(table.page.info().recordsTotal).toBe(0);
                
		        server.restore();
				done();
			}
		});
	});
});
