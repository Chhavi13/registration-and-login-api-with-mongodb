const userController = require('../controller/userController');
const express = require('express');
const router = express.Router();
const middleware = require('../middleware/auth');


router.post('/register',userController.register)
router.post('/login', userController.login);
router.get('/getalluser',userController.getalluser);
router.get('/getspecificuser/:id',userController.getSpecificUser);
router.post('/reset-password',userController.resetPassword)
router.post('/user-profile',userController.userProfile)




module.exports = router;
