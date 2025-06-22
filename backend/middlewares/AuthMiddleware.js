import jwt from 'jsonwebtoken';

const isAuth = async(req, res, next) => {
    try {
        // const token = req.cookies.token || req.headers.authorization;
        const token =  req.headers.authorization;
        if(!token){
            return res.status(400).json({
                success:false,
                message:"Please provide the token"
            });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({
                success:false,
                message:"Invalid token"
            });
        }
        req.id = decode.userId;
        next();

    } catch (error) {
        console.log(error);
    }
}
export default isAuth;