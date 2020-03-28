const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const createError = require('http-errors');
const router = require('./routes');

const PORT = 3000;
const app = express();

// Middleware
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', router)

// 404
app.use((req, res, next) => {
  console.log('no route found')
  next(createError(404, 'route not found'));
})

// Error handler
app.use((err, req, res, next) => {
  console.log('handle error')
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message
  });
});

// App waiting to listen
app.on('ready', () => { 
  app.listen(PORT, () => { 
    console.log(`server running on port ${PORT}`); 
  }); 
}); 

// Connect to database and start server
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => {
  console.log('connected to database');
  app.emit('ready');
});
