import React, { useState } from 'react'
import { Download, Eye, Share2, BookOpen, FileText, Video, Users, Search, Filter } from 'lucide-react'

const ResourceCard = ({ resource, onView, onDownload, onShare }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'guide': return <BookOpen className="h-5 w-5" />
      case 'document': return <FileText className="h-5 w-5" />
      case 'video': return <Video className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-800'
      case 'document': return 'bg-green-100 text-green-800'
      case 'video': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
            {getTypeIcon(resource.type)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
            <p className="text-sm text-gray-600">{resource.category}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(resource.type)}`}>
          {resource.type}
        </span>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{resource.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>Par {resource.author}</span>
        <span>{resource.publishDate}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{resource.downloads} téléchargements</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(resource)}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>Lire</span>
          </button>
          <button
            onClick={() => onDownload(resource)}
            className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Télécharger</span>
          </button>
          <button
            onClick={() => onShare(resource)}
            className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Partager</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const ResourceViewer = ({ resource, isOpen, onClose }) => {
  if (!isOpen || !resource) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">{resource.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose max-w-none">
            <div className="mb-6">
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span>Auteur: {resource.author}</span>
                <span>•</span>
                <span>Publié le: {resource.publishDate}</span>
                <span>•</span>
                <span>Catégorie: {resource.category}</span>
              </div>
              <p className="text-gray-700 mb-6">{resource.description}</p>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3">Introduction</h3>
                <p>
                  Ce guide technique vous accompagne dans la compréhension et la mise en œuvre 
                  des meilleures pratiques agricoles adaptées au contexte tchadien. Il couvre 
                  les aspects essentiels de la production, de la gestion et de la commercialisation.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Objectifs</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Améliorer les rendements agricoles</li>
                  <li>Optimiser l'utilisation des ressources</li>
                  <li>Renforcer les capacités techniques</li>
                  <li>Faciliter l'accès aux marchés</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Contenu Technique</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">1. Préparation du sol</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    La préparation adéquate du sol est cruciale pour assurer une bonne germination 
                    et un développement optimal des cultures. Cette section détaille les techniques 
                    de labour, de nivellement et d'amendement du sol.
                  </p>
                  
                  <h4 className="font-medium mb-2">2. Sélection des semences</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Le choix des variétés adaptées au climat local et résistantes aux maladies 
                    est essentiel. Nous présentons ici les critères de sélection et les sources 
                    d'approvisionnement fiables.
                  </p>

                  <h4 className="font-medium mb-2">3. Techniques de plantation</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Les méthodes de plantation varient selon les cultures. Cette partie explique 
                    les espacements recommandés, les profondeurs de semis et les calendriers culturaux.
                  </p>

                  <h4 className="font-medium mb-2">4. Gestion de l'irrigation</h4>
                  <p className="text-sm text-gray-700">
                    L'eau étant une ressource précieuse, nous détaillons les systèmes d'irrigation 
                    économiques et efficaces adaptés aux petites exploitations.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Recommandations Pratiques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Bonnes Pratiques</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Rotation des cultures</li>
                      <li>• Compostage organique</li>
                      <li>• Lutte intégrée contre les ravageurs</li>
                      <li>• Conservation de l'eau</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Outils Recommandés</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Houe adaptée</li>
                      <li>• Système d'irrigation goutte-à-goutte</li>
                      <li>• Pulvérisateur manuel</li>
                      <li>• Matériel de récolte</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Conclusion</h3>
                <p>
                  L'application de ces techniques permettra d'améliorer significativement 
                  la productivité et la rentabilité de vos exploitations agricoles. 
                  N'hésitez pas à adapter ces conseils à votre contexte local spécifique.
                </p>
              </section>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Imprimer
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Resources() {
  const [resources, setResources] = useState([
    {
      id: 1,
      title: "Guide de Production du Coton au Tchad",
      description: "Manuel complet pour la culture du coton, de la préparation du sol à la commercialisation. Techniques modernes adaptées au climat tchadien.",
      category: "Agriculture",
      type: "guide",
      author: "ITRAD - Institut Tchadien de Recherche Agronomique",
      publishDate: "15 Mars 2024",
      downloads: 1250,
      fileSize: "2.5 MB",
      pages: 45
    },
    {
      id: 2,
      title: "Techniques d'Irrigation Économiques",
      description: "Solutions d'irrigation adaptées aux petites exploitations agricoles avec un focus sur l'économie d'eau et l'efficacité.",
      category: "Irrigation",
      type: "document",
      author: "FAO Tchad",
      publishDate: "8 Février 2024",
      downloads: 890,
      fileSize: "1.8 MB",
      pages: 32
    },
    {
      id: 3,
      title: "Formation: Gestion des Coopératives",
      description: "Module de formation vidéo sur la gestion administrative et financière des coopératives agricoles.",
      category: "Gestion",
      type: "video",
      author: "ONDR - Office National de Développement Rural",
      publishDate: "22 Janvier 2024",
      downloads: 654,
      duration: "45 min"
    },
    {
      id: 4,
      title: "Culture du Mil et du Sorgho",
      description: "Guide technique détaillé pour la production de céréales traditionnelles résistantes à la sécheresse.",
      category: "Céréales",
      type: "guide",
      author: "Centre de Recherche Agricole de Sarh",
      publishDate: "10 Décembre 2023",
      downloads: 2100,
      fileSize: "3.2 MB",
      pages: 58
    },
    {
      id: 5,
      title: "Élevage Bovin Moderne",
      description: "Techniques d'élevage améliorées pour augmenter la productivité du cheptel bovin au Tchad.",
      category: "Élevage",
      type: "document",
      author: "Ministère de l'Élevage",
      publishDate: "5 Novembre 2023",
      downloads: 780,
      fileSize: "2.1 MB",
      pages: 40
    },
    {
      id: 6,
      title: "Transformation des Produits Agricoles",
      description: "Guide pratique pour la transformation et la conservation des produits agricoles locaux.",
      category: "Transformation",
      type: "guide",
      author: "SODELAC",
      publishDate: "18 Octobre 2023",
      downloads: 1450,
      fileSize: "4.1 MB",
      pages: 72
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [viewingResource, setViewingResource] = useState(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'Agriculture', label: 'Agriculture' },
    { value: 'Irrigation', label: 'Irrigation' },
    { value: 'Gestion', label: 'Gestion' },
    { value: 'Céréales', label: 'Céréales' },
    { value: 'Élevage', label: 'Élevage' },
    { value: 'Transformation', label: 'Transformation' }
  ]

  const types = [
    { value: 'all', label: 'Tous les types' },
    { value: 'guide', label: 'Guides' },
    { value: 'document', label: 'Documents' },
    { value: 'video', label: 'Vidéos' }
  ]

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesType = selectedType === 'all' || resource.type === selectedType
    
    return matchesSearch && matchesCategory && matchesType
  })

  const handleView = (resource) => {
    setViewingResource(resource)
    setIsViewerOpen(true)
  }

  const handleDownload = (resource) => {
    // Simuler le téléchargement
    const link = document.createElement('a')
    link.href = '#'
    link.download = `${resource.title}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Mettre à jour le compteur de téléchargements
    setResources(prev => prev.map(r => 
      r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r
    ))
    
    alert(`Téléchargement de "${resource.title}" commencé !`)
  }

  const handleShare = (resource) => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href
      })
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      navigator.clipboard.writeText(window.location.href)
      alert('Lien copié dans le presse-papiers !')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Centre de Ressources Agricoles</h1>
        <p className="text-green-100">
          Accédez à une bibliothèque complète de guides techniques, documents et formations 
          pour améliorer vos pratiques agricoles au Tchad.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher des ressources..."
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

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {types.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>{filteredResources.length} ressource(s) trouvée(s)</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{resources.length}</div>
          <div className="text-gray-600">Ressources Disponibles</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {resources.reduce((sum, r) => sum + r.downloads, 0)}
          </div>
          <div className="text-gray-600">Téléchargements Total</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {categories.length - 1}
          </div>
          <div className="text-gray-600">Catégories</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {types.length - 1}
          </div>
          <div className="text-gray-600">Types de Contenu</div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onView={handleView}
            onDownload={handleDownload}
            onShare={handleShare}
          />
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune ressource trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez de modifier vos critères de recherche ou de filtrage.
          </p>
        </div>
      )}

      {/* Resource Viewer Modal */}
      <ResourceViewer
        resource={viewingResource}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </div>
  )
}