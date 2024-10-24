/**
 * @swagger
 * tags:
 *   - name: Properties
 *     description: API endpoints for managing properties.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the property.
 *         address:
 *           type: string
 *           description: The address of the property.
 *         city:
 *           type: string
 *           description: The city where the property is located.
 *         state:
 *           type: string
 *           description: The state where the property is located.
 *         zip:
 *           type: integer
 *           description: The zip code of the property.
 *         propertyValue:
 *           type: integer
 *           description: The value of the property.
 *         monthlyRentalIncome:
 *           type: integer
 *           description: The monthly rental income from the property.
 *         squareFeet:
 *           type: integer
 *           description: The square footage of the property.
 *         bedrooms:
 *           type: integer
 *           description: The number of bedrooms in the property.
 *         bathrooms:
 *           type: integer
 *           description: The number of bathrooms in the property.
 *         availability:
 *           type: string
 *           description: The availability status of the property (e.g., "Available", "Not Available").
 *         image:
 *           type: string
 *           description: The URL of the property image.
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: List of amenities available at the property.
 *         notes:
 *           type: string
 *           description: Additional notes or description of the property.
 */

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties
 *     description: Retrieve all properties from the database.
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: Successful response with the properties data.
 *
 *   post:
 *     summary: Create a new property
 *     description: Create a new property and add it to the database.
 *     tags: [Properties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       201:
 *         description: Property created successfully.
 *       400:
 *         description: Bad request. Check your request data.
 *       500:
 *         description: Internal Server Error.
 *
 * /api/properties/{id}:
 *   get:
 *     summary: Get a property by ID
 *     description: Retrieve a property from the database by its ID.
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the property to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with the property data.
 *       404:
 *         description: Property not found.
 *
 *   put:
 *     summary: Update a property by ID
 *     description: Update all fields of a property based on its ID.
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the property to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       200:
 *         description: Property updated successfully.
 *       400:
 *         description: Bad request. Check your request data.
 *       404:
 *         description: Property not found.
 *       500:
 *         description: Internal Server Error.
 *
 *   delete:
 *     summary: Delete a property by ID
 *     tags:
 *       - Properties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the property to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       404:
 *         description: Property not found
 *       500:
 *         description: Internal Server Error
 */

const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const router = express.Router();
const mongoURI = process.env.MONGO_URI;

// Middleware for parsing JSON
router.use(express.json());

// Get all properties
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
    const propertiesCollection = db.collection('properties');

    // Fetch properties from MongoDB
    const properties = await propertiesCollection.find({}).toArray();

    // Close the MongoDB connection
    await client.close();

    // Set Content-Type header to application/json
    res.setHeader('Content-Type', 'application/json');
    res.json(properties);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Connect to MongoDB
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    // Access the database and collection for properties
    const db = client.db('PROD');
    const propertiesCollection = db.collection('properties');

    // Find property by ID
    const property = await propertiesCollection.findOne({ id: id });

    // Close the MongoDB connection
    await client.close();

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Set Content-Type header to application/json
    res.setHeader('Content-Type', 'application/json');
    res.json(property);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add new Property
router.post('/', async (req, res) => {
  try {
    const propertyData = req.body;

    // Validate the request data
    if (!propertyData) {
      return res
        .status(400)
        .json({ message: 'Bad request. Property data is required.' });
    }

    // Connect to MongoDB
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    // Access the database and collection for properties
    const db = client.db('PROD');
    const propertiesCollection = db.collection('properties');

    // Check if the ID already exists
    const existingProperty = await propertiesCollection.findOne({
      id: propertyData.id,
    });
    if (existingProperty) {
      await client.close();
      return res
        .status(400)
        .json({ message: 'Property with this ID already exists.' });
    }

    // Insert the new property into the collection
    const result = await propertiesCollection.insertOne(propertyData);

    // Close the MongoDB connection
    await client.close();

    // Respond with the inserted property data
    res.status(201).json({ message: 'Successfully added a new property.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update a property by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const propertyData = req.body;

    console.log('Received update request for ID:', id);
    console.log('Updated property data:', propertyData);

    // Validate the request data
    if (!propertyData) {
      return res
        .status(400)
        .json({ message: 'Bad request. Property data is required.' });
    }

    // Connect to MongoDB
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    // Access the database and collection for properties
    const db = client.db('PROD');
    const propertiesCollection = db.collection('properties');

    // Update the property in the collection using findOneAndUpdate
    const result = await propertiesCollection.updateOne(
      { id: id },
      { $set: propertyData },
      { returnOriginal: false, returnDocument: 'after' } // Return the updated document
    );

    console.log('MongoDB update result:', result);

    // Close the MongoDB connection
    await client.close();

    // Check if property was found
    if (result.matchedCount !== 1) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Respond with updated property data
    res
      .status(200)
      .json({ message: 'Successfully updated an existing property.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a property by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Connect to MongoDB
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    // Access the database and collection for properties
    const db = client.db('PROD');
    const propertiesCollection = db.collection('properties');

    // Delete the property from the collection
    const result = await propertiesCollection.deleteOne({ id: id });

    // Close the MongoDB connection
    await client.close();

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
