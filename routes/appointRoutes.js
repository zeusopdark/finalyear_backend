const express = require("express");
const auth = require("../middleware/auth");
const appointmentController = require("../controllers/appointmentController");

const appointRouter = express.Router();

appointRouter.get(
  "/getallappointments",
  auth,
  appointmentController.getallappointments
);

appointRouter.post(
  "/bookappointment",
  auth,
  appointmentController.bookappointment
);
appointRouter.get(
  "/generateMeetingId",
  auth,
  appointmentController.generateMeetingId
)

appointRouter.put("/completed", auth, appointmentController.completed);

module.exports = appointRouter;
