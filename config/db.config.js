

const mongoose = require("mongoose");
mongoose.Promise =global.Promise;
mongoose.connect("mongodb://localhost:27017/socialdb",{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log("connection success"))
.catch((err)=>console.log(err));

require("../models/usermodel");
require("../models/postmodel");
