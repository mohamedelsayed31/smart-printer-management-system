const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "employee" }
}, { 
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
});

// الجسر لجدول الـ employee
userSchema.virtual('employeeProfile', {
  ref: 'employee',      // اسم موديل الموظف
  localField: '_id',    // الـ ID بتاع اليوزر
  foreignField: 'userId', // الحقل المربوط به في جدول الموظف
  justOne: true
});

module.exports = mongoose.model("user", userSchema);