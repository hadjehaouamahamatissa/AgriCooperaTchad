import React from "react"
import { useNavigate } from "react-router-dom"
import { Users, DollarSign, ShoppingCart, Package, TrendingUp, AlertCircle } from "lucide-react"

const StatCard = ({ title, value, icon: Icon, color = "blue" }) => {
    const colorClasses = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        yellow: "bg-yellow-500",
        purple: "bg-purple-500"
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
             <div className={`${colorClasses[color]} rounded-md p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd className="text-lg font-medium text-gray-900">{value}</dd>
                    </dl>
                </div>
            </div>
        </div>
    )
}

const ActivityItem = ({ title, description, time, type }) => {
    const getTypeColor = (type) => {
        switch (type) {
            case "success": return "bg-green-100 text-green-800"
            case "warning": return "bg-yellow-100 text-yellow-800"
            case "info": return "bg-blue-100 text-blue-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
                {type === "success" ? "✓" : type === "warning" ? "⚠" : "ℹ"}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
                <p className="text-sm text-gray-500 truncate">{description}</p>
            </div>
            <div className="text-sm text-gray-500">{time}</div>
        </div>
    )
}

export default function Dashboard() {
    const stats = [
        {
            title: "Cooperatives Actives",
            value: "24",
            icon: Users,
            color: "blue"
        },
        {
            title: "Revenus Totaux",
            value: "2.4M FCFA",
            icon: DollarSign,
            color: "green"
        },
        {
            title: "Produits en ventes",
            value: "12",
            icon: ShoppingCart,
            color: "yellow"
        },
        {
            title: "Stock Total",
            value: "89%",
            icon: Package,
            color: "purple"
        }
       
    ]

    const recentActivities = [
        {
            title: "Nouvelle cooperative enregistree",
            description: "Cooperative de Moundou - 45 membres",
            time: "il y a 4h",
            type: "success"
        },
        {
            title: "Vente importante",
            description: "500kg de mil vendus - 250,000 FCFA",
            time: "Il y a 2h",
            type: "success"
        },
        {
            title: "Stock faible",
            description: "Engrais NPK Reapprovisionnement necessaire",
            time: "Il y a 6h",
            type: "warning"
        },
        {
            title: "Formation programmee",
            description: "Technique d'irrigation - 15 Mars 2025",
            time: "Il y a 1jr",
            type: "info"
        }
    ]

    const navigate = useNavigate()

    const quickActions = [
        { title: "Ajouter Cooperative", icon: Users, color: "bg-blue-500" },
        { title: "Enreidistrer Vente", icon: DollarSign, color: "bg-green-500" },
        { title: "Gerer Stock", icon: Package, color: "bg-purple-500" },
        { title: "Nouvelle Formation", icon: TrendingUp, color: "bg-yellow-500" }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-gray-600">Vue d'ensemble des activites des cooperatives agricoles</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color} 
                    />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recen Activities */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Activites Recentes</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {recentActivities.map((activity, index) => (
                                <ActivityItem 
                                key={index}
                                title={activity.title}
                                description={activity.description}
                                time={activity.time}
                                type={activity.type}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="text-lg font-medium text-gray-900">Actions Rapides</div>
                    </div>
                    <div className="p-6 space-y-4">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon
                            return (
                                <button
                                key={index}
                                onClick={() => navigate(action.path)} //redirection vers la page correspondante
                                className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <div className={`${action.color} rounded-md p-2`}>
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">{action.title}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Alerts */}
                <div className="mt-6 bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Alertes</h3>
                    </div>
                    <div className="p-6">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Stock Faible</p>
                                <p className="text-sm text-gray-500">3 produits necessitent un reapprovisionnement</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
