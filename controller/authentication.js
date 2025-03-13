const User=require('../model/userschema.js')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')



require('dotenv').config();



const renderloginpage=((req,res)=>{
    res.render('login',{msg:null})
})

const rendersignuppage=((req,res)=>{
    res.render('signup')
})







const signup=async(req,res)=>{
    try{
    const{name,email,password}=req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.render("signup", { msg: "Email already exists. Please login." });
    }
    console.log("recived password:",password)
        const saltrounds=10;
        const hashedpassword=await bcrypt.hash(password,saltrounds)
        console.log('hashed password',hashedpassword)
    const newUser=new User({
        name,
        email,
        password:hashedpassword,
    }) 

   
    await newUser.save()
     console.log("user saved succesfully")
     res.render('Home',{user:newUser})
    }catch(err){
        res.status(404).send('aleready have an account')
        console.log(err)
    }
}

const login=async(req,res)=>{
    try{
    const{email,password}=req.body;
        const user=await User.findOne({email})

        if(!user){
            return res.render("login", { msg: "Invalid credentials" });
        }
        if (user.isBlocked) {
            return res.render("login", { msg: "Your account has been blocked. Contact admin." });
        }
        const isMatch = await bcrypt.compare(password, user.password);


        if(!isMatch){
           return res.status(401).send('invalid email or password')
        }
    const token=jwt.sign({userid:user._id,email:user.email},process.env.JWT_SECRET,
        {expiresIn:'1h'})//token expires in 1 hour

        if (!token) {
            return res.status(500).json({ message: "Error generating token, please try again" });
        }
        res.cookie("token", token, { httpOnly: true });



            console.log("login succesfull")
            res.render('Home',{user})

       

    }catch(err){
        res.status(500).send("error during login")
        console.log(err)
    }
   

}

const logout = (req, res) => {
    res.clearCookie("token", { httpOnly: true }); 
    console.log("User logged out successfully");
    
    return res.redirect('/user'); // Redirect to login page
};


module.exports={renderloginpage,rendersignuppage,signup,login,logout}