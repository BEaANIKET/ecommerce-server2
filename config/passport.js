import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../model/user.model.js";
import { generateToken2 } from "../utils/createToken.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Attempt to find a user with the provided Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If not found, attempt to find a user by email
          const email = profile.emails?.[0]?.value;
          if (!email) {
            throw new Error("Google account does not provide an email address.");
          }

          user = await User.findOne({ email });

          // If no user exists with the email, create a new user
          if (!user) {
            user = await User.create({
              googleId: profile.id,
              email,
              firstName: profile.name?.givenName || profile.displayName?.split(" ")[0] || "Unknown",
              lastName: profile.name?.familyName || profile.displayName?.split(" ")[1] || "",
            });
          } else {
            // Update the user's Google ID if the email matches an existing account
            user.googleId = profile.id;
            await user.save();
          }
        }

        // Generate a token for the user
        const token = await generateToken2({ email: user.email });

        return done(null, { user, token });
      } catch (error) {
        console.error("Error in Google OAuth strategy:", error.message);
        return done(error, null);
      }
    }
  )
);

export default passport;
