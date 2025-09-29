import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Home from "./pages/Dashboard"
import Layout from "./components/Layout"
import Cooperatives from "./pages/Cooperatives"
import Finance from "./pages/Finance"
import Marketplace from "./pages/Marketplace"
import Resources from "./pages/Resources"
// import Payment from "./pages/Payment"
// import Formation from "./pages/Formation"

function App() {
    return (
        <BrowserRouter>
        {/* <Layout> */}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<Home />} />

                <Route path="/cooperatives" element={<Layout><Cooperatives /></Layout>} />
                <Route path="/marketplace" element={<Layout><Marketplace /></Layout>} />
                <Route path="/finance" element={<Layout><Finance /></Layout>} />
                <Route path="/resources" element={<Layout></Layout>} />          
                 {/* <Route path="/formation" element={<Formation />} />  */}
                {/* <Route path="/payment" element={<Payment />} /> */}
                {/* <Route path="/inventory" element={<Inventory />} /> */}
                           {/* <Route path="/formation" element={<Formation />} />  */}
            </Routes>
        {/* </Layout> */}
        </BrowserRouter>
    )
    
}

export default App
