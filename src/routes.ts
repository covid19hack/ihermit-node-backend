import express, { Router, Request, Response, NextFunction } from 'express';
const users = require('./routes/v1/users');

const router: Router = express.Router();

router.get('/ping', (req, res) => {
  res.json({"message": "pong"});
})

router.use('v1/users', users);


export default router;
