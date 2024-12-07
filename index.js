
// import express from "express";
// import http from "http";
// import cors from "cors";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import authRoute from "./Routes/authh.js";
// import userRoute from "./Routes/user.js";
// import doctorRoute from "./Routes/doctor.js";
// import reviewRoute from "./Routes/review.js";
// import bookingRoute from "./Routes/booking.js";
// import { Server } from "socket.io";

// const app = express();
// app.use(cors());

// // Create an HTTP server instance
// const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:5174",
//         methods: ["GET", "POST"],
//     },
// });
// io.on("connection", (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     socket.on("send-message", (message) => {
//         console.log(message);

//         // Broadcast the received message to all connected users
//         io.emit("received-message", message)
//     })

//     socket.on("disconnect", () => console.log("User disconnected"))
// });

// // Define port
// const port = process.env.PORT || 3000;

// // Load environment variables
// dotenv.config();

// // Database connection
// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URL, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('MongoDB database is connected');
//     } catch (err) {
//         console.error('MongoDB database connection failed', err);
//     }
// };

// // Middleware
// app.use(express.json());

// // Define routes
// app.use('/api/v1/Auth', authRoute);
// app.use('/api/v1/users', userRoute);
// app.use('/api/v1/doctors', doctorRoute);
// app.use('/api/v1/reviews', reviewRoute);
// app.use('/api/v1/bookings', bookingRoute);

// // Start the server
// server.listen(port, () => {
//     connectDB();
//     console.log('Server is running on port ' + port);
// });

// export default app;


import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './Routes/authh.js';
import userRoute from './Routes/user.js';
import doctorRoute from './Routes/doctor.js';
import reviewRoute from './Routes/review.js';
import bookingRoute from './Routes/booking.js';
import chatRoute from './Routes/chat.js';
import { handleSocketConnection } from './socketHandler.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_SITE_URL,
    methods: ["GET", "POST"],
  },
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB database is connected'))
.catch((err) => console.error('MongoDB database connection failed', err));

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/doctors', doctorRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/bookings', bookingRoute);
app.use('/api/v1/chat', chatRoute);

handleSocketConnection(io);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('Server is running on port ' + port);
});

export default app;

