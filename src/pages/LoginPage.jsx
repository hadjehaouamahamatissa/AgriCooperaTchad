import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulation de connexion
    const userData = {
      id: 1,
      email: "admin@agricooperatchad.com",
      nom: "Admin",
      prenom: "System", 
      role: "admin",
      avatar: "https://ui-avatars.com/api/?name=Admin+System&background=10B981&color=fff"
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Connexion à AgriCooperaTchad</h1>
        <form className="space-y-4">
          <input 
            type="email" 
            placeholder="Votre email" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <input 
            type="password" 
            placeholder="Votre mot de passe" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <button 
            type="button"
            onClick={handleLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold transition-colors"
          >
            Se connecter
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          <a href="/" className="text-green-600 hover:text-green-700">
            ← Retour à l'accueil
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;