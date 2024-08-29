import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserRepository } from '../database/repository/UserRepository';
import { User } from '../database/models/User';  // may be error happen ({user})
const {createOrUpdateGoogleUser} = new UserRepository()
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3001/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await createOrUpdateGoogleUser(profile);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
