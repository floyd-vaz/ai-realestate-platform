import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiHeart, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { MdOutlineRealEstateAgent } from 'react-icons/md';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
          <MdOutlineRealEstateAgent size={28} />
          <span>EstateAI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="flex items-center gap-1 text-gray-600 hover:text-primary transition">
            <FiHome size={16} /> Home
          </Link>
          <Link to="/properties" className="text-gray-600 hover:text-primary transition">
            Properties
          </Link>
          <Link to="/predict-price" className="text-gray-600 hover:text-primary transition">
            AI Price Predictor
          </Link>
          {user && (
            <Link to="/saved" className="flex items-center gap-1 text-gray-600 hover:text-primary transition">
              <FiHeart size={16} /> Saved
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-accent font-semibold hover:text-yellow-600 transition">
              Admin Panel
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Hey, {user.name} 👋</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-red-50 text-red-500 px-3 py-2 rounded-lg hover:bg-red-100 transition text-sm"
              >
                <FiLogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-blue-50 transition text-sm">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition text-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-600">Home</Link>
          <Link to="/properties" onClick={() => setMenuOpen(false)} className="text-gray-600">Properties</Link>
          <Link to="/predict-price" onClick={() => setMenuOpen(false)} className="text-gray-600">AI Price Predictor</Link>
          {user && <Link to="/saved" onClick={() => setMenuOpen(false)} className="text-gray-600">Saved Properties</Link>}
          {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-accent font-semibold">Admin Panel</Link>}
          {user ? (
            <button onClick={handleLogout} className="text-red-500 text-left">Logout</button>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-2 border border-primary text-primary rounded-lg text-sm">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;