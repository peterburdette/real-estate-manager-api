/**
 * @swagger
 * tags:
 *   - name: AppState
 *     description: API endpoints for app-wide functionalities.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ViewPropertiesToggleState:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the View Properties toggle state.
 *         viewMode:
 *           type: string
 *           description: The view mode for displaying properties, either 'list' or 'grid'.
 *           enum: [list, grid]
 *           example: "list or grid"
 */

/**
 * @swagger
 * /api/viewPropertiesToggleState:
 *   get:
 *     summary: Get the state of the View Properties toggle switch
 *     description: Retrieve the state from the database.
 *     tags: [AppState]
 *     responses:
 *       200:
 *         description: Successful response getting viewPropertiesToggleState state.
 *
 *   post:
 *     summary: Create a new App State
 *     description: Create a new App State and add it to the database.
 *     tags: [AppState]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ViewPropertiesToggleState'
 *     responses:
 *       201:
 *         description: App State created successfully.
 *       400:
 *         description: Bad request. Check your request data.
 *       500:
 *         description: Internal Server Error.
 *
 * /api/viewPropertiesToggleState/{id}:
 *   put:
 *     summary: Update a App State by ID
 *     description: Update App State based on its ID.
 *     tags: [AppState]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the App State to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ViewPropertiesToggleState'
 *     responses:
 *       200:
 *         description: App State updated successfully.
 *       400:
 *         description: Bad request. Check your request data.
 *       404:
 *         description: App State not found.
 *       500:
 *         description: Internal Server Error.
 */

const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const router = express.Router();
const mongoURI = process.env.MONGO_URI;

// Middleware for parsing JSON
router.use(express.json());

router.get('/', async (req, res) => {
  try {
    // Connect to MongoDB
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    // Access the database and collection for appState
    const db = client.db('PROD');
    const appStateCollection = db.collection('appState');

    // Find all App States
    const appStates = await appStateCollection.find({}).toArray();

    // Close the MongoDB connection
    await client.close();

    // Set Content-Type header to application/json
    res.setHeader('Content-Type', 'application/json');
    res.json(appStates);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add new App State
router.post('/', async (req, res) => {
  try {
    const appStateData = req.body;
    console.log('appStateData: ', appStateData);

    // Validate the request data
    if (!appStateData) {
      return res
        .status(400)
        .json({ message: 'Bad request. App State data is required.' });
    }

    // Connect to MongoDB
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    // Access the database and collection for appState
    const db = client.db('PROD');
    const appStateCollection = db.collection('appState');

    // Check if the ID already exists
    const existingAppState = await appStateCollection.findOne({
      id: appStateData.id,
    });
    if (existingAppState) {
      await client.close();
      return res
        .status(400)
        .json({ message: 'AppState with this ID already exists.' });
    }

    // Insert the new App State into the collection
    const result = await appStateCollection.insertOne(appStateData);

    // Close the MongoDB connection
    await client.close();

    // Respond with the inserted App State data
    res.status(201).json({ message: 'Successfully added a App State.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update an App State by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appStateData = req.body;

    console.log('Received update request for ID:', id);
    console.log('Updated App State data:', appStateData);

    // Validate the request data
    if (!appStateData) {
      return res
        .status(400)
        .json({ message: 'Bad request. App State data is required.' });
    }

    // Connect to MongoDB
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    // Access the database and collection for appState
    const db = client.db('PROD');
    const appStateCollection = db.collection('appState');

    // Update the App State in the collection using findOneAndUpdate
    const result = await appStateCollection.updateOne(
      { id: id },
      { $set: appStateData },
      { returnOriginal: false, returnDocument: 'after' } // Return the updated document
    );

    console.log('MongoDB update result:', result);

    // Close the MongoDB connection
    await client.close();

    // Check if App State was found
    if (result.matchedCount !== 1) {
      return res.status(404).json({ message: 'App State not found.' });
    }

    // Respond with updated App State data
    res
      .status(200)
      .json({ message: 'Successfully updated an existing App State.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
