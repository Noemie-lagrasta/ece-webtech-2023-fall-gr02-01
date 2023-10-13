// Import the Express.js framework
const express = require('express');
const index = express(); // Create an instance of the Express application
const port = 3000; // Define the port number to listen on
//const db = require('./database'); // Import your database module defined in 'database.js'

index.use(express.json()); // Ajoutez cette ligne pour analyser les demandes JSON

// Import your router module defined in 'handles.js'
const handlesRouter = require('./handles');

// Use the 'handlesRouter' for handling routes at the root '/'
index.use('/', handlesRouter);

// Start the server and listen on the specified port
index.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Log a message when the server starts
});