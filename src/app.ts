import express, {Application} from "express"
import {connectToDatabase} from "./database/connection-config"
import cookieParser from "cookie-parser"
import passport from "passport"
import cors from "cors"
import dotenv from "dotenv"
import session from "express-session"
import "./config/passport"
import authRouter from "./presentation/routes/authRoutes"
import paymentRoutes from "./presentation/routes/paymentRoutes"
import workspaceRoutes from "./presentation/routes/workspaceRoutes"
import adminRoutes from "./presentation/routes/adminRoutes"
import documentRoutes from "./presentation/routes/documentRoutes"
import {errorHandler} from "./presentation/middleware/errorHandler"
import {createServer} from "http" 
import {Server} from "socket.io"
import { setupSocketIO } from "./socket";

dotenv.config()

const app: Application = express()
const server = createServer(app)

app.use(cookieParser())
app.use(express.json())

app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
)
app.use(
  session({
    secret: "your_session_secret",
    resave: false,
    saveUninitialized: false,
  })
)

const port = process.env.PORT || 5000
connectToDatabase()
  .then(() => {
    app.use(passport.initialize())

    const io = new Server(server, {
      cors: {
        origin: `${process.env.CLIENT_URL}`,
        credentials: true,
        exposedHeaders: ["set-cookie"],
      },
    })
    app.use((req, res, next) => {
      req.io = io
      next()
    })

    setupSocketIO(io);

    app.use("/auth", authRouter)
    app.use("/workspace", workspaceRoutes)
    app.use("/doc", documentRoutes)
    app.use("/admin", adminRoutes)
    app.use("/payment", paymentRoutes)
    app.use(errorHandler)


    server.listen(port, () => {
      console.log(`Server is running on port ${port}`)
      console.log(`client is running on port ${process.env.CLIENT_URL}`)
    })
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error)
  })
