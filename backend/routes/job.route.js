import express from "express";
import isAuth from "../middlewares/AuthMiddleware.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();

router.post('/post', isAuth, postJob);
router.get('/get', isAuth, getAllJobs);
router.get('/getadminjobs', isAuth, getAdminJobs);
router.post('/get/:id', isAuth, getJobById);

export default router;
