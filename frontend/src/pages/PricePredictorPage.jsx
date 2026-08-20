import { useState } from 'react';
import { predictPrice } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const PricePredictorPage = () => {
  const [form, setForm] = useState({
    city: '', area: '', bedrooms: '',
    bathrooms: '', propertyType: 'apartment', furnished: 'unfurnished'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePredict = async () => {
    if (!form.city || !form.area || !form.bedrooms) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const res = await predictPrice(form);
      setResult(res.data);
    } catch (error) {
      toast.error('Prediction failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🤖 AI Price Predictor</h1>
        <p className="text-gray-500">Enter property details to get an AI-powered price estimate</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'city', label: 'City *', type: 'text', placeholder: 'e.g. Goa' },
            { name: 'area', label: 'Area (sqft) *', type: 'number', placeholder: 'e.g. 1200' },
            { name: 'bedrooms', label: 'Bedrooms *', type: 'number', placeholder: 'e.g. 3' },
            { name: 'bathrooms', label: 'Bathrooms', type: 'number', placeholder: 'e.g. 2' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-700 text-sm mb-1">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}

          <div>
            <label className="block text-gray-700 text-sm mb-1">Property Type</label>
            <select name="propertyType" value={form.propertyType} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Furnished</label>
            <select name="furnished" value={form.furnished} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi Furnished</option>
              <option value="fully-furnished">Fully Furnished</option>
            </select>
          </div>
        </div>

        <button onClick={handlePredict} disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl hover:bg-secondary transition font-medium mt-6 disabled:opacity-50">
          {loading ? 'AI is predicting...' : 'Predict Price'}
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 AI Price Estimate</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Minimum Price</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{result.minPrice?.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Maximum Price</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{result.maxPrice?.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2">Why this price?</p>
              <ul className="space-y-2">
                {result.reasons?.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-primary mt-0.5">✓</span> {reason}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PricePredictorPage;