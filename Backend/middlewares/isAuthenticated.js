import jwt from "jsonwebtoken";

const isAuthenticated = async (req,res,next) => {
    try {
        console.log("cookies inside middleware",req.cookies)
        
        const accessToken = req.cookies.accessToken;
        console.log("access token fetching in middleware",accessToken)

        if (!accessToken) {
            return res.status(401).json({
                message: "user is not authenticated",
                success:false
            })
        }
        const decode = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);

        if (!decode) {
            return res.status(401).json({
                message: "Invalid access Token",
                success:false
            })
        }

        req.user = decode;
        next()
    } catch (error) {
        console.log("error while getting access token fron frontend",error)
    }
}
export default isAuthenticated;