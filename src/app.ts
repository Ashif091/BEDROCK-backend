import express, {Application} from "express"
import authRouter from "./presentation/routes/authRoutes"
import workspaceRoutes from "./presentation/routes/workspaceRoutes"
import {connectToDatabase} from "./database/connection-config"
import cookieParser from 'cookie-parser';
import session from "express-session";
import {errorHandler} from "./presentation/middleware/errorHandler"
import cors from "cors";
import dotenv from "dotenv"
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
    app.use("/auth", authRouter)
    app.use("/workspace",workspaceRoutes)
    app.use(errorHandler)
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
      console.log(`client is running on port ${process.env.CLIENT_URL}`)
    })
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error)
  })
