const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
   
    if (token == null) return res.status(401).send("Unauthorized request!")
   //console.log("token",token)
  // console.log("req",req)

   jwt.verify(token, "chhavi_chourasiya", (err, user) => {
        //console.log(err)
       // console.log("token===",token)
        
        if (err) return res.status(401).send({message:"invalid token tou must be logged in"})
         
        req.user = user;
      //  console.log("req user",req.user)
        next();

    })
    
}

function generateAccessToken(user_id) {
    return jwt.sign({data: user_id}, "chhavi_chourasiya");     //, { expiresIn: '2h' }
}

module.exports = {
    authenticateToken,
    generateAccessToken
}