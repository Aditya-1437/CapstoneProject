import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//GENERATE A TOKEN
const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
}

export const registerUser = async(req,res)=>{
    try {
        const {name,email,password} = req.body;

        //CHECK IF USER ALREADY EXISTS
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "User already exists."})
        }
        if(password.length < 6){
            return res.status(400).json({success: false, message: "Password must have more than 6 characters."})
        }

        //HASHING PASSWORD
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        //CREAT A USER
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        })
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        })
    }
}

//LOGIN FUNCTION

export const loginUser = async(req,res) => {
    try {
        const {email,password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(500).json({message: "Invalid Email or Password"})
        }

        //COMPARE THE PASSWORD
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(500).json({message: "Invalid Email or Password"});
        }
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        })
    }
}

//GET USER PROFILE FUNCTION
export const getUserProfile = async(req,res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        if(!user){
            return res.status(404).json({messge: "User not found!"})
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        })
    }
}
