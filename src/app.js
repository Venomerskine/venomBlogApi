import express from 'express';
import cors from 'cors';
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/users.routes.js';
import commentRoutes from './routes/comments.router.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

export default app;



