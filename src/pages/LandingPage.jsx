import React, { useState, useEffect } from 'react';
import { Users, Building2, ShoppingCart, Banknote, Truck, Eye, User, LogOut, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Composant Button
const Button = ({ children, onClick, variant = "default", size = "default", className = "", ...props }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

    const variants = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
    };

    const sizes = {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
    };

    const buttonClasses = twMerge(
        clsx(baseClasses, variants[variant], sizes[size], className)
    );

    return (
        <button
            className={buttonClasses}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

// Composants Card
const Card = ({ children, className = "", ...props }) => (
    <div className={twMerge('rounded-lg border bg-card text-card-foreground shadow-sm', className)} {...props}>
        {children}
    </div>
);

const CardContent = ({ children, className = "", ...props }) => (
    <div className={twMerge("p-6 pt-0", className)} {...props}>
        {children}
    </div>
);

const CardHeader = ({ children, className = "", ...props }) => (
    <div className={twMerge('flex flex-col space-y-1.5 p-6', className)} {...props}>
        {children}
    </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
    <h3 className={twMerge('text-2xl font-semibold leading-none tracking-tight', className)} {...props}>
        {children}
    </h3>
);

const CardDescription = ({ children, className = "", ...props }) => (
    <p className={twMerge("text-sm text-muted-foreground", className)} {...props}>
        {children}
    </p>
);

// COMPOSANT AUTHMODAL COMPLET
import AuthModal from '../components/AuthModal';

// COMPOSANT USER MENU
const UserMenu = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 border border-green-200 hover:border-green-300 transition-colors"
            >
                <img
                    src={user.avatar}
                    alt={`${user.prenom} ${user.nom}`}
                    className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">
                    {user.prenom} {user.nom}
                </span>
                <User className="w-4 h-4 text-gray-500" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.prenom} {user.nom}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>

                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Mon profil
                    </button>

                    <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                    </button>
                </div>
            )}
        </div>
    );
};

