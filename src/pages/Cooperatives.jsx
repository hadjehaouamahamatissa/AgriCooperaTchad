import React, { useState } from "react"
import { Plus, Search, Edit, Trash2, Users, MapPin, Phone} from "lucide-react"

const CooperativeCard = ({ cooperative, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{cooperative.name}</h3>
                    <div className="mt-2 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {cooperative.locatiol}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            {cooperative.members} membres
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {cooperative.contact}
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            cooperative.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                            {cooperative.status === "active" ? "Actif" : "En attente"}
                        </span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(cooperative)}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button 
                        onClick={() => onDelete(cooperative.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>     
                </div>
            </div>     
        </div>
    )
}

const CooperativeModal = ({ isOpen, onClose, cooperative, onSave }) => {
    const [formData, setFormData] = useState(
        cooperative || {
            name: "",
            location: "",
            members: "",
            contact: "",
            president: "",
            status: "active"
        }
    )

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(SaveData)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-xl font-bold mb-4">
                    {cooperative ? "Modifier la cooperative" : "Nouvelle cooperative"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom de la cooperative
                        </label>
                        <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Localisation
                        </label>
                        <input 
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de membres
                        </label>
                        <input 
                        type="number"
                        value={formData.mumbers}
                        onChange={(e) => setFormData({...formData, numbers: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact
                        </label>
                        <input 
                        type="tel"
                        value={formData.contact}
                        onChange={(e) => setFormData({...formData, contact: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Président
                        </label>
                        <input 
                        type="text"
                        value={formData.president}
                        onChange={(e) => setFormData({...formData, president: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required 
                        />
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
                            {cooperative ? "Modifier" : "Créer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function Cooperatives() {
    const [cooperatives, setCooperatives] = useState([
        {
            id: 1,
            name: "Cooperative de Moundou",
            location: "Abeche, N'djamena Moundou",
            members: 45,
            contact: "+235 66 12 34 56",
            president: "Hassane Moustapha",
            status: "active"
        },
        {
            id: 2,
            name: "Union des producteurs de sarh",
            location: "Sarh, Moyen-Chari",
            members: 67,
            contact: "+235 66 50 51 41",
            president: "Fatima Abdoulaye",
            status: "active"
        },
        {
            id:3,
            name: "Groupement de Bongor",
            location: "Bongor Mayo-Kebbi Est",
            members: 32,
            contact: "+235 66 34 56 78",
            president: "Ibrahim Ousmane",
            status: "pending"
        }
    ])

    const [searchTerm, setsearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCooperative, setEditCooperative] = useState(null)

    const filtredCooperatives = cooperatives.filter(coop => 
        coop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coop.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleEdit = (cooperative) => {
        setEditCooperative(cooperative)
        setIsModalOpen(true)
    }

    const handleDelete = (id) => {
        if (window.confirm("Etes-vous sur de vouloir supprimer ce message ?")) {
            setCooperatives(cooperatives.filter(coop => coop.id !== id))
        }
    }

    const handleSave = (formData) => {
        if (editingCooperative) {
            setCooperatives(cooperatives.map(coop => 
                coop.id === editingCooperative.id ? {...formData, id: editingCooperative.id } : coop
            ))
        } else {
            setCooperatives([...cooperatives, {...formData, id: Date.now() }])
        }
        setEditingCooperative(null)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingCooperative(null)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des Cooperatives</h1>
                    <p className="text-gray-600">Gerez les cooperatives agricoles et leurs membres</p>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
                <Plus className="h-4 w-4" />
                <span>Nouvelle Cooperative</span>
            </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input 
                    type="text"
                    placeholder="Rechercher une cooperative..."
                    value={searchTerm}
                    onChange={(e) => setsearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 runded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Cooperatives Grid */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtredCooperatives.map((cooperative) => (
                    <CooperativeCard
                        key={cooperative.id}
                        cooperative={cooperative}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}    
            </div>
            {filtredCooperatives.length === 0 && (

            <div className="text-center py-2">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-500">Aucun</h3>
                <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? "Aucun resultat pour votre recherche." : "Commencez par creer une nouvelle cooperative."}
               </p>
            </div>
            )}

            {/* Modal for Add/Edit Cooperative */}
            <CooperativeModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                cooperative={editingCooperative}
                onSave={handleSave}
            />  
        </div>
    )

}