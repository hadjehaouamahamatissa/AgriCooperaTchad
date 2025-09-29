import React, { useState } from 'react'
import { CreditCard, Smartphone, DollarSign, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'

const PaymentMethod = ({ method, isSelected, onSelect }) => {
  const getMethodIcon = (type) => {
    switch (type) {
      case 'moov': return '/api/placeholder/40/40'
      case 'airtel': return '/api/placeholder/40/40'
      case 'card': return <CreditCard className="h-8 w-8" />
      default: return <DollarSign className="h-8 w-8" />
    }
  }

  return (
    <div
      onClick={() => onSelect(method)}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {typeof getMethodIcon(method.type) === 'string' ? (
            <img 
              src={getMethodIcon(method.type)} 
              alt={method.name}
              className="h-10 w-10 rounded"
            />
          ) : (
            <div className="p-2 bg-gray-100 rounded-lg">
              {getMethodIcon(method.type)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{method.name}</h3>
          <p className="text-sm text-gray-600">{method.description}</p>
          {method.fees && (
            <p className="text-xs text-gray-500 mt-1">Frais: {method.fees}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className={`w-4 h-4 rounded-full border-2 ${
            isSelected 
              ? 'border-blue-500 bg-blue-500' 
              : 'border-gray-300'
          }`}>
            {isSelected && (
              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const MoovMoneyForm = ({ onSubmit, onCancel }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simuler le processus de paiement
    setTimeout(() => {
      onSubmit({ phoneNumber, method: 'moov' })
      setLoading(false)
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Numéro de téléphone Moov Money
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+235 XX XX XX XX"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Vous recevrez un message de confirmation sur ce numéro
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Instructions de paiement</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Composez *555# sur votre téléphone Moov</li>
          <li>2. Sélectionnez "Payer Marchand"</li>
          <li>3. Entrez le code marchand qui vous sera envoyé</li>
          <li>4. Confirmez le montant et validez</li>
        </ol>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Traitement...' : 'Payer avec Moov Money'}
        </button>
      </div>
    </form>
  )
}

const AirtelMoneyForm = ({ onSubmit, onCancel }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    setTimeout(() => {
      onSubmit({ phoneNumber, method: 'airtel' })
      setLoading(false)
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Numéro de téléphone Airtel Money
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+235 XX XX XX XX"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      <div className="bg-red-50 p-4 rounded-lg">
        <h4 className="font-medium text-red-900 mb-2">Instructions de paiement</h4>
        <ol className="text-sm text-red-800 space-y-1">
          <li>1. Composez *505# sur votre téléphone Airtel</li>
          <li>2. Sélectionnez "Paiements"</li>
          <li>3. Entrez le code marchand qui vous sera envoyé</li>
          <li>4. Confirmez le montant et votre PIN</li>
        </ol>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Traitement...' : 'Payer avec Airtel Money'}
        </button>
      </div>
    </form>
  )
}

const CardPaymentForm = ({ onSubmit, onCancel }) => {
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    setTimeout(() => {
      onSubmit({ ...cardData, method: 'card' })
      setLoading(false)
    }, 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom sur la carte
        </label>
        <input
          type="text"
          value={cardData.name}
          onChange={(e) => setCardData({...cardData, name: e.target.value})}
          placeholder="Nom complet"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Numéro de carte
        </label>
        <input
          type="text"
          value={cardData.number}
          onChange={(e) => setCardData({...cardData, number: e.target.value})}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date d'expiration
          </label>
          <input
            type="text"
            value={cardData.expiry}
            onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
            placeholder="MM/AA"
            maxLength="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <input
            type="text"
            value={cardData.cvv}
            onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
            placeholder="123"
            maxLength="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>Paiement sécurisé SSL</span>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Traitement...' : 'Payer par carte'}
        </button>
      </div>
    </form>
  )
}

export default function Payment({ order, onSuccess, onCancel }) {
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [currentStep, setCurrentStep] = useState("select") // select, form, success
  // const [order, setOrder] = useState({ amount: 0 }) // 👈 montant vide au départ
  const [paymentResult, setPaymentResult] = useState(null)

  const paymentMethods = [
    {
      id: 'moov',
      type: 'moov',
      name: 'Moov Money',
      description: 'Paiement mobile via Moov Money',
      fees: '1% du montant (min. 100 XAF)',
      available: true
    },
    {
      id: 'airtel',
      type: 'airtel',
      name: 'Airtel Money',
      description: 'Paiement mobile via Airtel Money',
      fees: '1.5% du montant (min. 150 XAF)',
      available: true
    },
    {
      id: 'card',
      type: 'card',
      name: 'Carte Bancaire',
      description: 'Visa, Mastercard acceptées',
      fees: '2.5% du montant',
      available: true
    }
  ]

  const handleMethodSelect = (method) => {
    setSelectedMethod(method)
  }

  const handlePaymentSubmit = (paymentData) => {
    // Simuler le résultat du paiement
    const success = Math.random() > 0.1 // 90% de chance de succès
    
    setPaymentResult({
      success,
      transactionId: success ? `TXN${Date.now()}` : null,
      message: success 
        ? 'Paiement effectué avec succès !' 
        : 'Échec du paiement. Veuillez réessayer.',
      paymentData
    })
    
    setCurrentStep('result')
    
    if (success && onSuccess) {
      setTimeout(() => onSuccess(paymentResult), 2000)
    }
  }

  const handleContinue = () => {
    if (selectedMethod) {
      setCurrentStep('form')
    }
  }

  const handleBack = () => {
    if (currentStep === 'form') {
      setCurrentStep('select')
    } else if (currentStep === 'success') {
      setCurrentStep('select')
      setPaymentResult(null)
    }
  }

  const calculateTotal = () => {
    if (!order || !selectedMethod) return order?.amount || 10
    
    const baseAmount = order.amount || 0
    const feePercentage = {
      'moov': 0.01,
      'airtel': 0.015,
      'card': 0.025
    }[selectedMethod.id] || 0
    
    const fee = Math.max(baseAmount * feePercentage, selectedMethod.id === 'moov' ? 100 : selectedMethod.id === 'airtel' ? 150 : 0)
    return baseAmount + fee
  }

  if (currentStep === 'success') {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center">
          {paymentResult?.success ? (
            <>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Paiement Réussi !</h2>
              <p className="text-gray-600 mb-4">{paymentResult.message}</p>
              {paymentResult.transactionId && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-600">ID de transaction:</p>
                  <p className="font-mono text-sm">{paymentResult.transactionId}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Échec du Paiement</h2>
              <p className="text-gray-600 mb-4">{paymentResult.message}</p>
            </>
          )}
          
          <div className="space-y-3">
            {paymentResult?.success ? (
              <button
                onClick={() => onSuccess && onSuccess(paymentResult)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Continuer
              </button>
            ) : (
              <button
                onClick={handleBack}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Réessayer
              </button>
            )}
            
            <button
              onClick={onCancel}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {currentStep === 'form' && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h2 className="text-xl font-bold text-gray-900">
            {currentStep === 'select' ? 'Choisir un mode de paiement' : 'Finaliser le paiement'}
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Order Summary */}
      {order && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Résumé de la commande</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Montant:</span>
              <span>{order.amount?.toLocaleString()} XAF</span>
            </div>
            {selectedMethod && (
              <>
                <div className="flex justify-between">
                  <span>Frais de transaction:</span>
                  <span>{(calculateTotal() - order.amount).toLocaleString()} XAF</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Total:</span>
                  <span>{calculateTotal().toLocaleString()} XAF</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {currentStep === 'select' && (
        <>
          {/* Payment Methods */}
          <div className="space-y-4 mb-6">
            {paymentMethods.map((method) => (
              <PaymentMethod
                key={method.id}
                method={method}
                isSelected={selectedMethod?.id === method.id}
                onSelect={handleMethodSelect}
              />
            ))}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!selectedMethod}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuer
          </button>
        </>
      )}

      {currentStep === 'form' && selectedMethod && (
        <div>
          {selectedMethod.id === 'moov' && (
            <MoovMoneyForm
              onSubmit={handlePaymentSubmit}
              onCancel={handleBack}
            />
          )}
          {selectedMethod.id === 'airtel' && (
            <AirtelMoneyForm
              onSubmit={handlePaymentSubmit}
              onCancel={handleBack}
            />
          )}
          {selectedMethod.id === 'card' && (
            <CardPaymentForm
              onSubmit={handlePaymentSubmit}
              onCancel={handleBack}
            />
          )}
        </div>
      )}
    </div>
  )
}