// COMPOSANT PRINCIPAL
export default function Index() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedUserType, setSelectedUserType] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    // Vérifier si l'utilisateur est déjà connecté au chargement
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

    const userTypes = [
        {
            id: 'admin',
            title: 'Administrateur',
            description: 'Gérer la plateforme et superviser toutes les activités',
            icon: Users,
            color: 'bg-red-500 hover:bg-red-600',
            features: ['Gestion globale', 'Supervision', 'Rapports avancés']
        },
        {
            id: 'cooperative',
            title: 'Coopérative Agricole',
            description: 'Gérer votre coopérative et vos membres',
            icon: Building2,
            color: 'bg-green-500 hover:bg-green-600',
            features: ['Gestion des membres', 'Vente de produits', 'Demandes de crédit']
        },
        {
            id: 'buyer',
            title: 'Acheteur/Commerçant',
            description: 'Acheter des produits agricoles en gros',
            icon: ShoppingCart,
            color: 'bg-blue-500 hover:bg-blue-600',
            features: ['Marketplace', 'Commandes en gros', 'Négociation prix']
        },
        {
            id: 'financial',
            title: 'Institution Financière',
            description: 'Offrir des services de crédit et financement',
            icon: Banknote,
            color: 'bg-green-500 hover:bg-green-600',
            features: ['Gestion des crédits', 'Évaluation risques', 'Paiements']
        },
        {
            id: 'supplier',
            title: 'Fournisseur',
            description: 'Fournir des intrants et equipements agricoles',
            icon: Truck,
            color: 'bg-green-500 hover:bg-green-600',
            features: ["Catalogue produits", "Livraisons", "Support technique"]
        },
        {
            id: "visitor",
            title: 'Visiteur',
            description: 'Explorer la plateforme sans engagement',
            icon: Eye,
            color: 'bg-green-500 hover:bg-green-600',
            features: ["Consultation libre", "Informations publiques", 'Decouverte']
        }
    ];

    const handleUserTypeSelect = (userType) => {
        setSelectedUserType(userType);
        setShowAuthModal(true);
    };

    const handleLoginSuccess = (userData) => {
        setCurrentUser(userData);

        // Redirection vers la page d'accueil de l'application
        setTimeout(() => {
            window.location.href = '/home';
        }, 1000);
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                    AgriCoopéraTchad
                                </h1>
                                <p className="text-sm text-gray-600">Plateforme de coopératives agricoles</p>
                            </div>
                        </div>

                        {/* Menu utilisateur ou bouton connexion */}
                        {currentUser ? (
                            <UserMenu user={currentUser} onLogout={handleLogout} />
                        ) : (
                            <Button
                                onClick={() => {
                                    setSelectedUserType("visitor");
                                    setShowAuthModal(true);
                                }}
                                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                            >
                                Se connecter
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Contenu principal */}
            {currentUser ? (
                // Interface après connexion
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <img
                            src={currentUser.avatar}
                            alt={`${currentUser.prenom} ${currentUser.nom}`}
                            className="w-24 h-24 rounded-full mx-auto mb-4"
                        />
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            Bienvenue, {currentUser.prenom} !
                        </h2>
                        <p className="text-gray-600 mb-4 capitalize">
                            Vous êtes connecté en tant que <strong>{currentUser.role}</strong>
                        </p>
                        <p className="text-green-600 font-semibold">
                            Accès complet à l'application AgriCooperaTchad
                        </p>

                        {/* Boutons d'accès selon le rôle */}
                        <div className="mt-8 flex justify-center gap-4">
                            {currentUser.role === 'admin' && (
                                <Button className="bg-red-600 hover:bg-red-700 text-white">
                                    Dashboard Admin
                                </Button>
                            )}
                            <Button className="bg-green-600 hover:bg-green-700 text-white">
                                Accéder à l'application
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                // Landing page normale (non connecté)
                <>
                    {/* Hero Section */}
                    <section className="py-20 px-4">
                        <div className="container mx-auto text-center">
                            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-yellow-600 bg-clip-text text-transparent">
                                Bienvenue sur AgriCooperaTchad
                            </h2>
                            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
                                La plateforme intégrée pour la gestion des coopératives agricoles au Tchad. Digitalisez, connectez, gérez et développez votre coopérative avec des outils adaptés à vos besoins pour une gestion exceptionnelle.
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-green-200">
                                    <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                                    <div className="text-gray-700">Cooperatives Enregistrees</div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                                    <div className="text-gray-700">Agriculteurs Connectes</div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">2M+</div>
                                    <div className="text-gray-700">FCFA Transactions</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* User Types Section */}
                    <section className="py-16 px-4 bg-white/40 backdrop-blur-sm">
                        <div className="container mx-auto">
                            <h3 className="text-3xl font-bold text-center mb-4 max-w-2xl mx-auto">
                                Choisissez votre profil
                            </h3>
                            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                                Selectionnez le type de compte qui correspond à votre activité pour accéder aux fonctionnalités adaptées à vos besoins.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {userTypes.map((type) => {
                                    const IconComponent = type.icon;
                                    return (
                                        <Card
                                            key={type.id}
                                            className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/80 backdrop-blur-sm border-2 hover:border-green-300"
                                            onClick={() => handleUserTypeSelect(type.id)}
                                        >
                                            <CardHeader className="text-center">
                                                <div className={`w-16 h-16 ${type.color} rounded-full flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110`}>
                                                    <IconComponent className="w-8 h-8 text-white" />
                                                </div>
                                                <CardTitle className='text-xl mb-2'>{type.title}</CardTitle>
                                                <CardDescription className="text-gray-600">
                                                    {type.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="space-y-2">
                                                    {type.features.map((feature, index) => (
                                                        <li key={index} className="flex items-center text-sm text-gray-700">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <Button
                                                    className={`w-full mt-6 ${type.color} text-white border-none`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUserTypeSelect(type.id);
                                                    }}
                                                >
                                                    Commencer
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-16 px-4">
                        <div className="container mx-auto">
                            <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
                                Fonctionnalités Principales
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4" >
                                        <Users className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-lg font-semibold mb-2">Gestion des Cooperatives</h4>
                                    <p className="text-gray-600 text-black">Organisez et gérez efficacement vos membres et activités</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShoppingCart className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-lg font-semibold mb-2">Marketplace de Produits Intégré</h4>
                                    <p className="text-gray-600 text-black">Vendez et achetez des produits agricoles en ligne</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4" >
                                        <Banknote className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-lg font-semibold mb-2">Financement Agricole</h4>
                                    <p className="text-gray-600 text-black">Accédez à des offres et crédits agricoles</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4" >
                                        <Truck className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-lg font-semibold mb-2">Logistique & Livraison</h4>
                                    <p className="text-gray-600 text-black">Solutions de transport et livraison optimisées</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="bg-gray-800 text-white py-12 px-4">
                        <div className="container mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div>
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-xl font-bold">AgriCooperaTchad</span>
                                    </div>
                                    <p className="text-gray-400 text-sm">
                                        Développer l'agriculture tchadienne grâce à la technologie et à la coopération moderne.
                                    </p>
                                </div>
                                <div>
                                    <h5 className="font-semibold mb-4">Liens Rapides</h5>
                                    <ul className="space-y-2 text-sm text-gray-400">
                                        <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-semibold mb-4">Ressources</h5>
                                    <ul className="space-y-2 text-sm text-gray-400">
                                        <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-semibold mb-4">Contact</h5>
                                    <div className="space-y-2 text-sm text-gray-400">
                                        <p>📧 admin@agricooperatchad.com</p>
                                        <p>📞 +235 66 50 51 41</p>
                                        <p>📍 Abéché, Tchad</p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
                                <p>&copy; 2025 AgriCooperaTchad. Tous droits réservés. @HDMI</p>
                            </div>
                        </div>
                    </footer>
                </>
            )}

            {/* Modal d'authentification */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                defaultUserType={selectedUserType}
                onLoginSuccess={handleLoginSuccess}
            />
        </div>
    );
}