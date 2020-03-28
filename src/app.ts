import express, { Application, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import mongoose, { Connection } from 'mongoose';
import morgan from 'morgan';
import createError, { HttpError } from 'http-errors';
import router from './routes';

const PORT: Number = 3000;
const app: Application = express();

// Middleware
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api', router)

// 404
app.use((req, res, next) => {
  console.log('no route found')
  next(createError(404));
})

// Error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  console.log('error handler')
  res.status(err.status || 500).json({ error: err.message });
});

// App waiting to listen
app.on('ready', () => { 
  app.listen(PORT, () => { 
    console.log(`server running on port ${PORT}`); 
  }); 
}); 

// Connect to database and start server
mongoose.connect(process.env.DATABASE_URL!, { useNewUrlParser: true, useUnifiedTopology: true })
const db: Connection = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => {
  console.log('connected to database');
  app.emit('ready');
});
