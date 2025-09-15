import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Users, Briefcase } from 'lucide-react';

const Recrutement = () => {
  const { recrutements, ajouterRecrutement } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    typeContrat: '',
    role: '',
    dateDebut: '',
    commentaire: ''
  });

  const typesContrats = [
    'CDI',
    'CDD',
    'Stage',
    'Freelance',
    'Apprentissage',
    'Intérim'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.typeContrat && formData.role && formData.dateDebut) {
      ajouterRecrutement(formData);
      setFormData({
        typeContrat: '',
        role: '',
        dateDebut: '',
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
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getContratColor = (type) => {
    switch (type) {
      case 'CDI':
        return 'bg-green-100 text-green-800';
      case 'CDD':
        return 'bg-blue-100 text-blue-800';
      case 'Stage':
        return 'bg-purple-100 text-purple-800';
      case 'Freelance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion du Recrutement</h1>
          <p className="text-gray-600 mt-1">Gérez vos demandes de recrutement</p>
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
            <Users size={20} />
            <span>Nouvelle demande de recrutement</span>
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de contrat
              </label>
              <select
                name="typeContrat"
                value={formData.typeContrat}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Sélectionner un type</option>
                {typesContrats.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle/Poste
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-input"
                placeholder="Ex: Développeur Full Stack"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début souhaitée
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
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commentaire/Description
              </label>
              <textarea
                name="commentaire"
                value={formData.commentaire}
                onChange={handleChange}
                rows="4"
                className="form-input"
                placeholder="Décrivez les compétences requises, le contexte du poste..."
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
          <Briefcase size={20} />
          <span>Demandes de recrutement</span>
        </h2>
        
        {recrutements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Aucune demande de recrutement</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Type de contrat</th>
                  <th className="table-header">Rôle/Poste</th>
                  <th className="table-header">Date début</th>
                  <th className="table-header">Statut</th>
                  <th className="table-header">Date création</th>
                  <th className="table-header">Commentaire</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recrutements.map((recrutement) => (
                  <tr key={recrutement.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getContratColor(recrutement.typeContrat)}`}>
                        {recrutement.typeContrat}
                      </span>
                    </td>
                    <td className="table-cell font-medium">{recrutement.role}</td>
                    <td className="table-cell">
                      {new Date(recrutement.dateDebut).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(recrutement.statut)}`}>
                        {recrutement.statut}
                      </span>
                    </td>
                    <td className="table-cell text-gray-500">
                      {new Date(recrutement.dateCreation).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="table-cell max-w-xs">
                      <div className="truncate" title={recrutement.commentaire}>
                        {recrutement.commentaire || '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {recrutements.filter(r => r.statut === 'En cours').length}
          </div>
          <div className="text-sm text-gray-600">En cours</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {recrutements.filter(r => r.statut === 'Planifié').length}
          </div>
          <div className="text-sm text-gray-600">Planifiés</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {recrutements.filter(r => r.statut === 'Terminé').length}
          </div>
          <div className="text-sm text-gray-600">Terminés</div>
        </div>
      </div>
    </div>
  );
};

export default Recrutement;