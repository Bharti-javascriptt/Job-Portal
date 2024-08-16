import express from 'express'
import auth from '../middleware/auth.js';
// import { createJobController, deleterJobController, getAllJobsController, jobsStatsController, updateJobcontroller } from '../controller/jobscontroller.js';
import {createJobController, getAlljob, getsinglejob, } from '../controller/jobscontroller.js'

import { getAllJobsController } from '../controller/jobscontroller.js';
import { updateJobcontroller } from '../controller/jobscontroller.js';
import { deleteJobController } from '../controller/jobscontroller.js';
import { jobsStatsController } from '../controller/jobscontroller.js';
const router =express.Router()


router.post ('/post', auth, createJobController)
router.get ('/getall', getAlljob  )

router.get('/get-job',auth, getAllJobsController)
router.patch('/update/:id', auth, updateJobcontroller)
// 
router.delete('/delete-job/:id', auth, deleteJobController)
router.get('/job-stats', auth, jobsStatsController)

router.get('/getall/:id', getsinglejob)
// 
export default router;