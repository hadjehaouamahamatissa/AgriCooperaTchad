import React, { useState, useEffect } from 'react';
import { Users, Building2, ShoppingCart, Banknote, Truck, Eye, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLanguage } from '../contexts/LangContext';
import LanguageSelector from "../components/LanguageSelector";
import AuthModal from '../components/AuthModal';

// Composant Button responsive
const Button = ({ children, onClick, variant = "default", size = "default", className = "", ...props }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

    const variants = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
    };

    const sizes = {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md text-xs',
        lg: 'h-11 px-8 rounded-md text-base',
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

// Composants Card responsive
const Card = ({ children, className = "", ...props }) => (
    <div className={twMerge('rounded-lg border bg-card text-card-foreground shadow-sm', className)} {...props}>
        {children}
    </div>
);

const CardContent = ({ children, className = "", ...props }) => (
    <div className={twMerge("p-4 sm:p-6 pt-0", className)} {...props}>
        {children}
    </div>
);

const CardHeader = ({ children, className = "", ...props }) => (
    <div className={twMerge('flex flex-col space-y-1.5 p-4 sm:p-6', className)} {...props}>
        {children}
    </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
    <h3 className={twMerge('text-lg sm:text-xl font-semibold leading-none tracking-tight', className)} {...props}>
        {children}
    </h3>
);

const CardDescription = ({ children, className = "", ...props }) => (
    <p className={twMerge("text-sm text-muted-foreground", className)} {...props}>
        {children}
    </p>
);

// COMPOSANT USER MENU responsive
const UserMenu = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t, isRTL } = useLanguage();

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 border border-green-200 hover:border-green-300 transition-colors"
            >
                <img
                    src={user.avatar}
                    alt={`${user.prenom} ${user.nom}`}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                />
                <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:block">
                    {user.prenom} {user.nom}
                </span>
                <User className="w-4 h-4 text-gray-500" />
            </button>

            {isOpen && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50`}>
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.prenom} {user.nom}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>

                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        {t('profile.myProfile')}
                    </button>

                    <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t('auth.logout')}
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Utilisation du hook de traduction
    const { t, language, isRTL } = useLanguage();
    const direction = language === 'ar' ? 'rtl' : 'ltr';

    // Vérifier si l'utilisateur est déjà connecté au chargement
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

    // Données des types d'utilisateurs avec traductions
    const userTypes = [
        {
            id: 'admin',
            title: t('admin'),
            description: t('landing.userTypes.admin.description'),
            icon: Users,
            color: 'bg-red-500 hover:bg-red-600',
            features: [
                t('landing.userTypes.admin.features.0'),
                t('landing.userTypes.admin.features.1'),
                t('landing.userTypes.admin.features.2')
            ]
        },
        {
            id: 'cooperative',
            title: t('cooperative'),
            description: t('landing.userTypes.cooperative.description'),
            icon: Building2,
            color: 'bg-green-500 hover:bg-green-600',
            features: [
                t('landing.userTypes.cooperative.features.0'),
                t('landing.userTypes.cooperative.features.1'),
                t('landing.userTypes.cooperative.features.2')
            ]
        },
        {
            id: 'buyer',
            title: t('buyer'),
            description: t('landing.userTypes.buyer.description'),
            icon: ShoppingCart,
            color: 'bg-blue-500 hover:bg-blue-600',
            features: [
                t('landing.userTypes.buyer.features.0'),
                t('landing.userTypes.buyer.features.1'),
                t('landing.userTypes.buyer.features.2')
            ]
        },
        {
            id: 'financial',
            title: t('landing.userTypes.financial.title'),
            description: t('landing.userTypes.financial.description'),
            icon: Banknote,
            color: 'bg-purple-500 hover:bg-purple-600',
            features: [
                t('landing.userTypes.financial.features.0'),
                t('landing.userTypes.financial.features.1'),
                t('landing.userTypes.financial.features.2')
            ]
        },
        {
            id: 'supplier',
            title: t('supplier'),
            description: t('landing.userTypes.supplier.description'),
            icon: Truck,
            color: 'bg-orange-500 hover:bg-orange-600',
            features: [
                t('landing.userTypes.supplier.features.0'),
                t('landing.userTypes.supplier.features.1'),
                t('landing.userTypes.supplier.features.2')
            ]
        },
        {
            id: "visitor",
            title: t('visitor'),
            description: t('landing.userTypes.visitor.description'),
            icon: Eye,
            color: 'bg-gray-500 hover:bg-gray-600',
            features: [
                t('landing.userTypes.visitor.features.0'),
                t('landing.userTypes.visitor.features.1'),
                t('landing.userTypes.visitor.features.2')
            ]
        }
    ];

    const handleUserTypeSelect = (userType) => {
        setSelectedUserType(userType);
        setShowAuthModal(true);
    };

    const handleLoginSuccess = (userData) => {
        setCurrentUser(userData);
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
        <div
            className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50"
            dir={direction}
        >
            {/* Header responsive */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-40">
                <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Logo et titre */}
                        <div className={`flex items-center space-x-2 sm:space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                                <Building2 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className={isRTL ? 'text-right' : 'text-left'}>
                                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                    {t('appName')}
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                                    {t('landing.subtitle')}
                                </p>
                            </div>
                        </div>

                        {/* Menu desktop */}
                        <div className="hidden sm:flex items-center gap-3">
                            <LanguageSelector />
                            {currentUser ? (
                                <UserMenu user={currentUser} onLogout={handleLogout} />
                            ) : (
                                <Button
                                    onClick={() => {
                                        setSelectedUserType("visitor");
                                        setShowAuthModal(true);
                                    }}
                                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-sm"
                                >
                                    {t('login')}
                                </Button>
                            )}
                        </div>

                        {/* Menu mobile */}
                        <div className="flex sm:hidden items-center gap-2">
                            <LanguageSelector />
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                            >
                                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Menu mobile déroulant */}
                    {mobileMenuOpen && (
                        <div className="sm:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
                            {currentUser ? (
                                <div className="space-y-3">
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-900">
                                            {currentUser.prenom} {currentUser.nom}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm">
                                            {t('profile.myProfile')}
                                        </Button>
                                        <Button 
                                            onClick={handleLogout}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm"
                                        >
                                            {t('logout')}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    onClick={() => {
                                        setSelectedUserType("visitor");
                                        setShowAuthModal(true);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-sm"
                                >
                                    {t('login')}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Contenu principal */}
            {currentUser ? (
                // Interface après connexion - responsive
                <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <div className={`bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                        <img
                            src={currentUser.avatar}
                            alt={`${currentUser.prenom} ${currentUser.nom}`}
                            className="w-16 h-16 sm:w-24 sm:h-24 rounded-full mx-auto mb-4"
                        />
                        <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">
                            {t('landing.welcomeMessage')}, {currentUser.prenom} !
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 capitalize">
                            {t('landing.connectedAs')} <strong>{t(`roles.${currentUser.role}`)}</strong>
                        </p>
                        <p className="text-green-600 font-semibold text-sm sm:text-base">
                            {t('landing.fullAccess')}
                        </p>

                        {/* Boutons d'accès selon le rôle */}
                        <div className={`mt-6 flex flex-col sm:flex-row justify-center gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                            {currentUser.role === 'admin' && (
                                <Button className="bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base">
                                    {t('landing.adminDashboard')}
                                </Button>
                            )}
                            <Button className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base">
                                {t('landing.accessApp')}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                // Landing page normale (non connecté) - responsive
                <>
                    {/* Hero Section responsive */}
                    <section className="py-12 sm:py-20 px-4 sm:px-6">
                        <div className={`container mx-auto text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                            <h2 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-yellow-600 bg-clip-text text-transparent">
                                {t('landing.heroTitle')}
                            </h2>
                            <p className="text-base sm:text-xl text-gray-700 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
                                {t('landing.heroDescription')}
                            </p>

                            {/* Stats responsive */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-12 sm:mb-16">
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-green-200">
                                    <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">500+</div>
                                    <div className="text-sm sm:text-base text-gray-700">{t('landing.stats.cooperatives')}</div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-blue-200">
                                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                                    <div className="text-sm sm:text-base text-gray-700">{t('landing.stats.farmers')}</div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-blue-200">
                                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">2M+</div>
                                    <div className="text-sm sm:text-base text-gray-700">{t('landing.stats.transactions')}</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* User Types Section responsive */}
                    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white/40 backdrop-blur-sm">
                        <div className="container mx-auto">
                            <h3 className={`text-2xl sm:text-3xl font-bold text-center mb-4 max-w-2xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
                                {t('landing.chooseProfile')}
                            </h3>
                            <p className={`text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base ${isRTL ? 'text-right' : 'text-left'}`}>
                                {t('landing.chooseProfileDescription')}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                                {userTypes.map((type) => {
                                    const IconComponent = type.icon;
                                    return (
                                        <Card
                                            key={type.id}
                                            className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/80 backdrop-blur-sm border-2 hover:border-green-300"
                                            onClick={() => handleUserTypeSelect(type.id)}
                                        >
                                            <CardHeader className="text-center">
                                                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${type.color} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-transform group-hover:scale-110`}>
                                                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                                </div>
                                                <CardTitle className='text-base sm:text-xl mb-2'>{type.title}</CardTitle>
                                                <CardDescription className="text-gray-600 text-xs sm:text-sm">
                                                    {type.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="space-y-2">
                                                    {type.features.map((feature, index) => (
                                                        <li key={index} className={`flex items-center text-xs sm:text-sm text-gray-700 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                                            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full ${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'}`}></div>
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <Button
                                                    className={`w-full mt-4 sm:mt-6 ${type.color} text-white border-none text-xs sm:text-sm`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUserTypeSelect(type.id);
                                                    }}
                                                >
                                                    {t('landing.getStarted')}
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Features Section responsive */}
                    <section className="py-12 sm:py-16 px-4 sm:px-6">
                        <div className="container mx-auto">
                            <h3 className={`text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {t('landing.featuresTitle')}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                                {[
                                    { icon: Users, title: t('landing.features.0.title'), description: t('landing.features.0.description') },
                                    { icon: ShoppingCart, title: t('landing.features.1.title'), description: t('landing.features.1.description') },
                                    { icon: Banknote, title: t('landing.features.2.title'), description: t('landing.features.2.description') },
                                    { icon: Truck, title: t('landing.features.3.title'), description: t('landing.features.3.description') }
                                ].map((feature, index) => {
                                    const IconComponent = feature.icon;
                                    return (
                                        <div key={index} className="text-center">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4" >
                                                <IconComponent className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                                            </div>
                                            <h4 className="text-base sm:text-lg font-semibold mb-2">{feature.title}</h4>
                                            <p className="text-gray-600 text-black text-xs sm:text-sm">{feature.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Footer responsive */}
                    <footer className="bg-gray-800 text-white py-8 sm:py-12 px-4 sm:px-6">
                        <div className="container mx-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                    <div className={`flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                                            <Building2 className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                                        </div>
                                        <span className="text-lg sm:text-xl font-bold">{t('appName')}</span>
                                    </div>
                                    <p className="text-gray-400 text-xs sm:text-sm">
                                        {t('landing.footer.description')}
                                    </p>
                                </div>
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                    <h5 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('landing.footer.quickLinks')}</h5>
                                    <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                                        <li><a href="#" className="hover:text-white transition-colors">{t('landing.footer.about')}</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">{t('landing.footer.services')}</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">{t('landing.footer.contact')}</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">{t('landing.footer.support')}</a></li>
                                    </ul>
                                </div>
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                    <h5 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('landing.footer.resources')}</h5>
                                    <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                                        <li><a href="#" className="hover:text-white transition-colors">{t('landing.footer.documentation')}</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">{t('landing.footer.guides')}</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">{t('landing.footer.faq')}</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">{t('landing.footer.blog')}</a></li>
                                    </ul>
                                </div>
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                    <h5 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('landing.footer.contact')}</h5>
                                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                                        <p>📧 {t('landing.footer.email')}</p>
                                        <p>📞 {t('landing.footer.phone')}</p>
                                        <p>📍 {t('landing.footer.address')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
                                <p>{t('landing.footer.copyright')}</p>
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