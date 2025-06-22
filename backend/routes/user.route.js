import express from "express";
import { login, logout, register, updateProfile} from '../controllers/user.controller.js'
import isAuth from "../middlewares/AuthMiddleware.js";
import { singleUpload } from "../middlewares/mutler.js";


const router = express.Router();


router.post('/register', singleUpload, register);
router.post('/login', login);
router.post('/profile/update', isAuth, singleUpload, updateProfile);
router.post('/logout', isAuth, logout);

//protected Admin route auth
router.get("/admin-auth", isAuth, (req, res) => {
    res.status(200).send({ ok: true });
  });

export default router;