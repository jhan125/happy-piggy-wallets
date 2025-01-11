import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/account/Login";
import SignUp from "./pages/account/SignUp";
import Profile from "./pages/account/Profile";
import Terms from "./pages/settings/Terms";
import Privacy from "./pages/settings/Privacy";
import Help from "./pages/settings/Help";
import Support from "./pages/settings/Support";
import WalletDetails from "./pages/WalletDetails";
import AddWallet from "./pages/AddWallet";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Wallet Routes */}
        <Route path="/wallet/:id" element={<WalletDetails />} />
        <Route path="/add-wallet" element={<AddWallet />} /> 
        
        {/* Support Routes */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/help" element={<Help />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </Router>
  );
}
