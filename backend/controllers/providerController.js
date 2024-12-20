import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import providerModel from "../models/providerModel.js";
import {v2 as cloudinary} from 'cloudinary'
import postModel from "../models/postModel.js";

const registerProvider = async(req,res)=>{
    try {
        const {
            providerName,
            providerEmail,
            providerPassword,
            providerPhone,
            category
        } = req.body
        // Check for missing fields
    if (!providerName || !providerEmail || !providerPassword || !providerPhone || !category) {
        return res.json({
          success: false,
          message: "Please Provide Missing Details",
        });
      }
       // Validate email format
    if (!validator.isEmail(providerEmail)) {
        return res.json({
          success: false,
          message: "Please Provide a Valid Email",
        });
      }
      // Validate password length
    if (providerPassword.length < 8) {
        return res.json({
          success: false,
          message: "Your password must contain at least 8 characters",
        });
      }
       // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(providerPassword, salt);
    const providerData = {
        providerName,
        providerEmail,
        providerPassword:hashedPassword,
        providerPhone,
        category
    }

    // Create and save new provider
    const newProvider = new providerModel(providerData);
    const provider = await newProvider.save();

    // Generate JWT token
    const token = jwt.sign({ id: provider._id }, process.env.JWT_SECRET);

    // Send response
    res.json({ success: true, token });

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//provider login
const providerLogin = async (req,res) => {
    try {
        const {providerEmail,
            providerPassword
        } = req.body
        // Check provider Exists
        const provider = await providerModel.findOne({providerEmail})
        if(!provider){
            return res.json({success:false, message:'Please enter a valid email'})
        }
        // compare password
        const isMatch = await bcrypt.compare(providerPassword,provider.providerPassword)
        if(isMatch){
            // Generate token
            const token = jwt.sign({ id: provider._id }, process.env.JWT_SECRET);
            return res.json({success:true,token})

        }
        else{
            return res.json({success:false, message:'Please enter correct password'})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// get provider profile

const getProviderProfile = async(req,res)=>{
    try {
        const {providerId} = req.body
        const providerData = await providerModel.findById(providerId).select("-providerPassword")
        res.json({ success: true, providerData });
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// update provider profile
const updateProviderProfile = async (req, res) => {
    try {
      const { providerId, providerName, providerPhone, providerAddress, providerBio } = req.body;
  
      await providerModel.findByIdAndUpdate(providerId, {
        providerName,
        providerPhone,
        providerAddress: JSON.parse(providerAddress),
        providerBio
      });
  
      const providerImage = req.file;
      if (providerImage) {
        const imageUpload = await cloudinary.uploader.upload(providerImage.path, {
          resource_type: "image",
        });
        const imageUrl = imageUpload.secure_url;
        await providerModel.findByIdAndUpdate(providerId, { providerImage: imageUrl });
      }
  
      res.json({ success: true, message: "Provider Profile Updated" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };

  // List all providers
  const listProviders = async(req,res)=>{
    try {
      const providers = await providerModel.find({}).select('-password')
      res.json({success:true,providers})
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  }

  

  // Add a service
  const addService = async(req,res)=>{
    try {
      const {providerId, postDescription } = req.body
      const imageFiles = req.files; 
      
      const  providerData = await providerModel.findById(providerId).select('-providerPassword')



    // Upload images to Cloudinary
    const uploadPromises = imageFiles.map((file) => {
      return cloudinary.uploader.upload(file.path, {
        resource_type: 'image',
        folder: 'services',
      });
    });
    const uploadResults = await Promise.all(uploadPromises);

    // Extract URLs of uploaded images
    const postImages = uploadResults.map(result => result.secure_url);
    const postData = {
      providerId,postDescription,postImages,providerData, date: Date.now()
    }
    const newPost = new postModel(postData);

    await newPost.save()
    res.json({success:true, message:"Service Added"})

    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  }

  // List all services

  const listServices = async(req,res)=>{
    try {
      const posts = await postModel.find({})
      res.json({success:true, posts})
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  }

  // List Provider posts 
  const listProviderPosts = async(req,res)=>{
    try {
      const {providerId} = req.body
      const providerPost = await postModel.find({providerId})
      res.json({success:true, providerPost})
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  }

  // Delete Provider Post
  const deletePost = async(req,res)=>{
    try {
      const {postId} = req.body
      await postModel.findByIdAndDelete(postId)
      res.json({success:true, postId})
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  }


export {registerProvider,
    providerLogin,
    getProviderProfile,
    updateProviderProfile,
    listProviders,
    addService,
    listServices,
    listProviderPosts,
    deletePost
}