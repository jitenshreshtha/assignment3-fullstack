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
  cardetails: {
    make: { type: String, required: true, default: "" },
    model: { type: String, required: true, default: "" },
    year: { type: Number, required: true, default: 0 },
    plate: { type: String, required: true, default: "" },
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
