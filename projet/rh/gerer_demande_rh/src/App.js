import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Conges from './pages/Conges';
import Recrutement from './pages/Recrutement';
import VueManager from './pages/VueManager';
import Historique from './pages/Historique';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Conges />} />
              <Route path="/conges" element={<Conges />} />
              <Route path="/recrutement" element={<Recrutement />} />
              <Route path="/vue-manager" element={<VueManager />} />
              <Route path="/historique" element={<Historique />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;