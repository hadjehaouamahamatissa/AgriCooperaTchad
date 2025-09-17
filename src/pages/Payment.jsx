import React, { useState } from "react"
import { CreditCard, Smartphone, DollarSign, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"

const PaymentMethod = ({ method, isSelected, onSelect }) => {

    const getMethodIcon = (type) => {
        switch (type) {
            case "moov": return "/api/placeholder/40/40"
            case "airtel": return "/api/placeholder/40/40"
            case "card": return <CreditCard className="h-8 w-8" />
            default: return <DollarSign className="h-8 w-8" />
        }
    }

    return (
        <div
            onClick={() => onSelect(method)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-200 hover:border-gray-300"
                }`}
        >
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    {typeof getMethodIcon(method) === "string" ? (
                        <img
                            src={getMethodIcon(method.type)}
                            alt={method.name}
                            className="h-10 w-1- rounded"
                        />
                    ) : (
                        <div className="p-2 bg-gray-100 rounded-lg">
                            {getMethodIcon(method.type)}
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                    {method.fees && (
                        <p className="text-xs text-gray-500 mt-1">Frais: {method.fees}</p>
                    )}
                </div>
                <div className="flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full border-2 ${isSelected
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
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
    const [phoneNumber, SetPhoneNumber] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Simuler le processus de paiement
        setTimeout(() => {
            onSubmit({ phoneNumber, method: "moov" })
            setLoading(false)
        }, 20000)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numero de telephone Moov Money
                </label>
                <input
                    type={phoneNumber}
                    onChange={(e) => SetPhoneNumber(e.target.value)}
                    placeholder="+235 XX XX XX XX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">
                    Vous recevez un message de confirmation sur ce numero
                </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Inscription de paiement</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Composez *555# sur votre telephone Moov</li>
                    <li>2. Selectionnez "Payer Marchand"</li>
                    <li>3. Entrez le code marchand qui vous sera envoye"</li>
                    <li>4. Confirmer le montant et validez"</li>
                </ol>
            </div>

            <div className="flex space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacipity-50"

                >
                    {loading ? "Traitement..." : "Paver avec Moov Money"}
                </button>
            </div>
        </form>
    )
}
const AirtelMoneyForm = ({ onSubmit, onCancel }) => {
    const [phoneNumber, SetPhoneNumber] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Simuler le processus de paiement
        setTimeout(() => {
            onSubmit({ phoneNumber, method: "moov" })
            setLoading(false)
        }, 20000)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numero de telephone Airtel Money
                </label>
                <input
                    type={phoneNumber}
                    onChange={(e) => SetPhoneNumber(e.target.value)}
                    placeholder="+235 XX XX XX XX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">
                    Vous recevez un message de confirmation sur ce numero
                </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Inscription de paiement</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Composez *505# sur votre telephone Airtel</li>
                    <li>2. Selectionnez "paiement"</li>
                    <li>3. Entrez le code marchand qui vous sera envoye"</li>
                    <li>4. Confirmer le montant et votre PIN"</li>
                </ol>
            </div>

            <div className="flex space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacipity-50"

                >
                    {loading ? "Traitement..." : "Paver avec Airtel Money"}
                </button>
            </div>
        </form>
    )
}

const CardPaymentForm = ({ onSubmit, onCancel }) => {
    const [cardData, setCardData] = useState({
        number: "",
        expiry: "",
        cvv: "",
        name: ""
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        setTimeout(() => {
            onSubmit({ ...cardData, method: "card" })
            setLoading(false)
        }, 3000)
    }

    return (
        <form omSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block tex-sm font-medium text-gray-700 mb-2">
                    Nom sur la carte
                </label>
                <input
                    type="text"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                    placeholder="Nom complet"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md f0cus:outline-none focus:ring-2 focus-ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block tex-sm font-medium text-gray-700 mb-2">
                    Numero de carte
                </label>
                <input
                    type="text"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md f0cus:outline-none focus:ring-2 focus-ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block tex-sm font-medium text-gray-700 mb-2">
                    Date d'expiration
                </label>
                <input
                    type="text"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    placeholder="MM/AA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md f0cus:outline-none focus:ring-2 focus-ring-blue-500"
                    required
                />
            </div>

            <div className="gridmgrid-cols-2 gap-6">
                <div>
                    <label className="block tex-sm font-medium text-gray-700 mb-2">
                        CVV
                    </label>
                    <input
                        type="text"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md f0cus:outline-none focus:ring-2 focus-ring-blue-500"
                        required
                    />
                </div>
            </div>

            <div className="bg-gray-50-p-4-rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Paiement securise SSL</span>
                </div>
            </div>

            <div className="flex space-y-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    onClick={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Traitement..." : "Payer par carte"}
                </button>
            </div>
        </form>
    )
}

export default function Payment({ order, onSuccess, onCancel }) {
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [currentStep, setCurrentStep] = useState("select") // Select from Success
    const [paymentResultat, setPaymentResultat] = useState(null)

    const paymentMethods = [
        {
            id: "moov",
            type: "moov",
            name: "Moov Money",
            description: "Paiement mobile via Moov Money",
            fees: "1% du montant (min. 100 XAF)",
            available: true
        },
        {
            id: "airtel",
            type: "airtel",
            name: "Airtel Money",
            description: "Paiement mobile via Airtel Money",
            fees: "1.5% du montant (min. 150 XAF)",
            available: true
        },
        {
            id: "card",
            type: "card",
            name: "Carte Bancaire",
            description: "Visa, Mastercard acceptees",
            fees: "2% du montant",
            available: true
        }
    ]

    const handleMethodSelect = (method) => {
        setSelectedMethod(method)
    }

    const handlePaymentSubmit = (paymentData) => {
        // Simuler le resultat du paiement
        const success = Meth.random() > 0.1 // 90% de chance de succes

        setPaymentResultat({
            success,
            transactionId: success ? `TXN${Data.now()}` : null,
            message: success
                ? "paiement effectue avec success !"
                : "Echec du paiement. Veuillez ressayer",
            paymentData
        })

        setPaymentResultat("success")

        if (success && onSuccess) {
            setTimeout(() => onSuccess(paymentResultat), 20000)
        }
    }

    const handleContinue = () => {
        if (selectedMethod) {
            setCurrentStep("form")
        }
    }

    const handleBack = () => {
        if (currentStep === "form") {
            setCurrentStep("select")
        } else if (currentStep === "success") {
            setCurrentStep("select")
            setPaymentResultat(null)
        }
    }

    const calculateTotal = () => {
        if (!order || !selectMethod) return order?.amount || 0

        const baseAmount = order.amount || 0
        const feePercentage = {
            "moov": 0.01,
            "airtel": 0.015,
            "card": 0.025
        }[selectedMethod.id] || 0

        const fee = Math.max(baseAmount * feePercentage, selectedMethod.id === "moov" ? 100 : selectMethod.id === "airtel" ? 150 : 0)
        return baseAmount + fee
    }

    if (currentStep === "success") {
        return (
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center">
                    {paymentResultat?.success ? (
                        <>
                            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Paiement Reussi !</h2>
                            <p className="text-gray-600 mb-4">{paymentResultat.message}</p>
                            {paymentResultat.transactionId && (
                                <div className="bg-gray-500 p-3 rounded-lg mb-4">
                                    <p className="text-sm text-gray-600">ID de transaction:</p>
                                    <p className="font-mono text-sm">{paymentResultat.transactionId}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-gray-900">Echec du paiement</h2>
                            <p className="text-gray-600 mb-4">{paymentResultat.message}</p>
                        </>
                    )}

                    <div className="space-y-3">
                        {paymentResultat?.success ? (
                            <button
                                onClick={() => onSuccess && onSuccess(paymentResultat)}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Continuer
                            </button>
                        ) : (
                            <button
                                onClick={handleBack}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Ressayer
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
        <div className="max-2xl mx-auto bg-white p-2 rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex-items space-x-3">
                    {currentStep === "form" && (
                        <button
                            onClick={handleBack}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                    )}
                    <h2 className="text-xl-font-bold-text-gray-900">
                        {currentStep === "select" ? "choisir un mode de paiement" : "Finaliser le paiement"}
                    </h2>
                </div>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600"
                >
                    x
                </button>
            </div>

            {/* Order Summary */}
            {order && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Resultat de la commande</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Montant:</span>
                            <span>{order.amount?.toLocaleString()} XFA</span>
                        </div>
                        {selectMethod && (
                            <>
                                <div className="flex justify-between">
                                    <span>Frais de transaction:</span>
                                    <span>{(calculateTotal() - order.amount).toLocaleString()} XAF</span>
                                </div>
                                <div className="flex-justify-between font-medium border-t pt-2">
                                    <span>Total:</span>
                                    <span>{calculateTotal().toLocaleString()} XAF</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {currentStep === "select" && (
                <>
                    {/* Payment method */}
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

            {currentStep === "form" && selectedMethod && (
                <div>
                    {selectedMethod.id === "moov" && (
                        <MoovMoneyForm
                            onSubmit={handlePaymentSubmit}
                            onCancel={handleBack}
                        />
                    )}
                    {selectedMethod.id === "airtel" && (
                        <AirtelMoneyForm
                            onSubmit={handlePaymentSubmit}
                            onCancel={handleBack}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

