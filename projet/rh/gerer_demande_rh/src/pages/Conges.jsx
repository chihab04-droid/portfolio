import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Calendar, Clock } from 'lucide-react';

const Conges = () => {
  const { conges, ajouterConge } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employe: '',
    type: '',
    dateDebut: '',
    dateFin: '',
    commentaire: ''
  });

  const typesConges = [
    'Congés payés',
    'Congé maladie',
    'Congé maternité/paternité',
    'Congé sans solde',
    'RTT',
    'Congé formation'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.employe && formData.type && formData.dateDebut && formData.dateFin) {
      ajouterConge(formData);
      setFormData({
        employe: '',
        type: '',
        dateDebut: '',
        dateFin: '',
        commentaire: ''
      });
      setShowForm(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Congés</h1>
          <p className="text-gray-600 mt-1">Gérez vos demandes de congés</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nouvelle demande</span>
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Calendar size={20} />
            <span>Nouvelle demande de congé</span>
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employé
              </label>
              <input
                type="text"
                name="employe"
                value={formData.employe}
                onChange={handleChange}
                className="form-input"
                placeholder="Nom de l'employé"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de congé
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Sélectionner un type</option>
                {typesConges.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input
                type="date"
                name="dateDebut"
                value={formData.dateDebut}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                name="dateFin"
                value={formData.dateFin}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commentaire
              </label>
              <textarea
                name="commentaire"
                value={formData.commentaire}
                onChange={handleChange}
                rows="3"
                className="form-input"
                placeholder="Commentaire optionnel..."
              />
            </div>
            
            <div className="md:col-span-2 flex space-x-3">
              <button type="submit" className="btn-primary">
                Soumettre la demande
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tableau des demandes */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Clock size={20} />
          <span>Mes demandes de congés</span>
        </h2>
        
        {conges.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Aucune demande de congé</p>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {conges.map((conge) => (
                  <tr key={conge.id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">{conge.employe}</td>
                    <td className="table-cell">{conge.type}</td>
                    <td className="table-cell">
                      <div className="text-sm">
                        <div>{new Date(conge.dateDebut).toLocaleDateString('fr-FR')}</div>
                        <div className="text-gray-500">au {new Date(conge.dateFin).toLocaleDateString('fr-FR')}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      {calculerDuree(conge.dateDebut, conge.dateFin)} jour(s)
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(conge.statut)}`}>
                        {conge.statut}
                      </span>
                    </td>
                    <td className="table-cell max-w-xs truncate">
                      {conge.commentaire || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conges;