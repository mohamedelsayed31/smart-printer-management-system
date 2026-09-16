const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employee", 
        required: true
    },
    date: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
    workingHours: { type: Number, default: 0 },
    status: { type: String, default: "Present" },
    
    // 🔥 الحقل السحري الجديد اللي هيشيل إحداثيات البصمة مجاناً
    location: {
        lat: { type: Number },
        lng: { type: Number }
    }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);