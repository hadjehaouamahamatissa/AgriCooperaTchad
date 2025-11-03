import React, { useState } from 'react';
import { CreditCard, DollarSign, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Configuration Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

// --- Composant pour chaque méthode de paiement ---
const PaymentMethod = ({ method, isSelected, onSelect }) => {
  const getMethodIcon = (type) => {
    switch (type) {
      case 'moov':
      case 'airtel':
        return 'mobile_money';
      case 'card':
        return 'credit_card';
      default:
        return 'cash';
    }
  };

  const icon = getMethodIcon(method.type);

  return (
    <div
      onClick={() => onSelect(method)}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {typeof icon === 'string' ? (
            <div className="p-2 bg-gray-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-gray-600" />
            </div>
          ) : (
            <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{method.name}</h3>
          <p className="text-sm text-gray-600">{method.description}</p>
          {method.fees && <p className="text-xs text-gray-500 mt-1">Frais: {method.fees}</p>}
        </div>
        <div className="flex-shrink-0">
          <div
            className={`w-4 h-4 rounded-full border-2 ${
              isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
            }`}
          >
            {isSelected && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Formulaire Moov Money ---
const MoovMoneyForm = ({ onSubmit, onCancel }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSubmit({ phoneNumber, method: 'mobile_money' });
      setLoading(false);
    }, 2000);
  };

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
  );
};

// --- Formulaire Airtel Money ---
const AirtelMoneyForm = ({ onSubmit, onCancel }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSubmit({ phoneNumber, method: 'mobile_money' });
      setLoading(false);
    }, 2000);
  };

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
  );
};

// --- Formulaire Stripe Card Payment ---
const StripeCardForm = ({ onSubmit, onCancel, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Créer un token de paiement
      const { error, token } = await stripe.createToken(cardElement);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Simuler un appel API pour traiter le paiement
      // En production, vous devriez envoyer le token à votre backend
      const paymentResult = await simulateStripePayment(token, amount);
      
      if (paymentResult.success) {
        onSubmit({
          method: 'credit_card',
          stripeToken: token.id,
          cardLast4: token.card.last4,
          cardBrand: token.card.brand
        });
      } else {
        setError(paymentResult.error);
      }
    } catch (err) {
      setError('Une erreur est survenue lors du traitement du paiement');
    }

    setLoading(false);
  };

  // Simulation du traitement Stripe (à remplacer par votre API backend)
  const simulateStripePayment = async (token, amount) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simuler un succès dans 90% des cas
        const success = Math.random() > 0.1;
        resolve({
          success,
          error: success ? null : 'Paiement refusé par votre banque'
        });
      }, 2000);
    });
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Informations de carte bancaire
        </label>
        <div className="p-3 border border-gray-300 rounded-md">
          <CardElement options={cardElementOptions} />
        </div>
        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span>Paiement sécurisé par Stripe</span>
        </div>
        <p className="text-xs text-green-700 mt-1">
          Vos informations de carte sont cryptées et sécurisées
        </p>
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
          disabled={!stripe || loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Traitement...' : `Payer ${amount?.toLocaleString()} XAF`}
        </button>
      </div>
    </form>
  );
};

// --- Formulaire Carte Bancaire (Legacy) ---
const CardPaymentForm = ({ onSubmit, onCancel }) => {
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSubmit({ ...cardData, method: 'credit_card' });
      setLoading(false);
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom sur la carte
        </label>
        <input
          type="text"
          value={cardData.name}
          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
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
          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
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
            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
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
            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
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
  );
};

// --- Composant principal Payment ---
export default function Payment({ order, onSuccess, onCancel }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [currentStep, setCurrentStep] = useState('select'); // select, form, success
  const [paymentResult, setPaymentResult] = useState(null);

  const paymentMethods = [
    { id: 'moov', type: 'moov', name: 'Moov Money', description: 'Paiement mobile via Moov Money', fees: '1% du montant (min. 100 XAF)' },
    { id: 'airtel', type: 'airtel', name: 'Airtel Money', description: 'Paiement mobile via Airtel Money', fees: '1.5% du montant (min. 150 XAF)' },
    { id: 'stripe', type: 'card', name: 'Carte Bancaire (Stripe)', description: 'Visa, Mastercard via Stripe', fees: '2.9% + 30 XAF' },
    { id: 'card', type: 'card', name: 'Carte Bancaire', description: 'Visa, Mastercard acceptées', fees: '2.5% du montant' },
  ];

  const handleMethodSelect = (method) => setSelectedMethod(method);

  const handlePaymentSubmit = (paymentData) => {
    const success = Math.random() > 0.1;
    const result = {
      success,
      transactionId: success ? `TXN${Date.now()}` : null,
      message: success ? 'Paiement effectué avec succès !' : 'Échec du paiement. Veuillez réessayer.',
      paymentData,
      selectedMethod
    };
    setPaymentResult(result);
    setCurrentStep('success');

    if (success && onSuccess) {
      setTimeout(() => onSuccess(result, selectedMethod), 1000);
    }
  };

  const handleContinue = () => selectedMethod && setCurrentStep('form');
  const handleBack = () => {
    if (currentStep === 'form') setCurrentStep('select');
    else if (currentStep === 'success') {
      setCurrentStep('select');
      setPaymentResult(null);
    }
  };

  const calculateTotal = () => {
    if (!order || !selectedMethod) return order?.amount || 0;
    const baseAmount = order.amount || 0;
    const feesPercent = { moov: 0.01, airtel: 0.015, stripe: 0.029, card: 0.025 };
    const minFees = { moov: 100, airtel: 150, stripe: 30, card: 0 };
    const fee = Math.max(baseAmount * (feesPercent[selectedMethod.id] || 0), minFees[selectedMethod.id] || 0);
    return baseAmount + fee;
  };

  // --- Rendu ---
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
                onClick={() => onSuccess && onSuccess(paymentResult, selectedMethod)}
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
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {currentStep === 'form' && (
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h2 className="text-xl font-bold text-gray-900">
            {currentStep === 'select' ? 'Choisir un mode de paiement' : 'Finaliser le paiement'}
          </h2>
        </div>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

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
          {selectedMethod.id === 'moov' && <MoovMoneyForm onSubmit={handlePaymentSubmit} onCancel={handleBack} />}
          {selectedMethod.id === 'airtel' && <AirtelMoneyForm onSubmit={handlePaymentSubmit} onCancel={handleBack} />}
          {selectedMethod.id === 'stripe' && (
            <Elements stripe={stripePromise}>
              <StripeCardForm 
                onSubmit={handlePaymentSubmit} 
                onCancel={handleBack} 
                amount={calculateTotal()}
              />
            </Elements>
          )}
          {selectedMethod.id === 'card' && <CardPaymentForm onSubmit={handlePaymentSubmit} onCancel={handleBack} />}
        </div>
      )}
    </div>
  );
}