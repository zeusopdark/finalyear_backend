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
    return res.status(201).send(result);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Unable to book appointment");
  }
};

const completed = async (req, res) => {
  try {

    const alreadyFound = await Appointment.findOneAndUpdate(
      { _id: req.body.appointid },
      { status: "Completed" }
    );

    if (alreadyFound) {
      return res.status(200).json({ success: true, message: "Already completed" })
    }
    // Find the notification based on userId
    const impData = await Appointment.findById(req.body.appointid);


    // Create notification for user
    const user = await User.findById(req.locals);
    const usernotification = new Notification({
      userId: impData.userId,
      content: `Your appointment with ${user.firstname}${user.lastname} has been completed`,
    });

    await usernotification.save();

    // Find the user based on req.locals (assuming it's the user id)

    // Create notification for doctor
    const doctornotification = new Notification({
      userId: req.body.doctorId,
      content: `Your appointment with ${req.body.doctorname} has been completed`,
    });

    await doctornotification.save();

    return res.status(201).send("Appointment completed");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Unable to complete appointment");
  }
};

const generateMeetingId = async (req, res) => {
  const userId = req.locals;

  const timestamp = Date.now();

  // Combine doctor's ID and timestamp to generate a unique meeting ID
  const meetingId = `${userId}_${timestamp}`;

  // You can return the meeting ID in the response or use it further as needed
  return res.status(200).json({ meetingId });

}

module.exports = {
  getallappointments,
  bookappointment,
  completed,
  generateMeetingId
};
