import express, {Application} from "express"
import {connectToDatabase} from "./database/connection-config"
import cookieParser from "cookie-parser"
import passport from "passport"
import cors from "cors"
import dotenv from "dotenv"
import session from "express-session"
import "./config/passport"
import authRouter from "./presentation/routes/authRoutes"
import workspaceRoutes from "./presentation/routes/workspaceRoutes"
import documentRoutes from "./presentation/routes/documentRoutes"
import {errorHandler} from "./presentation/middleware/errorHandler"
import {createServer} from "http" // Import HTTP to create the server
import {Server} from "socket.io" // Import Socket.io

dotenv.config()

const app: Application = express()

const server = createServer(app)

interface User {
  name: string
  profile: string
  socketId: string
}

interface Room {
  [userId: string]: User
}

interface Rooms {
  [workspaceId: string]: Room
}

const rooms: Rooms = {}
// Create a new Socket.io instance
const io = new Server(server, {
  cors: {
    origin: `${process.env.CLIENT_URL}`,
    methods: ["GET", "POST"],
  },
})

app.use(express.json())
app.use(cookieParser())
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

const port = process.env.PORT
connectToDatabase()
  .then(() => {
    app.use(passport.initialize())
    app.use((req, res, next) => {
      req.io = io
      next()
    })

    app.use("/auth", authRouter)
    app.use("/workspace", workspaceRoutes)
    app.use("/doc", documentRoutes)
    app.use(errorHandler)
    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`)
      //rtc cummunication

      socket.on("join-room", (workspaceId: string, userData: User) => {
        if (!rooms[workspaceId]) {
          rooms[workspaceId] = {}
        }

        userData.socketId = socket.id
        rooms[workspaceId][userData.socketId] = userData
        
        socket.join(workspaceId)
        // console.log("🚀 ~ socket.on ~ rooms:", rooms)

        console.log(`${userData.name} joined room ${workspaceId}`)

        // Notify other users in the room
        console.log("🚀 ~ socket.on ~ userData:", userData)

        socket.to(workspaceId).emit("user-joined", userData)

        // Send the list of users in the room to the newly joined user
        socket.emit("room-users", Object.values(rooms[workspaceId]))
      })

      socket.on("leave-room", (workspaceId: string) => {
        if (rooms[workspaceId] && rooms[workspaceId][socket.id]) {
          const userData = rooms[workspaceId][socket.id]
          delete rooms[workspaceId][socket.id]
          socket.leave(workspaceId)
          console.log(`${userData.name} left room ${workspaceId}`)

          // Notify other users in the room
          socket.to(workspaceId).emit("user-left", userData)
        }
      })
      // WebRTC signaling
      socket.on("offer", (offer, workspaceId: string, toSocketId: string) => {
        console.log("🚀 ~ socket.on ~ offer:", offer)
        
        socket.to(toSocketId).emit("offer", offer, socket.id)
      })

      socket.on("answer", (answer, workspaceId: string, toSocketId: string) => {

        socket.to(toSocketId).emit("answer", answer, socket.id)
      })

      socket.on(
        "ice-candidate",
        (candidate, workspaceId: string, toSocketId: string) => {
          console.log(toSocketId,":🚀 ~ io.on ~ candidate of id ",socket.id,":", candidate)
          socket.to(toSocketId).emit("ice-candidate", candidate, socket.id)
        }
      )

      socket.on("media-state-change", ({ type, enabled, roomId }) => {
        // Broadcast the state change to all other users in the room
        console.log(roomId,":⏳data media state update",enabled);
        
        socket.to(roomId).emit("media-state-changed", {
          userId: socket.id,
          type,
          enabled
        });
      });

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`)
        for (const workspaceId in rooms) {
          if (rooms[workspaceId][socket.id]) {
            const userData = rooms[workspaceId][socket.id]
            delete rooms[workspaceId][socket.id]
            socket.to(workspaceId).emit("user-left", userData)
          }
        }
      })
      // Handle user joining a room based on their email or user ID
      socket.on("notify", (userEmail) => {
        socket.join(userEmail)
        console.log(`${userEmail} joined their notification room`)
      })
      socket.on("updateDoc", (WorkspaceId) => {
        console.log(`doc added by :${socket.id}`)
        socket.join(WorkspaceId)
        console.log(`${WorkspaceId} doc room`)
      })

    })

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`)
      console.log(`client is running on port ${process.env.CLIENT_URL}`)
    })
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error)
  })
