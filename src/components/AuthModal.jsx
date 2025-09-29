// components/AuthModal.jsx
import React, { useState, useEffect } from 'react';

const AuthModal = ({ isOpen, onClose, defaultUserType = '' }) => {
    const [authMode, setAuthMode] = useState('login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nom: '',
        prenom: '',
        telephone: '',
        role: defaultUserType || 'visiteur'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Réinitialiser le formulaire quand la modale s'ouvre
    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({
                ...prev,
                role: defaultUserType || 'visiteur',
                email: '',
                password: '',
                confirmPassword: '',
                nom: '',
                prenom: '',
                telephone: ''
            }));
            setError('');
            setSuccessMessage('');
        }
    }, [isOpen, defaultUserType]);

    // Service API simulé pour le débogage
    const apiService = {
        login: async (credentials) => {
            console.log('🔐 Tentative de connexion:', credentials);
            
            // Simulation d'un délai réseau
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Pour le débogage, acceptons toujours la connexion
            return {
                success: true,
                token: 'fake-jwt-token-' + Date.now(),
                user: {
                    email: credentials.email,
                    role: formData.role
                }
            };
        },
        
        register: async (userData) => {
            console.log('📝 Tentative d\'inscription:', userData);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return {
                success: true,
                message: 'Compte créé avec succès'
            };
        },
        
        forgotPassword: async (emailData) => {
            console.log('📧 Mot de passe oublié:', emailData);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return {
                success: true,
                message: 'Email envoyé'
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('🔄 Début de la soumission du formulaire');
        
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            console.log('📋 Validation du formulaire...');
            
            // Validation de base
            if (!formData.email || !formData.email.includes('@')) {
                throw new Error('Adresse email invalide');
            }

            if (authMode !== 'forgot' && !formData.password) {
                throw new Error('Mot de passe requis');
            }

            if (authMode === 'register') {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Les mots de passe ne correspondent pas');
                }
                if (formData.password.length < 6) {
                    throw new Error('Le mot de passe doit contenir au moins 6 caractères');
                }
            }

            console.log('✅ Validation réussie, appel API...');

            let result;

            if (authMode === 'login') {
                result = await apiService.login({
                    email: formData.email,
                    password: formData.password
                });
                
            } else if (authMode === 'register') {
                result = await apiService.register(formData);
                
            } else if (authMode === 'forgot') {
                result = await apiService.forgotPassword({
                    email: formData.email
                });
            }

            console.log('📨 Réponse API:', result);

            if (!result.success) {
                throw new Error(result.message || 'Erreur lors de l\'opération');
            }

            // Gestion des succès
            if (authMode === 'login') {
                console.log('🎉 Connexion réussie!');
                
                // Stocker le token
                if (result.token) {
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('userRole', formData.role);
                    localStorage.setItem('userEmail', formData.email);
                }
                
                setSuccessMessage('Connexion réussie! Redirection...');
                
                setTimeout(() => {
                    onClose();
                    window.location.href = '/dashboard';
                }, 1000);
                
            } else if (authMode === 'register') {
                console.log('🎉 Inscription réussie!');
                setSuccessMessage('Compte créé avec succès! Connexion automatique...');
                
                // Auto-login après inscription
                setTimeout(async () => {
                    try {
                        const loginResult = await apiService.login({
                            email: formData.email,
                            password: formData.password
                        });
                        
                        if (loginResult.success && loginResult.token) {
                            localStorage.setItem('authToken', loginResult.token);
                            localStorage.setItem('userRole', formData.role);
                            localStorage.setItem('userEmail', formData.email);
                            onClose();
                            window.location.href = '/dashboard';
                        }
                    } catch (loginError) {
                        setError('Compte créé mais échec de la connexion automatique');
                        setAuthMode('login');
                    }
                }, 2000);
                
            } else if (authMode === 'forgot') {
                console.log('📧 Email de réinitialisation envoyé!');
                setSuccessMessage('Un lien de réinitialisation a été envoyé à votre adresse email.');
                
                setTimeout(() => {
                    setAuthMode('login');
                }, 3000);
            }
            
        } catch (err) {
            console.error('❌ Erreur:', err);
            setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
            console.log('🏁 Fin du traitement');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const getTitle = () => {
        switch (authMode) {
            case 'login': return 'Connexion';
            case 'register': return 'Inscription';
            case 'forgot': return 'Réinitialiser le mot de passe';
            default: return 'Authentification';
        }
    };

    const getSubmitButtonText = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Chargement...
                </div>
            );
        }
        
        switch (authMode) {
            case 'login': return 'Se connecter';
            case 'register': return 'S\'inscrire';
            case 'forgot': return 'Envoyer le lien';
            default: return 'Valider';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* En-tête */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {authMode === 'login' && 'Connectez-vous à votre compte'}
                            {authMode === 'register' && 'Créez un nouveau compte'}
                            {authMode === 'forgot' && 'Entrez votre email pour réinitialiser votre mot de passe'}
                            {formData.role && formData.role !== 'visiteur' && ` - Profil : ${formData.role}`}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-light disabled:opacity-50"
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <div className="p-6">
                    {/* Messages d'erreur et de succès */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                            ❌ {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                            ✅ {successMessage}
                        </div>
                    )}

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Champs pour l'inscription */}
                        {authMode === 'register' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input 
                                            type="text"
                                            name="prenom"
                                            placeholder="Prénom"
                                            value={formData.prenom}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div>
                                        <input 
                                            type="text"
                                            name="nom"
                                            placeholder="Nom"
                                            value={formData.nom}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                
                                <input 
                                    type="tel"
                                    name="telephone"
                                    placeholder="Téléphone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                    disabled={loading}
                                />

                                <select 
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                    disabled={loading}
                                >
                                    <option value="visiteur">Visiteur</option>
                                    <option value="cooperative">Coopérative Agricole</option>
                                    <option value="acheteur">Acheteur/Commerçant</option>
                                    <option value="institution_financiere">Institution Financière</option>
                                    <option value="fournisseur">Fournisseur</option>
                                    <option value="admin">Administrateur</option>
                                </select>
                            </>
                        )}

                        {/* Champ email pour tous les modes */}
                        <div>
                            <input 
                                type="email"
                                name="email"
                                placeholder="hadjehaouamahamatissa@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Champs mot de passe (sauf pour forgot) */}
                        {authMode !== 'forgot' && (
                            <>
                                <div>
                                    <input 
                                        type="password"
                                        name="password"
                                        placeholder={authMode === 'register' ? 'Créez un mot de passe' : 'Mot de passe'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                        minLength={6}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Confirmation de mot de passe pour l'inscription */}
                                {authMode === 'register' && (
                                    <div>
                                        <input 
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirmez le mot de passe"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {/* Lien mot de passe oublié (seulement en mode login) */}
                        {authMode === 'login' && (
                            <div className="text-right">
                                <button 
                                    type="button"
                                    onClick={() => setAuthMode('forgot')}
                                    className="text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                                    disabled={loading}
                                >
                                    Mot de passe oublié ?
                                </button>
                            </div>
                        )}

                        {/* Bouton de soumission */}
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {getSubmitButtonText()}
                        </button>
                    </form>

                    {/* Liens de navigation entre les formulaires */}
                    <div className="text-center mt-4 space-y-2">
                        {authMode === 'login' && (
                            <p className="text-sm text-gray-600">
                                Pas de compte ?{' '}
                                <button 
                                    onClick={() => setAuthMode('register')}
                                    className="text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                                    disabled={loading}
                                >
                                    Créer un compte
                                </button>
                            </p>
                        )}

                        {authMode === 'register' && (
                            <p className="text-sm text-gray-600">
                                Déjà un compte ?{' '}
                                <button 
                                    onClick={() => setAuthMode('login')}
                                    className="text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                                    disabled={loading}
                                >
                                    Se connecter
                                </button>
                            </p>
                        )}

                        {authMode === 'forgot' && (
                            <p className="text-sm text-gray-600">
                                <button 
                                    onClick={() => setAuthMode('forgot')}
                                    className="text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                                    disabled={loading}
                                >
                                    ← Retour à la connexion
                                </button>
                            </p>
                        )}
                    </div>

                    {/* Section débogage (à retirer en production) */}
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
                        <div className="font-mono text-gray-600">
                            <div>Mode: {authMode}</div>
                            <div>Loading: {loading ? 'true' : 'false'}</div>
                            <div>Email: {formData.email}</div>
                            <div>Role: {formData.role}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;