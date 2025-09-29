import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
    Home,
    Users,
    DollarSign,
    ShoppingCart,
    BookOpen,
    Package,
    Menu,
    X
} from "lucide-react"

const menuItems = [
    { icon: Package, label: "Landing Page", path: "/" },
    { icon: Home, label: "Tableau de bord", path: "/Home" },
    { icon: Users, label: "Cooperatives", path: "/cooperatives" },
    { icon: ShoppingCart, label: "Marketplace", path: "/marketplace" },
    { icon: DollarSign, label: "Finance", path: "/finance" },
    { icon: BookOpen, label: "Ressources", path: "/resources" },
]

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()

    return (
        <div className="flex h-screen bg-gray-100">
            { /* Sidebar*/}
            <div className={`bg-white text-black w-64 min-h-screen p-4 ${sidebarOpen ? "block" : "hidden"} md:block`}>
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-xl font-bold">AGRICOOPERATCHAD</h1>
                    <button 
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden"
                    >
                        < X size={24} />
                    </button>
                </div>

                <nav>
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            const isActive = location.pathname === item.path

                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                            isActive
                                                ? "bg-black-900 text-black font-semibold"
                                                : "text-black-100 hover:bg-black hover:text-white"
                                        }   `}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <Icon size={20} />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </div>

            { /* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Système de Gestion des Coopératives Agricoles
                        </h2>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>

            { /*Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    )
}
