import express from 'express';
import cors from 'cors';
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/posts.users.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



