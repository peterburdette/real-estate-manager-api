/**
 * @swagger
 * tags:
 *   - name: Support
 *     description: API endpoints for support-related functionalities.
 */

/**
 * @swagger
 * /api/support:
 *   get:
 *     summary: Get all faqs
 *     description: Retrieve all questions and answers from the database.
 *     tags: [Support]
 *     responses:
 *       200:
 *         description: Successful response with the faq data.
 */

const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const router = express.Router();
const mongoURI = process.env.MONGO_URI;

router.get('/', async (req, res) => {
  try {
    // Connect to MongoDB
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    // Access the database and collection for properties
    const db = client.db('PROD');
    const propertiesCollection = db.collection('support');

    // Fetch properties from MongoDB
    const properties = await propertiesCollection.find({}).toArray();

    // Close the MongoDB connection
    await client.close();

    res.json(properties);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
