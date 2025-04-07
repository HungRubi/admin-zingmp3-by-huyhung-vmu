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
    
    // Check if user is authenticated for web routes
    checkAuth(req, res, next) {
        // Skip auth check for login page, login action, and logout
        if (req.path === '/api/authen/login' || 
            (req.path === '/api/authen/login' && req.method === 'POST') ||
            req.path === '/api/authen/logout') {
            return next();
        }
        
        const token = req.cookies.token;
        
        if (!token) {
            return res.redirect('/api/authen/login');
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
            req.user = decoded;
            next();
        } catch (err) {
            res.clearCookie('token');
            return res.redirect('/api/authen/login');
        }
    }
}

module.exports = new MiddlewareController();