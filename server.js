require("dotenv").config();
const mongoose=require('mongoose');
const express = require("express");
const cors = require("cors");
require("dotenv").config();
// require("../HealthBooker/db/conn");
const userRouter = require("./routes/userRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const appointRouter = require("./routes/appointRoutes");

const notificationRouter = require("./routes/notificationRouter");

const app = express();
console.log(process.env.MONGO_URL);
// client();
app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointment", appointRouter);
app.use("/api/notification", notificationRouter);

mongoose.connect("mongodb+srv://ankit:zeusdark@cluster0.qbv9zzo.mongodb.net/FinalYear?retryWrites=true&w=majority");
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
  
});
mongoose.connection.on('error', err => {
    console.log(err);
});
