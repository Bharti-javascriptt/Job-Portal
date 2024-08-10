import React,{useEffect,useState,useContext} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {FaCheck} from 'react-icons/fa6';
import {RxCross2} from 'react-icons/rx';
import {Context} from '../../index.js';
import { useNavigate } from 'react-router-dom';

const MyJob = () => {
  const [myjob, setmyjob]=useState([]);
  const  [editingmode, seteditingmode]=useState([]);
  const [isAuthorized,user]=useContext(Context);
  const navigateTo=useNavigate();
  useEffect(()=>{
    const fetchjob=async()=>{
      try{
        const {data}=await axios.get("http://localhost:8000/api/v1/job/get-job",{withCredentials:true})
      }
      catch(err){
        toast.error(err.response.data.message);
        setmyjob([])

      };
      fetchjob();

    };
  },[]);
  if (!isAuthorized||user&&user.role!=="Employer"){
    navigateTo("/")
  }
  const handleenableedit=(jobId)=>{
    seteditingmode(jobId);
  }
  const handledisable=(jobId)=>{
    seteditingmode(jobId)
  }
  const handleupdatejob=async (jobId)=>{
    const updatejob=myjob.find(job=>job._id=== jobId);
    await axios.put (`http://localhost:8000/api/v1/job/update-job${jobId}`,updatejob,{
      withCredentials:true
    }).then(res=>{
      toast.success(res.data.message);
      seteditingmode(null);
    }).catch(error=>{
      toast.error(error.response.data.message)
    });
  }
  const deletejob=async(jobId)=>{
    await axios.delete(`http://localhost:80000/api/v1/job/delete-job${jobId}`,{
      withCredentials:true,
    }).then(res=>{
      toast.success(res.data.message);
      setmyjob(prevjob=>prevjob.filter(job=>job._id!==jobId))
    }).catch(error=>
    [toast.error(error.response.data.message)]
    )
  }
  return (
    <div>
      
    </div>
  )
}

export default MyJob
