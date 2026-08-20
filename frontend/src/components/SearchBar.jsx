import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    city: '',
    propertyType: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: ''
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        <input
          name="keyword"
          value={filters.keyword}
          onChange={handleChange}
          placeholder="Search by keyword..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary col-span-1 md:col-span-3 lg:col-span-1"
        />
        <input
          name="city"
          value={filters.city}
          onChange={handleChange}
          placeholder="City"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          name="propertyType"
          value={filters.propertyType}
          onChange={handleChange}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Sale & Rent</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <input
          name="minPrice"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="Min Price (₹)"
          type="number"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Max Price (₹)"
          type="number"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          name="bedrooms"
          value={filters.bedrooms}
          onChange={handleChange}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Any Bedrooms</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4+ BHK</option>
        </select>
        <button
          onClick={handleSearch}
          className="bg-primary text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 hover:bg-secondary transition text-sm font-medium"
        >
          <FiSearch size={16} /> Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;