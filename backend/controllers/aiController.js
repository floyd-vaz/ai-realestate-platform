const { GoogleGenerativeAI } = require('@google/generative-ai');
const Property = require('../models/Property');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

// AI CHAT — ask anything about a property
const chatWithAI = async (req, res) => {
  try {
    const { message, propertyId } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const prompt = `
      You are a helpful real estate assistant.
      Answer questions about this property:
      
      Property: ${property.title}
      Price: ₹${property.price}
      Location: ${property.location.address}, ${property.location.city}
      Type: ${property.propertyType}
      Status: For ${property.status}
      Bedrooms: ${property.features.bedrooms}
      Bathrooms: ${property.features.bathrooms}
      Area: ${property.features.area} sq ft
      Furnished: ${property.features.furnished}
      Amenities: ${property.amenities.join(', ')}
      Description: ${property.description}
      
      User question: ${message}
      
      Be concise, friendly and helpful. Answer in 2-3 sentences.
    `;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.status(200).json({ reply });

  } catch (error) {
    console.log('AI CHAT ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// AI PRICE PREDICTION
const predictPrice = async (req, res) => {
  try {
    const { city, area, bedrooms, bathrooms, propertyType, furnished } = req.body;

    const prompt = `
      As a real estate expert in India, predict a realistic price range for this property:
      City: ${city}
      Area: ${area} sq ft
      Bedrooms: ${bedrooms}
      Bathrooms: ${bathrooms}
      Property Type: ${propertyType}
      Furnished: ${furnished}
      
      Respond ONLY with a valid JSON object, no extra text, no markdown, no backticks:
      {
        "minPrice": 0000000,
        "maxPrice": 0000000,
        "reasons": ["reason1", "reason2", "reason3"]
      }
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Clean response in case Gemini adds markdown
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(text);
    res.status(200).json(parsed);

  } catch (error) {
    console.log('PRICE PREDICTION ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// GENERATE AI SUMMARY
const generateSummary = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const prompt = `
      Write a compelling 3-4 sentence marketing description for this property:
      Title: ${property.title}
      Type: ${property.propertyType}
      Price: ₹${property.price}
      Location: ${property.location.city}
      Bedrooms: ${property.features.bedrooms}
      Area: ${property.features.area} sq ft
      Amenities: ${property.amenities.join(', ')}
      
      Make it sound professional and attractive to buyers.
      Do not use any markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    property.aiSummary = summary;
    await property.save();

    res.status(200).json({ summary });

  } catch (error) {
    console.log('SUMMARY ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { chatWithAI, predictPrice, generateSummary };