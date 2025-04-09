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
    async checkAuth(req, res, next) {
        try {
            const token = req.cookies.token;
            const refreshToken = req.cookies.refreshToken;

            // Skip auth check for login page, login action, and logout
            if (req.path === '/api/authen/login' || 
                (req.path === '/authen/login' && req.method === 'POST') ||
                req.path === '/api/authen/logout') {
                return next();
            }

            if (!token) {
                return res.redirect('/api/authen/login');
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
                const user = await User.findById(decoded.id);
                if (!user) {
                    return res.redirect('/api/authen/login');
                }
                // Store user info in res.locals
                res.locals.user = {
                    _id: user._id,
                    username: user.username,
                    fullname: user.fullname,
                    email: user.email,
                    quyenhan: user.quyenhan,
                    img: user.img || '/img/user/user.jpg' // Add default image if user.img is not set
                };
                next();
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    // Handle token refresh here if needed
                    return res.redirect('/api/authen/login');
                }
                return res.redirect('/api/authen/login');
            }
        } catch (error) {
            console.error('Auth error:', error);
            return res.redirect('/api/authen/login');
        }
    }
}

module.exports = new MiddlewareController();