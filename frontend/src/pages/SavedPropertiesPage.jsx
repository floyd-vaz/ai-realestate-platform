import { useState, useEffect } from 'react';
import { getProfile } from '../api';
import PropertyCard from '../components/PropertyCard';
import Loader from '../components/Loader';

const SavedPropertiesPage = () => {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const res = await getProfile();
      setSaved(res.data.savedProperties || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSaved(); }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Saved Properties</h1>
      <p className="text-gray-500 mb-8">Properties you've saved for later</p>

      {saved.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No saved properties yet. Browse and save properties you like!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map(property => (
            <PropertyCard key={property._id} property={property} onSaveToggle={fetchSaved} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPropertiesPage;