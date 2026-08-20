const Property = require('../models/Property');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// GET ALL PROPERTIES (with filters)
const getProperties = async (req, res) => {
  try {
    const {
      city, propertyType, status,
      minPrice, maxPrice, bedrooms, keyword
    } = req.query;

    let filter = { isAvailable: true };

    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (propertyType) filter.propertyType = propertyType;
    if (status) filter.status = status;
    if (bedrooms) filter['features.bedrooms'] = Number(bedrooms);
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (keyword) {
      filter.$or = [
        { title: new RegExp(keyword, 'i') },
        { description: new RegExp(keyword, 'i') }
      ];
    }

    const properties = await Property.find(filter)
      .populate('postedBy', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE PROPERTY
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('postedBy', 'name email phone');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Increment view count
    property.views += 1;
    await property.save();

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE PROPERTY (admin only)
const createProperty = async (req, res) => {
  try {
    const {
      title, description, price,
      address, city, state, pincode,
      propertyType, status,
      bedrooms, bathrooms, area,
      parking, furnished, amenities
    } = req.body;

    // Handle uploaded images
    const images = req.files?.map(file => ({
      url: file.path,
      public_id: file.filename
    })) || [];

    const property = await Property.create({
      title,
      description,
      price,
      location: { address, city, state, pincode },
      propertyType,
      status,
      features: {
        bedrooms, bathrooms, area,
        parking: parking === 'true',
        furnished
      },
      images,
      amenities: amenities ? amenities.split(',') : [],
      postedBy: req.user.id
    });

    res.status(201).json(property);
  } catch (error) {
    console.log('CREATE PROPERTY ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROPERTY (admin only)
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PROPERTY (admin only)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Delete images from Cloudinary
    for (const image of property.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await property.deleteOne();
    res.status(200).json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SAVE / UNSAVE PROPERTY
const toggleSaveProperty = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const propertyId = req.params.id;

    const isSaved = user.savedProperties.includes(propertyId);

    if (isSaved) {
      user.savedProperties = user.savedProperties.filter(
        id => id.toString() !== propertyId
      );
    } else {
      user.savedProperties.push(propertyId);
    }

    await user.save();
    res.status(200).json({
      message: isSaved ? 'Property unsaved' : 'Property saved',
      savedProperties: user.savedProperties
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleSaveProperty
};