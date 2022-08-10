const User = require('../models/usermodel');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { response } = require('express');
const { Mongoose } = require('mongoose');
const e = require('express');
const req = require('express/lib/request');
async function login({ email, password, res }, callback) {

    // console.log("email",email)
    const user = await User.findOne({ email });
    console.log("user", user)

    if (user != null) {
        // synchronously compare user entered password with hashed password
        if (bcrypt.compareSync(password, user.password)) {
            const data = {
                user_id: user._id, email
            }


            const token = auth.generateAccessToken(data);

            // call toJSON method applied during model instantiation
            // let {password , ...rest} = user;
            // // call toJSON method applied during model instantiation
            // return callback(null, { rest, token });

            return callback(null, { ...user.toJSON(), token });
        } else {
            return callback({
                message: "invalid credintial"
            })
        }

    } else {
        return callback({
            message: "invalid username/Password"
        })
    }

}
async function register(req, callback) {
    // console.log('params', params)

    console.log('req', req)
    console.log('callback', callback)

    const email = req.email;
    console.log("email", req.id)

    if (req.email === undefined) {
        return callback({ message: "email required" })
    }
    const person = await User.findOne({ email: email })

    if (person) {
        return callback({
            message: "email already exist"
        })

    } else {
        // instantiate a user modal and save to mongoDB

        const user = new User({
            id: req.id,
            name: req.name,
            phone: req.phone,
            email: req.email,
            password: req.password
        })
        // console.log(user)
        user.save().then((response) => {
            return callback(null, response)

        }).catch((error) => {
            return callback(error);
        });
    }


}





module.exports = {
    login,
    register

};