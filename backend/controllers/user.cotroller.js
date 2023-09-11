require('dotenv').config();
const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const { validationResult, body } = require('express-validator');

class UserController {
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

    static async registeringUser(req, res) {
        try {
            const { username, email, password } = req.body;


            await body('email').isEmail().normalizeEmail().run(req);
            await body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).run(req);
            const errors = validationResult(req);

            // Checking  for validation errors
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

            const isUser = await User.findOne({ where: { email } });
            if (isUser) {
                return res.status(409).json({
                    status: false,
                    message: 'User already exists'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10); // Use a higher salt round for better security

            const newUser = await User.create({
                username,
                email,
                password: hashedPassword, // Store the hashed password
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

    static async phoneLogin(req, res) {
        try {
            const { phone } = req.body;
            const number = "+91" + phone;
            // Generate a 6-digit OTP code
            const otpCode = generateNumericOTP(6);


            const isUser = await User.findOne({ where: { mobileNumber: number } });
            if (isUser) {
                return res.status(200).json({
                    status: true,
                    message: 'OTP send successfully',
                    otp: otpCode
                })
            }

            await User.create({mobileNumber: number });
            return res.status(200).json({
                status: true,
                message: 'OTP send successfully',
                otp: otpCode
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: false,
                message : 'Internal Server Error'
            })
        }
    }
}


// Generating the OTP 
function generateNumericOTP(length) {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }

    return otp;
}

module.exports = UserController;
