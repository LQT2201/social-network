const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/user.model");

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create a new user if not found
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            password: "google",
          });
          await user.save();
        }

        // Pass the user object to Passport
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

module.exports = passport;
