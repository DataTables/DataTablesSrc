describe('language.url option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		dt.html('basic');

		it('url is blank by default ', function () {
			expect(DataTable.defaults.language.url).toBe('');
		});

		dt.html('basic');

		it('Loading of German file loads language information', function (done) {
			let table = new DataTable('#example', {
				language: {
					url: 'https://cdn.datatables.net/plug-ins/2.3.7/i18n/de-DE.json'
				}
			});

			table.ready(() => {
				expect($('div.dt-length label').text()).toBe(
					' Zeilen anzeigen'
				);
				expect($('div.dt-search label').text()).toBe('Suche:');
				expect($('div.dt-info').text()).toBe(
					'1 bis 10 von 57 Einträgen'
				);
				done();
			});
		});

		dt.html('basic');

		it('Mixed remote and local options', function (done) {
			let table = new DataTable('#example', {
				language: {
					lengthMenu: '_MENU_ ROWS',
					url: 'https://cdn.datatables.net/plug-ins/2.3.7/i18n/fr-FR.json'
				}
			});

			table.ready(() => {
				expect($('div.dt-length label').text()).toBe(' ROWS');
				expect($('div.dt-search label').text()).toBe('Rechercher :');
				expect($('div.dt-info').text()).toBe(
					'Affichage de 1 à 10 sur 57 entrées'
				);
				done();
			});
		});
	});
});
