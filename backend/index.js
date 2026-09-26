import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config()
import { connectdb } from "./config/db.js";
import Msgmodel from "./models/messages.js";
import Users from "./models/usercollection.js";

connectdb()

const app = express();

app.use(cors())

app.use(express.json())

const __filname = fileURLToPath(import.meta.url);

const __dirname = dirname(__filname);

const distPath = path.join(__dirname, "..", "frontend", "dist");

app.use(express.static(distPath));

app.use((req, res, next) => {
    if (req.method !== "GET") return next();

    res.sendFile(path.join(distPath, "index.html"));
});


const server = http.createServer(app);

const io = new Server(server);

const array = []

const UserRole = []

io.on("connection", async (socket) => {
    console.log("Frontend connected:", socket.id);

    const messagecon = await Msgmodel.find({}, { messages: 1, sendroles: 1, recivrole: 1, _id: 0 });

    array.push(socket.id)

    socket.emit("backendMessage", messagecon);

    socket.on("frontendMessage", (data) => {

        console.log("Frontend says:", data.msg);

        UserRole.push({ socketID: socket.id, role: data.role })

        socket.emit("backendReply", "Message received by Backend!");
    });

    io.emit("arrydata", array)

    socket.on("frontenddata", async (data) => {

        if (data.messages === "")
            return;

        console.log("data", data.messages, data.role);

        const senderId = socket.id;

        const sendroles = data.role;

        const reciveR = UserRole.find(item => item.role !== data.role)

        const reciverrole = reciveR?.role

        savemesg(data.messages, sendroles, reciverrole)

        async function savemesg(message, srole, rrole) {

            await Msgmodel.create({
                sendroles: srole,
                recivrole: rrole,
                messages: message

            })
        }

        const prevcurr = { messagedata: messagecon, messages: data.messages, sendroles: sendroles, recivrole: reciverrole }


        io.emit("frontenddata", prevcurr);

        console.log(prevcurr)

    })

    socket.on("typetrack", (data) => {

        socket.broadcast.emit("typetrack", data)

    })


    socket.on("disconnect", () => {
        console.log("Frontend disconnected");
    });
});


server.listen(process.env.PORT, () => {
    console.log("Server running at http://localhost:3000");
});