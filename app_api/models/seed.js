// Bring in the DB connection and the Trip schema
const Mongoose = require('./db');
const Trip = require('./travlr');
const fs = require('fs');
const path = require('path');

// Load seed data from trips.json
const tripsPath = path.join(__dirname, '../../data/trips.json');
const trips = JSON.parse(fs.readFileSync(tripsPath, 'utf8'));
console.log("Number of trips loaded:", trips.length);

// Seed the database inside an async function
const seedDB = async () => {
    try {
        // Delete existing trips
        await Trip.deleteMany({});
        console.log("Existing trips deleted.");

        // Insert seed trips
        await Trip.insertMany(trips);
        console.log("Trips inserted successfully!");
    } catch (err) {
        console.error("Error seeding the database:", err);
    } finally {
        // Close the DB connection
        await Mongoose.connection.close();
        console.log("Database connection closed.");
        process.exit(0);
    }
};

// Run the seeding function
seedDB();