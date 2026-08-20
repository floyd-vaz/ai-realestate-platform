import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDroplet, FiMaximize, FiHeart, FiMapPin } from 'react-icons/fi';
import { FaBed } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import { toggleSaveProperty } from '../api';
import toast from 'react-hot-toast';

const PropertyCard = ({ property, onSaveToggle }) => {
  const { user } = useAuth();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to save properties');
      return;
    }
    try {
      await toggleSaveProperty(property._id);
      toast.success('Property save status updated!');
      if (onSaveToggle) onSaveToggle();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition"
    >
      <Link to={`/properties/${property._id}`}>
        {/* Image */}
        <div className="relative h-52 bg-gray-200">
          {property.images?.[0]?.url ? (
            <img
              src={property.images[0].url}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full capitalize">
              {property.status}
            </span>
            <span className="bg-white text-gray-700 text-xs px-2 py-1 rounded-full capitalize">
              {property.propertyType}
            </span>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-50 transition"
          >
            <FiHeart size={16} className="text-red-400" />
          </button>
        </div>

        {/* Details */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">{property.title}</h3>

          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <FiMapPin size={14} />
            <span>{property.location?.city}, {property.location?.state}</span>
          </div>

          {/* Features */}
          <div className="flex gap-4 text-gray-500 text-sm mb-4">
            <span className="flex items-center gap-1">
              <FaBed size={14} /> {property.features?.bedrooms} Beds
            </span>
            <span className="flex items-center gap-1">
              <FiDroplet size={14} /> {property.features?.bathrooms} Baths
            </span>
            <span className="flex items-center gap-1">
              <FiMaximize size={14} /> {property.features?.area} sqft
            </span>
          </div>

          {/* Price */}
          <div className="flex justify-between items-center">
            <span className="text-primary font-bold text-xl">
              ₹{property.price?.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-400">{property.views} views</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;