import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Eye, History } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/conges', label: 'Congés', icon: Calendar },
    { path: '/recrutement', label: 'Recrutement', icon: Users },
    { path: '/vue-manager', label: 'Vue Manager', icon: Eye },
    { path: '/historique', label: 'Historique', icon: History }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RH</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Gestion RH</h1>
          </div>
          
          <div className="hidden md:flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === path
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <select 
              className="form-input text-sm"
              value={location.pathname}
              onChange={(e) => window.location.href = e.target.value}
            >
              {navItems.map(({ path, label }) => (
                <option key={path} value={path}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;