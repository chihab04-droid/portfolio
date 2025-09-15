import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Eye, Check, X, Filter, Calendar } from 'lucide-react';

const VueManager = () => {
  const { conges, mettreAJourStatutConge } = useData();
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [filtreType, setFiltreType] = useState('tous');

  const handleApprouver = (id) => {
    mettreAJourStatutConge(id, 'Approuvé');
  };

  const handleRefuser = (id) => {
    mettreAJourStatutConge(id, 'Refusé');
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Approuvé':
        return 'bg-green-100 text-green-800';
      case 'Refusé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const calculerDuree = (dateDebut, dateFin) => {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diffTime = Math.abs(fin - debut);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const congesFiltres = conges.filter(conge => {
    const matchStatut = filtreStatut === 'tous' || conge.statut === filtreStatut;
    const matchType = filtreType === 'tous' || conge.type === filtreType;
    return matchStatut && matchType;
  });

  const typesConges = [...new Set(conges.map(c => c.type))];
  const statuts = ['En attente', 'Approuvé', 'Refusé'];

  const statistiques = {
    total: conges.length,
    enAttente: conges.filter(c => c.statut === 'En attente').length,
    approuves: conges.filter(c => c.statut === 'Approuvé').length,
    refuses: conges.filter(c => c.statut === 'Refusé').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vue Manager</h1>
          <p className="text-gray-600 mt-1">Gérez les demandes de congés de votre équipe</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-800">{statistiques.total}</div>
          <div className="text-sm text-gray-600">Total demandes</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">{statistiques.enAttente}</div>
          <div className="text-sm text-gray-600">En attente</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{statistiques.approuves}</div>
          <div className="text-sm text-gray-600">Approuvées</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">{statistiques.refuses}</div>
          <div className="text-sm text-gray-600">Refusées</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Filter size={20} />
          <span>Filtres</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Type de congé
            </label>
            <select
              value={filtreType}
              onChange={(e) => setFiltreType(e.target.value)}
              className="form-input"
            >
              <option value="tous">Tous les types</option>
              {typesConges.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des demandes */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Eye size={20} />
          <span>Demandes de congés à traiter</span>
        </h2>
        
        {congesFiltres.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Aucune demande correspondant aux filtres</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Employé</th>
                  <th className="table-header">Type</th>
                  <th className="table-header">Période</th>
                  <th className="table-header">Durée</th>
                  <th className="table-header">Statut</th>
                  <th className="table-header">Commentaire</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {congesFiltres.map((conge) => (
                  <tr key={conge.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-primary-600 font-medium text-sm">
                            {conge.employe.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{conge.employe}</div>
                          <div className="text-sm text-gray-500">
                            Demandé le {new Date(conge.dateCreation).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm font-medium">{conge.type}</span>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm">
                        <div className="font-medium">
                          {new Date(conge.dateDebut).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-gray-500">
                          au {new Date(conge.dateFin).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {calculerDuree(conge.dateDebut, conge.dateFin)} jour(s)
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(conge.statut)}`}>
                        {conge.statut}
                      </span>
                    </td>
                    <td className="table-cell max-w-xs">
                      <div className="truncate" title={conge.commentaire}>
                        {conge.commentaire || '-'}
                      </div>
                    </td>
                    <td className="table-cell">
                      {conge.statut === 'En attente' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprouver(conge.id)}
                            className="btn-success flex items-center space-x-1"
                            title="Approuver"
                          >
                            <Check size={16} />
                            <span className="hidden sm:inline">Approuver</span>
                          </button>
                          <button
                            onClick={() => handleRefuser(conge.id)}
                            className="btn-danger flex items-center space-x-1"
                            title="Refuser"
                          >
                            <X size={16} />
                            <span className="hidden sm:inline">Refuser</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Traité</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Actions rapides */}
      {statistiques.enAttente > 0 && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-yellow-800">
                {statistiques.enAttente} demande(s) en attente
              </h3>
              <p className="text-yellow-700">
                Des demandes nécessitent votre attention
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFiltreStatut('En attente')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Voir les demandes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VueManager;