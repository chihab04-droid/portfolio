import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [conges, setConges] = useState([
    {
      id: 1,
      employe: 'Marie Dubois',
      type: 'Congés payés',
      dateDebut: '2024-02-15',
      dateFin: '2024-02-25',
      commentaire: 'Vacances d\'hiver',
      statut: 'En attente',
      dateCreation: '2024-01-15'
    },
    {
      id: 2,
      employe: 'Jean Martin',
      type: 'Congé maladie',
      dateDebut: '2024-01-20',
      dateFin: '2024-01-22',
      commentaire: 'Grippe',
      statut: 'Approuvé',
      dateCreation: '2024-01-18'
    }
  ]);

  const [recrutements, setRecrutements] = useState([
    {
      id: 1,
      typeContrat: 'CDI',
      role: 'Développeur Frontend',
      dateDebut: '2024-03-01',
      commentaire: 'Besoin urgent pour projet client',
      statut: 'En cours',
      dateCreation: '2024-01-10'
    },
    {
      id: 2,
      typeContrat: 'Stage',
      role: 'Assistant Marketing',
      dateDebut: '2024-04-15',
      commentaire: 'Stage de 6 mois',
      statut: 'Planifié',
      dateCreation: '2024-01-05'
    }
  ]);

  const ajouterConge = (conge) => {
    const nouveauConge = {
      ...conge,
      id: Date.now(),
      statut: 'En attente',
      dateCreation: new Date().toISOString().split('T')[0]
    };
    setConges(prev => [...prev, nouveauConge]);
  };

  const ajouterRecrutement = (recrutement) => {
    const nouveauRecrutement = {
      ...recrutement,
      id: Date.now(),
      statut: 'En cours',
      dateCreation: new Date().toISOString().split('T')[0]
    };
    setRecrutements(prev => [...prev, nouveauRecrutement]);
  };

  const mettreAJourStatutConge = (id, nouveauStatut) => {
    setConges(prev => 
      prev.map(conge => 
        conge.id === id ? { ...conge, statut: nouveauStatut } : conge
      )
    );
  };

  const value = {
    conges,
    recrutements,
    ajouterConge,
    ajouterRecrutement,
    mettreAJourStatutConge
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};