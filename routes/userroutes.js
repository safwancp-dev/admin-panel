const express=require('express')
const router=express.Router()

const{renderloginpage,rendersignuppage,signup,login,logout}=require("../controller/authentication.js")

router.get('/',renderloginpage)
router.get('/signup',rendersignuppage)
router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)


module.exports=router;