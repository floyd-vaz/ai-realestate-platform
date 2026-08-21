import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyById, generateSummary } from '../api';
import { FiDroplet, FiMaximize, FiMapPin, FiEye } from 'react-icons/fi';
import { FaBed } from "react-icons/fa";
import { MdLocalParking, MdOutlineChair } from 'react-icons/md';
import AIChat from '../components/AIChat';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { createEnquiry } from '../api';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    buyerName: '', buyerEmail: '', buyerPhone: '', message: ''
  });
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await getPropertyById(id);
        setProperty(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await generateSummary(id);
      setProperty(prev => ({ ...prev, aiSummary: res.data.summary }));
      toast.success('AI summary generated!');
    } catch (error) {
      toast.error('Could not generate summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleEnquiry = async () => {
    if (!enquiryForm.buyerName || !enquiryForm.buyerEmail || !enquiryForm.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setEnquiryLoading(true);
    try {
      await createEnquiry({ ...enquiryForm, propertyId: id });
      toast.success('Enquiry sent! Agent will contact you within 24 hours.');
      setShowEnquiry(false);
      setEnquiryForm({ buyerName: '', buyerEmail: '', buyerPhone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send enquiry');
    } finally {
      setEnquiryLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!property) return <div className="text-center py-20">Property not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left — Images and Details */}
        <div className="lg:col-span-2">
          {/* Main Image */}
          <div className="rounded-2xl overflow-hidden h-80 bg-gray-200 mb-3">
            {property.images?.[activeImage]?.url ? (
              <img src={property.images[activeImage].url} alt={property.title}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>

          {/* Thumbnail Images */}
          {property.images?.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {property.images.map((img, i) => (
                <img key={i} src={img.url} alt=""
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-24 object-cover rounded-lg cursor-pointer border-2 transition ${activeImage === i ? 'border-primary' : 'border-transparent'}`}
                />
              ))}
            </div>
          )}

          {/* Title and Location */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{property.title}</h1>
          <div className="flex items-center gap-1 text-gray-500 mb-4">
            <FiMapPin />
            <span>{property.location?.address}, {property.location?.city}, {property.location?.state}</span>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <FaBed className="text-primary" /> {property.features?.bedrooms} Bedrooms
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiDroplet className="text-primary" /> {property.features?.bathrooms} Bathrooms
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiMaximize className="text-primary" /> {property.features?.area} sqft
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiEye className="text-primary" /> {property.views} Views
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MdLocalParking className="text-primary" /> {property.features?.parking ? 'Parking' : 'No Parking'}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MdOutlineChair className="text-primary" /> {property.features?.furnished}
            </div>
          </div>

          {/* Description */}
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{property.description}</p>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a, i) => (
                  <span key={i} className="bg-blue-50 text-primary px-3 py-1 rounded-full text-sm capitalize">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
      
          {/* Google Map */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">📍 Location</h2>
            <div className="rounded-xl overflow-hidden h-64">
              <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={{ lat: 15.2993, lng: 74.1240 }} // Default to Goa — update with actual coords
                  zoom={13}
                >
                  <Marker position={{ lat: 15.2993, lng: 74.1240 }} />
                </GoogleMap>
              </LoadScript>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              📍 {property.location?.address}, {property.location?.city}, {property.location?.state}
            </p>
          </div>

          {/* AI Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">🤖 AI Summary</h2>
              <button onClick={handleGenerateSummary} disabled={summaryLoading}
                className="text-xs bg-primary text-white px-3 py-1 rounded-lg hover:bg-secondary transition disabled:opacity-50">
                {summaryLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {property.aiSummary || 'Click Generate to create an AI-powered summary for this property.'}
            </p>
          </div>
        </div>

        {/* Right — Price Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                property.status === 'sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                For {property.status}
              </span>
              <span className="text-gray-400 text-sm capitalize">{property.propertyType}</span>
            </div>

            <p className="text-3xl font-bold text-primary mb-1">
              ₹{property.price?.toLocaleString('en-IN')}
            </p>
            <p className="text-gray-400 text-sm mb-6">
              ₹{Math.round(property.price / property.features?.area).toLocaleString('en-IN')} per sqft
            </p>

            <div className="border-t pt-4 mb-4">
              <p className="text-sm text-gray-500 mb-1">Posted by</p>
              <p className="font-semibold text-gray-800">{property.postedBy?.name}</p>
              <p className="text-sm text-gray-500">{property.postedBy?.email}</p>
              {property.postedBy?.phone && (
                <p className="text-sm text-gray-500">{property.postedBy?.phone}</p>
              )}
            </div>

            {/* Contact Button */}
            <button
              onClick={() => setShowEnquiry(!showEnquiry)}
              className="w-full bg-primary text-white py-3 rounded-xl hover:bg-secondary transition font-medium"
            >
              {showEnquiry ? 'Cancel' : 'Contact Agent'}
            </button>

            {/* Enquiry Form */}
            {showEnquiry && (
              <div className="mt-4 space-y-3">
                <input
                  placeholder="Your Name *"
                  value={enquiryForm.buyerName}
                  onChange={(e) => setEnquiryForm({...enquiryForm, buyerName: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  placeholder="Your Email *"
                  type="email"
                  value={enquiryForm.buyerEmail}
                  onChange={(e) => setEnquiryForm({...enquiryForm, buyerEmail: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  placeholder="Your Phone"
                  value={enquiryForm.buyerPhone}
                  onChange={(e) => setEnquiryForm({...enquiryForm, buyerPhone: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  placeholder="Your Message *"
                  rows={3}
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({...enquiryForm, message: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleEnquiry}
                  disabled={enquiryLoading}
                  className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition font-medium disabled:opacity-50"
                >
                  {enquiryLoading ? 'Sending...' : 'Send Enquiry'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Chat floating button */}
      <AIChat propertyId={id} />
    </div>
  );
};

export default PropertyDetailPage;