describe('Legacy oLanguage option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Can set using options', function () {
		new DataTable('#example', {
			oLanguage: {
				sProcessing: 'Traitement en cours...',
				sSearch: 'Rechercher:',
				sLengthMenu: 'Afficher _MENU_ elements',
				sInfo: "Affichage de l'element _START_ a _END_ sur _TOTAL_ elements",
				sInfoEmpty: "Affichage de l'element 0 a 0 sur 0 elements",
				sInfoFiltered: '(filtre de _MAX_ elements au total)',
				sInfoPostFix: '',
				sLoadingRecords: 'Chargement en cours...',
				sZeroRecords: 'Aucun element a afficher',
				sEmptyTable: 'Aucune donnee disponible dans le tableau',
				oPaginate: {
					sFirst: 'Premier',
					sPrevious: 'Precedent',
					sNext: 'Suivant',
					sLast: 'Dernier'
				},
				oAria: {
					sSortAscending: ': activer pour trier la colonne par ordre croissant',
					sSortDescending:
						': activer pour trier la colonne par ordre decroissant'
				}
			}
		});

		expect($('.dt-paging-button.next').text()).toBe('Suivant');
		expect($('.dt-paging-button.previous').text()).toBe('Precedent');
		expect($('.dt-paging-button.first').text()).toBe('Premier');
		expect($('.dt-paging-button.last').text()).toBe('Dernier');
		expect($('div.dt-info').text()).toBe('Affichage de l\'element 1 a 10 sur 57 elements');
		expect($('div.dt-search label').text()).toBe('Rechercher:');
	});
});
