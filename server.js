const express = require('express');
const app = express();
const port = 4000;


const mongoose = require('mongoose');
const dbconfig = require('./config/db.config');
const auth = require('./middleware/auth');
const errors = require('./middleware/errors')
const unless = require('express-unless')
const userroutes = require('./routers/users.routes')


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
app.use(errors.errorHandler);




app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)

});