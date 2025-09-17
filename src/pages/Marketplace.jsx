import React, { useState } from "react"
import { ShoppingCart, Search, Filter, Star, MapPin, Phone, Package, Eye, Share2 } from "lucide-react"

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
                    <span className={`px-2-py-1-text-xs-font-medium-rounded-full ${
                        product.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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

const ProductDetailsModal = ({ isOpen, onClose, product, onBuy, onContact }) => {
    if (!isOpen || !product) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="h-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{product.name}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <image
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
                                 <h3 className="font-semibold text-gray-900 mb-2">Prix</h3>
                                <div className="text-2xl font-bold text-green-600">
                                    <MapPin className="h-4 w-4 mr-2" />
                                      {product.location}
                                </div>
                            </div>

                            <div>
                                 <h3 className="font-semibold text-gray-900 mb-2">Prix</h3>
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
                            h3.font-semibold
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
            {/* <div className="h-48 bg-gray-200 flex items-center justift-center">
                <ShoppingCart className="h-24 w-24 text-gray-400" />
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>

                <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Prix:</span>
                        <span className="font-medium">{product.price.toLocaleString()}FCFA/{product.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Stock:</span>
                        <span className={`font-medium ${product.stock < 10 ? "text-red-600" : "text-green-600"}`}>
                            {product.stock} {product.unit}
                        </span>
                    </div>
                    <div className="flex judtify-between text-sm">
                        <span className="text-gray-500">Vendeur:</span>
                        <span className="font-medium">{product.seller}</span>
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        product.status === "available"
                        ? "bg-green-100 text-gray-800"
                        : "bg-yellow-100 text-gray-800" 
                    }`}>
                        {product.status === "available" ? "Disponible"  : "En rupture"}
                    </span>

                    <div className="flex-space-x-1">
                        <button
                            onClick={() => onEdit(product.name)}
                            className="p-1 text-gray-400 hover:text-blue-600 rounded"
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => onDelete(product.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ProductModal = ({ isOpen, onClose, product, onSave }) => {
    const [formData, setFormData] = useState(
        product || {
            name: "",
            description: "",
            price: "",
            unit:"kg",
            stock: "",
            seller: "",
            category: "cereales",
            status: "available"
        }
    )

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave({
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            id: product ? product.id : Date.now()
        })
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h [90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    {product ? "Modifier le produit" : "Nouveau produit"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom du produit
                        </label>
                        <input 
                            type="text"
                            value={formData}
                            onChange={(e) => setFormData({...formData, name: Edit.target.value})}
                            className="w-full px-3 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus-ring-2 focus:ring-blue-500"
                            rows="3"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prix (FCFA)
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Unite
                            </label>
                            <select
                                value={formData.unit}
                                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                                className="w-full px-3 py-2 border borde-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="kg">kg</option>
                                <option value="tonne">tonne</option>
                                <option value="sac">sac</option>
                                <option value="litre">litre</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vendeur/Cooperative
                        </label>
                        <input
                            type="text"
                            value={formData.seller}
                            onChange={(e) => setFormData({...formData, seller: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounder-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categorie
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="cereales">Cereales</option>
                            <option value="legimineuses">Legumineuses</option>
                            <option value="legumes">Lequimes</option>
                            <option value="fruit">Fruits</option>
                            <option value="betail">Betail</option>
                            <option value="autres">Autres</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {product ? "Modifier" : "Creer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} */}

export default function Marketplace() {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Mil Rouge",
            description: "Mil de qualite superieur, recolte 2025",
            price: 7500,
            stock: 250,
            unit: "kg",
            seller: "Cooperative de Moundou",
            category: "cereale",
            status: "available"
        },
          {
            id: 2,
            name: "Sorgho Blanc",
            description: "Sorgho blanc pour consommationet brasserie",
            price: 500,
            stock: 180,
            unit: "kg",
            seller: "Union de Producteur de Sarh",
            category: "cereale",
            status: "available"
        },
          {
            id: 3,
            name: "Arachide",
            description: "Arachide decortiquees, prete a la vente",
            price: 1500,
            stock: 50,
            unit: "kg",
            seller: "Cooperative de Moundou",
            category: "legumineuses",
            status: "available"
        },
          {
            id: 4,
            name: "Haricots Niebe",
            description: "Haricots niebe seches",
            price: 2000,
            stock: 25,
            unit: "kg",
            seller: "Cooperative de Moundou",
            category: "legumineuses",
            status: "available"
        },
          {
            id: 6,
            name: "Sesame",
            description: "Sesame de qualite superieur, recolte 2025",
            price: 3500,
            stock: 250,
            unit: "kg",
            seller: "Copperative d'Abeche",
            category: "cereale",
            status: "available"
        },
          {
            id: 1,
            name: "Mil Rouge",
            description: "Mil de qualite superieur, recolte 2025",
            price: 7500,
            stock: 250,
            unit: "kg",
            seller: "Cooperative de Moundou",
            category: "cereale",
            status: "available"
        },
    ])

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)

    const categories = [
        { value: "all", label: "Tout les cooperatives"},
        { value: "cereales", label: "Cereales"},
        { value: "ligumineuses", label: "Legumineuses"},
        { value: "legume", label: "Legume"},
        { value: "fruits", label: "Fruits"},
        { value: "betail", label: "Betail"},
        { value: "autres", label: "Autres"},
    ]

    const filteredProcducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory ==="all" || product.category === selectedCategory

        return matchesSearch && matchesCategory
    }) 

    const handleEdit = (product) => {
        setEditingProduct(product)
        setIsModalOpen(true)
    }

    const handleDelete = (id) => {
        if(window.confirm("Etes-vous sur de vouloir supprimer ce produit ?")) {
            setProducts(products.filter(product => product.id !== id))
        }
    }

    const handleSave = (formData) => {
        if (editingProduct) {
            setProducts(products.map(product => 
                product.id === editingProduct.id ? formData : product
            ))
        } else {
            setProducts([...products, formData])
        }
        setEditingProduct(null)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingProduct(null)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Marche Agricole</h1>
                    <p className="text-gray-600">Plateforme d'achat et vente de produits agricoles</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="Bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Ajouter un produit</span>
                </button>
            </div>

            {/* Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus-ring-blue-500"
                >
                    {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                            {category.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Prducts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProcducts.map((product) => (
                    <ProductCard 
                        key={product.id}
                        product={product}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {filteredProcducts.length === 0 && (
                <div className="text-center py-2">
                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-500">Aucun produit trouve</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || selectedCategory !== "all"
                            ? "Aucun resultat pour vos criteres de recherche."
                            : "Commencez par ajouter des produits au marche."
                        }
                    </p>
                </div>
            )}

            {/* Modal */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                product={editingProduct}
                onSave={handleSave}
            />
        </div>
    )

    
}