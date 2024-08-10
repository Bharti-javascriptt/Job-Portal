import jobseekerModel from "../models/jobseekerModel.js"
// import cloudinary from 'cloudinary'
import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose"
export const employergetAllApplication=async(req,res,next)=>{

  
    const {role}=req.user;
  

    if(role==='Job seeker'){
        return next("Job seeker is not allowed to access this page ")
    }
    const {_id}=req.user;
    const application= await jobseekerModel.find({'employerID.user':_id});
    res.status(200).json({
        success:true,
        application
    })
    };


export const jobseekergetAllApplication=async(req,res,next)=>{
    const {role}=req.user;
  

    if(role==='Employer'){
        return next("Job seeker is not allowed to access this page ")
    }
    const {_id}=req.user;
    const application= await jobseekerModel.find({'applicantID.user':_id});
    res.status(200).json({
        success:true,
        application
    })
};




export const jobseekerDeleteApplication=async(req,res,next)=>{
    const {role}=req.user;
  

    if(role==='Employer'){
        return next("Job seeker is not allowed to access this page ")
    }
    const {_id}=req.params;
    const application= await jobseekerModel.findById(id);
    if(!application){
        return next('oops application not found')
    }
    await application.deleteOne();

    res.status(200).json({
        success:true,
        message:'application deleted '
    })
};



//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1 post resume here 


// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
//   api_key: process.env.CLOUDINARY_CLIENT_API,
//   api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
// });


export const postApplication = async (req, res, next) => {
  const { role } = req.user;

  // Check if the user is a job seeker
  if (role === "Employer") {
    return next("Employer not allowed to access this resource.");
  }
// //!!!impage upload
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return next("Resume File Required!");
//   }

//   const { resume } = req.files;
//   const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
//   if (!allowedFormats.includes(resume.mimetype)) {
//     return next(
//       "Invalid file type. Please upload a PNG file."
//     );
//   }
//   const cloudinaryResponse = await cloudinary.uploader.upload(
//     resume.tempFilePath
//   );

//   if (!cloudinaryResponse || cloudinaryResponse.error) {
//     console.error(
//       "Cloudinary Error:",
//       cloudinaryResponse.error || "Unknown Cloudinary error"
//     );
//     return next("Failed to upload Resume to Cloudinary");
//   }

  try {
    // Extract data from request body
    const { name, email, coverLetter, phone, address, jobId } = req.body;

    // Validate jobId
    if (!jobId) {
      return next("Job ID is required.");
    }

    // Check if the job exists
    const jobDetails = await jobsModel.findById(jobId);
    if (!jobDetails) {
      return next("Job not found.");
    }

    // Construct applicantID and employerID
    const applicantID = { user: req.user._id, role: "Job seeker" };
    const employerID = { user: jobDetails.createdBy, role: "Employer" };

    // Validate all required fields
    if (!name || !email || !coverLetter || !phone || !address || !applicantID || !employerID) {
      return next("Please fill all fields.");
    }

    // Create a new application
    const application = await jobseekerModel.create({
      name,
      email,
      coverLetter,
      phone,
      address,
      applicantID,
      employerID,
    });

    console.log("aad")

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Application Submitted!",
      application,
    });
  } catch (error) {
    console.error("Error in postApplication:", error);
    return next("Failed to submit application.");
  }
};  

