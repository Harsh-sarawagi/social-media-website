import jwt from 'jsonwebtoken'

export const verifyAccessToken=(req,res,next)=>{
    const accesstoken = req.cookies.accesstoken;
    if(!accesstoken){
        return res.status(401).json({success:false, message: "unauthorised"})
    }
    try {
        const decoded= jwt.verify(accesstoken,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({success:false, message: "unauthorised"})
        }
        // console.log(decoded);
        req.userID= decoded.userID
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({success:false, message: "unauthorised"})
    }
}