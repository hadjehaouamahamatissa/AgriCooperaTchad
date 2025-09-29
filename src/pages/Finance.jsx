import { useState } from 'react';
import { 
  Plus, 
  CreditCard, 
  Building2, 
  Package,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

// Données simulées des demandes de crédit
const initialCreditRequests = [
  {
    id: 1,
    cooperative: 'Coopérative de Sarh',
    amount: 5000000,
    purpose: 'Achat de matériel agricole (tracteur)',
    lender: 'Banque Commerciale du Tchad',
    status: 'En cours',
    requestDate: '2024-01-15',
    interestRate: 12,
    duration: 24
  },
  {
    id: 2,
    cooperative: 'Coopérative de Moundou',
    amount: 2500000,
    purpose: 'Achat d\'intrants (semences et engrais)',
    lender: 'Microfinance ACEP',
    status: 'Approuvé',
    requestDate: '2024-02-01',
    interestRate: 8,
    duration: 12
  },
  {
    id: 3,
    cooperative: 'Coopérative de Bongor',
    amount: 1800000,
    purpose: 'Construction d\'un entrepôt de stockage',
    lender: 'Fonds de Développement Agricole',
    status: 'Rejeté',
    requestDate: '2024-01-20',
    interestRate: 15,
    duration: 36
  }
];

const lenders = [
  { id: 'bct', name: 'Banque Commerciale du Tchad', type: 'Banque', rate: '10-15%' },
  { id: 'acep', name: 'Microfinance ACEP', type: 'Microfinance', rate: '8-12%' },
  { id: 'fda', name: 'Fonds de Développement Agricole', type: 'Institution publique', rate: '5-10%' },
  { id: 'ecobank', name: 'Ecobank Tchad', type: 'Banque', rate: '12-18%' },
  { id: 'express', name: 'Express Union', type: 'Microfinance', rate: '9-14%' }
];

export default function Finance() {
  const [creditRequests, setCreditRequests] = useState(initialCreditRequests);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    amount: '',
    purpose: '',
    lender: '',
    duration: '',
    businessPlan: '',
    collateral: ''
  });

  const handleSubmitRequest = () => {
    const selectedLender = lenders.find(l => l.id === newRequest.lender);
    const request = {
      id: Date.now(),
      cooperative: 'Ma Coopérative',
      amount: parseFloat(newRequest.amount),
      purpose: newRequest.purpose,
      lender: selectedLender ? selectedLender.name : '',
      status: 'En cours',
      requestDate: new Date().toISOString().split('T')[0],
      interestRate: Math.floor(Math.random() * 10) + 8,
      duration: parseInt(newRequest.duration)
    };
    
    setCreditRequests([...creditRequests, request]);
    setNewRequest({
      amount: '',
      purpose: '',
      lender: '',
      duration: '',
      businessPlan: '',
      collateral: ''
    });
    setIsRequestModalOpen(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approuvé':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'En cours':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Rejeté':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approuvé':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejeté':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance & Crédit</h1>
          <p className="text-gray-600">Gérez vos demandes de crédit et financements</p>
        </div>
        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle demande de crédit</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Demandes Totales</p>
              <p className="text-2xl font-bold text-gray-900">{creditRequests.length}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Crédits Approuvés</p>
              <p className="text-2xl font-bold text-green-600">
                {creditRequests.filter(r => r.status === 'Approuvé').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-yellow-600">
                {creditRequests.filter(r => r.status === 'En cours').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Montant Total</p>
              <p className="text-2xl font-bold text-blue-600">
                {creditRequests
                  .filter(r => r.status === 'Approuvé')
                  .reduce((sum, r) => sum + r.amount, 0)
                  .toLocaleString()} FCFA
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Institutions Financières Partenaires */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Institutions Financières Partenaires</h2>
          <p className="text-gray-600">Nos partenaires pour le financement des coopératives agricoles</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lenders.map((lender) => (
              <div key={lender.id} className="bg-gray-50 rounded-lg border p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{lender.name}</h3>
                    <p className="text-xs text-gray-500 mb-1">{lender.type}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs border border-gray-200 bg-white">
                      Taux: {lender.rate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des Demandes */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Mes Demandes de Crédit</h2>
          <p className="text-gray-600">Suivi de vos demandes de financement</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coopérative</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {creditRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.cooperative}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.amount.toLocaleString()} FCFA</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{request.purpose}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.lender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.duration} mois</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.interestRate}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.requestDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de demande de crédit */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Demande de Crédit</h2>
                <p className="text-gray-600">Remplissez votre demande de financement</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant demandé (FCFA)
                  </label>
                  <input
                    type="number"
                    placeholder="5000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newRequest.amount}
                    onChange={(e) => setNewRequest({...newRequest, amount: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objet du crédit
                  </label>
                  <textarea
                    placeholder="Décrivez l'utilisation prévue des fonds..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newRequest.purpose}
                    onChange={(e) => setNewRequest({...newRequest, purpose: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution financière
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newRequest.lender}
                    onChange={(e) => setNewRequest({...newRequest, lender: e.target.value})}
                  >
                    <option value="">Choisissez une institution</option>
                    {lenders.map((lender) => (
                      <option key={lender.id} value={lender.id}>
                        {lender.name} - {lender.type} - Taux: {lender.rate}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée (mois)
                  </label>
                  <input
                    type="number"
                    placeholder="24"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newRequest.duration}
                    onChange={(e) => setNewRequest({...newRequest, duration: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan d'affaires (résumé)
                  </label>
                  <textarea
                    placeholder="Décrivez votre plan d'affaires et la rentabilité prévue..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newRequest.businessPlan}
                    onChange={(e) => setNewRequest({...newRequest, businessPlan: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Garanties proposées
                  </label>
                  <textarea
                    placeholder="Décrivez les garanties que vous pouvez offrir..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newRequest.collateral}
                    onChange={(e) => setNewRequest({...newRequest, collateral: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitRequest}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Soumettre la demande
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conseils Financiers */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Conseils pour Obtenir un Crédit</h2>
          <p className="text-gray-600">Améliorez vos chances d'obtenir un financement</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-green-800">Documents Requis</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Statuts de la coopérative</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Plan d'affaires détaillé</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>États financiers (3 dernières années)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Garanties ou cautions</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-800">Conseils Pratiques</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span>Diversifiez vos sources de financement</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span>Maintenez une bonne tenue des comptes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span>Développez des relations avec les banques</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span>Préparez un dossier complet et professionnel</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}