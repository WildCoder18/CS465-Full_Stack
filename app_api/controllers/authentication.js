const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user');
// REGISTER a new user
const register = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);

    await user.save(); // ✅ Mongoose 7+ compatible

    const token = user.generateJWT();
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json(err);
  }
};

// LOGIN an existing user
const login = (req, res) => {

  console.log("LOGIN CONTROLLER CALLED");
  console.log("Email:", req.body.email);
  console.log("Password:", req.body.password);

  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  passport.authenticate('local', (err, user, info) => {

    console.log("Passport callback executed");
    console.log("User found:", user);

    if (err) {
      return res.status(404).json(err);
    }

    if (user) {
      const token = user.generateJWT();
      return res.status(200).json({ token });
    } else {
      return res.status(401).json(info || { message: "Login failed" });
    }

  })(req, res);
};

// Export methods that drive endpoints
module.exports = {
  register,
  login
};