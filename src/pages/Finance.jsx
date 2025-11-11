import { useState, useEffect } from 'react';
import { apiService } from "../services/api";
import {
  Plus,
  Building2,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Loader,
  UploadCloud,
  Trash2,
  DownloadCloud
} from 'lucide-react';

export default function Finance() {
  const [creditRequests, setCreditRequests] = useState([]);
  const [lenders, setLenders] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
    totalAmount: 0
  });
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    amount: '',
    purpose: '',
    lender: '',
    duration: '',
    documents: []
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const STATUS_MAP = {
    submitted: { label: 'Soumise', color: 'bg-gray-100 text-gray-800', icon: Clock },
    pending: { label: 'En cours', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    approved: { label: 'Approuvé', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { label: 'Rejeté', color: 'bg-red-100 text-red-800', icon: XCircle },
    disbursed: { label: 'Débloqué', color: 'bg-blue-100 text-blue-800', icon: DollarSign },
    repaid: { label: 'Remboursé', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
  };

  useEffect(() => {
    loadFinanceData();
  }, []);

  const loadFinanceData = async () => {
    try {
      setLoading(true);
      const institutionsResponse = await apiService.getFinancialInstitutions();
      setLenders(institutionsResponse.data.institutions);

      const statsResponse = await apiService.getFinanceStats();
      setStats(statsResponse.data.stats);

      const creditsResponse = await apiService.getUserCredits();
      setCreditRequests(creditsResponse.data || []);
    } catch (error) {
      console.error("Erreur chargement données finance:", error);
      alert("Erreur lors du chargement des données: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewRequest({ ...newRequest, documents: [...newRequest.documents, ...files] });
  };

  const removeFile = (index) => {
    const updatedFiles = [...newRequest.documents];
    updatedFiles.splice(index, 1);
    setNewRequest({ ...newRequest, documents: updatedFiles });
  };

  const handleSubmitRequest = async () => {
    try {
      setSubmitting(true);

      if (!newRequest.amount || parseFloat(newRequest.amount) < 10000) {
        alert("Le montant minimum est de 10,000 FCFA");
        return;
      }
      if (!newRequest.lender) {
        alert("Veuillez sélectionner une institution financière");
        return;
      }
      if (!newRequest.duration) {
        alert("Veuillez saisir la durée du crédit");
        return;
      }
      if (!newRequest.purpose.trim()) {
        alert("Veuillez préciser l'objet du financement");
        return;
      }
      if (!newRequest.documents || newRequest.documents.length === 0) {
        alert("Veuillez joindre au moins un document justificatif");
        return;
      }

      const formData = new FormData();
      formData.append("amount", newRequest.amount);
      formData.append("purpose", newRequest.purpose);
      formData.append("duration", newRequest.duration);
      formData.append("lender", newRequest.lender);
      newRequest.documents.forEach(file => formData.append("documents", file));

      // const token = localStorage.getItem("token");

      // await apiService.createCreditRequest(formData);


      const response = await apiService.createCreditRequest(formData); 
      // if (!response.ok) throw new Error(data.message || "Erreur serveur");

      alert("✅ Demande soumise avec succès. Vous recevrez un email de confirmation.");

      setNewRequest({ amount: '', purpose: '', lender: '', duration: '', documents: [] });
      setIsRequestModalOpen(false);
      loadFinanceData();
    } catch (error) {
      console.error("Erreur soumission demande:", error);
      alert("Erreur lors de la soumission: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">Chargement des données...</span>
    </div>
  );

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Demandes Totales</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
          </div>
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <div className="bg-white rounded-lg border shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Crédits Approuvés</p>
            <p className="text-2xl font-bold text-green-600">{stats.approvedRequests}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <div className="bg-white rounded-lg border shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">En Attente</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</p>
          </div>
          <Clock className="w-8 h-8 text-yellow-400" />
        </div>
        <div className="bg-white rounded-lg border shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Montant Total</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalAmount.toLocaleString()} FCFA</p>
          </div>
          <DollarSign className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      {/* Tableau demandes */}
      <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-900 p-6 border-b">Mes Demandes de Crédit</h2>
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coopérative</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {creditRequests.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">Aucune demande de crédit trouvée</td>
              </tr>
            ) : creditRequests.map(request => {
              const { label, color: statusColor, icon: StatusIcon } = STATUS_MAP[request.status.toLowerCase()] || {};
              return (
                <tr key={request._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.cooperative.name} {/* éventuellement récupérer le nom de la coop via ton API */}
                  </td>
                  <td>{request.amount.toLocaleString()} FCFA</td>
                  <td>{request.purpose}</td>
                  <td>{request.lender}</td>
                  <td>{request.duration} mois</td>
                  <td>{request.interestRate || 0}%</td>
                  <td>
                    {request.documents && request.documents.length > 0 ? (
                      <ul>
                        {request.documents.map((doc, idx) => (
                          <li key={idx}>
                            <a href={`http://localhost:5000${doc.url}`} target="_blank" rel="noopener noreferrer">
                              {doc.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : "Aucun document"}
                  </td>

                  <td>{new Date(request.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td>
                    {/* {STATUS_MAP[request.status.toLowerCase()]?.label || request.status} */}
                    <div className="flex items-center space-x-2">
                      {StatusIcon && <StatusIcon className="w-4 h-4" />}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                        {label || request.status}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Création */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Nouvelle Demande de Crédit</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Montant (FCFA) *</label>
                  <input
                    type="number"
                    placeholder="5000000"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newRequest.amount}
                    onChange={(e) => setNewRequest({ ...newRequest, amount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Objet du crédit *</label>
                  <textarea
                    rows={3}
                    placeholder="Décrivez l'utilisation des fonds..."
                    className="w-full px-3 py-2 border rounded-md"
                    value={newRequest.purpose}
                    onChange={(e) => setNewRequest({ ...newRequest, purpose: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Institution *</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={newRequest.lender}
                    onChange={(e) => setNewRequest({ ...newRequest, lender: e.target.value })}
                  >
                    <option value="">Sélectionnez une institution</option>
                    {lenders.map(lender => (
                      <option key={lender.id} value={lender.id}>
                        {lender.name} - {lender.type} - Taux: {lender.rate}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Durée (mois) *</label>
                  <input
                    type="number"
                    placeholder="24"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newRequest.duration}
                    onChange={(e) => setNewRequest({ ...newRequest, duration: e.target.value })}
                  />
                </div>

                {/* Upload moderne */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Documents justificatifs *</label>
                  <div className="border border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 relative">
                    <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="text-gray-500 text-sm mb-2 text-center">Glissez-déposez vos fichiers ou cliquez pour sélectionner</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {newRequest.documents.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {newRequest.documents.map((file, idx) => (
                        <li key={idx} className="flex items-center justify-between bg-gray-100 px-3 py-1 rounded-md">
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                          <button type="button" onClick={() => removeFile(idx)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 border rounded-md"
                  disabled={submitting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitRequest}
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2 disabled:opacity-50"
                >
                  {submitting && <Loader className="w-4 h-4 animate-spin" />}
                  <span>{submitting ? 'Soumission...' : 'Soumettre'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
