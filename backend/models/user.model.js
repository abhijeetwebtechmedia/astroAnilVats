const { DataTypes, Model } = require('sequelize');
const Database = require('../configs/connection'); // Import the database connection

class User extends Model { }

User.init(
    {
        username: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mobileNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        locationOfBirth: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'Other'),
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            defaultValue: 'user'
        },
        preferredLanguage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        notificationPreferences: {
            type: DataTypes.JSON, // Store preferences as JSON data
            allowNull: true,
        },
        profilePictureURL: {
            type: DataTypes.STRING, // Store the URL to the profile picture
            allowNull: true,
        },
        subscriptionPlan: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        interests: {
            type: DataTypes.JSON, // Store interests as JSON data
            allowNull: true,
        },
        socialMediaLinks: {
            type: DataTypes.JSON, // Store links to social media profiles
            allowNull: true,
        },
        // Add more fields as needed for your user schema
    },
    {
        sequelize: Database.connection,
        modelName: 'User',
        tableName: 'users',
    }
);

module.exports = User;
