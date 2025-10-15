import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Home from "./pages/Dashboard"
import Layout from "./components/Layout"
import Cooperatives from "./pages/Cooperatives"
import Marketplace from "./pages/Marketplace"
import Finance from "./pages/Finance"
import Resources from "./pages/Resources"
import LoginPage from "./pages/LoginPage"
// import SignupPage from "./pages/SignupPage"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* <Route path="/signup" element={<SignupPage />} /> */}
                <Route path="/home" element={<Layout><Home /></Layout>} />
                <Route path="/cooperatives" element={<Layout><Cooperatives /></Layout>} />
                <Route path="/marketplace" element={<Layout><Marketplace /></Layout>} />
                <Route path="/finance" element={<Layout><Finance /></Layout>} />
                <Route path="/resources" element={<Layout><Resources /></Layout>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App