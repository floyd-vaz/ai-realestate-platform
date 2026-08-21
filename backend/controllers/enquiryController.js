const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');
const { sendEnquiryEmail } = require('../config/email');

// CREATE ENQUIRY
const createEnquiry = async (req, res) => {
  try {
    const { buyerName, buyerEmail, buyerPhone, message, propertyId } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const enquiry = await Enquiry.create({
      property: propertyId,
      buyerName,
      buyerEmail,
      buyerPhone,
      message
    });

    // Send emails
    await sendEnquiryEmail({
      buyerName,
      buyerEmail,
      buyerPhone,
      message,
      propertyTitle: property.title,
      propertyId
    });

    res.status(201).json({ message: 'Enquiry sent successfully', enquiry });
  } catch (error) {
    console.log('ENQUIRY ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ENQUIRIES (admin)
const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate('property', 'title location price images')
      .sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ENQUIRY STATUS (admin)
const updateEnquiry = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );
    res.status(200).json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ENQUIRY (admin)
const deleteEnquiry = async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ENQUIRY STATS (admin)
const getEnquiryStats = async (req, res) => {
  try {
    const total = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: 'new' });
    const contacted = await Enquiry.countDocuments({ status: 'contacted' });
    const closed = await Enquiry.countDocuments({ status: 'closed' });

    res.status(200).json({ total, new: newEnquiries, contacted, closed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createEnquiry, getEnquiries, updateEnquiry, deleteEnquiry, getEnquiryStats };