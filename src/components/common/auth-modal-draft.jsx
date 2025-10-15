const AuthModal = ({ isOpen, onClose, defaultUserType = "", onLoginSuccess }) => {
    const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot'
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
            setAuthMode('login');
        }
    }, [isOpen, defaultUserType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            // Validation
            if (authMode === 'register') {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Les mots de passe ne correspondent pas');
                }
                if (formData.password.length < 6) {
                    throw new Error('Le mot de passe doit contenir au moins 6 caractères');
                }
            }

            // Simulation d'appel API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Données utilisateur simulées
            const userData = {
                id: Date.now(),
                email: formData.email,
                nom: formData.nom,
                prenom: formData.prenom,
                telephone: formData.telephone,
                role: formData.role,
                avatar: `https://ui-avatars.com/api/?name=${formData.prenom}+${formData.nom}&background=10B981&color=fff`,
                dateInscription: new Date().toISOString()
            };

            if (authMode === 'login') {
                console.log('Connexion réussie:', userData);
                localStorage.setItem('currentUser', JSON.stringify(userData));
                setSuccessMessage('Connexion réussie!');

                setTimeout(() => {
                    onLoginSuccess(userData);
                    onClose();
                }, 1000);

            } else if (authMode === 'register') {
                console.log('Inscription réussie:', userData);

                // Sauvegarder l'utilisateur
                const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
                existingUsers.push(userData);
                localStorage.setItem('users', JSON.stringify(existingUsers));

                // Auto-login après inscription
                localStorage.setItem('currentUser', JSON.stringify(userData));
                setSuccessMessage('Compte créé avec succès! Connexion...');

                setTimeout(() => {
                    onLoginSuccess(userData);
                    onClose();
                }, 2000);

            } else if (authMode === 'forgot') {
                setSuccessMessage('Un lien de réinitialisation a été envoyé à votre email.');
                setTimeout(() => {
                    setAuthMode('login');
                }, 3000);
            }

        } catch (err) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
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
            case 'forgot': return 'Réinitialisation';
            default: return 'Authentification';
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
                            {formData.role && `Profil : ${formData.role}`}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-light"
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <div className="p-6">
                    {/* Messages */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                            {successMessage}
                        </div>
                    )}

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Champs inscription */}
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
                                />

                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
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

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Adresse email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Mot de passe */}
                        {authMode !== 'forgot' && (
                            <>
                                <div>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder={authMode === 'register' ? 'Mot de passe (min. 6 caractères)' : 'Mot de passe'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                {authMode === 'register' && (
                                    <div>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirmer le mot de passe"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {/* Mot de passe oublié */}
                        {authMode === 'login' && (
                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={() => setAuthMode('forgot')}
                                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                                >
                                    Mot de passe oublié ?
                                </button>
                            </div>
                        )}

                        {/* Bouton */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {authMode === 'login' ? 'Connexion...' :
                                        authMode === 'register' ? 'Inscription...' : 'Envoi...'}
                                </div>
                            ) : (
                                authMode === 'login' ? 'Se connecter' :
                                    authMode === 'register' ? 'S\'inscrire' : 'Envoyer le lien'
                            )}
                        </button>
                    </form>

                    {/* Liens de navigation */}
                    <div className="text-center mt-4 space-y-2">
                        {authMode === 'login' && (
                            <p className="text-sm text-gray-600">
                                Pas de compte ?{' '}
                                <button
                                    onClick={() => setAuthMode('register')}
                                    className="text-green-600 hover:text-green-700 font-medium"
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
                                    className="text-green-600 hover:text-green-700 font-medium"
                                >
                                    Se connecter
                                </button>
                            </p>
                        )}

                        {authMode === 'forgot' && (
                            <p className="text-sm text-gray-600">
                                <button
                                    onClick={() => setAuthMode('login')}
                                    className="text-green-600 hover:text-green-700 font-medium"
                                >
                                    ← Retour à la connexion
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;