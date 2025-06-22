import  jwt  from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async(req, res) => {
    try {
        const { fullname, email, password, phone, role} = req.body;
        console.log("hi");
        if(!fullname || !email || !password || !phone || !role){
            return res.status(400).json({
                success:false,
                message:"something is missing"
            });
        }
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({email});
            if(user){
                return res.status(400).json({
                    success:false,
                    message:"user is already exists"
                });
            }
            const hashedPass = await bcrypt.hash(password,10);
            await User.create({
                fullname,
                email,
                password:hashedPass,
                phone,
                role,
                profile:{
                    profilePhoto:cloudResponse.secure_url,
                }
            });
            return res.status(201).json({
                success:true,
                message:"user is registered successfully"
            });
        
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const {email, password, role} = req.body;
        if(!email || !password || !role){
            return res.status(400).json({
                success:false,
                message:"Missing required data",
            });
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found",
            });
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched){
            return res.status(400).json({
                success:false,
                message:"Invalid User Credentils",
            });
        }
        if(role !==user.role){
            return res.status(400).json({
                success:false,
                message:"User is not registered with current role",
            });
        }
        const tokenData = {
            userId:user._id
        }
        user = {
            _id: user?._id,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profile: user.profile?user.profile :""
        }
        const token = jwt.sign(tokenData,process.env.JWT_SECRET,{ expiresIn:'1d'});
        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000, httpsOnly:true,sameSite:'strict'}).json({
            success:true,
            message:"User is successfully logged in",
            user:user,
            token,
        });

        // return res.status(200).json({
        //     success:true,
        //     message:"User is successfully logged in",
        //     user:user,
        //     token,
        // });
    } catch (error) {
        console.log(error);
    }
}

export const logout = async(req, res) => {
    try {
        return res.status(200).cookie("token","", {maxAge:0}).json({
            success:true,
            message:"Successfully Logged Out",
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateProfile = async(req, res) => {
    try {
        const { fullname, phone,bio, skills} = req.body;

        // if(!fullname ||  !phone || !bio || !skills){
        //     return res.status(400).json({
        //         success:false,
        //         message:"something is missing"
        //     });
        // }

        const file = req.file;
        // cloudinary ayega idhar
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const skillsArray = skills.split(",");
        const userId = req.id;
        let user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            });
        }
        // updating data
        if(fullname) user.fullname = fullname;
        if(phone) user.phone = phone;
        if(bio) user.profile.bio = bio;
        if(skillsArray) user.profile.skills = skillsArray;
        user.fullname = fullname
        
         // resume comes later here...
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }
        
        
        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phone: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(201).json({
            success:true,
            message:"user profile updated successfully",
            user
        });

    } catch (error) {
        console.log(error);
    }

}
