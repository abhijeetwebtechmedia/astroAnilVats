const express = require('express');
const UserController = require('../controllers/user.cotroller');



class UserRouter {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    async initializeRoutes() {
        this.router.get('/', UserController.getAllUsers)
        this.router.post('/register', UserController.registeringUser)
        this.router.post('/phone-login', UserController.phoneLogin)
    }


    getRouter() {
        return this.router;
    }
}

module.exports = new UserRouter