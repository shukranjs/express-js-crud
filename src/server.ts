import express, { Application } from 'express';
import mongoose from 'mongoose';
import config from './config';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';

const app: Application = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

mongoose.connect(config.mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });
