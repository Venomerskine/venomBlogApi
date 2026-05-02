import express from 'express';
import cors from 'cors';
import indexRouter from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



