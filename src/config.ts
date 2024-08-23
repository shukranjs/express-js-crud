import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/express-crud-auth',
    jwtSecret: process.env.JWT_SECRET || 'your_secret_key',
};
