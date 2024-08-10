import jobsModel from "../models/jobsModel.js"
import mongoose from "mongoose"
import  moment from 'moment'

//!! job seeker see the job 
export const getAlljob=async(req,res)=>{
    // const {id}=req.params;
    const job=await jobsModel.find({});
   res.status(200).json({
    success:true,
    job
 }) ;
   
};

//!!!! created job by employer 
// export const createJobController= async (req,res,next)=>{

//     const {role}=req.user;
//     if(role==='Job seeker'){
//         return next("Job seeker is not allowed to access this page ")
//     }

//     const { position, description, city,}=req.body
//     if( !position || !description ||!city ){
//         next('please provide all field ')
//     }
//     if((!salaryFrom|| !salaryTo)&& !fixedSalary){
//         next('please provide either fixed Salary or  range salary ')
//     }
   
//     req.body.createdBy=req.user.userID
//     const job=await jobsModel.create(req.body)
//     res.status(201).json({job});

// }



//!! Search filter through query string search  job 

export const getAllJobsController=async( req, res, next)=>{

    
    // const jobs=await jobsModel.find({}});
     
    const {status,workType,search,sort}=req.query
    const queryObject={
        createdBy:req.user.userID
                    }
     //??Logic

    if(status && status !=='all'){

        queryObject.status=status
    }

    if(workType&& workType!=='all'){
        queryObject.workType=workType;
    }


    if(search){
        queryObject.position={$regex: search , $options:"i"};
    }


    let queryResult=jobsModel.find(queryObject)


    if(sort==='latest'){
        queryResult=queryResult.sort('-createdAt')
    }

    


    if(sort==='oldest'){
        queryResult=queryResult.sort('createdAt')
    }

    if(sort==='a-z'){
        queryResult=queryResult.sort('position')
    }
    
    if(sort==='z-a'){
        queryResult=queryResult.sort('-position')
    }
    //!!!pagination

    const page=Number(req.query.page)||1
    const limit = Number (req.query.limit)||10
    const skip =(page-1)*limit ;
    queryResult =queryResult.skip(skip).limit(limit)
    //jobs count 
    const totalJobs=await jobsModel.countDocuments(queryResult)
    const numbOfPage=Math.ceil(totalJobs/limit)

    
    const job=await queryResult;

    
     res.status(200).json({
        totalJobs:job.length,
        job,
        numbOfPage
     })
}

// ???????????????????????? update job 
export const updateJobcontroller=async(req,res,next)=>{

    const {role}=req.user;
    if(role==='Job seeker'){
        return next("Job seeker is not allowed to access this page ")
    }

    const {id}=req.params
    // const {company, position}=req.body

    //>validation
    // if(!company||!position){
        // next('please provide all field ')
    // }
    const job =await jobsModel.findOne({_id:id})
    if(!job){
        next(`no job found id ${id}`)
    }
    if(!req.user.userID===job.createdBy){
    
        next('you are not  authorized to update')
        return;
    
        
    }
    const updateJob=await jobsModel.findOneAndUpdate({_id:id}, req.body,{
        new:true,
        runValidators:true
    });
    res.status(200).json({success:true, message:"job updated"});
}


//!!!!!!!!!!!!!!!!!!!!!!!!

export  const deleteJobController=async( req,res,next)=>{

    const {role}=req.user;
    if(role==='Job seeker'){
        return next("Job seeker is not allowed to access this page ")
    }

    const {id}=req.params
    const job=await jobsModel.findOne({_id:id})
    if(!job){
        next(`no job  found wiht  this id ${id}`)
    }
    if(!req.user.userID===job.createdBy){
        next(`you are not authorize to delte `)
        return;

    }
    await job.deleteOne( );
    res.status(200).json({message:'success , job deleted'})

}


///!!!!!!!!!!!!!!Filter 

export const jobsStatsController=async (req,res)=>{
    const userId = new mongoose.Schema.Types.ObjectId(req.user.userID);

    const stats =await jobsModel.aggregate([
    {

        $match:{
            createdBy:userId,
        },

    },
    {
   
        $group:{
            _id:'$status',
            count:{$sum:1}
        },
    }
    ]);


    const defaultStats={
        pending:stats.pending||0,
        reject:stats.reject||0,
        interview:stats.interview||0
    }

    //monthly application
    let monthlyApplication=await jobsModel.aggregate([
        {$match:{
            createdBy:new mongoose.Schema.Types.ObjectId(req.user.userID)
        }},
        {
            $group:{
                _id:{
                    year:{$year:"$createdAt"},
                    month:{$month:"$createdAt"},


                },
                count:{
                    $sum:1
                },
            },
        },
    ]);
    monthlyApplication=monthlyApplication.map(item=>{
        const {_id:{year,month},count}=item
        const date=moment().month(month-1).year(year).format(`MMM Y`)
        return {date,count}

    })
    .reverse();
    res.status(200)
    .json({total:stats.length , stats, defaultStats, monthlyApplication});


} 


// export const getsinglejob = async (req, res, next) => {
//     const id = req.params.id;

//     try {
//     const job = await jobsModel.findById(id);
//     return res.status(200).json({
//                 success: true,
//                 job
//             });
//         } 
//     catch (err) {
//        if (err.name === 'CastError') {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid ID format"
//             });
//         }

//         return next(err);
//     }
// };

// export const getsinglejob =async (req, res, next) => {
//     const { id } = req.params;
//     try {
//       const job = await jobsModel.findById(id);
//       if (!job) {
//         return next("Job not found.");
//       }
//       res.status(200).json({
//         success: true,
//         job,
//       });
//     } catch (error) {
//       return next(`Invalid ID / CastError`);
//     }
//   };

export const getsinglejob = async (req, res, next) => {
    
    const { id } = req.params;
    try {
      const job = await jobsModel.findById(id);
      if (!job) {
        return next('value not found');
      }
      res.status(200).json({
        success: true,
        job,
      });
    } catch (error) {
      console.error('Error fetching job:', error); // Log the error for debugging
      res.status(400).json({
        success: false,
        message: 'Invalid ID / CastError',
      });
    }
  };
  


  export const createJobController = async (req, res, next) => {
    // const role  = req.user;
    // console.log(role);
    // if (role === "Job Seeker") {
    //   return next(
    //     "Job Seeker not allowed to access this resource."
    //   );
    // }
    const {
      position,
      description,
      company,
      country,
      city,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
    } = req.body;
  
    if (!position || !description || !company || !country || !city || !location) {
      return next("Please provide full job details.",);
    }
  
    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
      return next(
        
          "Please either provide fixed salary or ranged salary.",
              );
    }
  
    if (salaryFrom && salaryTo && fixedSalary) {
      return next(
        "Cannot Enter Fixed and Ranged Salary together."
      );
    }
    const createdBy = req.user.userID;
    console.log(` Employer id who post job id ${createdBy}`)

    const job = await jobsModel.insertMany({
      position,
      description,
      company,
      country,
      city,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
      createdBy,
    });
    res.status(200).json({
      success: true,
      message: "Job Posted Successfully!",
      job,
    });
  };


//   export const createJobController = async (req, res, next) => {
//     const { company, position } = req.body;
//     if (!company || !position) {
//       next("Please Provide All Fields");
//     }
//     req.body.createdBy = req.user.userID;
//     console.log(` Employer id who post job id ${req.body.createdBy}`)
//     const job = await jobsModel.create(req.body);
//     res.status(201).json({ job });
//   };
  