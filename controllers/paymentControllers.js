const Razorpay = require("razorpay");
const crypto = require("crypto");
const Appointment = require("../models/appointmentModel.js");
const Payment = require("../models/paymentModel.js");
const getKey = async (req, res, next) => {
    try {
        res.status(200).json({ message: "Successfull", success: true, key: process.env.ID });
    } catch (err) {
        res.status(404).json({ message: "No key found", success: false });
    }
}

const checkout = async (req, res, next) => {
    const instance = new Razorpay({
        key_id: process.env.ID,
        key_secret: process.env.KEY_SECRET
    });

    try {
        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR"
        };
        const order = await instance.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}

// const paymentVerification = async (req, res, next) => {
//     const { appointmentId } = req.query;
//     try {

//         const { razorpay_order_id, razorpay_signature, razorpay_payment_id } = req.body;

//         const body = razorpay_order_id + "|" + razorpay_payment_id;
//         const expectedSignature = crypto.createHmac('sha256', process.env.KEY_SECRET)
//             .update(body)
//             .digest('hex');

//         const isAuthentic = expectedSignature === razorpay_signature;
//         console.log(isAuthentic);
//         if (isAuthentic) {
//             const { doctorId, userId } = req.query;

//             await Payment.create({
//                 userId,
//                 doctorId,
//                 razorpay_order_id,
//                 razorpay_payment_id,
//                 razorpay_signature_id: razorpay_signature,
//                 status: 'completed'
//             })
//             try {
//                 const appointment = await Appointment.findById(appointmentId);
//                 await appointment.findByIdAndUpdate(appointmentId, { payment: "Successful" }, { new: true });

//             } catch (err) {
//                 res.status(400).json({ message: "Appointment Unsuccessful", success: false, err })
//             }

//             res.redirect("http://localhost:3000/doctors")

//         } else {
//             if (appointmentId) {
//                 await Appointment.deleteOne({ _id: appointmentId });
//             }
//             res.status(400).json({ success: false, error: "Invalid Signature" });

//         }
//     } catch (err) {
//         if (appointmentId) {
//             await Appointment.deleteOne({ _id: appointmentId });
//         }
//         res.status(500).json({ message: "Internal server error", success: false })
//     }
// }
const paymentVerification = async (req, res, next) => {
    const { appointmentId } = req.query;
    try {
        const { razorpay_order_id, razorpay_signature, razorpay_payment_id } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac('sha256', process.env.KEY_SECRET)
            .update(body)
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;
        console.log(isAuthentic);
        if (isAuthentic) {
            const { doctorId, userId } = req.query;

            await Payment.create({
                userId,
                doctorId,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature_id: razorpay_signature,
                status: 'completed'
            });

            // Update appointment status
            await Appointment.findByIdAndUpdate(appointmentId, { payment: "Successful" }, { new: true });

            res.redirect("https://final-year-frontend.onrender.com")

        } else {
            // Invalid signature, delete appointment and send error response
            if (appointmentId) {
                await Appointment.deleteOne({ _id: appointmentId });
            }
            res.status(400).json({ success: false, error: "Invalid Signature" });
        }
    } catch (err) {
        // Internal server error, delete appointment and send error response
        if (appointmentId) {
            await Appointment.deleteOne({ _id: appointmentId });
        }
        console.error(err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}


module.exports = { getKey, checkout, paymentVerification };
