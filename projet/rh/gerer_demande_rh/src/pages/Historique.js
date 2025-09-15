import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { History, Search, Calendar, Users, Filter } from 'lucide-react';

const Historique = () => {
  const { conges, recrutements } = useData();
  const [filtreType, setFiltreType] = useState('tous');
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [recherche, setRecherche] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  // Combiner les données de congés et recrutements
  const toutesLesDemandes = [
    ...conges.map(conge => ({
      ...conge,
      typeElement: 'Congé',
      titre: `${conge.type} - ${conge.employe}`,
      description: `Du ${new Date(conge.dateDebut).toLocaleDateString('fr-FR')} au ${new Date(conge.dateFin).toLocaleDateString('fr-FR')}`,
      personne: conge.employe
    })),
    ...recrutements.map(recrutement => ({
      ...recrutement,
      typeElement: 'Recrutement',
      titre: `${recrutement.typeContrat} - ${recrutement.role}`,
      description: `Début prévu: ${new Date(recrutement.dateDebut).toLocaleDateString('fr-FR')}`,
      personne: recrutement.role
    }))
  ].sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));

  // Filtrer les données
  const demandesFiltrees = toutesLesDemandes.filter(demande => {
    const matchType = filtreType === 'tous' || demande.typeElement === filtreType;
    const matchStatut = filtreStatut === 'tous' || demande.statut === filtreStatut;
    const matchRecherche = recherche === '' || 
      demande.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      demande.personne.toLowerCase().includes(recherche.toLowerCase()) ||
      (demande.commentaire && demande.commentaire.toLowerCase().includes(recherche.toLowerCase()));
    
    let matchDate = true;
    if (dateDebut && dateFin) {
      const dateCreation = new Date(demande.dateCreation);
      const debut = new Date(dateDebut);
      const fin = new Date(dateFin);
      matchDate = dateCreation >= debut && dateCreation <= fin;
    }

    return matchType && matchStatut && matchRecherche && matchDate;
  });

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Approuvé':
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      case 'Refusé':
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Planifié':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTypeColor = (type) => {
    return type === 'Congé' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800';
  };

  const statistiques = {
    total: toutesLesDemandes.length,
    conges: conges.length,
    recrutements: recrutements.length,
    enAttente: toutesLesDemandes.filter(d => d.statut === 'En attente').length
  };

  const statuts = [...new Set(toutesLesDemandes.map(d => d.statut))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historique</h1>
          <p className="text-gray-600 mt-1">Consultez l'historique de toutes les demandes</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-800">{statistiques.total}</div>
          <div className="text-sm text-gray-600">Total demandes</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{statistiques.conges}</div>
          <div className="text-sm text-gray-600">Demandes congés</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{statistiques.recrutements}</div>
          <div className="text-sm text-gray-600">Demandes recrutement</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">{statistiques.enAttente}</div>
          <div className="text-sm text-gray-600">En attente</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Filter size={20} />
          <span>Filtres et recherche</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="form-input pl-10"
                placeholder="Rechercher..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filtreType}
              onChange={(e) => setFiltreType(e.target.value)}
              className="form-input"
            >
              <option value="tous">Tous les types</option>
              <option value="Congé">Congés</option>
              <option value="Recrutement">Recrutements</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="form-input"
            >
              <option value="tous">Tous les statuts</option>
              {statuts.map(statut => (
                <option key={statut} value={statut}>{statut}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date début
            </label>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="form-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date fin
            </label>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
        
        {(recherche || filtreType !== 'tous' || filtreStatut !== 'tous' || dateDebut || dateFin) && (
          <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <span className="text-sm text-gray-600">
              {demandesFiltrees.length} résultat(s) trouvé(s)
            </span>
            <button
              onClick={() => {
                setRecherche('');
                setFiltreType('tous');
                setFiltreStatut('tous');
                setDateDebut('');
                setDateFin('');
              }}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Liste des demandes */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <History size={20} />
          <span>Historique des demandes</span>
        </h2>
        
        {demandesFiltrees.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Aucune demande trouvée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {demandesFiltrees.map((demande) => (
              <div key={`${demande.typeElement}-${demande.id}`} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(demande.typeElement)}`}>
                        {demande.typeElement}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(demande.statut)}`}>
                        {demande.statut}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(demande.dateCreation).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {demande.titre}
                    </h3>
                    
                    <p className="text-gray-600 mb-2">
                      {demande.description}
                    </p>
                    
                    {demande.commentaire && (
                      <p className="text-sm text-gray-500 italic">
                        "{demande.commentaire}"
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {demande.typeElement === 'Congé' ? (
                      <Calendar size={20} className="text-blue-500" />
                    ) : (
                      <Users size={20} className="text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Résumé par mois */}
      {demandesFiltrees.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Résumé par mois</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(
              demandesFiltrees.reduce((acc, demande) => {
                const mois = new Date(demande.dateCreation).toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long' 
                });
                acc[mois] = (acc[mois] || 0) + 1;
                return acc;
              }, {})
            ).slice(0, 6).map(([mois, count]) => (
              <div key={mois} className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-lg font-semibold text-gray-800">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{mois}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Historique;