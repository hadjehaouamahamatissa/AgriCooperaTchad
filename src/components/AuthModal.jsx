// components/AuthModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Phone, RefreshCw, ArrowLeft } from 'lucide-react';
import { apiService } from '../services/api';

const AuthModal = ({ isOpen, onClose, defaultUserType = '' }) => {
    const [currentStep, setCurrentStep] = useState('selection'); // selection, login, register, forgot, otp
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nom: '',
        prenom: '',
        telephone: '',
        role: defaultUserType || 'admin',
        otp: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [pendingEmail, setPendingEmail] = useState('');

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleClose = () => {
        setCurrentStep('selection');
        setFormData({
            email: '',
            password: '',
            nom: '',
            prenom: '',
            telephone: '',
            role: defaultUserType || 'visiteur',
            otp: ''
        });
        setError('');
        setSuccess('');
        setCountdown(0);
        setPendingEmail('');
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            switch (currentStep) {
                case 'login':
                    await handleLogin();
                    break;
                case 'register':
                    await handleRegister();
                    break;
                case 'forgot':
                    await handleForgotPassword();
                    break;
                case 'otp':
                    await handleOTPVerification();
                    break;
                case 'reset':
                    await handlePasswordReset();
                    break;
            }
        } catch (err) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        const result = await apiService.login({
            email: formData.email,
            password: formData.password
        });
        // log result
        console.log('📨 handleLogin appelé avec:', result);      
        

        if (result.success) {
            handleClose();
            // redirection vers la page d'accueil
            window.location.href = '/home';
            
            // log current route
            console.log('📨 Current route:', window.location.href);
            // window.location.reload();
        } else if (result.requiresVerification) {
            setPendingEmail(formData.email);
            setCurrentStep('otp');
            setSuccess('Veuillez vérifier votre email pour vous connecter');
        }
    };

    const handleRegister = async () => {
        const result = await apiService.register(formData);

        if (result.success) {
            setPendingEmail(formData.email);
            setCurrentStep('otp');
            setSuccess('Un code de vérification a été envoyé à votre email');
            setCountdown(60); // 60 secondes avant de pouvoir renvoyer
        }
    };

    const handleForgotPassword = async () => {
        console.log('📨 handleForgotPassword appelé avec:', formData);
        console.log('🔧 Calling handleForgotPassword with:', formData.email);
        
        const result = await apiService.forgotPassword(formData.email);

        if (result.success) {
            setPendingEmail(formData.email);
            setCurrentStep('reset');
            setSuccess('Un code de réinitialisation a été envoyé à votre email');
            setCountdown(60);
        }
    };

    const handleOTPVerification = async () => {
        const result = await apiService.verifyEmail(
            pendingEmail,
            formData.otp
        );


        if (result.success) {
            setSuccess('Email vérifié avec succès !');
            setTimeout(() => {
                handleClose();
                window.location.reload();
            }, 2000);
        }
    };

    const handlePasswordReset = async () => {
        const result = await apiService.resetPassword(
            pendingEmail,
            formData.otp,
            formData.password
        );


        if (result.success) {
            setSuccess('Mot de passe réinitialisé avec succès !');
            setTimeout(() => {
                setCurrentStep('login');
                setFormData(prev => ({ ...prev, password: '', otp: '' }));
            }, 2000);
        }
    };

    const handleResendOTP = async () => {
        if (countdown > 0) return;

        setLoading(true);
        try {
            const type = currentStep === 'otp' ? 'email_verification' : 'password_reset';
            const result = await apiService.resendOTP(pendingEmail);


            if (result.success) {
                setSuccess('Nouveau code envoyé !');
                setCountdown(60);
            }
        } catch (err) {
            setError(err.message || 'Erreur lors de l\'envoi du code');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (!isOpen) return null;

    const renderStep = () => {
        switch (currentStep) {
            case 'selection':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-center">Comment souhaitez-vous continuer ?</h3>
                        <button
                            onClick={() => setCurrentStep('login')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-medium"
                        >
                            Se connecter
                        </button>
                        <button
                            onClick={() => setCurrentStep('register')}
                            className="w-full border border-green-600 text-green-600 hover:bg-green-50 p-3 rounded-lg font-medium"
                        >
                            Créer un compte
                        </button>
                    </div>
                );

            case 'login':
                return (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-center mb-2">
                            <h3 className="text-lg font-semibold">Connexion</h3>
                            <p className="text-sm text-gray-600">Accédez à votre compte</p>
                        </div>

                        <div className="space-y-3">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Mot de passe"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-2 border rounded-md"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setCurrentStep('forgot')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Mot de passe oublié ?
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-md disabled:opacity-50"
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setCurrentStep('register')}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Créer un nouveau compte
                            </button>
                        </div>
                    </form>
                );

            case 'register':
                return (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-center mb-2">
                            <h3 className="text-lg font-semibold">Inscription</h3>
                            <p className="text-sm text-gray-600">Créez votre compte {formData.role}</p>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="prenom"
                                        placeholder="Prénom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        className="w-full pl-10 p-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="nom"
                                        placeholder="Nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        className="w-full pl-10 p-2 border rounded-md"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-2 border rounded-md"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="tel"
                                    name="telephone"
                                    placeholder="Téléphone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-2 border rounded-md"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Mot de passe"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-2 border rounded-md"
                                    required
                                />
                            </div>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            >
                                <option value="admin">Administrateur</option>
                                <option value="visiteur">Visiteur</option>
                                <option value="cooperative">Coopérative Agricole</option>
                                <option value="acheteur">Acheteur/Commerçant</option>
                                <option value="institution_financiere">Institution Financière</option>
                                <option value="fournisseur">Fournisseur</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-md disabled:opacity-50"
                        >
                            {loading ? 'Inscription...' : 'S\'inscrire'}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setCurrentStep('login')}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Déjà un compte ? Se connecter
                            </button>
                        </div>
                    </form>
                );

            case 'forgot':
                return (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-center mb-2">
                            <h3 className="text-lg font-semibold">Mot de passe oublié</h3>
                            <p className="text-sm text-gray-600">Entrez votre email pour recevoir un code de réinitialisation</p>
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 p-2 border rounded-md"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-md disabled:opacity-50"
                        >
                            {loading ? 'Envoi...' : 'Envoyer le code'}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setCurrentStep('login')}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Retour à la connexion
                            </button>
                        </div>
                    </form>
                );

            case 'otp':
            case 'reset':
                const isVerification = currentStep === 'otp';

                return (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-center mb-2">
                            <h3 className="text-lg font-semibold">
                                {isVerification ? 'Vérification Email' : 'Réinitialisation'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {isVerification
                                    ? 'Entrez le code envoyé à votre email'
                                    : 'Entrez le code et votre nouveau mot de passe'
                                }
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.otp}
                                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                    placeholder="Code à 6 chiffres"
                                    className="w-full pl-10 p-2 border rounded-md text-center text-lg tracking-widest"
                                    maxLength={6}
                                    required
                                />
                            </div>

                            {!isVerification && (
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Nouveau mot de passe"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 p-2 border rounded-md"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={countdown > 0 || loading}
                                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>
                                    {countdown > 0 ? `Renvoyer (${countdown}s)` : 'Renvoyer le code'}
                                </span>
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-md disabled:opacity-50"
                        >
                            {loading ? 'Vérification...' : (isVerification ? 'Vérifier' : 'Réinitialiser')}
                        </button>
                    </form>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center space-x-2">
                        {(currentStep !== 'selection') && (
                            <button
                                onClick={() => {
                                    const previousSteps = {
                                        login: 'selection',
                                        register: 'selection',
                                        forgot: 'login',
                                        otp: 'register',
                                        reset: 'forgot'
                                    };
                                    setCurrentStep(previousSteps[currentStep] || 'selection');
                                }}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <h2 className="text-xl font-bold">AgriCooperaTchad</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-gray-100 rounded"
                        disabled={loading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {success}
                        </div>
                    )}

                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;