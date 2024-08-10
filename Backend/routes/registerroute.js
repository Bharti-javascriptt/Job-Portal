    import express from 'express'
    import auth from '../middleware/auth.js'
    import  { registercontroller,loginController, logoutController, getUser} from '../controller/registercontroller.js'

    const router =express.Router()
    router.post('/register',registercontroller)
    router.post('/login', loginController)
    router.get('/logout', logoutController)
    router.get('/getuser',auth,getUser)


    export default router;  


    //!! this is registration login and lgout api whihc is for both jobseeker and employer