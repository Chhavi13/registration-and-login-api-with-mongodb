const express = require('express');
const crypto = require("crypto");
const bcrypt = require('bcryptjs')
const userServices = require('../services/users.services');
const User = require('../models/usermodel')
const auth = require('../middleware/auth');
const { Validator } = require('node-input-validator')
const jwt = require('jsonwebtoken');
const req = require('express/lib/request');
const { emailtoken } = require('../utils/sendmail');

exports.register = (req, res, next) => {
  const { name, phone, password, email, resetToken, expiryToken } = req.body;
  console.log(req.body)
  const salt = bcrypt.genSaltSync(10);
  req.body.password = bcrypt.hashSync(password, salt);
  console.log(User)

  userServices.register(req.body, (error, result) => {
    if (error) {
      return next(error)
    }
    return res.status(200).send(
      {
        message: "success",
        data: result,

      });
  });

};

exports.login = (req, res) => {
  const { email, password } = req.body;

  userServices.login({ email, password }, (error, result) => {
    if (error) {
      return res.status(404).json({
        message:"user not found",
        // status:404,
        // data:null
      })
    }
    return res.status(200).json(
      {
        message: " login success ",
        status:200,
        data: result,

      });

  });

};

exports.getalluser = async (req, res, next) => {
  // console.log("req user", req.user)

  User.find({}).exec().then(result => {
    res.status(200).json(result);
  }).catch(err => {
    res.status(500).json(err);
  });

  // User.findOne({data:req.user}).exec().then(result=>{
  //   res.status(200).json(result);
  // }).catch(err=>{
  //   res.status(500).json(err);
  // });
}


exports.getSpecificUser = async (req, res) => {

  const _id = req.params.id;
  console.log('req', _id)
  User.findById(_id)
    .then(data => {
      console.log("req2" + data)
      if (!data) {
        res.status(404).send({ message: `cannot get the user by ${_id}, maybe user not found..!` })
      }
      else {
        res.status(200).send(data)
      }
    }).catch(err => {
      res.status(500).send({
        message: err.message || "error in  user information"
      })
    })


}


exports.resetPassword = (req, res) => {

  try {
    crypto.randomBytes(32, (err, buffer, next) => {
      if (err) {
        console.log(err)
      }
      else {
        const token = buffer.toString('hex')
        const email = req.body.email
        console.log("++++++", email)
        User.findOne({ email: email })
          .then(user => {

            if (!user) {
              return res.status(422).json("user not found")
            }
            user.resetToken = token
            user.expiryToken = Date.now() + 3600000
            user.save().then(result => {
              console.log("++++++", result)
              emailtoken(user.email, token)
              res.json("check your mail")
            })

          })
      }
    })
  }
  catch (error) {
    console.log(error)

  }
}







// exports.LogoutUser = (req, res) => {
//   User.findByIdAndUpdate(
//   { _id: req.user._id }
//   , { token: ‘’ },
//   (err) => {
//   if (err) return res.json({ success: false, err })
//   return res.status(200).send({ success: true, message: ‘Successfully Logged Out!’ });
//  })
//  }



exports.user_delete = (req, res, next) => {
  console.log(User)
  User.deleteOne({ _id: req.params.id }).exec().then(result => {
    res.status(200).json({ message: 'User deleted' });
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: err });
  });
};



// console.log('req.body', req.body)

// const password = req.body.password;
// console.log(password)
// const errors = validationResult(req);
// if (!errors.isEmpty()) {
//   console.log(errors.array());
//   return res.status(422).json({ errors: errors.array() });
// } else {
//   User.findOne({ email: req.body.email })
//     .exec()
//     .then(bcrypt.hash(req.body.password, 10, (err, hash) => {
//       if (err) {
//         return res.status(500).json({ error: err });
//       } else {

//         User.findById(req.params.id, (err, user) => {
//           if (err) {
//             return next(err);
//           }
//           console.log("user", user)
//           user.password = hash
//           user.save()
//         })
//           .then(result => {
//             res.status(201).json({ message: "password changed" });
//           })
//           .catch(err => {
//             console.log(err);
//             res.status(500).json({ error: err });
//           });
//       }
//     }));





// User.pre("save", function (next) {
//   const user = this

//   if (this.isModified("password") || this.isNew) {
//     bcrypt.genSalt(10, function (saltError, salt) {
//       if (saltError) {
//         return next(saltError)
//       } else {
//         bcrypt.hash(user.password, salt, function(hashError, hash) {
//           if (hashError) {
//             return next(hashError)
//           }

//           user.password = hash
//           next()
//         })
//       }
//     })
//   } else {
//     return next()
//   }
// })










exports.userProfile = (req, res) => {
  //console.log("req",req)

  console.log("id", req.params)

  User.Update({ _id: req.params.id },
    {
      // username: req.body.username,
      // phone: req.body.phone
      data:req.body
    }, function (err, docs) {
      if (err) res.json(err);
      else {
        // console.log("req user",req.user)
        console.log(docs);
        res.send(docs)
      }
    });
};



exports.changepwd = async (req, res, next) => {
  try {

    const v = new Validator(req.body, {

      old_password: 'required',
      new_password: 'required',
      confirm_password: 'required|same:new_password'
    });
    const matched = await v.check();
    if (!matched) {
      return res.status(422).send(v.errors);
    }
    const current_user = await User.findOne({ _id: req.params.id });
    //  const current_user =req.user;
    //console.log(current_user.password)
    if (bcrypt.compareSync(req.body.old_password, current_user.password)) {
      const salt = bcrypt.genSaltSync(10);
      const hashpwd = bcrypt.hashSync(req.body.new_password, salt);
      await User.updateOne({
        _id: current_user._id
      }, {
        password: hashpwd
      });
      console.log("_id", current_user._id)
      const data = await User.findOne({ _id: current_user.id });
      const token = auth.generateAccessToken(data);
      return res.status(200).send({
        message: "password successfully change",
        data: data,
        token: token
      })


    }
    else {
      return res.status(400).send({
        message: "old password doesn not matched",
        data: {}
      })
    }

  } catch (err) {
    return res.status(400).send({
      message: err.message,
      data: err
    });

  }

}



