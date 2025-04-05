const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../model/user.model");

class MiddlewareController {

    verifyToken(req, res, next) {
        const token = req.headers.authorization || req.headers.token;
    
        if (!token) {
            return res.status(401).json("You're not authenticated"); 
        }
    
        const accessToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    
        jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid"); 
            }
    
            req.user = user;
            next(); 
        });
    }
    
}

module.exports = new MiddlewareController();