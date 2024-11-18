import { Server } from "socket.io";

interface User {
  name: string;
  profile: string;
  socketId: string;
}

interface Room {
  [userId: string]: User;
}

interface Rooms {
  [workspaceId: string]: Room;
}

const rooms: Rooms = {};

export const setupSocketIO = (io: Server) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-room", (workspaceId: string, userData: User) => {
      if (!rooms[workspaceId]) {
        rooms[workspaceId] = {};
      }

      userData.socketId = socket.id;
      rooms[workspaceId][userData.socketId] = userData;

      socket.join(workspaceId);
      console.log(`${userData.name} joined room ${workspaceId}`);

      // Notify other users in the room
      socket.to(workspaceId).emit("user-joined", userData);

      // Send the list of users in the room to the newly joined user
      socket.emit("room-users", Object.values(rooms[workspaceId]));
    });

    socket.on("leave-room", (workspaceId: string) => {
      if (rooms[workspaceId] && rooms[workspaceId][socket.id]) {
        const userData = rooms[workspaceId][socket.id];
        delete rooms[workspaceId][socket.id];
        socket.leave(workspaceId);
        console.log(`${userData.name} left room ${workspaceId}`);

        // Notify other users in the room
        socket.to(workspaceId).emit("user-left", userData);
      }
    });

    // WebRTC signaling
    socket.on("offer", (offer, workspaceId: string, toSocketId: string) => {
      socket.to(toSocketId).emit("offer", offer, socket.id);
    });

    socket.on("answer", (answer, workspaceId: string, toSocketId: string) => {
      socket.to(toSocketId).emit("answer", answer, socket.id);
    });

    socket.on("ice-candidate", (candidate, workspaceId: string, toSocketId: string) => {
      socket.to(toSocketId).emit("ice-candidate", candidate, socket.id);
    });

    socket.on("media-state-change", ({ type, enabled, roomId }) => {
      socket.to(roomId).emit("media-state-changed", {
        userId: socket.id,
        type,
        enabled,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      for (const workspaceId in rooms) {
        if (rooms[workspaceId][socket.id]) {
          const userData = rooms[workspaceId][socket.id];
          delete rooms[workspaceId][socket.id];
          socket.to(workspaceId).emit("user-left", userData);
        }
      }
    });

    socket.on("notify", (userEmail) => {
      socket.join(userEmail);
      console.log(`${userEmail} joined their notification room`);
    });

    socket.on("updateDoc", (WorkspaceId) => {
      console.log(`doc added by :${socket.id}`);
      socket.join(WorkspaceId);
      console.log(`${WorkspaceId} doc room`);
    });
  });
};
