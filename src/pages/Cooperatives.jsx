import React, { useState } from "react"
import { Plus, Search, Edit, Trash2, Users, MapPin, Phone, Contact, Building, Eye, Mail, Download } from "lucide-react"

const CooperativeCard = ({ cooperative, onEdit, onDelete, onViewMembers, onContact, onExport }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-3 rounded-lg">
                        <Building className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{cooperative.name}</h3>
                        <p className="text-sm text-gray-600">{cooperative.type}</p>
                    </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${cooperative.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-800"
                    }`}>
                    {cooperative.status === "active" ? "Active" : "Inactive"}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{cooperative.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{cooperative.members} membres</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{cooperative.contact}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onViewMembers(cooperative)}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                    <Eye className="h-4 w-4" />
                    <span>Voir les membres</span>
                </button>
                <button
                    onClick={() => onContact(cooperative)}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                >
                    <Mail className="h-4 w-4" />
                    <span>Contacter</span>
                </button>
                <button
                    onClick={() => onExport(cooperative)}
                    className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                >
                    <Download className="h-4 w-4" />
                    <span>Exporter</span>
                </button>
                <button
                    onClick={() => onEdit(cooperative)}
                    className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
                >
                    <Edit className="h-4 w-4" />
                    <span>Modifier</span>
                </button>
            </div>
        </div>

    )
}

const CooperativeModal = ({ isOpen, onClose, cooperative, onSave }) => {
    const [formData, setFormData] = useState(
        cooperative || {
            name: "",
            type: "production",
            location: "",
            contact: "",
            email: "",
            manager: "",
            members: "",
            activities: [],
            status: "active"
        }
    )

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
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
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        >
                            <option value="production">Production</option>
                            <option value="commercialisation">Commercialisation</option>
                            <option value="transformation">Transformation</option>
                            <option value="mixte">Mixte</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Localisation
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de membres
                        </label>
                        <input
                            type="mumber"
                            value={formData.mumbers}
                            onChange={(e) => setFormData({ ...formData, numbers: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="text"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-md hover:from-green-700 hover:to-blue-700"
                        >
                            {cooperative ? "Modifier" : "Créer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}


const MembersModal = ({ isOpen, onClose, cooperative }) => {
    const [members] = useState([
        { id: 1, name: "Ahmadou Mahamat", role: "President", Phone: "+235 66 12 34 56", joinData: "2023-01-15" },
        { id: 2, name: "Fatima Abdoulaye", role: "Secretaire", Phone: "+235 66 78 90 12", joinData: "2023-02-10" },
        { id: 3, name: "Hassan Idriss", role: "Tresorier", Phone: "+235 66 45 67 89", joinData: "2023-03-05" },
        { id: 4, name: "Aicha Moussa", role: "Membre", Phone: "+235 66 23 45 67", joinData: "2023-04-20" }
    ])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Membres de {cooperative?.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <div className="space-y-3">
                    {members.map(member => (
                        <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                                <h3 className="font-medium">{member.name}</h3>
                                <p className="text-sm text-gray-600">{member.role} • {member.contact}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                                Adhesion: {new Date(member.joinData).toLocaleDateString("fr-FR")}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const ContactModal = ({ isOpen, onClose, cooperative }) => {
    const [message, setMessage] = useState("")

    const handleSend = () => {
        alert(`Message envoye a ${cooperative.name}: ${message}`)
        setMessage("")
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-xl font-bold mb-4">Contacter {cooperative?.name}</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tapez votre message..."
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
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-md"
                        >
                            Envoyer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}
"bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"



export default function Cooperatives() {
    const [cooperatives, setCooperatives] = useState([
        {
            id: 1,
            name: "Cooperative de Moundou",
            location: "Abeche, N'djamena Moundou",
            type: "Production",
            email: "coop.boncor@gmail.com",
            members: 45,
            contact: "+235 66 12 34 56",
            president: "Hassane Moustapha",
            status: "active"
        },
        {
            id: 2,
            name: "Union des producteurs de sarh",
            location: "Sarh, Moyen-Chari",
            type: "Commercialisation",
            email: "coop.boncor@gmail.com",
            members: 67,
            contact: "+235 66 50 51 41",
            president: "Fatima Abdoulaye",
            status: "active"
        },
        {
            id: 3,
            name: "Groupement de Bongor",
            type: "Commercialisation",
            location: "Bongor Mayo-Kebbi Est",
            email: "coop.boncor@gmail.com",
            members: 32,
            contact: "+235 66 12 34 56",
            manager: "Ibrahim Ousmane",
            status: "pending"
        }
    ])

    const [searchTerm, setsearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)
    const [isContactModalOpen, setIsContactModalOpen] = useState(false)
    const [editingCooperative, setEditingCooperative] = useState(null)
    const [selectedCooperative, setSelectedCooperative] = useState(null)

    const filtredCooperatives = cooperatives.filter(coop =>
        coop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coop.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleEdit = (cooperative) => {
        setEditingCooperative(cooperative)
        setIsModalOpen(true)
    }

    const handleDelete = (id) => {
        if (window.confirm("Etes-vous sur de vouloir supprimer ce message ?")) {
            setCooperatives(cooperatives.filter(coop => coop.id !== id))
        }
    }
    const handleViewMembers = (cooperative) => {
        setSelectedCooperative(cooperative)
        setIsMembersModalOpen(true)
    }

    const handleContact = (cooperative) => {
        setSelectedCooperative(cooperative)
        setIsContactModalOpen(true)
    }

    const handleExport = (cooperative) => {
        const data = JSON.stringify(cooperative, null, 2)
        const blob = new Blob([data], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `cooperative-${cooperative.name.replace(/\s+/g, "-")}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        alert(`Donnees de ${cooperative.name} exportees avec success !`)
    }

    const handleSave = (cooperativeData) => {
        if (editingCooperative) {
            setCooperatives(prev => prev.map(c =>
                c.id === editingCooperative.id ? { ...cooperativeData, id: c.id } : c
            ))
        } else {
            setCooperatives(prev => [...prev, { ...cooperativeData, id: Date.now() }])
        }
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
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 flex items-center space-x-2"
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
                        onViewMembers={handleViewMembers}
                        onContact={handleContact}
                        onExport={handleExport}
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
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingCooperative(null)
                }}
                cooperative={editingCooperative}
                onSave={handleSave}
            />

            <MembersModal
                isOpen={isMembersModalOpen}
                onClose={() => setIsMembersModalOpen(false)}
                cooperative={selectedCooperative}
            />

            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                cooperative={selectedCooperative}
            />
        </div>
    )

}