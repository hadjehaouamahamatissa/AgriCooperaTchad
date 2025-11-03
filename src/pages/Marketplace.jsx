import React, { useEffect, useState, useRef } from "react"
import { ShoppingCart, Search, Star, MapPin, Phone, CreditCard, Package, Eye, Share2, Upload, X, Mail } from "lucide-react"
import Payment from "./Payment"
import { apiService } from "../services/api"

const ProductCard = ({ product, onBuy, onContact, onShare, onViewDetails }) => {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative">
                <img
                    src={product.images && product.images.length > 0 ? product.images[0] : "/api/agrictd/arac.jpeg"}
                    alt={product.nom}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.disponibilite === "disponible" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {product.disponibilite === "disponible" ? "Disponible" : "Épuisé"}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.nom}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-3">
                    <div className="text-xl font-bold text-green-600">
                        {product.prix?.toLocaleString()} XAF
                    </div>
                    <div className="text-sm text-gray-500">
                        {product.unite}
                    </div>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                        {product.cooperative?.region}, {product.cooperative?.ville}
                    </span>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${i < (product.note || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-600">
                        ({product.avis?.length || 0} avis)
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => onViewDetails(product)}
                        className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                        <Eye className="h-4 w-4" />
                        <span>Détails</span>
                    </button>
                    <button
                        onClick={() => onContact(product)}
                        className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                    >
                        <Phone className="h-4 w-4" />
                        <span>Contacter</span>
                    </button>
                    <button
                        onClick={() => onBuy(product)}
                        disabled={product.disponibilite !== "disponible"}
                        className="flex items-center justify-center space-x-1 px-3 py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Acheter</span>
                    </button>
                    <button
                        onClick={() => onShare(product)}
                        className="flex items-center justify-center space-x-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                    >
                        <Share2 className="h-4 w-4" />
                        <span>Partager</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

// Modal Détails Produit
const ProductDetailsModal = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">{product.nom}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Images */}
                        <div>
                            <img
                                src={product.images && product.images.length > 0 ? product.images[0] : "/api/agrictd/arac.jpeg"}
                                alt={product.nom}
                                className="w-full h-80 object-cover rounded-lg mb-4"
                            />
                        </div>

                        {/* Informations détaillées */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className="font-medium text-gray-700 text-sm mb-1">Prix</h4>
                                    <p className="text-green-600 font-bold text-lg">{product.prix?.toLocaleString()} XAF/{product.unite}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className="font-medium text-gray-700 text-sm mb-1">Quantité disponible</h4>
                                    <p className="text-gray-900 font-semibold">{product.quantite} {product.unite}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className="font-medium text-gray-700 text-sm mb-1">Catégorie</h4>
                                    <p className="text-gray-900 capitalize">{product.category}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className="font-medium text-gray-700 text-sm mb-1">Statut</h4>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.disponibilite === "disponible" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {product.disponibilite === "disponible" ? "Disponible" : "Épuisé"}
                                    </span>
                                </div>
                            </div>

                            {/* Informations supplémentaires */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-2">Informations supplémentaires</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-blue-700">Quantité minimale:</span>
                                        <span className="ml-2 text-blue-900">{product.quantiteMin || 1} {product.unite}</span>
                                    </div>
                                    <div>
                                        <span className="text-blue-700">Délai livraison:</span>
                                        <span className="ml-2 text-blue-900">{product.delaiLivraison || 3} jours</span>
                                    </div>
                                    {product.bio && (
                                        <div className="col-span-2">
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">🌱 Produit Bio</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Coopérative */}
                            {product.cooperative && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-green-900 mb-3">Vendeur</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <span className="text-green-600 font-semibold text-sm">
                                                    {product.cooperative.nom?.charAt(0) || "C"}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-green-900">{product.cooperative.nom}</p>
                                                <p className="text-sm text-green-700 flex items-center">
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {product.cooperative.region}, {product.cooperative.ville}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Modal Contact
const ContactModal = ({ isOpen, onClose, product }) => {
    const [message, setMessage] = useState("");

    if (!isOpen || !product) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simuler l'envoi du message
        alert(`Message envoyé à ${product.cooperative?.nom || "le vendeur"} !\n\nVotre message: "${message}"`);
        setMessage("");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Contacter le vendeur</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Produit concerné */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-2">Produit concerné</h3>
                            <p className="text-blue-800 font-medium">{product.nom}</p>
                            <p className="text-blue-700 text-sm">{product.prix?.toLocaleString()} XAF/{product.unite}</p>
                        </div>

                        {/* Informations vendeur */}
                        {product.cooperative && (
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-green-900 mb-2">Coopérative</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 font-semibold text-sm">
                                                {product.cooperative.nom?.charAt(0) || "C"}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-green-900">{product.cooperative.nom}</p>
                                            <p className="text-sm text-green-700 flex items-center">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {product.cooperative.region}, {product.cooperative.ville}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Formulaire de contact */}
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                Votre message *
                            </label>
                            <textarea
                                id="message"
                                rows="4"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Bonjour, je suis intéressé par votre produit. Pouvez-vous me donner plus d'informations sur..."
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                required
                            />
                        </div>

                        <div className="bg-yellow-50 p-3 rounded-lg">
                            <p className="text-yellow-800 text-sm flex items-start">
                                <span className="mr-2">💡</span>
                                <span>
                                    <strong>Information:</strong> Votre message sera envoyé à la coopérative.
                                    Elles vous recontactera dans les plus brefs délais.
                                </span>
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
                            >
                                <Mail className="h-4 w-4" />
                                <span>Envoyer le message</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


// Purchase Modal
const PurchaseModal = ({ isOpen, onClose, onConfirm, product }) => {
    const [quantity, setQuantity] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("mobile_money");
    const [showPayment, setShowPayment] = useState(false);
    const [orderData, setOrderData] = useState(null);

    // Fonction améliorée pour récupérer l'utilisateur
    const getUser = () => {
        try {
            const userData = localStorage.getItem("user");
            const token = localStorage.getItem("token");

            console.log("🔍 Vérification utilisateur:", { userData: !!userData, token: !!token });

            if (!userData || !token) {
                console.warn("❌ Utilisateur ou token manquant dans localStorage");
                return null;
            }

            const user = JSON.parse(userData);

            // Vérification basique de la structure de l'utilisateur
            const userId = user._id || user.id;
            if (!userId || !user.email) {
                console.warn("❌ Structure utilisateur invalide:", user);
                return null;
            }

            // Normalisation de l'ID
            if (user.id && !user._id) {
                user._id = user.id;
            }

            console.log("✅ Utilisateur valide:", { id: user._id, email: user.email });
            return user;
        } catch (error) {
            console.error("❌ Erreur lecture user:", error);
            return null;
        }
    };
    
    if (!isOpen || !product) return null;

    const total = product.prix * quantity;
    const minQuantity = product.quantiteMin || 1;
    const maxQuantity = product.quantite;

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("🛒 Début processus d'achat...");

        // Vérifier que l'utilisateur est connecté AVANT de continuer
        const user = getUser();
        console.log("👤 Utilisateur récupéré:", user);

        if (!user) {
            alert("Veuillez vous connecter pour acheter ce produit.");
            return;
        }

        // Validation de la quantité
        if (quantity < minQuantity) {
            alert(`La quantité minimale est de ${minQuantity} ${product.unite}`);
            return;
        }

        if (quantity > maxQuantity) {
            alert(`La quantité disponible est de ${maxQuantity} ${product.unite}`);
            return;
        }

        console.log("✅ Utilisateur connecté, préparation de la commande...");

        // Préparer les données de commande
        const order = {
            product: {
                _id: product._id,
                nom: product.nom,
                prix: product.prix,
                unite: product.unite,
                cooperative: product.cooperative
            },
            quantity,
            total,
            paymentMethod,
            amount: total,
            user: user // Inclure l'utilisateur complet
        };

        console.log("📦 Données commande préparées:", order);

        setOrderData(order);
        setShowPayment(true);
    };

    const handlePaymentSuccess = (paymentResult, selectedMethod) => {
        if (!selectedMethod) {
            console.error("Erreur : selectedMethod est undefined");
            return;
        }

        console.log("💰 Paiement réussi, données:", selectedMethod.type);
        console.log("Transaction ID :", paymentResult.transactionId);
        console.log("Données du paiement :", paymentResult.paymentData);

        const user = getUser();
        if (!user) {
            alert("Session expirée. Veuillez vous reconnecter.");
            setShowPayment(false);
            setOrderData(null);
            return;
        }

        // CORRECTION : Vérification robuste de l'ID coopérative
        let cooperativeId = null;

        if (product.cooperative) {
            if (typeof product.cooperative === "object") {
                cooperativeId = product.cooperative._id || product.cooperative.id;
            } else if (typeof product.cooperative === "string") {
                cooperativeId = product.cooperative;
            }
        }

        console.log("🏷️ ID Coopérative récupéré:", cooperativeId);
        console.log("Structure cooperative:", product.cooperative);

        // VÉRIFICATION CRITIQUE AVANT DE CONTINUER
        if (!cooperativeId) {
            console.error("❌ ERREUR: ID coopérative manquant. Produit:", product);
            alert("Erreur: Impossible de déterminer le vendeur. Veuillez réessayer.");
            return;
        }

        // Vérification de l'ID produit
        if (!product._id) {
            console.error("❌ ERREUR: ID produit manquant:", product);
            alert("Erreur: Produit invalide.");
            return;
        }

        // Vérification de l'ID utilisateur
        if (!user._id) {
            console.error("❌ ERREUR: ID utilisateur manquant:", user);
            alert("Erreur: Utilisateur non authentifié.");
            return;
        }

        // Préparer les données pour l'API backend - CORRECTION: payment au lieu de paiement
        const orderDataForAPI = {
            items: [
                {
                    productId: product._id,          
                    productName: product.nom,        
                    quantity: quantity,              
                    unitPrice: product.prix,         
                    totalPrice: product.prix * quantity
                },
            ],
            totalAmount: product.prix * quantity,
            shippingAddress: {
                fullName: "Hawa Mahajeer",
                phone: "+23560001122",
                region: "Chari-Baguirmi",
                city: "N'Djamena",
                neighborhood: "Klemat",
                detailedAddress: "Quartier Klemat Rue 3"
            },
            payment: { 
                method: selectedMethod.type === 'card' ? 'stripe' : 'mobile_money',
                transactionId: paymentResult.transactionId,
                status: "paid",
            },
            notes: "Commande via application Marketplace",
            desiredDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        };

        console.log("📤 Données prêtes pour l'API:", orderDataForAPI);

        // Appeler la fonction parent pour créer la commande
        if (onConfirm) {
            onConfirm(orderDataForAPI);
        } else {
            console.warn("⚠️ onConfirm non défini");
            alert("Commande créée avec succès !");
        }

        setShowPayment(false);
        setOrderData(null);
        onClose();
    };
    
    const handlePaymentCancel = () => {
        console.log("❌ Paiement annulé");
        setShowPayment(false);
        setOrderData(null);
    };

    // Si le modal de paiement est ouvert
    if (showPayment && orderData) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Payment
                    order={orderData}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Acheter {product.nom}</h2>

                    {/* Afficher un message si l'utilisateur n'est pas connecté */}
                    {!getUser() && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                            <p className="text-yellow-800 text-sm">
                                <strong>Information :</strong> Vous devez être connecté pour acheter ce produit.
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Informations produit */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between mb-2">
                                <span className="font-medium">Prix unitaire:</span>
                                <span>{product.prix?.toLocaleString()} XAF/{product.unite}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Disponible:</span>
                                <span>{product.quantite} {product.unite}</span>
                            </div>
                        </div>

                        {/* Quantité */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantité ({product.unite}) *
                            </label>
                            <input
                                type="number"
                                min={minQuantity}
                                max={maxQuantity}
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || minQuantity)}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Minimum: {minQuantity} {product.unite}
                            </p>
                        </div>

                        {/* Méthode de paiement */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Méthode de paiement
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="mobile_money">Mobile Money</option>
                                <option value="credit_card">Carte Bancaire (Stripe)</option>
                                <option value="cash">Paiement à la livraison</option>
                                <option value="bank">Virement bancaire</option>
                            </select>
                        </div>

                        {/* Total */}
                        <div className="mb-6 p-3 bg-green-50 rounded-lg">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total:</span>
                                <span className="text-green-600">{total.toLocaleString()} XAF</span>
                            </div>
                        </div>

                        {/* Boutons */}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                                Procéder au paiement
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Modal Ajouter Produit
const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
    const [product, setProduct] = useState({
        nom: "",
        description: "",
        category: "céréales",
        prix: 500,
        unite: "kg",
        quantite: 100,
        quantiteMin: 1,
        delaiLivraison: 3,
        bio: false,
        saison: "tout l'année",
        certifications: [],
        tags: []
    });

    const [selectedImages, setSelectedImages] = useState([]);
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation côté client
        if (!product.nom || !product.description || product.prix <= 0 || product.quantite <= 0) {
            alert("Veuillez remplir tous les champs obligatoires correctement");
            return;
        }

        const productData = {
            ...product,
            images: selectedImages,
            disponibilite: "disponible",
            isActive: true
        };

        console.log('🎯 Données finales:', productData);
        await onAddProduct(productData);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const imagePromises = files.map(file => {
            return new Promise((resolve) => {
                if (file.size > 5 * 1024 * 1024) {
                    alert(`Le fichier ${file.name} est trop volumineux (max 5MB)`);
                    resolve(null);
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve(e.target.result);
                };
                reader.onerror = () => {
                    alert(`Erreur lors de la lecture de ${file.name}`);
                    resolve(null);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagePromises).then(base64Images => {
            const validImages = base64Images.filter(img => img !== null);
            setSelectedImages(prev => [...prev, ...validImages]);
        });

        e.target.value = "";
    };

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-6">Publier un produit</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nom du produit */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom du produit *
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: Riz local de qualité"
                                value={product.nom}
                                onChange={(e) => setProduct({ ...product, nom: e.target.value })}
                                required
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                placeholder="Décrivez votre produit en détail..."
                                value={product.description}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                required
                                rows="3"
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Prix et Unité */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Prix (FCFA) *
                                </label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={product.prix}
                                    onChange={(e) => setProduct({ ...product, prix: parseFloat(e.target.value) || 0 })}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unité *
                                </label>
                                <select
                                    value={product.unite}
                                    onChange={(e) => setProduct({ ...product, unite: e.target.value })}
                                    required
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="kg">Kilogramme (kg)</option>
                                    <option value="g">Gramme (g)</option>
                                    <option value="litre">Litre</option>
                                    <option value="pièce">Pièce</option>
                                    <option value="carton">Carton</option>
                                    <option value="autre">Autre</option>
                                </select>
                            </div>
                        </div>

                        {/* Quantité et Délai de livraison */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantité disponible *
                                </label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={product.quantite}
                                    onChange={(e) => setProduct({ ...product, quantite: parseInt(e.target.value) || 0 })}
                                    required
                                    min="0"
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Délai de livraison (jours)
                                </label>
                                <input
                                    type="number"
                                    placeholder="3"
                                    value={product.delaiLivraison}
                                    onChange={(e) => setProduct({ ...product, delaiLivraison: parseInt(e.target.value) || 3 })}
                                    min="1"
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>

                        {/* Catégorie et Saison */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catégorie *
                                </label>
                                <select
                                    value={product.category}
                                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                    required
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="céréales">Céréales</option>
                                    <option value="légumes">Légumes</option>
                                    <option value="légumineux">Légumineux</option>
                                    <option value="fruits">Fruits</option>
                                    <option value="betails">Bétails</option>
                                    <option value="autres">Autres</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Saison
                                </label>
                                <select
                                    value={product.saison}
                                    onChange={(e) => setProduct({ ...product, saison: e.target.value })}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="tout l'année">Toute l'année</option>
                                    <option value="saison sèche">Saison sèche</option>
                                    <option value="saison des pluies">Saison des pluies</option>
                                    <option value="hivernage">Hivernage</option>
                                </select>
                            </div>
                        </div>

                        {/* Sous-catégorie */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sous-catégorie
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: Riz local, Mil rouge, etc."
                                value={product.sousCategory || ""}
                                onChange={(e) => setProduct({ ...product, sousCategory: e.target.value })}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Upload d'images */}
                        <div className="border border-gray-300 rounded-md p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Images du produit
                            </label>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-green-500 transition-colors mb-4"
                            >
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">
                                    Cliquez pour ajouter des images
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG, JPEG jusqu'à 5MB
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>

                            {selectedImages.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                    {selectedImages.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={image}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-20 object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Options */}
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="bio"
                                    checked={product.bio}
                                    onChange={(e) => setProduct({ ...product, bio: e.target.checked })}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor="bio" className="ml-2 text-sm text-gray-700">
                                    Produit bio
                                </label>
                            </div>
                        </div>

                        {/* Boutons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                                Publier le produit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Composant principal Marketplace
function Marketplace() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const categories = [
        { value: "all", label: "Toutes les catégories" },
        { value: "céréales", label: "Céréales" },
        { value: "légumineux", label: "Légumineux" },
        { value: "légumes", label: "Légumes" },
        { value: "fruits", label: "Fruits" },
        { value: "betails", label: "Bétails" },
        { value: "autres", label: "Autres" },
    ];

    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await apiService.getProducts();
            console.log('Réponse API:', response);

            if (response.success) {
                setProducts(response.data.products || []);
            }
        } catch (error) {
            console.error("Erreur chargement produits:", error);
            // Données de secours
            setProducts([
                {
                    _id: "2",
                    nom: "Arachide Décortiquée",
                    description: "Arachide de première qualité, bien séchée et prête à l'emploi.",
                    prix: 800,
                    unite: "kg",
                    quantite: 50,
                    category: "légumineux",
                    disponibilite: "disponible",
                    note: 5,
                    avis: [],
                    images: ["/api/agrictd/arac.jpeg"],
                    cooperative: {
                        _id: "coop-001",
                        nom: "Cooperative de N'Djamena",
                        region: "N'Djamena",
                        ville: "N'Djamena"
                    }
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleBuy = (product) => {
        setSelectedProduct(product);
        setShowPurchaseModal(true);
    };

    const handleShare = (product) => {
        if (navigator.share) {
            navigator.share({
                title: product.nom,
                text: product.description,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(`${product.nom} - ${product.prix} XAF/${product.unite}`);
            alert("Informations copiées dans le presse-papiers !");
        }
    };

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setShowDetailsModal(true);
    };

    const handleContact = (product) => {
        setSelectedProduct(product);
        setShowContactModal(true);
    };

    const handleAddProduct = async (newProduct) => {
        try {
            const response = await apiService.createProduct(newProduct);
            if (response.success) {
                await loadProducts();
                setShowAddProductModal(false);
                alert("Produit créé avec succès !");
            }
        } catch (error) {
            alert("Erreur: " + error.message);
            throw error;
        }
    };

    // CORRECTION: handleConfirmPurchase corrigé
    const handleConfirmPurchase = async (orderData) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Session expirée. Veuillez vous reconnecter.");
                return;
            }

            console.log("📤 Données envoyées au backend:", orderData);

            const response = await apiService.createOrder(orderData, token);

            console.log("Réponse création commande:", response);

            if (response.success) {
                alert("Commande créée avec succès !");
                setShowPurchaseModal(false);
                setSelectedProduct(null);

                // Recharger les produits pour mettre à jour les quantités
                await loadProducts();
            } else {
                alert("Erreur lors de la création de la commande: " + response.message);
            }
        } catch (error) {
            console.error("Erreur création commande:", error);
            alert("Erreur lors de la création de la commande: " + error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
                <h1 className="text-3xl font-bold mb-2">Marché Agricole</h1>
                <p className="text-green-100">
                    Achetez et vendez des produits agricoles directement avec les producteurs locaux.
                </p>
            </div>

            <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-blue-700">
                    📊 {products.length} produits chargés | {filteredProducts.length} filtrés
                    {filteredProducts.length === 0 && products.length > 0 && " - Ajustez les filtres"}
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <button
                    onClick={() => setShowAddProductModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                    + Publier un produit
                </button>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Rechercher des produits..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {categories.map(category => (
                        <option key={category.value} value={category.value}>
                            {category.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* AFFICHAGE DES PRODUITS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        onBuy={handleBuy}
                        onShare={handleShare}
                        onViewDetails={handleViewDetails}
                        onContact={handleContact}
                    />
                ))}
            </div>

            {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun produit trouvé</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {products.length === 0
                            ? "Aucun produit disponible pour le moment"
                            : "Essayez de modifier vos critères de recherche."
                        }
                    </p>
                </div>
            )}

            {/* MODALS */}
            <AddProductModal
                isOpen={showAddProductModal}
                onClose={() => setShowAddProductModal(false)}
                onAddProduct={handleAddProduct}
            />

            <PurchaseModal
                isOpen={showPurchaseModal}
                product={selectedProduct}
                onClose={() => setShowPurchaseModal(false)}
                onConfirm={handleConfirmPurchase}
            />

            <ProductDetailsModal
                isOpen={showDetailsModal}
                product={selectedProduct}
                onClose={() => setShowDetailsModal(false)}
            />

            <ContactModal
                isOpen={showContactModal}
                product={selectedProduct}
                onClose={() => setShowContactModal(false)}
            />
        </div>
    );
}

export default Marketplace;