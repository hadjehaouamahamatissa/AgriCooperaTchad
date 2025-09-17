import React, { useState } from "react"
import { Plus, DollarSign, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { data } from "react-router-dom"

const TransactionCard = ({ transaction }) => {
    const isIncome = transaction.type === "income"

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center-space-x-3">
                    <div className={`p-2 rounded-full ${isIncome ? "bg-green-100" : "bg-red-100"}`}>
                        {isIncome ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                    </div>

                    <div>
                        <h3 className="fnt-medium text-gray-900">{transaction.description}</h3>
                        <p className="text-sm text-gray-500">{transaction.cooperative}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className={`font-semibold ${isIncome ? "text-green-600" : "text-red-600"}`}>
                        {isIncome ? "+" : "-"}{transaction.amount.toLocaleString()} FCFA
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
            </div>
        </div>
    )
}

const FinanceModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        type: "income",
        description: "",
        amount: 0,
        cooperative: "",
        date: new Date().toISOString().split("T")[0]
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave({
            ...formData,
            amount: parseFloat(formData.amount),
            id: Date.now()
        })
        setFormData({
            type: "income",
            description: "",
            amount: 0,
            cooperative: "",
            date: new Date().toISOString().split("T")[0]
        })
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-xl font-bold mb-4">Nouvelle Transaction</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type de Transaction
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 runded-md focus:utline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="income">Revenu</option>
                            <option value="expense">Depense</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Vente de mil"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Montant (FCFA)
                        </label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus: outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cooperative
                        </label>
                        <input
                            type="text"
                            value={formData.cooperative}
                            onChange={(e) => setFormData({ ...formData, cooperative: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus: outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nom de la cooperative"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus: outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-500"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Enreigistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function Finance() {
    const [transactions, setTransactions] = useState([
        {
            id: 1,
            type: "income",
            description: "Vente de mil",
            amount: 2500000,
            cooperative: "Cooperative de Moundou",
            date: "2025-09-13"
        },
        {
            id: 2,
            type: "income",
            description: "Vente de sorgho",
            amount: 3500000,
            cooperative: "Union de producteurs de Sarh",
            date: "2025-08-03"
        },
        {
            id: 3,
            type: "expense",
            description: "Vente d\'arachide",
            amount: 15000000,
            cooperative: "Cooperative de Bongor",
            date: "2025-05-22"
        },
        {
            id: 4,
            type: "income",
            description: "Achat d\'engrais",
            amount: 76000000,
            cooperative: "Cooperative de Moundou",
            date: "2025-02-07"
        },
        {
            id: 5,
            type: "expense",
            description: "Achat de semence",
            amount: 10000000,
            cooperative: "Union de producteurs d\'Abeche",
            date: "2025-05-14"
        },
    ])

    const [isModalOpen, setIsModalOpen] = useState(false)

    const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)

    const netProfit = totalIncome - totalExpenses

    const handleSave = (newTransaction) => {
        setTransactions([newTransaction, ...transactions])
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="tex-2xl font-bold text-gray-900"> Gestion Financière</h1>
                    <p className="text-gray-600">Suivi des revenus et dépenses des coopératives</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space=x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Nouvelle Transaction</span>
                </button>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="bg-green-500 rounded-md p-3">
                            <TrendingUp className="h-6 w-6 text-whote" />
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Revenus Totaux</p>
                            <p className="text-2xl font-bold text-green-600">
                                {totalIncome.toLocaleString()} FCFA
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="bg-red-500 rounded-md p-3">
                            <TrendingDown className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500"> Dépenses Totales</p>
                            <p className="text-2xl font-bold text-red-600">
                                {totalExpenses.toLocaleString()} FCFA
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="bg-blue-500 rounded-md p-3">
                            <DollarSign className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Benefice Net</p>
                            <p className={`text-2xl foont-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {netProfit.toLocaleString()} FCFA
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction list */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Transcations Recentes</h3>
                </div>
                <div className="p-6 space-y-4">
                    {transactions.map((transaction) => (
                        <TransactionCard key={transaction.id} transaction={transaction} />
                    ))}
                </div>
            </div>

            {/* Modal */}
            <FinanceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />
        </div>
    )

}