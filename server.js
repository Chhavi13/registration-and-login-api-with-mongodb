const express = require('express');
const app = express();

require('dotenv').config();
var cors = require('cors')
app.use(cors())
// app.use(cors({
//     origin: '*'
// }));

// const port =  process.env.PORT || 4000;
const port =  5000;


const mongoose = require('mongoose');
const dbconfig = require('./config/db.config');
const auth = require('./middleware/auth');
const errors = require('./middleware/errors')
const unless = require('express-unless')
const userroutes = require('./routers/users.routes')
const postroutes = require('./routers/posts.routes')


app.get('/',(req,res)=>res.send({message:"OK"}))

app.get('/get',(req,res)=>{
 
    // debugger
    res.send({message:"OK"})
})


app.use('/image',express.static('public/images'))
auth.authenticateToken.unless = unless;

app.use(
    auth.authenticateToken.unless({
        path: [
            { url: '/users/login', methods: ['POST'] },
            { url: '/users/register', methods: ['POST'] },
        ],
    })
);



app.use(express.json());
app.use('/users', userroutes);
app.use('/posts',postroutes)

// app.use('/api/password-reset', passwordReset);

app.use(errors.errorHandler);



app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)

});