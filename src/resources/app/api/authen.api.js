const User = require('../model/user.model');
const Albums = require('../model/albums.model');
const Songs = require('../model/songs.model');
const Singer = require('../model/singers.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const {formatDate} = require('../../util/formatDate.util');
dotenv.config();

let refreshTokens = []
class Authen {
    /** [POST] /api/authen/login */
    async login(req, res, next) {
        try{
            console.log(req.body);
            const user = await User.findOne({username: req.body.username});
            if(!user){
                // Check if the request is from a form submission
                if (req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
                    // Render the login page with error message
                    return res.render('auth/login', { 
                        error: 'Incorrect username or password',
                        layout: false
                    });
                }
                return res.status(404).json("Incorrect username");
            }
            if (!user.password.startsWith("$2b$")) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await User.updateOne({ _id: user._id }, { password: hashedPassword });
                user.password = hashedPassword;
            }
            const validedPass = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if(!validedPass){
                // Check if the request is from a form submission
                if (req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
                    // Render the login page with error message
                    return res.render('auth/login', { 
                        error: 'Incorrect username or password',
                        layout: false
                    });
                }
                return res.status(404).json("Incorrect password");
            }
            if(user && validedPass){
                const accessToken = jwt.sign(
                    {
                        id: user._id,
                        quyenhan: user.quyenhan,
                    },
                    process.env.JWT_ACCESS_KEY,
                    {expiresIn: "2h"}
                );
                const refreshToken = jwt.sign(
                    {
                        id: user._id,
                        quyenhan: user.quyenhan,
                    },
                    process.env.JWT_REFRESH_KEY,
                    {expiresIn: "365d"} 
                );
                refreshTokens.push(refreshToken)
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/" ,
                    sameSite: "strict",
                })
                res.cookie("token", accessToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/" ,
                    sameSite: "strict",
                })
                await User.updateOne({ _id: user._id }, { lastLogin: new Date() });
                const { password, ...userWithoutPassword } = user.toObject();
                const albumIds = user.favoriteAlbums || [];
                const songIds = user.favoriteSongs || [];
                const singerId = user.favoriteSingers || [];

                const [albums, songs, singers] = await Promise.all([
                    Albums.find({ _id: { $in: albumIds } }), 
                    Songs.find({ _id: { $in: songIds } }),    
                    Singer.find({ _id: { $in: singerId } }),    
                ]);
                const formatUser = {
                    ...userWithoutPassword,
                    format: formatDate(user.birth)
                }
                
                // Check if the request is from a form submission
                if (req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
                    // Redirect to home page for form submissions
                    return res.redirect('/');
                }
                
                // Return JSON for API requests
                res.status(200).json({
                    message: "Login successful",
                    user: formatUser,
                    favoriteAlbums: albums,
                    favoriteSongs: songs,
                    favoriteSingers: singers,
                    accessToken,
                })
            }
        } catch (error) {
            console.log(error);
            // Check if the request is from a form submission
            if (req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
                // Render the login page with error message
                return res.render('auth/login', { 
                    error: 'An error occurred during login. Please try again.',
                    layout: false
                });
            }
            res.status(500).json(error);
        }
    }

    /** [POST] /api/authen/logout */
    async logout(req, res, next) {
        try {
            const token = req.headers.token?.split(" ")[1]; 
            if (!token) {
                return res.status(401).json({ message: "Không có token" });
            }
    
            res.clearCookie("refreshToken");
    
            const tokenIndex = refreshTokens.indexOf(token);
            if (tokenIndex > -1) {
                refreshTokens.splice(tokenIndex, 1); 
            }
    
            return res.status(200).json({ message: "Logout successfully" });
        } catch (error) {
            console.log("Lỗi logout:", error);
            return res.status(500).json({ message: "Lỗi server" }); 
        }
    }
    

    /** [POST] /api/auth/refresh */
    requestRefreshToken (req, res, next) {
        try{
            const refreshToken = req.cookies.refreshToken;
            if(!refreshToken){
                res.status(401).json("You're not authenticated");
            }
            if(refreshTokens.includes(refreshToken)){
                res.status(403).json("Refresh token is not vaild")
            }
            jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
                if(err) {
                    res.status(403).json(err);
                }
                refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
                const newAccessToken = jwt.sign(
                    {
                        id: user._id,
                        author: user.authour,
                    },
                    process.env.JWT_ACCESS_KEY,
                    {expiresIn: "2h"} 
                );
                const newRefreshToken = jwt.sign(
                    {
                        id: user._id,
                        author: user.authour,
                    },
                    process.env.JWT_REFRESH_KEY,
                    {expiresIn: "365d"} 
                );
                refreshTokens.push(newRefreshToken);
                res.status(200).json({
                    accessToken: newAccessToken,
                    newRefreshToken: newRefreshToken,
                });
            })
        }catch(error){
            console.log(error)
            res.status(500).json(error);
        }
    }
}

module.exports = new Authen();