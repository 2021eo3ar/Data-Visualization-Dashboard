const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/BlackCoffer', {
  
});

// Create a mongoose model without a specific schema
const DynamicModel = mongoose.model('DynamicModel', new mongoose.Schema({}, { strict: false }));

// Read data from the JSON file
const jsonFilePath = path.join(__dirname, '../backend/jsondata.json');
const jsonData = require(jsonFilePath);

// Function to insert data in batches with retry logic
async function insertDataWithRetry() {
  const batchSize = 100;
  let retries = 5;

  while (retries > 0) {
    try {
      for (let i = 0; i < jsonData.length; i += batchSize) {
        const batch = jsonData.slice(i, i + batchSize);
        await DynamicModel.insertMany(batch, { maxTimeMS: 600000, ordered: false }); // 60 seconds timeout per batch
      }
      console.log('Data inserted successfully!');
      return;
    } catch (error) {
      console.error('Error inserting data:', error);
      retries--;
      console.log(`Retrying... ${retries} retries left.`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds delay between retries
    }
  }

  console.error('Failed to insert data after retries.');
}

// Call the function with retry logic
insertDataWithRetry();

// API endpoint to import data into MongoDB using mongoimport
app.get('/api/import', (req, res) => {
  const dbName = 'BlackcCofferDB';
  const collectionName = 'your_collection'; // Replace with your desired collection name

  // Build the mongoimport command
  const mongoImportCommand = `mongoimport --db ${dbName} --collection ${collectionName} --file ${jsonFilePath} --jsonArray`;

  // Execute the mongoimport command
  exec(mongoImportCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Error importing data:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('Data imported successfully!');
    res.json({ message: 'Data imported successfully!' });
  });
});

// API endpoint to get data
app.get('/api/data', async (req, res) => {
  try {
    // Fetch all data from the collection
    const data = await DynamicModel.find();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
