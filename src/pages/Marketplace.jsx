import React, { use, useEffect, useState } from "react"
import { ShoppingCart, Search, Filter, Star, MapPin, Phone, CreditCard, Package, Eye, Share2 } from "lucide-react"
import Payment from "./Payment"

const ProductCard = ({ product, onBuy, onContact, onShare, onViewDetails }) => {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative">
                <img
                    src={product.image || "/api/agrictd/arac.jpeg agrictd"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                    <span className={`px-2-py-1-text-xs-font-medium-rounded-full ${product.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                        {product.available ? "Disponible" : "Epuise"}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-3">
                    <div className="text-xl font-bold text-green-600">
                        {product.price.toLocaleString()} XAF
                    </div>
                    <div className="text-sm text-gray-500">
                        {product.unit}
                    </div>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{product.location}</span>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${i < product.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews} avis)</span>

                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => onViewDetails(product)}
                        className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                        <Eye className="h-4 w-4" />
                        <span>Details</span>
                    </button>
                    <button
                        onClick={() => onContact(product)}
                        className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                        <Phone className="h-4 w-4" />
                        <span>Contacter</span>
                    </button>
                    <button
                        onClick={() => onBuy(product)}
                        disabled={!product.available}
                        className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Acheter</span>
                    </button>
                    <button
                        onClick={() => onShare(product)}
                        className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                        <Share2 className="h-4 w-4" />
                        <span>Partager</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

// Modal Ajouter Produit
const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        unit: "kg",
        location: "",
        category: "cereales",
        image: "",
        stock: 0,
        available: true,
        rating: 0,
        reviews: 0,
        seller: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddProduct(product);
        onClose();
        setProduct({
            name: "",
            description: "",
            price: "",
            unit: "kg",
            location: "",
            category: "cereales",
            image: "",
            stock: "",
            available: true,
            rating: 0,
            reviews: 0,
            seller: ""
        });
    };

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-xl font-bold mb-4">Publier un produit</h2>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <input
                        type="text"
                        placeholder="Nom du produit"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        required
                        className="w-full border px-3 py-2 rounded"
                    />
                    <textarea
                        placeholder="description"
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        required
                        className="w-full border px-3 py-2 rounded"
                    />
                    <div className="flex gap-2">
                        <input
                            type="Number"
                            placeholder="Prix"
                            value={product.price}
                            onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
                            required
                            className=" border px-2 py-1 rounded"
                        />

                        <input
                            text="text"
                            placeholder="Unite"
                            value={product.unit}
                            onChange={(e) => setProduct({ ...product, unit: e.target.value })}
                            className=" border px-3 py-2 rounded"
                        />
                    </div>
                    <input
                        text="text"
                        placeholder="Nom de la cooperative"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                    />
                    <input
                        text="text"
                        placeholder="image"
                        value={product.image}
                        onChange={(e) => setProduct({ ...product, image: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                    />
                    <select
                        value={product.category}
                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="céréales">Céréales</option>
                        <option value="leguimineuse">Leguimineuse</option>
                        <option value="legymes">Legumes</option>
                        <option value="fruits">Fruits</option>
                        <option value="bétails">Bétails</option>
                        <option value="AUtres">Autres</option>
                    </select>
                    <input
                        type="Number"
                        placeholder="Nombre de Stock"
                        value={product.stock}
                        onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) || 0 })}
                        className="w-full border px-3 py-2 rounded"
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded"
                        >
                            Publier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// --- Modal Ajouter Produit ---
// const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
//     const [product, setProduct] = useState({
//         name: "",
//         description: "",
//         price: 0,
//         unit: "kg",
//         location: "",
//         category: "cereales",
//         image: "",
//         stock: 0,
//         available: true,
//         rating: 0,
//         reviews: 0,
//         seller: "Mon Cooperative"
//     });

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onAddProduct(product);
//         onClose();
//         setProduct({ name: "", description: "", price: 0, unit: "kg", location: "", category: "cereales", image: "", stock: 0, available: true, rating: 0, reviews: 0, seller: "Mon Cooperative" });
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg max-w-md w-full p-6">
//                 <h2 className="text-xl font-bold mb-4">Publier un produit</h2>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <input
//                         type="text"
//                         placeholder="Nom du produit"
//                         value={product.name}
//                         onChange={(e) => setProduct({ ...product, name: e.target.value })}
//                         required
//                         className="w-full border px-3 py-2 rounded"
//                     />
//                     <textarea
//                         placeholder="Description"
//                         value={product.description}
//                         onChange={(e) => setProduct({ ...product, description: e.target.value })}
//                         required
//                         className="w-full border px-3 py-2 rounded"
//                     />
//                     <div className="flex gap-2">
//                         <input
//                             type="number"
//                             placeholder="Prix"
//                             value={product.price}
//                             onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
//                             required
//                             className="flex-1 border px-3 py-2 rounded"
//                         />
//                         <input
//                             type="text"
//                             placeholder="Unité"
//                             value={product.unit}
//                             onChange={(e) => setProduct({ ...product, unit: e.target.value })}
//                             className="flex-1 border px-3 py-2 rounded"
//                         />
//                     </div>
//                     <input
//                         type="text"
//                         placeholder="Localisation"
//                         value={product.location}
//                         onChange={(e) => setProduct({ ...product, location: e.target.value })}
//                         required
//                         className="w-full border px-3 py-2 rounded"
//                     />
//                     <input
//                         type="text"
//                         placeholder="URL image"
//                         value={product.image}
//                         onChange={(e) => setProduct({ ...product, image: e.target.value })}
//                         className="w-full border px-3 py-2 rounded"
//                     />
//                     <select
//                         value={product.category}
//                         onChange={(e) => setProduct({ ...product, category: e.target.value })}
//                         className="w-full border px-3 py-2 rounded"
//                     >
//                         <option value="cereales">Céréales</option>
//                         <option value="ligumineuses">Légumineuses</option>
//                         <option value="legume">Légumes</option>
//                         <option value="fruits">Fruits</option>
//                         <option value="betail">Bétail</option>
//                         <option value="autres">Autres</option>
//                     </select>
//                     <input
//                         type="number"
//                         placeholder="Stock disponible"
//                         value={product.stock}
//                         onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) || 0 })}
//                         className="w-full border px-3 py-2 rounded"
//                     />
//                     <div className="flex justify-end gap-2">
//                         <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Annuler</button>
//                         <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Publier</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };


const ProductDetailsModal = ({ isOpen, onClose, product, onBuy, onContact }) => {
    if (!isOpen || !product) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{product.name}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <img
                                src={product.image || "/api/agrictd/arac.jpeg"}
                                alt={product.name}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Prix</h3>
                                <div className="text-2xl font-bold text-green-600">
                                    {product.price.toLocaleString()} XAF/{product.unit}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Localisation</h3>
                                <div className="text-2xl font-bold text-green-600">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {product.location}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Vendeur</h3>
                                <p className="text-gray-600">{product.seller}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Evaluation</h3>
                                <div className="flex items-center space-x-2">
                                    <div className="flex-items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < product.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-gray-600">({product.reviews} avis)</span>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => onBuy(product)}
                                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orangr-700"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    <span>Acheter</span>
                                </button>
                                <button
                                    onClick={() => onContact(product)}
                                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orangr-700"
                                >
                                    <Phone className="h-4 w-4" />
                                    <span>Contacter</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600">{product.description}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-900 mb-2">Specification</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">Origine:</span>
                                        <p>{product.origin || "Tchad"}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Qualite:</span>
                                        <p>{product.quality || "Premium"}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Conditionnement:</span>
                                        <p>{product.package || "Sac de 50kg"}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Stock disponible:</span>
                                        <p>{product.stock || "100+"}{product.unit}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ContactModal = ({ isOpen, onClose, product }) => {
    const [message, setMessage] = useState("")

    const handleSend = () => {
        alert(`Message envoye a Vendeur de ${product?.name}: ${message}`)
        setMessage("")
        onClose()
    }

    if (!isOpen || !product) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-xl font-bold mb-4">Contacter le vendeur</h2>
                <p className="text-gray-600 mb-4">Produit: {product.name}</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Bonjour, je suis interesse par votre produit..."
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSend}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Envoyer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PurchaseModal = ({ isOpen, onClose, product, onConfirmPurchase }) => {
    const [quantity, setQuantity] = useState(1)
    const [showPayment, setShowPayment] = useState(false)

    const total = product ? product.price * quantity : 0

    const handleConfirm = () => {
        setShowPayment(true)
    }

    const handlePaymentSuccess = (payementResult) => {
        onConfirmPurchase({
            product,
            quantity,
            total,
            payementResult
        })
        onClose()
        setShowPayment(false)
        setQuantity(1)
    }

    if (!isOpen || !product) return null

    // console.log('showPayment:', showPayment, 'isOpen:', isOpen, 'product:', product)

    if (showPayment) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Payment
                    order={{ amount: total, product: product.name, quantity }}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setShowPayment(false)}
                />
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-xl fond-bold mb-4">Confirmer l'achat</h2>

                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <img
                            src={product.image || "/api/agrictd/arac.jpeg"}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.price.toLocaleString()} XAF/{product.unit}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantite</label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(parseInt(e.target.value)) || 1, 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-non focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Total:</span>
                            <span className="text-xl font-bold text-green-600">
                                {total.toLocaleString()} XAF
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center space-x-2"
                        >
                            <CreditCard className="h-4 w-4" />
                            <span>Procéder au paiement</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default function Marketplace() {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Mil Rouge Premium",
            description: "Mil de qualite, recolte, 2024. Ideal pour la consommation familiale et la transformation.",
            price: 500,
            unit: "kg",
            location: "Moundou, Logone Occidental",
            seller: "Cooperative de Moundou",
            rating: 4,
            reviews: 23,
            available: true,
            image: "/mil.jpeg",
            category: "cereales"
        },
        {
            id: 2,
            name: "Sorgho blanc",
            description: "Sorgho blanc traditionnel, variete locale resistante a la secheresse.",
            price: 600,
            unit: "kg",
            location: "Sarh, Moyen-chari",
            seller: "Union de Producteurs de Sarh",
            rating: 5,
            reviews: 15,
            available: true,
            image: "/ih.jpeg",
            category: "cereales"
        },
        {
            id: 3,
            name: "Arachide Decortiquees",
            description: "Arachides fraiches et decortiquees, parfaites pour la cuisine et la transformation.",
            price: 1500,
            unit: "kg",
            location: "Doba, Logone Oriental",
            seller: "Groupement Feminin de Doba",
            rating: 4,
            reviews: 31,
            available: true,
            image: "/arac.jpeg",
            category: "cereales"
        },
        {
            id: 4,
            name: "Mil Rouge Premium",
            description: "Mil de qualite, recolte, 2024. Ideal pour la consommation familiale et la transformation.",
            price: 500,
            unit: "kg",
            location: "Moundou, Logone Occidental",
            seller: "Cooperative de Moundou",
            rating: 4,
            reviews: 23,
            available: true,
            image: "/mil.jpeg",
            category: "cereales"
        },
        {
            id: 5,
            name: "Gombo",
            description: "Gombo de qualite, recolte, 2024. Ideal pour la consommation familiale et la transformation.",
            price: 500,
            unit: "kg",
            location: "Moundou, Logone Occidental",
            seller: "Cooperative de Moundou",
            rating: 4,
            reviews: 23,
            available: true,
            image: "/gom.jpeg",
            category: "cereales"
        },
        {
            id: 6,
            name: "Sesame Rouge Premium",
            description: "Sesame de qualite, recolte, 2024. Ideal pour la consommation familiale et la transformation.",
            price: 500,
            unit: "kg",
            location: "Moundou, Logone Occidental",
            seller: "Cooperative de Moundou",
            rating: 4,
            reviews: 23,
            available: true,
            image: "/seam.jpeg",
            category: "cereales"
        },
    ])

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showAddProductModal, setShowAddProductModal] = useState(false)
    const [showContactModal, setShowContactModal] = useState(false)
    const [showPurchaseModal, setShowPurchaseModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const categories = [
        { value: "all", label: "Tout les cooperatives" },
        { value: "cereales", label: "Cereales" },
        { value: "ligumineuses", label: "Legumineuses" },
        { value: "legume", label: "Legume" },
        { value: "fruits", label: "Fruits" },
        { value: "betail", label: "Betail" },
        { value: "autres", label: "Autres" },
    ]

    const filteredProcducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

        return matchesSearch && matchesCategory
    })

    const handleViewDetails = (product) => {
        setSelectedProduct(product)
        setShowDetailsModal(true)
    }



    const handleContact = (product) => {
        setSelectedProduct(product)
        setShowContactModal(true)
    }

    const handleBuy = (product) => {
        setSelectedProduct(product)
        setShowPurchaseModal(true)
    }

    const handleShare = (product) => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href
            })
        } else {
            navigator.clipboard.writeText(`${product.name} - ${product.price} XAF/${product.unit}`)
            alert("Informations copiees dans le presse-papiers !")
        }
    }

    const handleAddProduct = (newProduct) => {
        setProducts([newProduct, ...products]);
    };

    const handleConfirmPurchase = (purchaseData) => {
        alert(`Achat confirmer ! Vous avez achete ${purchaseData.quantity} ${purchaseData.product.unit} de ${purchaseData.product.name} pour ${purchaseData.total.toLocaleString()} XAF`)
    }

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-blue text-white p-6 rounded-lg">
                <h1 className="text-3xl font-bold mb-2">Marche Agricole</h1>
                <p className="text-green-100">
                    Achetez et vendez des produits agricoles directement avec les producteurs locaux.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <button
                    onClick={() => setShowAddProductModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProcducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onBuy={handleBuy}
                        onContact={handleContact}
                        onShare={handleShare}
                        onViewDetails={handleViewDetails}
                    />
                ))}
            </div>

            {filteredProcducts.length === 0 && (
                <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun produit trouve</h3>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                        Essayez de modifier vos criters de recherche.
                    </p>
                </div>
            )}

            <ProductDetailsModal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                product={selectedProduct}
                onBuy={handleBuy}
                onContact={handleContact}
            />
            <AddProductModal
                isOpen={showAddProductModal}
                onClose={() => setShowAddProductModal(false)}
                onAddProduct={handleAddProduct}
            />

            <ContactModal
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
                product={selectedProduct}
            />

            <PurchaseModal
                isOpen={showPurchaseModal}
                onClose={() => setShowPurchaseModal(false)}
                product={selectedProduct}
                onConfirmPurchase={handleConfirmPurchase}
            />
        </div>
    )

}

