import jwt, { decode } from "jsonwebtoken"
import User from "../models/user.model.js";
const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookie.jwt;
        if(!token) return res.status(401).json({error: "Unacuthorised No token Provided"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) res.status(401).json({error: " Unauthorised - Invalid Tokens"});
        
        const user = await User.findById(decoded.userID).select("-password");
        if(!user){
            return res.status(400).json({error : "User not Found"});

        }

        req.user = user
        next()

    } catch (error) {
     console.log("Error in ProtectROute middleware ", error.message);
    res.status(500).json({error: "internal Server Error"})
    }
}

export default protectRoute;