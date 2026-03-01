const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Load the User model (important so schema + methods are registered)
const User = require('../models/user');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // login uses email instead of username
    },
    async (email, password, done) => {
      try {
        console.log("LOGIN ATTEMPT");
        console.log("Searching for email:", email.trim());

        // Find user in database
        const user = await User.findOne({ email: email.trim() });

        console.log("User from DB:", user);

        // ✅ If user not found
        if (!user) {
          console.log("User not found");
          return done(null, false, {
            message: 'Incorrect email or password.'
          });
        }

        // ✅ If password does NOT match
        const isValid = user.validPassword(password);

        console.log("Password valid?", isValid);

        if (!isValid) {
          console.log("Password invalid");
          return done(null, false, {
            message: 'Incorrect email or password.'
          });
        }

        // ✅ SUCCESS
        console.log("Authentication successful");
        return done(null, user);

      } catch (err) {
        console.error("Passport Error:", err);
        return done(err);
      }
    }
  )
);

module.exports = passport;