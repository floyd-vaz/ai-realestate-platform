const OpenAI = require('openai');
const Property = require('../models/Property');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// AI CHAT — ask anything about a property
const chatWithAI = async (req, res) => {
  try {
    const { message, propertyId } = req.body;

    // Get property details to give AI context
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const propertyContext = `
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
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful real estate assistant. 
          Answer questions about this property: ${propertyContext}
          Be concise, friendly and helpful.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500
    });

    res.status(200).json({
      reply: response.choices[0].message.content
    });

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
      As a real estate expert in India, predict a realistic price range for:
      City: ${city}
      Area: ${area} sq ft
      Bedrooms: ${bedrooms}
      Bathrooms: ${bathrooms}
      Property Type: ${propertyType}
      Furnished: ${furnished}
      
      Give a minimum and maximum price range in Indian Rupees.
      Also give 2-3 brief reasons for this price.
      Format your response as JSON like this:
      {
        "minPrice": 0000000,
        "maxPrice": 0000000,
        "reasons": ["reason1", "reason2", "reason3"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300
    });

    const result = JSON.parse(response.choices[0].message.content);
    res.status(200).json(result);

  } catch (error) {
    console.log('PRICE PREDICTION ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// GENERATE AI SUMMARY FOR A PROPERTY
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
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200
    });

    const summary = response.choices[0].message.content;

    // Save summary to property
    property.aiSummary = summary;
    await property.save();

    res.status(200).json({ summary });

  } catch (error) {
    console.log('SUMMARY ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { chatWithAI, predictPrice, generateSummary };