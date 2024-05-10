const Appointment = require("../models/appointmentModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const getallappointments = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
        $or: [{ userId: req.query.search }, { doctorId: req.query.search }],
      }
      : {};

    const appointments = await Appointment.find(keyword)
      .populate("doctorId")
      .populate("userId");
    return res.send(appointments);
  } catch (error) {
    res.status(500).send("Unable to get apponintments");
  }
};

const bookappointment = async (req, res) => {
  try {
    const appointment = await Appointment({
      date: req.body.date,
      time: req.body.time,
      doctorId: req.body.doctorId,
      userId: req.locals,
    });

    const usernotification = Notification({
      userId: req.locals,
      content: `You booked an appointment with Dr. ${req.body.doctorname} for ${req.body.date} ${req.body.time}`,
    });

    await usernotification.save();

    const user = await User.findById(req.locals);

    const doctornotification = Notification({
      userId: req.body.doctorId,
      content: `You have an appointment with ${user.firstname} ${user.lastname} on ${req.body.date} at ${req.body.time}`,
    });

    await doctornotification.save();

    const result = await appointment.save();
    return res.status(201).json({ message: "Redirecting to Payment Gateway", success: true, result });
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Unable to book appointment");
  }
};

const completed = async (req, res) => {
  console.log("You hit me");
  try {
    const alreadyCompleted = await Appointment.findById(req.body.appointid);

    if (alreadyCompleted.status === "Completed") {
      return res.status(200).json({ success: true, message: "Already completed" })
    }

    const impData = await Appointment.findById(req.body.appointid);
    const user = await User.findById(req.locals);
    const usernotification = new Notification({
      userId: impData.userId,
      content: `Your appointment with ${user.firstname}${user.lastname} has been completed`,
    });

    await usernotification.save();

    const doctornotification = new Notification({
      userId: req.body.doctorId,
      content: `Your appointment with ${req.body.doctorname} has been completed`,
    });

    await doctornotification.save();
    alreadyCompleted.status = "Completed"
    await alreadyCompleted.save();

    return res.status(201).send("Appointment completed");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Unable to complete appointment");
  }
};

const generateMeetingId = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.body.appointid);

    if (appointment.meetingId) {
      return res.status(200).json({ meetingId: appointment.meetingId });
    }

    const timestamp = Date.now();

    const meetingId = `${req.body.appointid}_${timestamp}`;
    appointment.meetingId = meetingId;

    await appointment.save();
    const userIds = appointment.doctorId;
    const doc = await User.findById(userIds);


    const usernotification = new Notification({
      userId: appointment.userId,
      content: `Dr. ${doc.firstname} ${doc.lastname} has joined the meeting. Meeting ID: ${meetingId}`,
    });

    await usernotification.save();

    return res.status(200).json({ meetingId });
  } catch (error) {

    console.error("Error generating meeting ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const checkMeetingId = async (req, res) => {

  const id = req.body.meetingId;
  const appointmentId = id.split("_")[0]; // Extract the appointment ID from the meeting ID

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "No meetingId Present" });
    }

    // Check if the appointment's _id matches the extracted appointment ID
    if (appointment._id.toString() === appointmentId) {
      return res.status(200).json({ success: true, message: "Successful" });
    } else {
      return res.status(404).json({ success: false, message: "Invalid meetingId" });
    }
  } catch (error) {
    console.error("Error checking meeting ID:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


module.exports = {
  getallappointments,
  bookappointment,
  completed,
  generateMeetingId,
  checkMeetingId
};
