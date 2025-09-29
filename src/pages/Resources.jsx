import React, { useState, useEffect } from 'react'
import { 
  Download, Search, Filter, BookOpen, Video, 
  FileText, Users, DollarSign, Droplets, 
  Wheat, Star, Eye, Calendar, User
} from 'lucide-react'

const Resources = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  // Ressources avec contenu réel et détaillé
  const resourcesData = [
    {
      id: 1,
      title: 'Guide Pratique de Culture du Mil au Tchad',
      description: 'Manuel complet couvrant toutes les étapes de la culture du mil : préparation du sol, semis, entretien, fertilisation et récolte. Techniques adaptées aux conditions climatiques tchadiennes avec calendrier cultural détaillé.',
      category: 'production',
      type: 'guide',
      fileType: 'PDF',
      fileSize: '2.5 MB',
      downloadCount: 1247,
      rating: 4.8,
      author: 'Ministère de l\'Agriculture du Tchad',
      publishDate: '2024-01-15',
      filePath: '/resources/guide-culture-mil.pdf',
      tags: ['mil', 'céréales', 'semis', 'fertilisation', 'récolte'],
      preview: 'Ce guide détaille les meilleures pratiques pour cultiver le mil au Tchad, incluant la préparation du sol (labour 15-20cm), le semis (3-4 graines/poquet), l\'entretien (2-3 sarclages), et la récolte (120-140 jours). Rendement attendu : 800-1200 kg/ha.',
      chapters: [
        'Introduction au mil au Tchad',
        'Préparation et travail du sol',
        'Techniques de semis optimales',
        'Entretien et sarclage',
        'Fertilisation NPK et urée',
        'Gestion des maladies',
        'Récolte et post-récolte'
      ]
    },
    {
      id: 2,
      title: 'Techniques d\'Irrigation Adaptées au Sahel',
      description: 'Guide technique sur les systèmes d\'irrigation pour zones arides : irrigation gravitaire, goutte-à-goutte, aspersion. Calculs des besoins en eau, coûts d\'installation et maintenance des équipements.',
      category: 'irrigation',
      type: 'guide',
      fileType: 'PDF',
      fileSize: '3.1 MB',
      downloadCount: 892,
      rating: 4.6,
      author: 'Centre de Recherche Agricole pour le Développement',
      publishDate: '2024-02-10',
      filePath: '/resources/techniques-irrigation.pdf',
      tags: ['irrigation', 'eau', 'goutte-à-goutte', 'aspersion', 'sahel'],
      preview: 'Techniques d\'irrigation pour le Tchad : gravitaire (faible coût, 40-60% pertes), goutte-à-goutte (économie 30-50%, 200-400k FCFA/ha), aspersion (150-300k FCFA/ha). Besoins mil : 400-600mm, riz : 1000-1500mm.',
      chapters: [
        'Irrigation gravitaire traditionnelle',
        'Systèmes goutte-à-goutte modernes',
        'Irrigation par aspersion',
        'Calcul des besoins en eau',
        'Gestion et programmation',
        'Maintenance des équipements'
      ]
    },
    {
      id: 3,
      title: 'Gestion des Coopératives Agricoles',
      description: 'Manuel de gestion pour dirigeants de coopératives : création légale, structure organisationnelle, gestion financière, activités économiques et répartition des bénéfices selon la réglementation tchadienne.',
      category: 'cooperative',
      type: 'guide',
      fileType: 'PDF',
      fileSize: '4.2 MB',
      downloadCount: 634,
      rating: 4.9,
      author: 'Direction des Organisations Paysannes',
      publishDate: '2024-01-20',
      filePath: '/resources/gestion-cooperative.pdf',
      tags: ['coopérative', 'gestion', 'organisation', 'finance', 'statuts'],
      preview: 'Guide complet pour créer et gérer une coopérative au Tchad : minimum 7 membres, organes obligatoires (AG, CA, Bureau), cotisations 1000-5000 FCFA/mois, parts sociales 10,000 FCFA minimum. Répartition bénéfices : 40% ristournes, 30% réserves.',
      chapters: [
        'Création et formalités légales',
        'Structure organisationnelle',
        'Gestion financière et comptable',
        'Activités économiques',
        'Services aux membres',
        'Répartition des bénéfices'
      ]
    },
    {
      id: 4,
      title: 'Techniques de Stockage des Céréales',
      description: 'Guide pratique du stockage post-récolte : préparation des grains, méthodes traditionnelles et améliorées, lutte contre les ravageurs, contrôle qualité. Réduction des pertes de 20% à moins de 2%.',
      category: 'stockage',
      type: 'guide',
      fileType: 'PDF',
      fileSize: '2.8 MB',
      downloadCount: 1156,
      rating: 4.7,
      author: 'Institut Tchadien de Recherche Agronomique',
      publishDate: '2024-03-05',
      filePath: '/resources/stockage-cereales.pdf',
      tags: ['stockage', 'céréales', 'conservation', 'silos', 'ravageurs'],
      preview: 'Techniques de stockage au Tchad : séchage 12-14% humidité, greniers banco (500-2000kg, pertes 10-20%), silos métalliques (25-150k FCFA, pertes <2%). Lutte naturelle : neem, cendres, piment 2%.',
      chapters: [
        'Préparation post-récolte',
        'Stockage traditionnel banco',
        'Silos métalliques améliorés',
        'Lutte contre ravageurs',
        'Contrôle qualité et suivi',
        'Calcul des pertes'
      ]
    },
    {
      id: 5,
      title: 'Microfinance Rurale au Tchad',
      description: 'Guide complet des services financiers ruraux : institutions agréées (MECREDIT, ACEP, Crédit du Sahel), types de crédit, conditions d\'accès, procédures et produits d\'épargne disponibles.',
      category: 'finance',
      type: 'guide',
      fileType: 'PDF',
      fileSize: '3.5 MB',
      downloadCount: 723,
      rating: 4.5,
      author: 'Banque Centrale des États de l\'Afrique Centrale',
      publishDate: '2024-02-28',
      filePath: '/resources/microfinance-rurale.pdf',
      tags: ['microfinance', 'crédit', 'épargne', 'IMF', 'financement'],
      preview: 'Microfinance au Tchad : MECREDIT (taux 12-18%), ACEP (50k-2M FCFA), crédit campagne 6-12 mois, crédit équipement 1-5 ans. Conditions : 18-65 ans, caution solidaire, formation gestion obligatoire.',
      chapters: [
        'Institutions de microfinance agréées',
        'Types de crédit agricole',
        'Conditions et critères d\'accès',
        'Procédures de demande',
        'Produits d\'épargne',
        'Gestion du remboursement'
      ]
    },
    {
      id: 6,
      title: 'Formation Comptabilité Coopérative',
      description: 'Module de formation pratique pour trésoriers et gestionnaires : tenue des livres, élaboration budgets, rapports financiers, audit interne et conformité réglementaire.',
      category: 'formation',
      type: 'video',
      fileType: 'MP4',
      fileSize: '125 MB',
      downloadCount: 445,
      rating: 4.4,
      author: 'Centre de Formation Coopérative',
      publishDate: '2024-03-15',
      filePath: '/resources/formation-comptabilite.mp4',
      tags: ['comptabilité', 'formation', 'budget', 'audit', 'trésorier'],
      preview: 'Formation vidéo de 2h30 sur la comptabilité coopérative : registres obligatoires, plan comptable OHADA, élaboration budgets annuels, rapports AG, contrôles internes.',
      duration: '2h 30min',
      chapters: [
        'Introduction comptabilité coopérative',
        'Tenue des registres obligatoires',
        'Plan comptable OHADA simplifié',
        'Élaboration des budgets',
        'Rapports pour assemblée générale',
        'Audit et contrôle interne'
      ]
    },
    {
      id: 7,
      title: 'Calendrier Cultural Zones Sahéliennes',
      description: 'Calendrier détaillé des activités agricoles par région : dates optimales de semis, entretien et récolte selon les zones climatiques. Adaptation au changement climatique.',
      category: 'production',
      type: 'document',
      fileType: 'PDF',
      fileSize: '1.8 MB',
      downloadCount: 987,
      rating: 4.6,
      author: 'Direction de la Production Agricole',
      publishDate: '2024-04-01',
      filePath: '/resources/calendrier-cultural.pdf',
      tags: ['calendrier', 'semis', 'climat', 'saisons', 'planification'],
      preview: 'Calendrier agricole tchadien par zone : Sahélienne (juin-octobre), Soudanienne (mai-novembre). Cultures principales : mil (juin-octobre), sorgho (mai-septembre), arachide (juin-octobre).',
      chapters: [
        'Zones climatiques du Tchad',
        'Calendrier zone sahélienne',
        'Calendrier zone soudanienne',
        'Adaptation changement climatique',
        'Cultures de contre-saison',
        'Planification pluriannuelle'
      ]
    },
    {
      id: 8,
      title: 'Transformation Artisanale Céréales',
      description: 'Techniques de transformation locale : décorticage, mouture, conservation farines, conditionnement et commercialisation. Équipements adaptés et normes d\'hygiène.',
      category: 'transformation',
      type: 'guide',
      fileType: 'PDF',
      fileSize: '2.9 MB',
      downloadCount: 512,
      rating: 4.3,
      author: 'Programme d\'Appui à la Transformation',
      publishDate: '2024-03-20',
      filePath: '/resources/transformation-cereales.pdf',
      tags: ['transformation', 'mouture', 'farine', 'hygiène', 'commercialisation'],
      preview: 'Transformation céréales au Tchad : décorticage mécanique (rendement 75-85%), mouture (finesse 0.5-2mm), conservation farines (humidité <12%), conditionnement sachets 1-25kg.',
      chapters: [
        'Équipements de décorticage',
        'Techniques de mouture',
        'Conservation des farines',
        'Normes d\'hygiène HACCP',
        'Conditionnement et étiquetage',
        'Circuits de commercialisation'
      ]
    }
  ]

  const categories = [
    { id: 'all', label: 'Toutes les catégories', icon: BookOpen },
    { id: 'production', label: 'Production Agricole', icon: Wheat },
    { id: 'irrigation', label: 'Irrigation', icon: Droplets },
    { id: 'cooperative', label: 'Gestion Coopérative', icon: Users },
    { id: 'finance', label: 'Finance Rurale', icon: DollarSign },
    { id: 'stockage', label: 'Stockage', icon: FileText },
    { id: 'transformation', label: 'Transformation', icon: BookOpen },
    { id: 'formation', label: 'Formation', icon: Video }
  ]

  const fileTypes = [
    { id: 'all', label: 'Tous les types' },
    { id: 'guide', label: 'Guides Pratiques' },
    { id: 'video', label: 'Vidéos Formation' },
    { id: 'document', label: 'Documents' }
  ]

  useEffect(() => {
    // Simulation du chargement des ressources
    setLoading(true)
    setTimeout(() => {
      setResources(resourcesData)
      setLoading(false)
    }, 1000)
  }, [])

  // Filtrage des ressources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesType = selectedType === 'all' || resource.type === selectedType
    
    return matchesSearch && matchesCategory && matchesType
  })

  // Gestion du téléchargement
  const handleDownload = (resource) => {
    // Incrémenter le compteur de téléchargements
    setResources(prev => prev.map(r => 
      r.id === resource.id 
        ? { ...r, downloadCount: r.downloadCount + 1 }
        : r
    ))
    
    // Simuler le téléchargement
    const link = document.createElement('a')
    link.href = resource.filePath
    link.download = `${resource.title}.${resource.fileType.toLowerCase()}`
    link.click()
  }

  // Composant carte de ressource
  const ResourceCard = ({ resource }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              resource.type === 'guide' ? 'bg-blue-100 text-blue-800' :
              resource.type === 'video' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {resource.fileType}
            </span>
            <span className="ml-2 text-sm text-gray-500">{resource.fileSize}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {resource.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {resource.description}
          </p>
        </div>
      </div>

      {/* Prévisualisation du contenu */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Aperçu :</strong> {resource.preview}
        </p>
        {resource.chapters && (
          <div>
            <p className="text-sm font-medium text-gray-800 mb-1">Chapitres inclus :</p>
            <ul className="text-xs text-gray-600 space-y-1">
              {resource.chapters.slice(0, 3).map((chapter, index) => (
                <li key={index}>• {chapter}</li>
              ))}
              {resource.chapters.length > 3 && (
                <li className="text-gray-500">... et {resource.chapters.length - 3} autres chapitres</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Métadonnées */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <User size={14} className="mr-1" />
          <span>{resource.author}</span>
        </div>
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          <span>{new Date(resource.publishDate).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {resource.tags.slice(0, 4).map(tag => (
          <span key={tag} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      {/* Statistiques et actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Download size={14} className="mr-1" />
            <span>{resource.downloadCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <Star size={14} className="mr-1 text-yellow-500" />
            <span>{resource.rating}/5</span>
          </div>
          {resource.duration && (
            <div className="flex items-center">
              <Video size={14} className="mr-1" />
              <span>{resource.duration}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
            <Eye size={16} />
          </button>
          <button 
            onClick={() => handleDownload(resource)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center text-sm"
          >
            <Download size={16} className="mr-2" />
            Télécharger
          </button>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Centre de Ressources AgriCooperaTchad
          </h1>
          <p className="text-gray-600">
            Guides pratiques, formations et outils pour l'agriculture tchadienne
          </p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher une ressource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filtre catégorie */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>

          {/* Filtre type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {fileTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{resources.length}</div>
          <div className="text-sm text-gray-600">Ressources disponibles</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {resources.reduce((sum, r) => sum + r.downloadCount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Téléchargements totaux</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {categories.length - 1}
          </div>
          <div className="text-sm text-gray-600">Catégories</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {(resources.reduce((sum, r) => sum + r.rating, 0) / resources.length).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Note moyenne</div>
        </div>
      </div>

      {/* Résultats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredResources.length} ressource{filteredResources.length !== 1 ? 's' : ''} trouvée{filteredResources.length !== 1 ? 's' : ''}
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            <Filter size={16} className="mr-2" />
            Triés par pertinence
          </div>
        </div>

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">Aucune ressource trouvée</p>
            <p className="text-sm text-gray-400">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Resources