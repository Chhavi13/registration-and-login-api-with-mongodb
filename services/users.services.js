const User = require('../models/users.models');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { response } = require('express');



async function login({ username, password }, callback) {
    const user = await User.findOne({ username });
    if (user != null) {
        // synchronously compare user entered password with hashed password
        if (bcrypt.compareSync(password, user.password)) {
            const token = auth.generateAccessToken(username);

            // call toJSON method applied during model instantiation
            return callback(null, { ...user.toJSON(), token });
        } else {
            return callback({
                message: "invalid username/password"
            })
        }

    }else{
        return callback({
            message:"invalid username/Password"
        })
    }

}
async function register(params,callback) {
    if(params.username ===undefined){
        return callback({message:"username required"})
    }

    // instantiate a user modal and save to mongoDB
    const user = new User(params)
    user.save().then((response)=>{
        return callback(null,response)
    
    }).catch((error)=>{
        return callback(error);
    });
}



module.exports = {
    login,
    register
    
};