const express = require('express')
const router = express.Router();
const userControl = require('./controller/usercontroller')
const postControl = require('./controller/postcontroller')
const auth = require('./middleware/js-auth')

router.get('/', userControl.home)

// User related routes 
router.post('/register',userControl.register)
router.post('/login', userControl.login)
router.post('/logout',userControl.logout)

// post related routes
router.get('/create-post',auth.isAuthenticated,postControl.view)
router.post('/create-post',auth.isAuthenticated,postControl.create)

module.exports = router;