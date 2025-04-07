const User = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

class AuthController {
    // Render login page
    loginPage(req, res) {
        // Check if user is already logged in
        const token = req.cookies.token;
        if (token) {
            try {
                jwt.verify(token, process.env.JWT_ACCESS_KEY);
                return res.redirect('/');
            } catch (err) {
                // Token is invalid, clear it and show login page
                res.clearCookie('token');
            }
        }
        
        // Render login page with no layout to ensure it overlays everything
        res.render('auth/login', { 
            error: null,
            layout: false // This is important to prevent the main layout from being applied
        });
    }

    // Handle login form submission
    async login(req, res) {
        try {
            const { username, password } = req.body;
            
            // Find user by username
            const user = await User.findOne({ username });
            if (!user) {
                return res.render('auth/login', { 
                    error: 'Incorrect username or password',
                    layout: false
                });
            }

            // Check if password needs to be hashed (for legacy users)
            if (!user.password.startsWith("$2b$")) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await User.updateOne({ _id: user._id }, { password: hashedPassword });
                user.password = hashedPassword;
            }

            // Verify password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.render('auth/login', { 
                    error: 'Incorrect username or password',
                    layout: false
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id, quyenhan: user.quyenhan },
                process.env.JWT_ACCESS_KEY,
                { expiresIn: "2h" }
            );

            // Set token in cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 2 * 60 * 60 * 1000 // 2 hours
            });

            // Update last login
            await User.updateOne(
                { _id: user._id }, 
                { 
                    lastLogin: new Date(),
                    $push: { loginHistory: new Date() }
                }
            );

            // Redirect to home page
            res.redirect('/');
        } catch (error) {
            console.error('Login error:', error);
            res.render('auth/login', { 
                error: 'An error occurred during login. Please try again.',
                layout: false
            });
        }
    }

    // Handle logout
    logout(req, res) {
        // Clear the authentication token
        res.clearCookie('token');
        
        // Clear any other session data if needed
        // res.clearCookie('refreshToken'); // Uncomment if you're using refresh tokens
        
        // Redirect to login page
        res.redirect('/auth/login');
    }
}

module.exports = new AuthController(); 