const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  license: { type: String, required: true },
  age: { type: Number, required: true },
  dob: { type: Date, required: true, default: Date.now },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  usertype: {
    type: String,
    enum: ["Driver", "Examiner", "Admin"],
    default: "Driver",
  },
  testtype: {
    type: String,
    enum: ["G", "G2"],
    default: null
  },
  status: { type: String, default: "pending" },
  comment: { type: String, default: "" },
  isPassed: { type: Boolean, default: false },
  cardetails: {
    make: { type: String, required: true, default: "" },
    model: { type: String, required: true, default: "" },
    year: { type: Number, required: true, default: 0 },
    plate: { type: String, required: true, default: "" },
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },
});

// Check if the model already exists before creating it
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
