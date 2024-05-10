require("dotenv").config();
const mongoose = require('mongoose');
const express = require("express");
const cors = require("cors");
const morgan = require("morgan")
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const userRouter = require("./routes/userRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const appointRouter = require("./routes/appointRoutes");
const paymentRoute = require("./routes/paymentRoutes");
const notificationRouter = require("./routes/notificationRouter");
const corsOptions = {
    origin: true,
    credentials: true,
};



// client();
app.use(cors(corsOptions));
app.use(morgan("tiny"));
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointment", appointRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/payment", paymentRoute);



mongoose.connect("mongodb+srv://ankit:zeusdark@cluster0.qbv9zzo.mongodb.net/FinalYear?retryWrites=true&w=majority");
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))

});
mongoose.connection.on('error', err => {
    console.log(err);
});
