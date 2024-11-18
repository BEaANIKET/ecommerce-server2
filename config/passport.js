import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../model/user.model.js";
import { generateToken } from "../utils/createToken.js";
import dotenv from "dotenv";


dotenv.config();

const passPort = passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user in the database
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
            });
          } else {
            user.googleId = profile.id
          }
        }

        const token = await generateToken({ email: user.email })
        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passPort;