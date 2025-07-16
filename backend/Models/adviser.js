const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
    slotName: String,
    status: {
        type: String,
        enum: ["open", "reserved", "unavailable"],
        default: "unavailable"
    },
    reservedBy: {
        reg1: { type: String, default: null },
        reg2: { type: String, default: null }
    }
});

const adviserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    slots: [slotSchema]
});

module.exports = mongoose.model("Adviser", adviserSchema);