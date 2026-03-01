const express = require('express');
console.log("API ROUTES LOADED");
const router = express.Router();
const jwt = require('jsonwebtoken');

const authCtrl = require('../controllers/authentication');
const tripsController = require('../controllers/trips');

// Method to authenticate our JWT
function authenticateJWT(req, res, next) {

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.sendStatus(401);
    }

    const headers = authHeader.split(' ');
    if (headers.length < 2) {
        console.log('Invalid Auth Header format');
        return res.sendStatus(401);
    }

    const token = headers[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) {
            console.log('Token validation error');
            return res.sendStatus(401);
        }

        req.auth = verified;
        next();
    });
}

// REGISTER
router.post('/register', authCtrl.register);

// LOGIN
router.post('/login', (req, res, next) => {
  console.log("LOGIN ROUTE HIT");
  next();
}, authCtrl.login);

// GET all trips + POST new trip
router
  .route('/trips')
  .get(tripsController.tripsList)
  .post(authenticateJWT, tripsController.addTrip);   // 🔐 PROTECTED

// GET single trip + UPDATE
router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(authenticateJWT, tripsController.tripsUpdateTrip);  // 🔐 PROTECTED

module.exports = router;