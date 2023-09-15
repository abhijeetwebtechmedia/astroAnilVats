require('dotenv').config();
const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');

class UserController {
    // Get all users
    static async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            return res.status(200).json({
                status: true,
                message: 'List of all the users',
                count: users.length,
                data: users
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: false,
                error: 'Internal server error'
            });
        }
    }

    // Register a new user
    static async registeringUser(req, res) {
        try {
            const { username, email, password, role } = req.body;

            // Validate email and password
            await body('email').isEmail().normalizeEmail().run(req);
            await body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).run(req);
            const errors = validationResult(req);

            // Check for validation errors
            if (!errors.isEmpty()) {
                return res.status(400).send({
                    status: false,
                    msg: 'Invalid email or password format'
                });
            }

            if (!username || !email || !password) {
                return res.status(400).json({
                    status: false,
                    message: 'Please enter all the fields.'
                });
            }

            // Check if the user already exists
            const isUser = await User.findOne({ where: { email } });
            if (isUser) {
                return res.status(409).json({
                    status: false,
                    message: 'User already exists'
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                role,
            });

            return res.status(201).json({
                status: true,
                message: 'User registered successfully',
                data: newUser
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: false,
                error: 'Internal server error'
            });
        }
    }

    // Send OTP for phone login
    static async phoneLogin(req, res) {
        try {
            const { phone } = req.body;
            const number = "+91" + phone;
            // Generate a 6-digit OTP code
            const otpCode = UserController.generateNumericOTP(6);

            // Check if the user with the provided mobile number already exists
            const isUser = await User.findOne({ where: { mobileNumber: number } });
            if (isUser) {
                return res.status(200).json({
                    status: true,
                    message: 'OTP sent successfully',
                    otp: otpCode
                });
            }

            return res.status(200).json({
                status: true,
                message: 'OTP sent successfully',
                otp: otpCode
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error'
            });
        }
    }

    // Verify OTP
    static async verifyingOtp(req, res) {
        try {
            const otpCode = req.headers.otp; // Get the OTP code from the request headers
            const { otp } = req.body;

            if (otp === otpCode) {
                // Create a new user with the provided mobile number
                const user = await User.create({ mobileNumber: number });
                const token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET)
                res.status(200).json({
                    status: true,
                    message: 'OTP verified successfully',
                    token: token,
                    data: user
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: 'OTP verification failed'
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: false,
                error: 'Internal server error'
            });
        }
    }

    // Helper function to generate a numeric OTP
    static generateNumericOTP(length) {
        const digits = '0123456789';
        let otp = '';

        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * digits.length)];
        }

        return otp;
    }
}



module.exports = UserController;
