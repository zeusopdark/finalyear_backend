const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    payment: {
      type: String,
      default: "Unsuccessful"
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
    meetingId: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", schema);

module.exports = Appointment;
