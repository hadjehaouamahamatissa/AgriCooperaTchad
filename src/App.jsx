import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Cooperatives from "./pages/Cooperatives"
import Finance from "./pages/Finance"
import Payment from "./pages/Payment"
import Marketplace from "./pages/Marketplace"
import Resources from "./pages/Resources"
// import Formation from "./pages/Formation"

function App() {
    return (
        <BrowserRouter>
        <Layout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/cooperatives" element={<Cooperatives />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/resources" element={<Resources />} />           {/* <Route path="/formation" element={<Formation />} />  */}
                <Route path="/inventory" element={<Inventory />} />           {/* <Route path="/formation" element={<Formation />} />  */}
            </Routes>
        </Layout>
        </BrowserRouter>
    )
    
}

export default App
