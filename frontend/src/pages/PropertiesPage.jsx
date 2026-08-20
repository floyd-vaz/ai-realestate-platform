import { useState, useEffect } from 'react';
import { getProperties } from '../api';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async (filters = {}) => {
    setLoading(true);
    try {
      const res = await getProperties(filters);
      setProperties(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Properties</h1>
      <p className="text-gray-500 mb-8">Find your perfect home from our listings</p>

      <div className="mb-8">
        <SearchBar onSearch={fetchProperties} />
      </div>

      {loading ? <Loader /> : (
        <>
          <p className="text-gray-500 text-sm mb-4">{properties.length} properties found</p>
          {properties.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No properties found. Try different filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <PropertyCard key={property._id} property={property} onSaveToggle={() => fetchProperties()} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertiesPage;