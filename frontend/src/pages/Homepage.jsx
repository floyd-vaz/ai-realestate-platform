import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiHome, FiTrendingUp, FiMessageSquare } from 'react-icons/fi';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <FiSearch size={28} />, title: 'Smart Search', desc: 'Filter by city, price, type, bedrooms and more' },
    { icon: <FiTrendingUp size={28} />, title: 'AI Price Predictor', desc: 'Get accurate price estimates powered by AI' },
    { icon: <FiMessageSquare size={28} />, title: 'AI Chat Assistant', desc: 'Ask anything about any property instantly' },
    { icon: <FiHome size={28} />, title: 'Save Properties', desc: 'Build your wishlist and compare properties' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold mb-6"
          >
            Find Your Dream Property
            <span className="block text-accent mt-2">Powered by AI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-blue-100 mb-10"
          >
            Search thousands of properties, get AI price predictions,
            and chat with our intelligent assistant.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/properties')}
              className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
            >
              Browse Properties
            </button>
            <button
              onClick={() => navigate('/predict-price')}
              className="bg-accent text-white px-8 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition"
            >
              Predict Price
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose EstateAI?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition text-center"
            >
              <div className="text-primary mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Home?</h2>
        <p className="text-gray-400 mb-8">Join thousands of happy homeowners who found their dream property</p>
        <button
          onClick={() => navigate('/register')}
          className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-secondary transition"
        >
          Get Started Free
        </button>
      </section>
    </div>
  );
};

export default HomePage;