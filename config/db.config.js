

const mongoose = require("mongoose");
mongoose.Promise =global.Promise;
mongoose.connect("mongodb://localhost:27017/UserRegDb",{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log("connection success"))
.catch((err)=>console.log(err));

require("../models/users.models");
