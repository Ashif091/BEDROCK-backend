import express, {Application} from "express"
import {connectToDatabase} from "./database/connection-config"
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from "cors";
import dotenv from "dotenv"
import session from "express-session";
import './config/passport';
import authRouter from "./presentation/routes/authRoutes"
import workspaceRoutes from "./presentation/routes/workspaceRoutes"
import documentRoutes from "./presentation/routes/documentRoutes"
import {errorHandler} from "./presentation/middleware/errorHandler"
dotenv.config()

const app: Application = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(
  session({
    secret: "your_session_secret",
    resave: false,
    saveUninitialized: false,
  })
);

const port = process.env.PORT
connectToDatabase()
  .then(() => {
    app.use(passport.initialize());
    app.use("/auth", authRouter)
    app.use("/workspace",workspaceRoutes)
    app.use("/doc",documentRoutes)
    app.use(errorHandler)
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
      console.log(`client is running on port ${process.env.CLIENT_URL}`)
    })
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error)
  })
