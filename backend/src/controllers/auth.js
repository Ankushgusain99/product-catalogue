const User=require('../models/register')
const bcrypt=require('bcrypt')

exports.registerUser=async(req,res)=>{
    try {
        const {username,password,role} = req.body
        const existingUser=await User.findOne({username})
        if(existingUser){
            res.status(400).json({
                success:false,
                message:"User already exist"
            })
        }
        let hashedPassword;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

        if(password.length >5 && password.length <20 && regex.test(password)){
            hashedPassword=password
        }
        else{
            return res.status(401).json({
                status:false,
                message:'Your password should be in between 5 and 20 characters and contain atleast a capital, small, numerical and special character'
            })
        }   
            
        //securing the password
        try {
            hashedPassword=await bcrypt.hash(password,10) 
        } catch (error) {
            res.status(500).json({
                success:false,
                message:'Error in hashing password'
            })
        } 
        const user=await User.create({
            username,password:hashedPassword,role
        })
        console.log(user)
        return res.status(200).json({
            success:true,
            message:'User created successfully'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'User cannot be registered try again later'
        })
    }
}


