import mongoose from "mongoose";

const msgSchema = new mongoose.Schema({
    sendroles: {
        type: String,
        required: true
    },
    recivrole: {
        type: String,
        required: true
    },
    messages: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["sent", "delivered", "read"],
        default: "sent"
    }
})


const Msgmodel = mongoose.model("Msgmodel", msgSchema, "MessageDB")

export default Msgmodel;