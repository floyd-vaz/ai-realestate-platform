import { useState, useEffect } from 'react';
import { getProperties, createProperty, deleteProperty } from '../api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { FiTrash2, FiPlus } from 'react-icons/fi';

const AdminDashboardPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', price: '',
    address: '', city: '', state: '', pincode: '',
    propertyType: 'apartment', status: 'sale',
    bedrooms: '', bathrooms: '', area: '',
    parking: 'false', furnished: 'unfurnished', amenities: ''
  });
  const [images, setImages] = useState([]);

  const fetchProperties = async () => {
    try {
      const res = await getProperties();
      setProperties(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      images.forEach(img => formData.append('images', img));

      await createProperty(formData);
      toast.success('Property created successfully!');
      setShowForm(false);
      fetchProperties();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await deleteProperty(id);
      toast.success('Property deleted');
      fetchProperties();
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">{properties.length} total properties</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-secondary transition">
          <FiPlus /> Add Property
        </button>
      </div>

      {/* Add Property Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'price', label: 'Price (₹)', type: 'number' },
              { name: 'address', label: 'Address', type: 'text' },
              { name: 'city', label: 'City', type: 'text' },
              { name: 'state', label: 'State', type: 'text' },
              { name: 'pincode', label: 'Pincode', type: 'text' },
              { name: 'bedrooms', label: 'Bedrooms', type: 'number' },
              { name: 'bathrooms', label: 'Bathrooms', type: 'number' },
              { name: 'area', label: 'Area (sqft)', type: 'number' },
              { name: 'amenities', label: 'Amenities (comma separated)', type: 'text' },
            ].map(field => (
              <div key={field.name}>
                <label className="block text-gray-700 text-sm mb-1">{field.label}</label>
                <input type={field.type} name={field.name} value={form[field.name]}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            ))}

            {[
              { name: 'propertyType', label: 'Type', options: ['apartment','house','villa','plot','commercial'] },
              { name: 'status', label: 'Status', options: ['sale','rent'] },
              { name: 'furnished', label: 'Furnished', options: ['unfurnished','semi-furnished','fully-furnished'] },
              { name: 'parking', label: 'Parking', options: ['true','false'] },
            ].map(sel => (
              <div key={sel.name}>
                <label className="block text-gray-700 text-sm mb-1">{sel.label}</label>
                <select name={sel.name} value={form[sel.name]} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {sel.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm mb-1">Images</label>
              <input type="file" multiple accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <button onClick={handleSubmit} disabled={submitting}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-xl hover:bg-secondary transition disabled:opacity-50">
            {submitting ? 'Creating...' : 'Create Property'}
          </button>
        </div>
      )}

      {/* Properties Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-gray-600">Property</th>
              <th className="text-left px-6 py-4 text-gray-600">Location</th>
              <th className="text-left px-6 py-4 text-gray-600">Price</th>
              <th className="text-left px-6 py-4 text-gray-600">Status</th>
              <th className="text-left px-6 py-4 text-gray-600">Views</th>
              <th className="text-left px-6 py-4 text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(p => (
              <tr key={p._id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-800">{p.title}</td>
                <td className="px-6 py-4 text-gray-500">{p.location?.city}</td>
                <td className="px-6 py-4 text-primary font-semibold">₹{p.price?.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs capitalize ${p.status === 'sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{p.views}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(p._id)}
                    className="text-red-400 hover:text-red-600 transition">
                    <FiTrash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;