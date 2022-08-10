const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({


    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        maxlength: 10
    },

    post: {
        type: mongoose.Schema.ObjectId,
        ref:"Post"

    },
    resetToken:{
        type: String
    },
    expiryToken:{
        type: Date
    },

}, {
    timestamps: true
});

// UserSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//         returnedObject.id = returnedObject._id.toString()
//         delete returnedObject._id
//         delete returnedObject.__v
//         //do not reveal passwordHash
//         delete returnedObject.password
//     },
// })
// UserSchema.plugin(uniqueValidator, { message: "the email already in use" })

const User = mongoose.model("user", UserSchema);

module.exports = User;