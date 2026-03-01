const tripsEndpoint = 'http://localhost:3000/api/trips';

const options = {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

/* GET Travel page */
const travel = async (req, res) => {
  try {
    const response = await fetch(tripsEndpoint, options);
    const trips = await response.json();

    // --- Error condition #1: response is not an array ---
    if (!Array.isArray(trips)) {
      return res.status(500).render('travel', {
        title: 'Travlr Getaways',
        trips: [],
        message: 'Unexpected response format from Trips API.'
      });
    }

    // --- Error condition #2: array exists but has no data ---
    if (trips.length === 0) {
      return res.status(200).render('travel', {
        title: 'Travlr Getaways',
        trips: [],
        message: 'No trips are currently available.'
      });
    }

    // --- Normal successful case ---
    res.render('travel', {
      title: 'Travlr Getaways',
      trips: trips
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

module.exports = {
  travel
};