const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// Adjust path as needed
const Users = require("../models/user.model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Users.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/user/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Users.findOne({ email: profile.emails[0].value });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        user = await Users.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profileUrl: profile.photos[0].value,

          password: Math.random().toString(36).slice(-8), 
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    },
  ),
);
