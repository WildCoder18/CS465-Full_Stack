// app_api/controllers/trips.js
const Trip = require('../models/travlr'); // use your Trip model

// GET all trips
exports.tripsList = async (req, res) => {
  try {
    const trips = await Trip.find({});
    res.json(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// GET a single trip by code
exports.tripsFindByCode = async (req, res) => {
  try {
    const trip = await Trip.findOne({ code: req.params.tripCode });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// POST a new trip
exports.addTrip = async (req, res) => {
  try {
    const newTrip = new Trip(req.body);
    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving trip', error: err });
  }
};

// PUT: Update an existing trip by tripCode
exports.tripsUpdateTrip = async (req, res) => {
  try {
    console.log('Params:', req.params);
    console.log('Body:', req.body);

    const updatedTrip = await Trip.findOneAndUpdate(
      { code: req.params.tripCode }, // find trip by code
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      { new: true } // return the updated document
    ).exec();

    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found for update' });
    }

    res.status(200).json(updatedTrip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating trip', error: err });
  }
};