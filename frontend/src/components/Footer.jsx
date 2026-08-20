import { MdOutlineRealEstateAgent } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold mb-3">
            <MdOutlineRealEstateAgent size={24} />
            EstateAI
          </div>
          <p className="text-gray-400 text-sm">
            Find your dream property with the power of AI. 
            Smart search, price predictions and more.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-gray-400 text-sm">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/properties" className="hover:text-white transition">Properties</Link>
            <Link to="/predict-price" className="hover:text-white transition">AI Price Predictor</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <p className="text-gray-400 text-sm">estate.ai@gmail.com</p>
          <p className="text-gray-400 text-sm mt-1">Goa, India</p>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-gray-500 text-sm">
        © 2026 EstateAI. Built with MERN + OpenAI
      </div>
    </footer>
  );
};

export default Footer;