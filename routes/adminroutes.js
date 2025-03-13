const express =require('express')
const router=express.Router()
const{renderadminlogin,renderdashboard, adminlogin,renderUpdate,updateUser,blockUser,adminlogout}=require('../controller/admincontroller.js')



router.get('/adminlogin',renderadminlogin)
router.post('/adminlogin',adminlogin)
router.get('/admindashboard',renderdashboard)

router.get('/update-user/:id', renderUpdate);  
router.post('/update-user/:id',updateUser)
router.post('/block-user/:id',blockUser)
router.get('/adminlogout',adminlogout)

module.exports=router;