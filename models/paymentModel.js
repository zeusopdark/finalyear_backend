
const mongoose = require("mongoose");

const schema = mongoose.Schema({

    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
        required: true
    },
    doctorId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
        required: true
    },
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_signature_id: {
        type: String,
        required: true,
    },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
},
    {
        timestamps: true,
    }
);

const Payment = mongoose.model("Payment", schema);

module.exports = Payment;