 import jwt from "jsonwebtoken";

export const generateJWTtoken=(res,userID)=>{
    
    const accesstoken=jwt.sign({userID},process.env.JWT_SECRET,{
        expiresIn:"15m"
    })
    const refreshtoken=jwt.sign({userID},process.env.JWT_REFRESH_SECRET,{
        expiresIn:"7d"
    })

    res.cookie('accesstoken', accesstoken,{
        httpOnly: true,
        secure: false,
        samesite:'none',
        maxAge: 15*60*1000
    });
    res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 7*24*60* 60 * 1000
    });
    return {accesstoken,refreshtoken};
};