import { useState, useEffect } from 'react';
import { getProperties, createProperty, deleteProperty, getEnquiries, updateEnquiry, deleteEnquiry } from '../api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { FiTrash2, FiPlus, FiHome, FiMessageSquare, FiEye, FiX } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [properties, setProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', price: '',
    address: '', city: '', state: '', pincode: '',
    propertyType: 'apartment', status: 'sale',
    bedrooms: '', bathrooms: '', area: '',
    parking: 'false', furnished: 'unfurnished', amenities: ''
  });
  const [images, setImages] = useState([]);

  const fetchAll = async () => {
    try {
      const [propRes, enqRes] = await Promise.all([
        getProperties(),
        getEnquiries()
      ]);
      setProperties(propRes.data);
      setEnquiries(enqRes.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Analytics data
  const propertyTypeData = ['apartment', 'house', 'villa', 'plot', 'commercial'].map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    count: properties.filter(p => p.propertyType === type).length
  })).filter(d => d.count > 0);

  const enquiryStatusData = [
    { name: 'New', value: enquiries.filter(e => e.status === 'new').length, color: '#3b82f6' },
    { name: 'Contacted', value: enquiries.filter(e => e.status === 'contacted').length, color: '#f59e0b' },
    { name: 'Closed', value: enquiries.filter(e => e.status === 'closed').length, color: '#10b981' },
  ].filter(d => d.value > 0);

  const topProperties = [...properties]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      images.forEach(img => formData.append('images', img));
      await createProperty(formData);
      toast.success('Property created!');
      setShowForm(false);
      fetchAll();
    } catch (error) {
      toast.error('Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await deleteProperty(id);
      toast.success('Property deleted');
      fetchAll();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEnquiryUpdate = async (id, status) => {
    try {
      await updateEnquiry(id, { status });
      toast.success('Enquiry updated');
      fetchAll();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleEnquiryDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await deleteEnquiry(id);
      toast.success('Enquiry deleted');
      fetchAll();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <Loader />;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiHome /> },
    { id: 'properties', label: 'Properties', icon: <FiHome /> },
    { id: 'enquiries', label: `Enquiries ${enquiries.filter(e => e.status === 'new').length > 0 ? `(${enquiries.filter(e => e.status === 'new').length} new)` : ''}`, icon: <FiMessageSquare /> },
    { id: 'analytics', label: 'Analytics', icon: <FiEye /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your real estate platform</p>
        </div>
        {activeTab === 'properties' && (
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-secondary transition">
            <FiPlus /> Add Property
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Properties', value: properties.length, color: 'bg-blue-50 text-blue-600' },
          { label: 'For Sale', value: properties.filter(p => p.status === 'sale').length, color: 'bg-green-50 text-green-600' },
          { label: 'For Rent', value: properties.filter(p => p.status === 'rent').length, color: 'bg-purple-50 text-purple-600' },
          { label: 'New Enquiries', value: enquiries.filter(e => e.status === 'new').length, color: 'bg-amber-50 text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} rounded-xl p-4`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm opacity-75">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Viewed Properties */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Viewed Properties</h2>
            <div className="space-y-3">
              {topProperties.map((p, i) => (
                <div key={p._id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-5">#{i + 1}</span>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{p.title}</p>
                      <p className="text-gray-400 text-xs">{p.location?.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-semibold text-sm">₹{p.price?.toLocaleString('en-IN')}</p>
                    <p className="text-gray-400 text-xs">{p.views} views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Enquiries */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Enquiries</h2>
            {enquiries.slice(0, 5).map(enq => (
              <div key={enq._id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{enq.buyerName}</p>
                  <p className="text-gray-400 text-xs">{enq.property?.title}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  enq.status === 'new' ? 'bg-blue-100 text-blue-600' :
                  enq.status === 'contacted' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {enq.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROPERTIES TAB */}
      {activeTab === 'properties' && (
        <div>
          {/* Add Property Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'title', label: 'Title' },
                  { name: 'price', label: 'Price (₹)', type: 'number' },
                  { name: 'address', label: 'Address' },
                  { name: 'city', label: 'City' },
                  { name: 'state', label: 'State' },
                  { name: 'pincode', label: 'Pincode' },
                  { name: 'bedrooms', label: 'Bedrooms', type: 'number' },
                  { name: 'bathrooms', label: 'Bathrooms', type: 'number' },
                  { name: 'area', label: 'Area (sqft)', type: 'number' },
                  { name: 'amenities', label: 'Amenities (comma separated)' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-gray-700 text-sm mb-1">{field.label}</label>
                    <input type={field.type || 'text'} name={field.name} value={form[field.name]}
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
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-gray-600">Property</th>
                  <th className="text-left px-6 py-4 text-gray-600">Location</th>
                  <th className="text-left px-6 py-4 text-gray-600">Price</th>
                  <th className="text-left px-6 py-4 text-gray-600">Type</th>
                  <th className="text-left px-6 py-4 text-gray-600">Views</th>
                  <th className="text-left px-6 py-4 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(p => (
                  <tr key={p._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0]?.url && (
                          <img src={p.images[0].url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <span className="font-medium text-gray-800">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{p.location?.city}</td>
                    <td className="px-6 py-4 text-primary font-semibold">₹{p.price?.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                        p.status === 'sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>{p.status}</span>
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
      )}

      {/* ENQUIRIES TAB */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          {enquiries.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No enquiries yet</div>
          ) : (
            enquiries.map(enq => (
              <div key={enq._id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{enq.buyerName}</h3>
                    <p className="text-gray-500 text-sm">{enq.buyerEmail}</p>
                    {enq.buyerPhone && <p className="text-gray-500 text-sm">{enq.buyerPhone}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      enq.status === 'new' ? 'bg-blue-100 text-blue-600' :
                      enq.status === 'contacted' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {enq.status}
                    </span>
                    <button onClick={() => handleEnquiryDelete(enq._id)}
                      className="text-red-400 hover:text-red-600">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <p className="text-sm text-gray-600"><strong>Property:</strong> {enq.property?.title}</p>
                  <p className="text-sm text-gray-600 mt-1"><strong>Message:</strong> {enq.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>

                {/* Status Update Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEnquiryUpdate(enq._id, 'new')}
                    className={`text-xs px-3 py-1 rounded-lg border transition ${enq.status === 'new' ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200 text-gray-500 hover:border-blue-300'}`}>
                    New
                  </button>
                  <button
                    onClick={() => handleEnquiryUpdate(enq._id, 'contacted')}
                    className={`text-xs px-3 py-1 rounded-lg border transition ${enq.status === 'contacted' ? 'bg-yellow-500 text-white border-yellow-500' : 'border-gray-200 text-gray-500 hover:border-yellow-300'}`}>
                    Contacted
                  </button>
                  <button
                    onClick={() => handleEnquiryUpdate(enq._id, 'closed')}
                    className={`text-xs px-3 py-1 rounded-lg border transition ${enq.status === 'closed' ? 'bg-green-500 text-white border-green-500' : 'border-gray-200 text-gray-500 hover:border-green-300'}`}>
                    Closed
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Property Types Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Properties by Type</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={propertyTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Enquiry Status Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Enquiry Status Breakdown</h2>
            {enquiryStatusData.length > 0 ? (
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={enquiryStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {enquiryStatusData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {enquiryStatusData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}: <strong>{item.value}</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-10">No enquiry data yet</p>
            )}
          </div>

          {/* Top Properties by Views */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Top Properties by Views</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProperties.map(p => ({ name: p.title.slice(0, 15) + '...', views: p.views }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="views" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;