import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(cors())

const server = http.createServer(app);

const io = new Server(server);

const __filname = fileURLToPath(import.meta.url);

const __dirname = dirname(__filname);

const distPath = path.join(__dirname, "..", "frontend", "dist");

app.use(express.static(distPath));

// React Router ke direct URLs handle karne ke liye
app.use((req, res, next) => {
    if (req.method !== "GET") {
        return next();
    }

    res.sendFile(path.join(distPath, "index.html"));
});


const array = []


io.on("connection", (socket) => {
    console.log("Frontend connected:", socket.id);

    array.push(socket.id)

    socket.emit("backendMessage", "Hello from Backend!");

    socket.on("frontendMessage", (data) => {

        console.log("Frontend says:", data);

        socket.emit("backendReply", "Message received by Backend!");
    });

    io.emit("arrydata",array)

    socket.on("frontenddata", (data) => {

        console.log("data", data.message, data.role);

        if (data.role === "admin") {
            console.log("i am admin")



        } else if (data.role === "user") {
            console.log("i am user")
        }


        io.emit("frontenddata", data);

    })

    socket.on("typetrack",(data)=>{

        socket.broadcast.emit("typetrack",data)

    })

    

    // Connection disconnect hone par
    socket.on("disconnect", () => {
        console.log("Frontend disconnected");
    });
});


server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});