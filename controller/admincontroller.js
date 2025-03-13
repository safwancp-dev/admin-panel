const User=require('../model/userschema')
const Admin=require('../model/adminschema')
const  jwt=require("jsonwebtoken")



require('dotenv').config()

const renderadminlogin=((req,res)=>{
    res.render('adminlogin')
})



const renderdashboard= async(req,res)=>{
   try{
    const users=await User.find();
    console.log("users fetched from mongodb")
   
    res.render('admin',{users})
   }catch(err){
    console.log("error rendering dashboard",err)
    res.status(500).send("error dashboard loading")
   }
}




const renderUpdate=async(req,res)=>{
    try{
        const {id}=req.params;
        const user=await User.findById(id)
        if(!user){
            res.status(401).send("user not found in the render update page")
        }
        res.render("updateuser",{user})
    }catch(err){
        res.status(500).send("error loading update page")
        console.log("error render update",err)
    }
}
const adminlogin=async(req,res)=>{
    try{
        const { email, password } = req.body;

        // Find admin in database
        const admin = await Admin.findOne({ email});
        if (!admin) {
            return res.status(401).json({ msg: "Admin not found" });
        }
        
        if (admin.password !== password) {
            return res.status(401).send("Invalid email or password");
        
        } 
        console.log("password matched")

    const token=jwt.sign({admin:admin._id,email:admin.email},process.env.ADMIN_JWT,{expiresIn:"1h"})
    if(!token){
        res.status(401).json('error')
        console.log("error token not created")
    }
    res.cookie("token", token, { httpOnly: true });
    const users=await User.find();
    console.log("admin login successfull")
    res.render('admin',{users})
    }
    catch(err){
        console.log(err)
       return res.status(500).json('server error')

    }
}
const updateUser=async(req,res)=>{
    try{
        const {id}=req.params;
        const{name,email}=req.body;
        const updateUser=await User.findByIdAndUpdate(
            id,
            {name,email},
           { new: true}
        );
        if(!updateUser){
            res.status(404).json("user not found")
        }
        console.log("user updated succesfully")
        res.redirect("/admin/admindashboard")
    }
    catch(err){
        console.log("error user updating",err)
        res.status(401).send('error user update')
    }
}
const blockUser=async(req,res)=>{
    try{
    const {id}=req.params;
const user=await User.findById(id)
if(!user){
    return res.status(401).json('user not found')
}
    user.isBlocked=!user.isBlocked;
    await user.save()

    console.log(`User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`);
    res.redirect("/admin/admindashboard")
}catch(err){
    res.status(401).send('error user bloking',err)
}
}


const adminlogout=(req,res)=>{
    res.clearCookie('token')
      res.redirect('/admin/adminlogin')
      
}

module.exports={renderadminlogin,renderdashboard,adminlogin,renderUpdate,updateUser,blockUser,adminlogout}