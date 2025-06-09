import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { UserService } from '../services/userService';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const db = drizzle(pool);
const userService = new UserService(db);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userService.findById(id);
    done(null, user || false);
  } catch (err) {
    done(err, false);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await userService.findByGoogleId(profile.id);
    if (existingUser) {
      return done(null, existingUser);
    }
    // Create new user with Google profile info
    const newUser = await userService.createUserWithGoogle({
      google_id: profile.id,
      google_email: profile.emails?.[0].value || '',
      google_display_name: profile.displayName,
      google_photo_url: profile.photos?.[0].value || '',
      email: profile.emails?.[0].value || '',
      first_name: profile.name?.givenName || '',
      last_name: profile.name?.familyName || '',
    });
    done(null, newUser);
  } catch (error) {
    done(error, false);
  }
}));

export default passport;
