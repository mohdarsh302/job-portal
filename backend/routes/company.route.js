import express from 'express';
import { registerCompany, getCompany, getCompanyById, updateCompany} from '../controllers/company.controller.js'
import isAuth from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post('/register', isAuth, registerCompany);
router.get('/get', isAuth, getCompany);
router.get('/get/:id', isAuth, getCompanyById);
router.post('/update/:id', isAuth, updateCompany);

export default router;