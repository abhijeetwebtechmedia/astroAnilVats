require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./configs/connection');
const UserRouter = require('./routes/user.route');


class Server {
    constructor() {
        this.app = express();
        this.PORT = process.env.PORT || 3456;

        // Middleware
        this.setupMiddleware();
        // Routes
        this.app.get('/', this.handleRootRequest.bind(this));

        this.handleRoutes();

        // Start the server
        this.startServer();
    }

    async setupMiddleware() {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(cookieParser());
    }

    async handleRootRequest(req, res) {
        try {
            res.status(200).json({
                status: true,
                message: 'Welcome to Astro Anil Vats.'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                message: 'Error: ' + error.message
            });
        }
    }


    async handleRoutes(){
        this.app.use('/users', UserRouter.getRouter());
    }

    startServer() {
        db.getConnection().sync().then(() => {
            this.app.listen(this.PORT, () => {
                console.log(`Server is running on port ${this.PORT}`);
            });
        });
    }
}

// Create an instance of the Server class to start the server
new Server();
