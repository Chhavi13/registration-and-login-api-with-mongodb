const nodemailer = require("nodemailer");
 require('dotenv').config();
 
const emailtoken=(email,token)=>{

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: 465,
    secure: false,
    auth: {
        user:process.env.AUTH ,
        pass:process.env.PASS
    }
    
})

// const { subject, text } = req.body;

const mailData = {
    from: process.env.AUTH,
    to: email,
    subject: "password reset",
    html: `<h1>Email Confirmation</h1>
    <h1>Hello </h1>
    <p>you requested for password reset .click in thhis link to reset a password</p>
    <a href=http://localhost:4000/reset/${token}> Click here</a>
    </div>`,
};
// console.log(mailData)
 transporter.sendMail(mailData, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        res.status(200).send({
            message: 'check your email',
            info: info
        })
    }
})
   
}

// const sendOtptomail =(email,OTP)=>{

//     const transporter = nodemailer.createTransport({
//         host: process.env.HOST,
//         service: process.env.SERVICE,
//         port: 465,
//         secure: false,
//         auth: {
//             user:process.env.AUTH ,
//             pass:process.env.PASS
//         }
        
//     })
    
//     // const { subject, text } = req.body;
    
//     const mailData = {
//         from: process.env.AUTH,
//         to: email,
//         subject: "Please confirm your account",
//         html: `<h1>Email Confirmation</h1>
//         <h1>Hello your otp is ${OTP}</h1>`
//     };
//     // console.log(mailData)
//      transporter.sendMail(mailData, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             res.status(200).send({
//                 message: 'send mail successfully',
//                 info: info
//             })
//         }
//     })
       
//     }

//     const sendapprovalmail =(email)=>{

//         const transporter = nodemailer.createTransport({
//             host: process.env.HOST,
//             service: process.env.SERVICE,
//             port: 465,
//             secure: false,
//             auth: {
//                 user:process.env.AUTH ,
//                 pass:process.env.PASS
//             }
            
//         })
        
//         const mailData = {
//             from: process.env.AUTH,
//             to: email,
//             subject: "Approved plz login",
//             Text:"you have been approved ...!"
           
//         };
//         // console.log(mailData)
//          transporter.sendMail(mailData, function (error, info) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 res.status(200).send({
//                     message: 'send mail successfully'
                 
//                 })
//             }
//         })
           
//         }



//         const sendrejectmail =(email)=>{

//             const transporter = nodemailer.createTransport({
//                 host: process.env.HOST,
//                 service: process.env.SERVICE,
//                 port: 465,
//                 secure: false,
//                 auth: {
//                     user:process.env.AUTH ,
//                     pass:process.env.PASS
//                 }
                
//             })
            
//             const mailData = {
//                 from: process.env.AUTH,
//                 to: email,
//                 subject: "Approved plz login",
//                 Text:"you have been rejected ...!"
               
//             };
//             // console.log(mailData)
//              transporter.sendMail(mailData, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     res.status(200).send({
//                         message: 'send mail successfully'
                     
//                     })
//                 }
//             })
               
//             }
        
    


module.exports = { emailtoken }