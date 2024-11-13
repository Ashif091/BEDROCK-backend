import passport from "passport"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2"
import {UserRepository} from "../database/repository/UserRepository"
import {User} from "../database/models/User" // may be error happen ({user})
// import dotenv from "dotenv"
// dotenv.config()
  
const {createOrUpdateGoogleUser, createOrUpdateGithubUser} =
  new UserRepository()
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await createOrUpdateGoogleUser(profile)
        done(null, user)
      } catch (error) {
        done(error, false)
      }
    }
  )
)

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.S_GITHUB_CLIENT_ID!,
      clientSecret: process.env.S_GITHUB_CLIENT_SECRET!,
      callbackURL: `${process.env.SERVER_URL}/auth/github/callback`,
      scope: ['user:email'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: (error: any, user?: any) => void
    ) => {
      try {
        const user = await createOrUpdateGithubUser(profile)
        console.log("final code is run ",user);
        
        done(null, user)
      } catch (error) {
        done(error, false)
      }
    }
  )
)

passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  done(null, user)
})
