const Sequelize = require('sequelize');
require('dotenv').config(); // Load environment variables from a .env file

class Database {
    constructor() {
        const {
            DB_HOST,
            DB_NAME,
            DB_USER,
            DB_PASSWORD,
            DB_PORT,
            DB_DIALECT,
        } = process.env;

        this.connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
            host: DB_HOST,
            port: DB_PORT,
            dialect: DB_DIALECT,
        });

        // this.connect(); // Connect to the database
    }

    // async connect() {
    //     try {
    //         await this.connection.authenticate();
    //         console.log('Database connection has been established successfully.');
    //     } catch (error) {
    //         console.error('Unable to connect to the database:', error);
    //     }
    // }

    getConnection() {
        return this.connection;
    }
}

module.exports = new Database();
