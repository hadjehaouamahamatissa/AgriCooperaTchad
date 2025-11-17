import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Home,
    Users,
    DollarSign,
    ShoppingCart,
    BookOpen,
    Menu,
    X,
    User,
    LogOut,
    Edit3,
    Shield,
    ShoppingCart as CartIcon,
    UserX,
    ChevronRight
} from "lucide-react";

// Import des composants externalisés
import { useLanguage } from "../contexts/LangContext";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "../hooks/useTranslation" 


// Composant ProfileModal intégré directement
const ProfileModal = ({ isOpen, onClose, user, onEditProfile }) => {
    const { t } = useLanguage();
    const [status, setStatus] = useState('online');

    if (!isOpen || !user) return null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const handleStatusChange = () => {
        const statuses = ['online', 'away', 'busy', 'invisible'];
        const currentIndex = statuses.indexOf(status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        setStatus(statuses[nextIndex]);
    };

    const getStatusColor = () => {
        switch(status) {
            case 'online': return 'bg-green-500';
            case 'away': return 'bg-yellow-500';
            case 'busy': return 'bg-red-500';
            case 'invisible': return 'bg-gray-500';
            default: return 'bg-green-500';
        }
    };

    const getStatusText = () => {
        switch(status) {
            case 'online': return t('profile.status.online');
            case 'away': return t('profile.status.away');
            case 'busy': return t('profile.status.busy');
            case 'invisible': return t('profile.status.invisible');
            default: return t('profile.status.online');
        }
    };

    const getRoleText = (role) => {
        return t(`roles.${role}`) || t('roles.user');
    };

    const userName = user.nom || user.name || user.prenom || t('Profile');
    const userEmail = user.email || t('profile.emailNotAvailable');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 text-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl">
                {/* Header avec image de profil */}
                <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    
                    <div className="flex flex-col items-center">
                        {/* Avatar */}
                        <div className="relative mb-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor()} rounded-full border-2 border-gray-900`}></div>
                        </div>
                        
                        {/* Nom et email */}
                        <h2 className="text-xl font-bold mb-1">
                            {userName}
                        </h2>
                        <p className="text-white/80 text-sm mb-2">
                            {userEmail}
                        </p>
                        
                        {/* Badge rôle */}
                        <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                            {getRoleText(user.role)}
                        </span>
                    </div>
                </div>

                {/* Section Boost ton profil */}
                <div className="p-4 border-b border-gray-700">
                    <div className="bg-gray-800 rounded-lg p-3 mb-3">
                        <h3 className="text-sm font-semibold mb-2 flex items-center">
                            <span className="mr-2">✨</span>
                            {t('profile.boostProfile')}
                            <button className="ml-auto text-gray-400 hover:text-white">
                                <X className="h-4 w-4" />
                            </button>
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-2">
                            <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 rounded-lg p-2 text-xs font-medium transition-colors">
                                <Shield className="h-4 w-4" />
                                <span>{t('profile.getNitro')}</span>
                            </button>
                            <button className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 rounded-lg p-2 text-xs font-medium transition-colors">
                                <CartIcon className="h-4 w-4" />
                                <span>{t('profile.shop')}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menu d'actions */}
                <div className="p-2">
                    {/* Modifier le profil */}
                    <button 
                        onClick={onEditProfile}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors group"
                    >
                        <div className="flex items-center space-x-3">
                            <Edit3 className="h-5 w-5 text-gray-400" />
                            <span className="text-sm">{t('Modifier le profil')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                {t('En ligne')}
                            </span>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                        </div>
                    </button>

                    {/* Statut */}
                    <button 
                        onClick={handleStatusChange}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors group"
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`h-5 w-5 ${getStatusColor()} rounded-full`}></div>
                            <span className="text-sm">{getStatusText()}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                    </button>

                    {/* Changer de compte */}
                    <button 
                        onClick={() => alert('Fonctionnalité à venir')}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors group"
                    >
                        <div className="flex items-center space-x-3">
                            <UserX className="h-5 w-5 text-gray-400" />
                            <span className="text-sm">{t('Changer le compte')}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                    </button>

                    {/* Déconnexion */}
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between p-3 hover:bg-red-600/20 rounded-lg transition-colors group text-red-400 hover:text-red-300"
                    >
                        <div className="flex items-center space-x-3">
                            <LogOut className="h-5 w-5" />
                            <span className="text-sm">{t('Se deconnecter')}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 group-hover:text-red-300 transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Composant EditProfileModal intégré directement
const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        telephone: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                nom: user.nom || user.name || '',
                email: user.email || '',
                telephone: user.telephone || ''
            });
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{t('profile.editProfile')}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('Nom complet')}
                        </label>
                        <input
                            type="text"
                            value={formData.nom}
                            onChange={(e) => setFormData({...formData, nom: e.target.value})}
                            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('email')}
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('telephone')}
                        </label>
                        <input
                            type="tel"
                            value={formData.telephone}
                            onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                            {t('Annuler')}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {t('Sauvegarder')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Composant Layout principal
const LayoutContent = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const { t, language } = useLanguage();
    const token = localStorage.getItem("token");

    // Récupérer les infos du profil
    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return;
            try {
                const res = await fetch("http://localhost:5000/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                console.log('📊 Données utilisateur reçues:', data);
                if (res.ok) {
                    setUser(data.data || data);
                }
            } catch (err) {
                console.error("Erreur récupération profil :", err);
            }
        };
        fetchProfile();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const toggleProfileModal = () => {
        setShowProfileModal(!showProfileModal);
    };

    const handleEditProfile = () => {
        setShowProfileModal(false);
        setShowEditModal(true);
    };

    const handleSaveProfile = async (formData) => {
        try {
            const res = await fetch("http://localhost:5000/api/users/profile", {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser.data || updatedUser);
                alert('Profil mis à jour avec succès !');
            }
        } catch (err) {
            console.error("Erreur mise à jour profil:", err);
            alert('Erreur lors de la mise à jour du profil');
        }
    };

    const menuItems = [
        { icon: Home, label: t("Tableau de bord"), path: "/Home" },
        { icon: Users, label: t("Cooperative"), path: "/cooperatives" },
        { icon: ShoppingCart, label: t("Marketplace"), path: "/marketplace" },
        { icon: DollarSign, label: t("Finance"), path: "/finance" },
        // { icon: BookOpen, label: "Ressources", path: "/resources" },
    ];

    const displayName = user ? (user.nom || user.name || user.prenom || t('auth.myProfile')) : t('auth.myProfile');

    return (
        <div className={`flex h-screen bg-gradient-to-br ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            {/* Sidebar */}
            <div className={`bg-white border-r border-green-200  hover:bg-green-50 w-64 min-h-screen p-4 flex flex-col justify-between ${
                sidebarOpen ? "block" : "hidden"
            } md:block`}>
                <div>
                    {/* Logo + fermer */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-xl font-bold text-green-600 hover:text-blue-600">{t('AGRICOOPERATCHAD')}</h1>
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Menu */}
                    <nav>
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                                isActive
                                                    ? "bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold border border-green-200"
                                                    : "text-white-600 hover:bg-black-50 hover:text-green-600"
                                            }`}
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <Icon size={20} />
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                {/* Section bas de sidebar */}
                <div className="mt-4 space-y-2">
                    {/* Sélecteur de langue */}
                    {/* <LanguageSelector /> */}
                    
                    {/* Bouton profil */}
                    <button
                        onClick={toggleProfileModal}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-100 transition w-full text-left"
                    >
                        <User size={18} />
                        <span>{displayName}</span>
                    </button>

                    {/* Déconnexion */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                    >
                        <LogOut size={18} />
                        {t('Déconnexion')}
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800">
                            {t('Système de gestion des coopératives agricoles')}
                        </h2>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <ProfileModal 
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                user={user}
                onEditProfile={handleEditProfile}
            />

            <EditProfileModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                user={user}
                onSave={handleSaveProfile}
            />
        </div>
    );
};

// Wrapper avec Provider
export default function Layout({ children }) {
    return (
        <LayoutContent>{children}</LayoutContent>
    );
}