const mongoose=require('mongoose')


const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:false},

   
    isBlocked: { type: Boolean, default: false }  // Default is false (not blocked)
})


const User=mongoose.model('User',userSchema)

module.exports=User;