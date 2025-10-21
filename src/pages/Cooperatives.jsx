import React, { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Users, MapPin, Phone, Building, Eye, Mail, Download } from "lucide-react"
import { apiService } from "/src/services/api"

const CooperativeCard = ({ cooperative, onEdit, onDelete, onViewMembers, onExport }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-3 rounded-lg">
                        <Building className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{cooperative.nom}</h3>
                        <p className="text-sm text-gray-600">{cooperative.description}</p>
                    </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${cooperative.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-800"}`}>
                    {cooperative.isActive ? "Active" : "Inactive"}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{cooperative.region}, {cooperative.ville}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{cooperative.statistiques?.nombresMembres || 0} membres</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{cooperative.telephone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{cooperative.email}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onViewMembers(cooperative)}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                    <Eye className="h-4 w-4" />
                    <span>Gérer les membres</span>
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
                <button
                    onClick={() => onDelete(cooperative._id)}
                    className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                    <span>Supprimer</span>
                </button>
            </div>
        </div>
    )
}

const CooperativeModal = ({ isOpen, onClose, cooperative, onSave }) => {
    const [formData, setFormData] = useState(
        cooperative || {
            nom: "",
            description: "",
            region: "",
            ville: "",
            telephone: "",
            email: "",
            dateCreation: new Date().toISOString().split('T')[0],
            isActive: true,
            membres: [],
            statistiques: {
                nombresMembres: 0,  // Vous pourrez modifier cette valeur
                chiffreAffaireAnnuel: 0,
                superficieTotal: 0
            }
        }
    )


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await onSave(formData)
            onClose()
        } catch (error) {
            alert("Erreur: " + error.message)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    {cooperative ? "Modifier la coopérative" : "Nouvelle coopérative"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom de la coopérative *
                        </label>
                        <input
                            type="text"
                            value={formData.nom}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Région *
                        </label>
                        <input
                            type="text"
                            value={formData.region}
                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ville *
                        </label>
                        <input
                            type="text"
                            value={formData.ville}
                            onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de membres initial
                        </label>
                        <input
                            type="number"
                            value={formData.statistiques.nombresMembres}
                            onChange={(e) => setFormData({
                                ...formData,
                                statistiques: {
                                    ...formData.statistiques,
                                    nombresMembres: parseInt(e.target.value) || 0
                                }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Téléphone *
                        </label>
                        <input
                            type="tel"
                            value={formData.telephone}
                            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date de création
                        </label>
                        <input
                            type="date"
                            value={formData.dateCreation}
                            onChange={(e) => setFormData({ ...formData, dateCreation: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

const MembersManagementModal = ({ isOpen, onClose, cooperative, onAddMember }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMember, setNewMember] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        role: "membre",
        dateAdhesion: new Date().toISOString().split('T')[0]
    });

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            await onAddMember(cooperative._id, newMember);
            setNewMember({
                nom: "",
                prenom: "",
                email: "",
                telephone: "",
                role: "membre",
                dateAdhesion: new Date().toISOString().split('T')[0]
            });
            setShowAddForm(false);
        } catch (error) {
            alert("Erreur: " + error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">
                        Gestion des membres - {cooperative?.nom}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                {/* Bouton pour ajouter un membre */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Ajouter un membre</span>
                    </button>
                </div>

                {/* Formulaire d'ajout de membre */}
                {showAddForm && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-semibold mb-4">Nouveau membre</h3>
                        <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom *
                                </label>
                                <input
                                    type="text"
                                    value={newMember.nom}
                                    onChange={(e) => setNewMember({ ...newMember, nom: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Prénom *
                                </label>
                                <input
                                    type="text"
                                    value={newMember.prenom}
                                    onChange={(e) => setNewMember({ ...newMember, prenom: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={newMember.email}
                                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    value={newMember.telephone}
                                    onChange={(e) => setNewMember({ ...newMember, telephone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rôle
                                </label>
                                <select
                                    value={newMember.role}
                                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="membre">Membre</option>
                                    <option value="president">Président</option>
                                    <option value="secretaire">Secrétaire</option>
                                    <option value="tresorier">Trésorier</option>
                                    <option value="producteur">Producteur</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date d'adhésion
                                </label>
                                <input
                                    type="date"
                                    value={newMember.dateAdhesion}
                                    onChange={(e) => setNewMember({ ...newMember, dateAdhesion: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Ajouter le membre
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Liste des membres */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold mb-4">
                        Membres ({cooperative?.membres?.length || 0})
                    </h3>

                    {cooperative?.membres?.length > 0 ? (
                        cooperative.membres.map((membre, index) => (
                            <div key={membre._id || index} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg">
                                <div className="flex-1">
                                    <h4 className="font-medium">
                                        {membre.user?.prenom} {membre.user?.nom}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {membre.role} • {membre.user?.email || membre.user?.telephone}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Adhésion: {new Date(membre.dateAdhesion).toLocaleDateString("fr-FR")}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${membre.role === 'president' ? 'bg-purple-100 text-purple-800' :
                                        membre.role === 'producteur' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {membre.role}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Users className="mx-auto h-12 w-12 mb-4" />
                            <p>Aucun membre pour le moment</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

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
                    <h2 className="text-xl font-bold">Membres de {cooperative?.nom}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <div className="space-y-3">
                    {members.map(member => (
                        <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                                <h3 className="font-medium">{member.name}</h3>
                                <p className="text-sm text-gray-600">{member.role} • {member.Phone}</p>
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

export default function Cooperatives() {
    const [cooperatives, setCooperatives] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)
    const [editingCooperative, setEditingCooperative] = useState(null)
    const [selectedCooperative, setSelectedCooperative] = useState(null)
    const [loading, setLoading] = useState(true)

    // Charger les coopératives depuis l'API
    const loadCooperatives = async () => {
        try {
            setLoading(true)
            const response = await apiService.getCooperatives()
            if (response.success) {
                setCooperatives(response.data.cooperatives)
            }
        } catch (error) {
            console.error("Erreur chargement coopératives:", error)
            alert("Erreur lors du chargement des coopératives")
        } finally {
            setLoading(false)
        }
    }

    // Charger au démarrage
    useEffect(() => {
        loadCooperatives()
    }, [])

    const filteredCooperatives = cooperatives.filter(coop =>
        coop.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coop.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coop.ville.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleEdit = (cooperative) => {
        setEditingCooperative(cooperative)
        setIsModalOpen(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette coopérative ?")) {
            try {
                await apiService.deleteCooperative(id)
                await loadCooperatives() // Recharger la liste
                alert("Coopérative supprimée avec succès")
            } catch (error) {
                alert("Erreur lors de la suppression: " + error.message)
            }
        }
    }

    const handleAddMember = async (cooperativeId, memberData) => {
        try {
            await apiService.addMember(cooperativeId, memberData);
            // Recharger les coopératives pour avoir les membres à jour
            await loadCooperatives();
            alert("Membre ajouté avec succès !");
        } catch (error) {
            alert("Erreur: " + error.message);
            throw error;
        }
    };

    

    const handleSave = async (cooperativeData) => {
        try {
            if (editingCooperative) {
                // Modification
                await apiService.updateCooperative(editingCooperative._id, cooperativeData)
                alert("Coopérative modifiée avec succès")
            } else {
                // Création
                await apiService.createCooperative(cooperativeData)
                alert("Coopérative créée avec succès")
            }

            await loadCooperatives() // Recharger la liste
            setEditingCooperative(null)
            return true
        } catch (error) {
            alert("Erreur: " + error.message)
            throw error
        }
    }

    const handleViewMembers = (cooperative) => {
        setSelectedCooperative(cooperative)
        setIsMembersModalOpen(true)
    }

    const handleExport = (cooperative) => {
        const data = JSON.stringify(cooperative, null, 2)
        const blob = new Blob([data], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `cooperative-${cooperative.nom.replace(/\s+/g, "-")}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        alert(`Données de ${cooperative.nom} exportées avec succès !`)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Chargement des coopératives...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des Coopératives</h1>
                    <p className="text-gray-600">Gérez les coopératives agricoles et leurs membres</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Nouvelle Coopérative</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                    type="text"
                    placeholder="Rechercher une coopérative..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Cooperatives Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCooperatives.map((cooperative) => (
                    <CooperativeCard
                        key={cooperative._id}
                        cooperative={cooperative}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onViewMembers={handleViewMembers}
                        onExport={handleExport}
                    />
                ))}
            </div>

            {filteredCooperatives.length === 0 && (
                <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-500">Aucune coopérative</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm ? "Aucun résultat pour votre recherche." : "Commencez par créer une nouvelle coopérative."}
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

            {/* <MembersModal
                isOpen={isMembersModalOpen}
                onClose={() => setIsMembersModalOpen(false)}
                cooperative={selectedCooperative}
            />
        </div> */}

         <MembersManagementModal
                isOpen={isMembersModalOpen}
                onClose={() => setIsMembersModalOpen(false)}
                cooperative={selectedCooperative}
                onAddMember={handleAddMember}
            />
        </div>
    )
}